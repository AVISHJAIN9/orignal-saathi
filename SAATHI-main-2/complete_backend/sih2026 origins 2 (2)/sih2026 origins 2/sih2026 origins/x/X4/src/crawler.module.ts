import { Module } from '@nestjs/common';
import { CircularCrawlerService } from './circular-crawler.service';
import { CrawlerController } from './crawler.controller';
import { DiffDetector } from './diff-detector';
import { DocumentLifecycleManager } from './document-lifecycle.manager';
import { HttpCircularFetcherService } from './http-circular-fetcher.service';

@Module({
  controllers: [CrawlerController],
  providers: [
    CircularCrawlerService,
    DiffDetector,
    DocumentLifecycleManager,
    HttpCircularFetcherService,
  ],
  exports: [
    CircularCrawlerService,
    DiffDetector,
    DocumentLifecycleManager,
    HttpCircularFetcherService,
  ],
})
export class CrawlerModule {}
