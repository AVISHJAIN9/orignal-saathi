import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Global environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),

    // PostgreSQL connection via TypeORM (synchronize: false to protect shared bis_db)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const base = {
          type: 'postgres' as const,
          synchronize: false, // Never mutate shared tables automatically
          logging: configService.get<string>('DB_LOGGING') === 'true',
        };

        if (dbUrl) {
          return { ...base, url: dbUrl };
        }

        return {
          ...base,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'bis_db'),
        };
      },
    }),

    HealthModule,
  ],
})
export class AppModule {}
