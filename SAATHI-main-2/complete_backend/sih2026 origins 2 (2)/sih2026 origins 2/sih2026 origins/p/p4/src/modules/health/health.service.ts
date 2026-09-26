import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// ─── Response Types ──────────────────────────────────────────────────────────

export type ServiceStatus = 'healthy' | 'degraded' | 'unreachable';

export interface ComponentHealth {
  status: ServiceStatus;
  latencyMs?: number;
  detail?: string;
}

export interface SystemUptimeInfo {
  processUptimeSeconds: number;
  processUptimeHuman: string;
  memoryUsageMb: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  nodeVersion: string;
  platform: string;
}

export interface OverallHealthReport {
  status: ServiceStatus;
  checkedAt: string;
  uptime: SystemUptimeInfo;
  components: {
    postgres: ComponentHealth;
    redis: ComponentHealth;
  };
}

export interface VectorIndexInfo {
  lastChunkCreatedAt: string | null;
  ageHours: number | null;
  totalChunks: number;
  isStale: boolean;
  stalenessThresholdHours: number;
  status: 'fresh' | 'stale' | 'empty' | 'unknown';
}

export interface IngestionPipelineStatus {
  pipeline: 'operational' | 'degraded' | 'offline';
  vectorIndex: VectorIndexInfo;
  downstreamServices: {
    m3Retrieval: ComponentHealth;
    m5Generation: ComponentHealth;
    m9Session: ComponentHealth;
  };
  checkedAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class HealthService implements OnModuleInit {
  private readonly logger = new Logger(HealthService.name);
  private redisClient: Redis;
  private readonly stalenessThresholdHours: number;
  private readonly m3Url: string;
  private readonly m5Url: string;
  private readonly m9Url: string;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.stalenessThresholdHours = this.configService.get<number>(
      'VECTOR_STALENESS_THRESHOLD_HOURS',
      24,
    );
    this.m3Url = this.configService.get<string>('M3_RETRIEVAL_URL', 'http://localhost:8003/api/v1/retrieval');
    this.m5Url = this.configService.get<string>('M5_GENERATION_URL', 'http://localhost:8005/api/v1/generate');
    this.m9Url = this.configService.get<string>('M9_SESSION_URL', 'http://localhost:3000/api/v1');
  }

  onModuleInit() {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') ||
      `redis://${this.configService.get('REDIS_HOST', 'localhost')}:${this.configService.get('REDIS_PORT', 6379)}`;

    const password = this.configService.get<string>('REDIS_PASSWORD', '');

    this.redisClient = new Redis(redisUrl, {
      password: password || undefined,
      db: this.configService.get<number>('REDIS_DB', 0),
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
    });

    this.redisClient.on('error', (err) => {
      this.logger.warn(`[P4 Health] Redis connection error: ${err.message}`);
    });

    this.logger.log(
      `[P4 Health] Initialized — Postgres + Redis health checks active. ` +
        `Vector staleness threshold: ${this.stalenessThresholdHours}h`,
    );
  }

  // ── Uptime & Memory ───────────────────────────────────────────────────────

  checkSystemUptime(): SystemUptimeInfo {
    const uptimeSec = Math.floor(process.uptime());
    const mem = process.memoryUsage();

    const hours   = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;
    const human   = `${hours}h ${minutes}m ${seconds}s`;

    return {
      processUptimeSeconds: uptimeSec,
      processUptimeHuman: human,
      memoryUsageMb: {
        rss:       parseFloat((mem.rss       / 1024 / 1024).toFixed(2)),
        heapUsed:  parseFloat((mem.heapUsed  / 1024 / 1024).toFixed(2)),
        heapTotal: parseFloat((mem.heapTotal / 1024 / 1024).toFixed(2)),
        external:  parseFloat((mem.external  / 1024 / 1024).toFixed(2)),
      },
      nodeVersion: process.version,
      platform: process.platform,
    };
  }

  // ── PostgreSQL ─────────────────────────────────────────────────────────────

  async checkPostgres(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      await this.dataSource.query('SELECT 1 AS ping');
      const latencyMs = Date.now() - start;
      return { status: 'healthy', latencyMs, detail: 'Connection OK' };
    } catch (err: any) {
      return {
        status: 'unreachable',
        latencyMs: Date.now() - start,
        detail: err?.message ?? 'Query failed',
      };
    }
  }

  // ── Redis ─────────────────────────────────────────────────────────────────

  async checkRedis(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      if (!this.redisClient) {
        return { status: 'unreachable', latencyMs: 0, detail: 'Redis client not initialized' };
      }
      const pong = await this.redisClient.ping();
      const latencyMs = Date.now() - start;
      if (pong === 'PONG') {
        return { status: 'healthy', latencyMs, detail: 'PONG received' };
      }
      return { status: 'degraded', latencyMs, detail: `Unexpected response: ${pong}` };
    } catch (err: any) {
      return {
        status: 'unreachable',
        latencyMs: Date.now() - start,
        detail: err?.message ?? 'Redis ping failed',
      };
    }
  }

  // ── Composite Health ──────────────────────────────────────────────────────

  async getOverallHealth(): Promise<OverallHealthReport> {
    const [postgres, redis] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
    ]);

    const allHealthy =
      postgres.status === 'healthy' && redis.status === 'healthy';
    const anyUnreachable =
      postgres.status === 'unreachable' || redis.status === 'unreachable';

    const status: ServiceStatus = allHealthy
      ? 'healthy'
      : anyUnreachable
        ? 'unreachable'
        : 'degraded';

    return {
      status,
      checkedAt: new Date().toISOString(),
      uptime: this.checkSystemUptime(),
      components: { postgres, redis },
    };
  }

  // ── Vector Index Freshness ────────────────────────────────────────────────

  async getIngestionStatus(): Promise<IngestionPipelineStatus> {
    const vectorIndex = await this.getVectorIndexInfo();

    // Probe downstream services with a lightweight HEAD/GET request
    const [m3, m5, m9] = await Promise.all([
      this.probeHttpEndpoint(this.m3Url.replace(/\/retrieval$/, '/health')),
      this.probeHttpEndpoint(this.m5Url.replace(/\/generate$/, '/health')),
      this.probeHttpEndpoint(`${this.m9Url}/health`),
    ]);

    const pipeline: IngestionPipelineStatus['pipeline'] =
      vectorIndex.status === 'fresh' && m3.status === 'healthy'
        ? 'operational'
        : vectorIndex.status === 'stale' || m3.status === 'degraded'
          ? 'degraded'
          : 'offline';

    return {
      pipeline,
      vectorIndex,
      downstreamServices: {
        m3Retrieval: m3,
        m5Generation: m5,
        m9Session:    m9,
      },
      checkedAt: new Date().toISOString(),
    };
  }

  private async getVectorIndexInfo(): Promise<VectorIndexInfo> {
    try {
      const row = await this.dataSource.query<Array<{ max_created: string | null; total: string }>>(
        `SELECT MAX(created_at) AS max_created, COUNT(*) AS total
         FROM document_chunks`,
      );

      const { max_created, total } = row[0] ?? {};
      const totalChunks = parseInt(total ?? '0', 10);

      if (totalChunks === 0 || !max_created) {
        return {
          lastChunkCreatedAt: null,
          ageHours: null,
          totalChunks: 0,
          isStale: false,
          stalenessThresholdHours: this.stalenessThresholdHours,
          status: 'empty',
        };
      }

      const lastCreated = new Date(max_created);
      const ageMs       = Date.now() - lastCreated.getTime();
      const ageHours    = parseFloat((ageMs / (1000 * 60 * 60)).toFixed(2));
      const isStale     = ageHours > this.stalenessThresholdHours;

      return {
        lastChunkCreatedAt:     lastCreated.toISOString(),
        ageHours,
        totalChunks,
        isStale,
        stalenessThresholdHours: this.stalenessThresholdHours,
        status: isStale ? 'stale' : 'fresh',
      };
    } catch (err: any) {
      this.logger.warn(
        `[P4 Health] document_chunks freshness query failed: ${err?.message}`,
      );
      return {
        lastChunkCreatedAt: null,
        ageHours: null,
        totalChunks: 0,
        isStale: false,
        stalenessThresholdHours: this.stalenessThresholdHours,
        status: 'unknown',
      };
    }
  }

  /**
   * Attempt a lightweight HTTP GET to a health endpoint.
   * Uses Node's native `fetch` (Node 18+) to avoid extra dependencies.
   */
  private async probeHttpEndpoint(url: string): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timer);

      const latencyMs = Date.now() - start;
      return {
        status: res.ok ? 'healthy' : 'degraded',
        latencyMs,
        detail: `HTTP ${res.status}`,
      };
    } catch (err: any) {
      return {
        status: 'unreachable',
        latencyMs: Date.now() - start,
        detail: err?.name === 'AbortError' ? 'Timeout after 3000ms' : (err?.message ?? 'Request failed'),
      };
    }
  }
}
