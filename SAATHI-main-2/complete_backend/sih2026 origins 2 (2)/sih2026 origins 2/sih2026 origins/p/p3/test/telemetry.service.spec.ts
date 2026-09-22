import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import {
  TelemetryService,
  DEFAULT_PRICING,
  AggregatedStats,
} from '../src/modules/telemetry/telemetry.service';
import { LlmUsageLog } from '../src/modules/telemetry/entities/llm-usage.entity';
import { LogUsageDto, GetStatsQueryDto } from '../src/modules/telemetry/dto/log-usage.dto';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeLog(overrides: Partial<LlmUsageLog> = {}): LlmUsageLog {
  const log = new LlmUsageLog();
  log.id             = 'uuid-0001';
  log.modelName      = 'gpt-4o-mini';
  log.inputTokens    = 500;
  log.outputTokens   = 200;
  log.totalTokens    = 700;
  log.costUsd        = 0.00000195;
  log.isCacheHit     = false;
  log.latencyMs      = 450;
  log.createdAt      = new Date();
  return Object.assign(log, overrides);
}

function buildRawGlobalRow(overrides: Record<string, any> = {}) {
  return {
    totalRequests:    '10',
    totalInputTokens: '50000',
    totalOutputTokens:'20000',
    totalTokens:      '70000',
    totalCostUsd:     '0.01950000',
    cacheHitCount:    '3',
    avgLatencyMs:     '380.00',
    ...overrides,
  };
}

// ─── Mock query builder chain ─────────────────────────────────────────────────

function buildQbMock(getRawOneFn: jest.Mock, getRawManyFn: jest.Mock) {
  const qb: any = {
    select:      jest.fn().mockReturnThis(),
    addSelect:   jest.fn().mockReturnThis(),
    where:       jest.fn().mockReturnThis(),
    andWhere:    jest.fn().mockReturnThis(),
    groupBy:     jest.fn().mockReturnThis(),
    orderBy:     jest.fn().mockReturnThis(),
    getRawOne:   getRawOneFn,
    getRawMany:  getRawManyFn,
  };
  return qb;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('TelemetryService (Unit Tests)', () => {
  let service: TelemetryService;
  let repo: jest.Mocked<Repository<LlmUsageLog>>;
  let configGet: jest.Mock;

  beforeEach(async () => {
    configGet = jest.fn((key: string, defaultVal?: any) => defaultVal);

    const repoFactory = () => ({
      create:              jest.fn(),
      save:                jest.fn(),
      count:               jest.fn(),
      createQueryBuilder:  jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryService,
        { provide: getRepositoryToken(LlmUsageLog), useFactory: repoFactory },
        { provide: ConfigService, useValue: { get: configGet } },
      ],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
    repo    = module.get(getRepositoryToken(LlmUsageLog));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── calculateCost ────────────────────────────────────────────────────────────

  describe('calculateCost — gpt-4o-mini', () => {
    const { inputPerMToken, outputPerMToken } = DEFAULT_PRICING['gpt-4o-mini'];
    // $0.15 / 1M input   →  1000 input tokens = $0.00015
    // $0.60 / 1M output  →  500  output tokens = $0.00030
    // total = $0.00045

    it('should compute cost correctly for a non-cached request', () => {
      const cost = service.calculateCost('gpt-4o-mini', 1000, 500, false);
      const expected =
        (1000 / 1_000_000) * inputPerMToken +
        (500  / 1_000_000) * outputPerMToken;
      expect(cost).toBeCloseTo(expected, 8);
    });

    it('should return zero output cost for a cache hit', () => {
      const cost = service.calculateCost('gpt-4o-mini', 1000, 500, true);
      // Cache hit → output tokens billed at 0
      const expected = (1000 / 1_000_000) * inputPerMToken;
      expect(cost).toBeCloseTo(expected, 8);
    });

    it('should return 0.00 when both token counts are 0', () => {
      const cost = service.calculateCost('gpt-4o-mini', 0, 0, false);
      expect(cost).toBe(0);
    });
  });

  describe('calculateCost — gpt-4o', () => {
    it('should apply gpt-4o pricing correctly', () => {
      const { inputPerMToken, outputPerMToken } = DEFAULT_PRICING['gpt-4o'];
      const cost = service.calculateCost('gpt-4o', 2000, 800, false);
      const expected =
        (2000 / 1_000_000) * inputPerMToken +
        (800  / 1_000_000) * outputPerMToken;
      expect(cost).toBeCloseTo(expected, 8);
    });
  });

  describe('calculateCost — gpt-3.5-turbo', () => {
    it('should apply gpt-3.5-turbo pricing correctly', () => {
      const { inputPerMToken, outputPerMToken } = DEFAULT_PRICING['gpt-3.5-turbo'];
      const cost = service.calculateCost('gpt-3.5-turbo', 5000, 1000, false);
      const expected =
        (5000 / 1_000_000) * inputPerMToken +
        (1000 / 1_000_000) * outputPerMToken;
      expect(cost).toBeCloseTo(expected, 8);
    });
  });

  describe('calculateCost — unknown model', () => {
    it('should return 0.00 for an unrecognised model name', () => {
      const cost = service.calculateCost('claude-3-opus', 1000, 500, false);
      expect(cost).toBe(0);
    });
  });

  // ── Precision & rounding ──────────────────────────────────────────────────

  describe('calculateCost — decimal precision', () => {
    it('should round result to 8 decimal places', () => {
      const cost = service.calculateCost('gpt-4o-mini', 1, 1, false);
      const decimals = cost.toString().split('.')[1]?.length ?? 0;
      expect(decimals).toBeLessThanOrEqual(8);
    });

    it('large token counts should not produce NaN or Infinity', () => {
      const cost = service.calculateCost('gpt-4o', 100_000_000, 50_000_000, false);
      expect(isFinite(cost)).toBe(true);
      expect(isNaN(cost)).toBe(false);
    });
  });

  // ── getPricingForModel ─────────────────────────────────────────────────────

  describe('getPricingForModel', () => {
    it('should return correct rates for a known model', () => {
      const pricing = service.getPricingForModel('gpt-4o-mini');
      expect(pricing.inputPerMToken).toBe(0.15);
      expect(pricing.outputPerMToken).toBe(0.60);
    });

    it('should return __unknown__ sentinel rates for an unlisted model', () => {
      const pricing = service.getPricingForModel('llama-3-70b');
      expect(pricing.inputPerMToken).toBe(0);
      expect(pricing.outputPerMToken).toBe(0);
    });
  });

  // ── logUsage ──────────────────────────────────────────────────────────────

  describe('logUsage', () => {
    it('should calculate totalTokens and costUsd then persist the record', async () => {
      const dto: LogUsageDto = {
        conversationId: 'conv-abc',
        modelName:      'gpt-4o-mini',
        inputTokens:    1000,
        outputTokens:   500,
        isCacheHit:     false,
        latencyMs:      320,
      };

      const expectedCost = service.calculateCost('gpt-4o-mini', 1000, 500, false);
      const savedLog = makeLog({ costUsd: expectedCost, totalTokens: 1500 });

      repo.create.mockReturnValue(savedLog);
      repo.save.mockResolvedValue(savedLog);

      const result = await service.logUsage(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: 'conv-abc',
          modelName:      'gpt-4o-mini',
          inputTokens:    1000,
          outputTokens:   500,
          totalTokens:    1500,
          costUsd:        expectedCost,
          isCacheHit:     false,
          latencyMs:      320,
        }),
      );
      expect(repo.save).toHaveBeenCalledWith(savedLog);
      expect(result.totalTokens).toBe(1500);
      expect(result.costUsd).toBeCloseTo(expectedCost, 8);
    });

    it('should set isCacheHit=false by default when omitted from DTO', async () => {
      const dto: LogUsageDto = {
        modelName:    'gpt-4o-mini',
        inputTokens:  200,
        outputTokens: 100,
      };

      const savedLog = makeLog({ isCacheHit: false });
      repo.create.mockReturnValue(savedLog);
      repo.save.mockResolvedValue(savedLog);

      await service.logUsage(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ isCacheHit: false }),
      );
    });

    it('should bill zero output tokens on a cache hit', async () => {
      const dto: LogUsageDto = {
        modelName:    'gpt-4o-mini',
        inputTokens:  500,
        outputTokens: 300,
        isCacheHit:   true,
      };

      const expectedCost = service.calculateCost('gpt-4o-mini', 500, 300, true);
      const cacheOnlyCost = (500 / 1_000_000) * DEFAULT_PRICING['gpt-4o-mini'].inputPerMToken;

      expect(expectedCost).toBeCloseTo(cacheOnlyCost, 8);

      const savedLog = makeLog({ isCacheHit: true, costUsd: expectedCost });
      repo.create.mockReturnValue(savedLog);
      repo.save.mockResolvedValue(savedLog);

      await service.logUsage(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ isCacheHit: true, costUsd: expectedCost }),
      );
    });
  });

  // ── getAggregatedStats ─────────────────────────────────────────────────────

  describe('getAggregatedStats', () => {
    function mockQb(globalRow: any, modelRows: any[] = []) {
      const getRawOne  = jest.fn().mockResolvedValue(globalRow);
      const getRawMany = jest.fn().mockResolvedValue(modelRows);
      const qb = buildQbMock(getRawOne, getRawMany);
      // First call → global aggregates; second call → per-model breakdown
      repo.createQueryBuilder
        .mockReturnValueOnce(qb)
        .mockReturnValueOnce(qb);
      return { qb, getRawOne, getRawMany };
    }

    it('should return properly typed and rounded aggregated stats', async () => {
      const modelRow = {
        modelName:    'gpt-4o-mini',
        requests:     '10',
        inputTokens:  '50000',
        outputTokens: '20000',
        totalTokens:  '70000',
        costUsd:      '0.01950000',
        cacheHits:    '3',
        avgLatencyMs: '380.00',
      };
      mockQb(buildRawGlobalRow(), [modelRow]);

      const query: GetStatsQueryDto = {
        startDate: '2026-08-01T00:00:00.000Z',
        endDate:   '2026-08-31T23:59:59.999Z',
      };
      const stats: AggregatedStats = await service.getAggregatedStats(query);

      expect(stats.totalRequests).toBe(10);
      expect(stats.totalCostUsd).toBeCloseTo(0.019500, 4);
      expect(stats.cacheHitCount).toBe(3);
      expect(stats.cacheHitPercent).toBe(30); // 3/10 * 100
      expect(stats.averageLatencyMs).toBe(380);
      expect(stats.averageCostPerRequest).toBeCloseTo(0.01950 / 10, 6);
      expect(stats.breakdownByModel).toHaveLength(1);
      expect(stats.breakdownByModel[0].modelName).toBe('gpt-4o-mini');
    });

    it('should return 0 cacheHitPercent when totalRequests is 0', async () => {
      const emptyRow = buildRawGlobalRow({
        totalRequests: '0',
        totalCostUsd:  '0',
        cacheHitCount: '0',
        avgLatencyMs:  '0',
      });
      mockQb(emptyRow, []);

      const stats = await service.getAggregatedStats({});
      expect(stats.cacheHitPercent).toBe(0);
      expect(stats.averageCostPerRequest).toBe(0);
    });

    it('should default to last 30 days when no date range supplied', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      mockQb(buildRawGlobalRow(), []);
      const stats = await service.getAggregatedStats({});

      const diffDays =
        (new Date(stats.period.endDate).getTime() -
          new Date(stats.period.startDate).getTime()) /
        (1000 * 60 * 60 * 24);

      expect(diffDays).toBeCloseTo(30, 0);
      jest.spyOn(Date, 'now').mockRestore();
    });
  });
});
