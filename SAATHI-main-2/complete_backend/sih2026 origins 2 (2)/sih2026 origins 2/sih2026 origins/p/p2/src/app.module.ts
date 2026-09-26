import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import retentionConfig from './config/retention.config';
import { RetentionModule } from './modules/retention/retention.module';
import { Conversation } from './modules/retention/entities/conversation.entity';
import { Message } from './modules/retention/entities/message.entity';

@Module({
  imports: [
    // Global environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [retentionConfig],
      envFilePath: ['.env', '.env.example'],
    }),

    // Cron job scheduler module
    ScheduleModule.forRoot(),

    // PostgreSQL database connection via TypeORM
    // NOTE: synchronize is strictly set to FALSE to prevent schema collisions with Module M9
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            entities: [Conversation, Message],
            synchronize: false, // Prevents altering existing M9 schema
            logging: configService.get<boolean>('retention.dbLogging', false),
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('retention.dbHost', 'localhost'),
          port: configService.get<number>('retention.dbPort', 5432),
          username: configService.get<string>('retention.dbUsername', 'postgres'),
          password: configService.get<string>('retention.dbPassword', 'postgres'),
          database: configService.get<string>('retention.dbDatabase', 'bis_db'),
          entities: [Conversation, Message],
          synchronize: false, // Prevents altering existing M9 schema
          logging: configService.get<boolean>('retention.dbLogging', false),
        };
      },
    }),

    // Retention feature module
    RetentionModule,
  ],
})
export class AppModule {}
