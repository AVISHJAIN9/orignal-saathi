import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { LlmUsageLog } from './modules/telemetry/entities/llm-usage.entity';

@Module({
  imports: [
    // Global environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),

    // PostgreSQL connection — synchronize: false protects the shared bis_db schema.
    // Run a migration or CREATE TABLE manually before first use:
    //
    //   CREATE TABLE IF NOT EXISTS llm_usage_logs (
    //     id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    //     conversation_id VARCHAR(255),
    //     model_name      VARCHAR(120) NOT NULL,
    //     input_tokens    INT NOT NULL DEFAULT 0,
    //     output_tokens   INT NOT NULL DEFAULT 0,
    //     total_tokens    INT NOT NULL DEFAULT 0,
    //     cost_usd        DECIMAL(10,8) NOT NULL DEFAULT 0,
    //     is_cache_hit    BOOLEAN NOT NULL DEFAULT FALSE,
    //     latency_ms      INT,
    //     metadata        JSONB,
    //     created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    //   );
    //   CREATE INDEX idx_llm_usage_model    ON llm_usage_logs (model_name);
    //   CREATE INDEX idx_llm_usage_created  ON llm_usage_logs (created_at);
    //   CREATE INDEX idx_llm_usage_conv     ON llm_usage_logs (conversation_id);
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const base = {
          type: 'postgres' as const,
          entities: [LlmUsageLog],
          synchronize: false,  // Never alter shared bis_db schema automatically
          logging: configService.get<string>('DB_LOGGING') === 'true',
        };

        if (dbUrl) {
          return { ...base, url: dbUrl };
        }

        return {
          ...base,
          host:     configService.get<string>('DB_HOST',     'localhost'),
          port:     configService.get<number>('DB_PORT',     5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'bis_db'),
        };
      },
    }),

    TelemetryModule,
  ],
})
export class AppModule {}
