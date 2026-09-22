import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { LlmUsageLog } from './entities/llm-usage.entity';
import { LogUsageDto, GetStatsQueryDto } from './dto/log-usage.dto';

// ─── Cost Model ───────────────────────────────────────────────────────────────

/**
 * Pricing table: USD per 1,000,000 tokens (as published in OpenAI pricing).
 * Override any entry via environment variables at startup.
 */
export interface ModelPricing {
  inputPerMToken: number;  // USD / 1M input tokens
  outputPerMToken: number; // USD / 1M output tokens
}

/**
 * Built-in default pricing map.
 * New models can be added here without redeploying — env vars provide live overrides.
 */
export const DEFAULT_PRICING: Record<string, ModelPricing> = {
  'gpt-4o-mini':         { inputPerMToken: 0.15,   outputPerMToken: 0.60   },
  'gpt-4o':              { inputPerMToken: 5.00,   outputPerMToken: 15.00  },
  'gpt-4o-2024-08-06':   { inputPerMToken: 2.50,   outputPerMToken: 10.00  },
  'gpt-4-turbo':         { inputPerMToken: 10.00,  outputPerMToken: 30.00  },
  'gpt-3.5-turbo':       { inputPerMToken: 0.50,   outputPerMToken: 1.50   },
  'gpt-3.5-turbo-0125':  { inputPerMToken: 0.50,   outputPerMToken: 1.50   },
  // Fallback sentinel for unknown models — prevents silent zero-cost logging
  '__unknown__':          { inputPerMToken: 0.00,   outputPerMToken: 0.00   },
};

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface AggregatedStats {
  period: { startDate: string; endDate: string };
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  totalCostInr: number;
  cacheHitCount: number;
  cacheHitPercent: number;
  averageLatencyMs: number;
  averageCostPerRequest: number;
  averageCostPerRequestInr: number;
  budgetAlertTriggered: boolean;
  budgetThresholdInr: number;
  breakdownByModel: ModelBreakdown[];
}

export interface ModelBreakdown {
  modelName: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  costInr: number;
  cacheHits: number;
  avgLatencyMs: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private readonly pricingTable: Record<string, ModelPricing>;

  constructor(
    @InjectRepository(LlmUsageLog)
    private readonly usageLogRepository: Repository<LlmUsageLog>,
    private readonly configService: ConfigService,
  ) {
    this.pricingTable = this.buildPricingTable();
    this.logger.log(
      `[P3 Telemetry] Cost model loaded for ${Object.keys(this.pricingTable).length - 1} LLM models.`,
    );
  }

  // ── Pricing ────────────────────────────────────────────────────────────────

  /**
   * Merge built-in defaults with any environment variable overrides.
   * Env vars follow the pattern: COST_<MODEL_SLUG>_INPUT / COST_<MODEL_SLUG>_OUTPUT
   */
  private buildPricingTable(): Record<string, ModelPricing> {
    const table: Record<string, ModelPricing> = { ...DEFAULT_PRICING };

    const envOverrides: Array<{ model: string; envInput: string; envOutput: string }> = [
      { model: 'gpt-4o-mini',    envInput: 'COST_GPT4O_MINI_INPUT', envOutput: 'COST_GPT4O_MINI_OUTPUT' },
      { model: 'gpt-4o',         envInput: 'COST_GPT4O_INPUT',      envOutput: 'COST_GPT4O_OUTPUT'      },
      { model: 'gpt-3.5-turbo',  envInput: 'COST_GPT35_TURBO_INPUT', envOutput: 'COST_GPT35_TURBO_OUTPUT' },
    ];

    for (const { model, envInput, envOutput } of envOverrides) {
      const inp = parseFloat(this.configService.get<string>(envInput, ''));
      const out = parseFloat(this.configService.get<string>(envOutput, ''));
      if (!isNaN(inp) && !isNaN(out)) {
        table[model] = { inputPerMToken: inp, outputPerMToken: out };
      }
    }

    return table;
  }

  /**
   * Calculate API cost in USD for a given model and token counts.
   *
   * Formula: (inputTokens / 1_000_000) * inputRate + (outputTokens / 1_000_000) * outputRate
   *
   * Cache hits carry zero output token cost (tokens were not generated).
   */
  calculateCost(
    modelName: string,
    inputTokens: number,
    outputTokens: number,
    isCacheHit = false,
  ): number {
    const pricing =
      this.pricingTable[modelName] ?? this.pricingTable['__unknown__'];

    const effectiveOutputTokens = isCacheHit ? 0 : outputTokens;

    const cost =
      (inputTokens / 1_000_000) * pricing.inputPerMToken +
      (effectiveOutputTokens / 1_000_000) * pricing.outputPerMToken;

    // Round to 8 decimal places to match entity column precision
    return Math.round(cost * 1e8) / 1e8;
  }

  /**
   * Expose the loaded pricing for a specific model (used by tests & dashboard).
   */
  getPricingForModel(modelName: string): ModelPricing {
    return this.pricingTable[modelName] ?? this.pricingTable['__unknown__'];
  }

  // ── Ingest ────────────────────────────────────────────────────────────────

  /**
   * Ingest a token usage event from M5 (RAG Generation Engine).
   * Computes `totalTokens` and `costUsd` automatically before persisting.
   */
  async logUsage(dto: LogUsageDto): Promise<LlmUsageLog> {
    const isCacheHit = dto.isCacheHit ?? false;
    const totalTokens = dto.inputTokens + dto.outputTokens;
    const costUsd = this.calculateCost(
      dto.modelName,
      dto.inputTokens,
      dto.outputTokens,
      isCacheHit,
    );

    if (!this.pricingTable[dto.modelName]) {
      this.logger.warn(
        `[P3 Telemetry] Unknown model '${dto.modelName}' — cost logged as $0.00. Add to pricing table if this is intentional.`,
      );
    }

    const record = this.usageLogRepository.create({
      conversationId: dto.conversationId,
      modelName: dto.modelName,
      inputTokens: dto.inputTokens,
      outputTokens: dto.outputTokens,
      totalTokens,
      costUsd,
      isCacheHit,
      latencyMs: dto.latencyMs,
      metadata: dto.metadata,
    });

    const saved = await this.usageLogRepository.save(record);

    this.logger.debug(
      `[P3 Telemetry] Logged: model=${dto.modelName} in=${dto.inputTokens} out=${dto.outputTokens} ` +
        `cost=$${costUsd.toFixed(6)} cache=${isCacheHit} latency=${dto.latencyMs ?? 'N/A'}ms`,
    );

    return saved;
  }

  // ── Aggregation ───────────────────────────────────────────────────────────

  /**
   * Run a fully-aggregated telemetry query for the D6 Admin Dashboard.
   *
   * Computes per the requested date window:
   *  - Total cost, tokens, request count
   *  - Cache hit rate
   *  - Average latency
   *  - Per-model breakdown
   */
  async getAggregatedStats(query: GetStatsQueryDto): Promise<AggregatedStats> {
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // default: last 30 days

    const qb = this.usageLogRepository
      .createQueryBuilder('log')
      .where('log.created_at >= :startDate', { startDate })
      .andWhere('log.created_at <= :endDate', { endDate });

    if (query.modelName) {
      qb.andWhere('log.model_name = :modelName', { modelName: query.modelName });
    }

    // ── Global aggregates ──────────────────────────────────────────────────
    const globalRaw = await qb
      .select('COUNT(log.id)',                            'totalRequests')
      .addSelect('COALESCE(SUM(log.input_tokens), 0)',    'totalInputTokens')
      .addSelect('COALESCE(SUM(log.output_tokens), 0)',   'totalOutputTokens')
      .addSelect('COALESCE(SUM(log.total_tokens), 0)',    'totalTokens')
      .addSelect('COALESCE(SUM(log.cost_usd), 0)',        'totalCostUsd')
      .addSelect(
        'COALESCE(SUM(CASE WHEN log.is_cache_hit THEN 1 ELSE 0 END), 0)',
        'cacheHitCount',
      )
      .addSelect('COALESCE(AVG(log.latency_ms), 0)',      'avgLatencyMs')
      .getRawOne();

    const totalRequests = parseInt(globalRaw.totalRequests, 10) || 0;
    const cacheHitCount = parseInt(globalRaw.cacheHitCount, 10) || 0;

    // ── Per-model breakdown ────────────────────────────────────────────────
    const modelRaw = await this.usageLogRepository
      .createQueryBuilder('log')
      .select('log.model_name',                                             'modelName')
      .addSelect('COUNT(log.id)',                                            'requests')
      .addSelect('COALESCE(SUM(log.input_tokens), 0)',                       'inputTokens')
      .addSelect('COALESCE(SUM(log.output_tokens), 0)',                      'outputTokens')
      .addSelect('COALESCE(SUM(log.total_tokens), 0)',                       'totalTokens')
      .addSelect('COALESCE(SUM(log.cost_usd), 0)',                           'costUsd')
      .addSelect(
        'COALESCE(SUM(CASE WHEN log.is_cache_hit THEN 1 ELSE 0 END), 0)',   'cacheHits',
      )
      .addSelect('COALESCE(AVG(log.latency_ms), 0)',                         'avgLatencyMs')
      .where('log.created_at >= :startDate', { startDate })
      .andWhere('log.created_at <= :endDate', { endDate })
      .groupBy('log.model_name')
      .orderBy('costUsd', 'DESC')
      .getRawMany();

    const usdToInrRate = parseFloat(this.configService.get<string>('USD_TO_INR_RATE', '84.50'));
    const budgetThresholdInr = parseFloat(this.configService.get<string>('BUDGET_THRESHOLD_INR', '10000.00'));

    const breakdownByModel: ModelBreakdown[] = modelRaw.map((r) => {
      const cUsd = parseFloat(parseFloat(r.costUsd).toFixed(6));
      return {
        modelName:    r.modelName,
        requests:     parseInt(r.requests, 10),
        inputTokens:  parseInt(r.inputTokens, 10),
        outputTokens: parseInt(r.outputTokens, 10),
        totalTokens:  parseInt(r.totalTokens, 10),
        costUsd:      cUsd,
        costInr:      parseFloat((cUsd * usdToInrRate).toFixed(2)),
        cacheHits:    parseInt(r.cacheHits, 10),
        avgLatencyMs: parseFloat(parseFloat(r.avgLatencyMs).toFixed(2)),
      };
    });

    const totalCostUsd = parseFloat(parseFloat(globalRaw.totalCostUsd).toFixed(6));
    const totalCostInr = parseFloat((totalCostUsd * usdToInrRate).toFixed(2));
    const avgCostPerReqUsd = totalRequests > 0 ? parseFloat((totalCostUsd / totalRequests).toFixed(6)) : 0;
    const avgCostPerReqInr = totalRequests > 0 ? parseFloat((totalCostInr / totalRequests).toFixed(4)) : 0;

    return {
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      totalRequests,
      totalInputTokens:     parseInt(globalRaw.totalInputTokens, 10),
      totalOutputTokens:    parseInt(globalRaw.totalOutputTokens, 10),
      totalTokens:          parseInt(globalRaw.totalTokens, 10),
      totalCostUsd,
      totalCostInr,
      cacheHitCount,
      cacheHitPercent:
        totalRequests > 0
          ? parseFloat(((cacheHitCount / totalRequests) * 100).toFixed(2))
          : 0,
      averageLatencyMs:       parseFloat(parseFloat(globalRaw.avgLatencyMs).toFixed(2)),
      averageCostPerRequest:  avgCostPerReqUsd,
      averageCostPerRequestInr: avgCostPerReqInr,
      budgetAlertTriggered: totalCostInr >= budgetThresholdInr,
      budgetThresholdInr,
      breakdownByModel,
    };
  }
}
