import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsNumber,
  Min,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LogUsageDto {
  /**
   * The M9 conversation session this LLM call is associated with.
   */
  @IsOptional()
  @IsString()
  conversationId?: string;

  /**
   * LLM model identifier — must match a key in the cost table.
   * Examples: 'gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'
   */
  @IsString()
  @IsNotEmpty()
  modelName: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  inputTokens: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  outputTokens: number;

  /**
   * Whether the response was served from a cache layer.
   * When true, output tokens should be 0 and cost_usd is effectively 0.
   */
  @IsOptional()
  @IsBoolean()
  isCacheHit?: boolean;

  /**
   * End-to-end latency of the LLM round-trip in milliseconds.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  latencyMs?: number;

  /**
   * Arbitrary metadata — e.g. prompt_template, user_role, region.
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class GetStatsQueryDto {
  /**
   * ISO-8601 date string for the start of the stats window.
   * Defaults to 30 days ago when omitted.
   */
  @IsOptional()
  @IsString()
  startDate?: string;

  /**
   * ISO-8601 date string for the end of the stats window.
   * Defaults to now when omitted.
   */
  @IsOptional()
  @IsString()
  endDate?: string;

  /**
   * Optional filter by model name.
   */
  @IsOptional()
  @IsString()
  modelName?: string;
}
