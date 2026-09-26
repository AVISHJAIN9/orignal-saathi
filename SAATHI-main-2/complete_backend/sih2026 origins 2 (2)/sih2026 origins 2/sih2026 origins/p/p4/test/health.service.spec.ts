import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { HealthService } from '../src/modules/health/health.service';

describe('HealthService (Unit Tests)', () => {
  let service: HealthService;
  let dataSourceMock: any;
  let configServiceMock: any;
  let redisClientMock: any;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn((key: string, defaultVal?: any) => {
        const configMap: Record<string, any> = {
          VECTOR_STALENESS_THRESHOLD_HOURS: 24,
          M3_RETRIEVAL_URL: 'http://localhost:8003/api/v1/retrieval',
          M5_GENERATION_URL: 'http://localhost:8005/api/v1/generate',
          M9_SESSION_URL: 'http://localhost:3000/api/v1',
          REDIS_HOST: 'localhost',
          REDIS_PORT: 6379,
        };
        return configMap[key] ?? defaultVal;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);

    // Mock the internal redisClient created in onModuleInit
    redisClientMock = {
      ping: jest.fn().mockResolvedValue('PONG'),
      on: jest.fn(),
    };
    (service as any).redisClient = redisClientMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSystemUptime', () => {
    it('should return process uptime and memory usage metrics', () => {
      const uptime = service.checkSystemUptime();

      expect(uptime).toBeDefined();
      expect(uptime.processUptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(uptime.processUptimeHuman).toMatch(/\d+h \d+m \d+s/);
      expect(uptime.memoryUsageMb.heapUsed).toBeGreaterThan(0);
      expect(uptime.nodeVersion).toEqual(process.version);
    });
  });

  describe('checkPostgres', () => {
    it('should report healthy when database query succeeds', async () => {
      dataSourceMock.query.mockResolvedValueOnce([{ ping: 1 }]);

      const result = await service.checkPostgres();

      expect(result.status).toEqual('healthy');
      expect(result.latencyMs).toBeDefined();
      expect(result.detail).toEqual('Connection OK');
    });

    it('should report unreachable when database query throws error', async () => {
      dataSourceMock.query.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await service.checkPostgres();

      expect(result.status).toEqual('unreachable');
      expect(result.detail).toContain('Connection refused');
    });
  });

  describe('checkRedis', () => {
    it('should report healthy when Redis responds with PONG', async () => {
      redisClientMock.ping.mockResolvedValueOnce('PONG');

      const result = await service.checkRedis();

      expect(result.status).toEqual('healthy');
      expect(result.detail).toEqual('PONG received');
    });

    it('should report unreachable when Redis ping fails', async () => {
      redisClientMock.ping.mockRejectedValueOnce(new Error('Redis connection timeout'));

      const result = await service.checkRedis();

      expect(result.status).toEqual('unreachable');
      expect(result.detail).toContain('Redis connection timeout');
    });
  });

  describe('getOverallHealth', () => {
    it('should return healthy status when all services are healthy', async () => {
      dataSourceMock.query.mockResolvedValueOnce([{ ping: 1 }]);
      redisClientMock.ping.mockResolvedValueOnce('PONG');

      const report = await service.getOverallHealth();

      expect(report.status).toEqual('healthy');
      expect(report.components.postgres.status).toEqual('healthy');
      expect(report.components.redis.status).toEqual('healthy');
      expect(report.uptime).toBeDefined();
    });

    it('should return unreachable when a critical component fails', async () => {
      dataSourceMock.query.mockRejectedValueOnce(new Error('DB down'));
      redisClientMock.ping.mockResolvedValueOnce('PONG');

      const report = await service.getOverallHealth();

      expect(report.status).toEqual('unreachable');
      expect(report.components.postgres.status).toEqual('unreachable');
      expect(report.components.redis.status).toEqual('healthy');
    });
  });

  describe('getIngestionStatus', () => {
    it('should return fresh vector index status when recent document chunks exist', async () => {
      const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      dataSourceMock.query.mockResolvedValueOnce([
        { max_created: recentDate, total: '1450' },
      ]);

      // Mock downstream probe HTTP fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      } as any);

      const status = await service.getIngestionStatus();

      expect(status.vectorIndex.status).toEqual('fresh');
      expect(status.vectorIndex.isStale).toEqual(false);
      expect(status.vectorIndex.totalChunks).toEqual(1450);
      expect(status.vectorIndex.ageHours).toBeCloseTo(2, 0);
      expect(status.pipeline).toEqual('operational');
    });

    it('should return stale status when document chunks exceed staleness threshold', async () => {
      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(); // 48 hours ago (> 24h threshold)
      dataSourceMock.query.mockResolvedValueOnce([
        { max_created: oldDate, total: '500' },
      ]);

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      } as any);

      const status = await service.getIngestionStatus();

      expect(status.vectorIndex.status).toEqual('stale');
      expect(status.vectorIndex.isStale).toEqual(true);
      expect(status.pipeline).toEqual('degraded');
    });

    it('should handle empty document_chunks table gracefully', async () => {
      dataSourceMock.query.mockResolvedValueOnce([
        { max_created: null, total: '0' },
      ]);

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      } as any);

      const status = await service.getIngestionStatus();

      expect(status.vectorIndex.status).toEqual('empty');
      expect(status.vectorIndex.totalChunks).toEqual(0);
      expect(status.vectorIndex.lastChunkCreatedAt).toBeNull();
    });
  });
});
