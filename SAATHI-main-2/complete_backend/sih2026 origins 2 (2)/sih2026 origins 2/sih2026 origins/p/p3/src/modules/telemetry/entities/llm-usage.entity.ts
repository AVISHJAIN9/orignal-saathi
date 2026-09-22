import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'llm_usage_logs' })
@Index(['modelName'])
@Index(['createdAt'])
@Index(['conversationId'])
export class LlmUsageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Reference to the M9 conversation this LLM call belongs to.
   * Nullable for health-check calls and background tasks.
   */
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'conversation_id' })
  conversationId?: string;

  /**
   * LLM model identifier, e.g. 'gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'
   */
  @Column({ type: 'varchar', length: 120, name: 'model_name' })
  modelName: string;

  @Column({ type: 'int', default: 0, name: 'input_tokens' })
  inputTokens: number;

  @Column({ type: 'int', default: 0, name: 'output_tokens' })
  outputTokens: number;

  @Column({ type: 'int', default: 0, name: 'total_tokens' })
  totalTokens: number;

  /**
   * Calculated cost in USD based on model pricing.
   * Precision 10, scale 8 preserves sub-cent accuracy for micro-billing.
   */
  @Column({ type: 'decimal', precision: 10, scale: 8, default: 0, name: 'cost_usd' })
  costUsd: number;

  /**
   * True when the response was served from a semantic/prompt cache
   * (e.g. OpenAI prompt caching, Redis similarity cache).
   */
  @Column({ type: 'boolean', default: false, name: 'is_cache_hit' })
  isCacheHit: boolean;

  /**
   * End-to-end LLM call latency in milliseconds.
   */
  @Column({ type: 'int', nullable: true, name: 'latency_ms' })
  latencyMs?: number;

  /**
   * Optional metadata — prompt template key, user role, region, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
