import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TelemetryService, AggregatedStats } from './telemetry.service';
import { LogUsageDto, GetStatsQueryDto } from './dto/log-usage.dto';
import { LlmUsageLog } from './entities/llm-usage.entity';

@Controller('api/v1/telemetry')
export class TelemetryController {
  private readonly logger = new Logger(TelemetryController.name);

  constructor(private readonly telemetryService: TelemetryService) {}

  /**
   * Ingest endpoint for M5 (RAG Generation Engine) to report token usage.
   *
   * Called automatically after each LLM completion from the Python service.
   * Cost in USD is computed server-side; callers only need to supply token counts.
   *
   * POST /api/v1/telemetry/llm-usage
   */
  @Post('llm-usage')
  @HttpCode(HttpStatus.CREATED)
  async logUsage(@Body() dto: LogUsageDto): Promise<{
    status: string;
    logged: Pick<LlmUsageLog, 'id' | 'modelName' | 'totalTokens' | 'costUsd' | 'isCacheHit' | 'createdAt'>;
  }> {
    this.logger.debug(
      `[P3 Controller] Ingesting usage: model=${dto.modelName} in=${dto.inputTokens} out=${dto.outputTokens}`,
    );

    const record = await this.telemetryService.logUsage(dto);

    return {
      status: 'logged',
      logged: {
        id:          record.id,
        modelName:   record.modelName,
        totalTokens: record.totalTokens,
        costUsd:     record.costUsd,
        isCacheHit:  record.isCacheHit,
        createdAt:   record.createdAt,
      },
    };
  }

  /**
   * Aggregated cost and usage statistics for the D6 Admin Dashboard.
   *
   * Supports optional date-range and model filters via query params:
   *   - startDate (ISO-8601)
   *   - endDate   (ISO-8601)
   *   - modelName (exact match filter)
   *
   * GET /api/v1/telemetry/stats
   */
  @Get('stats')
  async getStats(@Query() query: GetStatsQueryDto): Promise<{
    status: string;
    stats: AggregatedStats;
    generatedAt: string;
  }> {
    const stats = await this.telemetryService.getAggregatedStats(query);

    return {
      status: 'ok',
      stats,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Return the loaded pricing table so the dashboard can display cost estimates.
   * GET /api/v1/telemetry/pricing
   */
  @Get('pricing')
  getPricing() {
    const models = [
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-4o-2024-08-06',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
    ];

    return {
      status: 'ok',
      currency: 'USD',
      unit: 'per 1M tokens',
      models: models.map((model) => ({
        model,
        ...this.telemetryService.getPricingForModel(model),
      })),
    };
  }

  /**
   * Health check
   * GET /api/v1/telemetry/health
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'SAATHI-BIS-Module-P3-LLMTelemetry',
      timestamp: new Date().toISOString(),
    };
  }
}
