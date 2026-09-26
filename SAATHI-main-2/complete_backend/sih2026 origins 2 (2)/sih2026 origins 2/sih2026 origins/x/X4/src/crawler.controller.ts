import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CircularCrawlerService } from './circular-crawler.service';
import { BisCircularItem } from './crawler.types';
import { DocumentLifecycleManager } from './document-lifecycle.manager';

@Controller('crawler')
export class CrawlerController {
  constructor(
    private readonly crawlerService: CircularCrawlerService,
    private readonly lifecycleManager: DocumentLifecycleManager
  ) {}

  @Post('poll')
  public async pollAndCrawl() {
    return this.crawlerService.pollAndCrawl();
  }

  @Post('ingest-circulars')
  public ingestCirculars(@Body('circulars') circulars: BisCircularItem[]) {
    return this.crawlerService.processCirculars(circulars);
  }

  @Get('standards/:stdNum/active')
  public getActiveStandard(@Param('stdNum') stdNum: string) {
    return this.lifecycleManager.getActiveVersion(stdNum);
  }

  @Get('standards/:stdNum/history')
  public getStandardHistory(@Param('stdNum') stdNum: string) {
    return this.lifecycleManager.getVersionHistory(stdNum);
  }
}
