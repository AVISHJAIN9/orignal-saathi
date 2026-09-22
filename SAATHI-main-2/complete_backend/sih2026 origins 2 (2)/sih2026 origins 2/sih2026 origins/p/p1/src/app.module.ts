import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis from 'ioredis';

import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/auth/entities/user.entity';
import { LicensingRecord } from './modules/auth/entities/licensing-record.entity';
import { ApplicantBusinessProfile } from './modules/lifecycle/entities/applicant-business-profile.entity';
import { ChecklistTemplate } from './modules/lifecycle/entities/checklist-template.entity';
import { PaymentFee } from './modules/lifecycle/entities/payment-fee.entity';
import { Certificate } from './modules/lifecycle/entities/certificate.entity';

const ALL_ENTITIES = [
  User,
  LicensingRecord,
  ApplicantBusinessProfile,
  ChecklistTemplate,
  PaymentFee,
  Certificate,
];

@Module({
  imports: [
    // Global environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),

    // PostgreSQL database connection via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            entities: ALL_ENTITIES,
            ssl: { rejectUnauthorized: false },
            synchronize: false,
            logging: configService.get<boolean>('DB_LOGGING', false),
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'bis_db'),
          entities: ALL_ENTITIES,
          ssl: { rejectUnauthorized: false },
          synchronize: false,
          logging: configService.get<boolean>('DB_LOGGING', false),
        };
      },
    }),

    // Distributed Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ttl = (configService.get<number>('THROTTLE_TTL', 60)) * 1000;
        const limit = configService.get<number>('THROTTLE_LIMIT', 100);

        return {
          throttlers: [
            {
              name: 'default',
              ttl,
              limit,
            },
          ],
        };
      },
    }),

    // Application Feature Modules
    AuthModule,
  ],
  providers: [
    // Apply Redis-backed ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
