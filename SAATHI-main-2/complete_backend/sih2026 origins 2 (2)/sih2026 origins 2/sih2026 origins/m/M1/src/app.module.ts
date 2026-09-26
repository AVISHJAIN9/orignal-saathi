import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { BullMQProvider } from './common/queue/bullmq.provider';
import { BisCrawlerService } from './crawler/bis-crawler.service';

/**
 * M1 App Module — Document Ingestion & BIS Crawler
 *
 * Replaces MockQueue with real BullMQ + Redis.
 * Adds BisCrawlerService for automated BIS website crawling.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [IngestionController],
  providers: [
    BullMQProvider,
    BisCrawlerService,
    IngestionService,
  ],
})
export class AppModule {}
