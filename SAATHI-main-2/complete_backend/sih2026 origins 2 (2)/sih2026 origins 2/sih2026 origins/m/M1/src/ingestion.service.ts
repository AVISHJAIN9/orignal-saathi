import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { BullMQProvider } from './common/queue/bullmq.provider';
import { BisCrawlerService } from './crawler/bis-crawler.service';
import { IngestionJobData } from './common/queue/ingestion-job.types';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly queue: BullMQProvider,
    private readonly crawler: BisCrawlerService,
  ) {}

  public computeChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Queue a document (uploaded PDF or HTML) for ingestion.
   * Uses real BullMQ queue backed by Redis.
   */
  public async queueDocumentIngestion(
    filename: string,
    standardNumber: string,
    fileBuffer: Buffer,
    sourceUrl?: string,
  ) {
    const checksum = this.computeChecksum(fileBuffer);
    const documentId = `doc-${standardNumber.replace(/\s+/g, '_')}-${checksum.slice(0, 8)}`;

    const jobData: IngestionJobData = {
      documentId,
      standardNumber,
      sourceUrl,
      fileBufferBase64: fileBuffer.toString('base64'),
      filename,
      uploadedAt: new Date().toISOString(),
      checksumSha256: checksum,
      sourceType: 'upload',
    };

    const job = await this.queue.add('process-bis-pdf', jobData);

    this.logger.log(`Document [${standardNumber}] queued. Job ID: ${job.id}, Checksum: ${checksum.slice(0, 16)}...`);
    return {
      jobId: job.id,
      documentId,
      checksum,
      status: 'queued',
      message: 'Document ingestion job accepted for text extraction and pgvector chunking',
    };
  }

  /**
   * Trigger a full BIS website crawl run.
   * Queues one job per changed page (skips unchanged via checksum comparison).
   */
  public async triggerCrawlRun(existingChecksums: Record<string, string> = {}): Promise<{
    crawlRunId: string;
    pagesQueued: number;
    pagesSkipped: number;
    message: string;
  }> {
    const crawlRunId = `crawl-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    this.logger.log(`Starting BIS crawl run: ${crawlRunId}`);

    const checksumMap = new Map<string, string>(Object.entries(existingChecksums));
    const pages = await this.crawler.crawlAll(checksumMap);

    let pagesQueued = 0;
    let pagesSkipped = 0;

    for (const page of pages) {
      const jobData: IngestionJobData = {
        documentId: `crawl-${crawlRunId}-${crypto.createHash('md5').update(page.url).digest('hex').slice(0, 8)}`,
        standardNumber: page.title,
        sourceUrl: page.url,
        filename: `crawler:${page.sourceType}:${page.url.replace(/[^a-zA-Z0-9]/g, '_').slice(-40)}.html`,
        uploadedAt: page.crawledAt,
        checksumSha256: page.checksum,
        sourceType: 'crawler',
        fileBufferBase64: Buffer.from(page.content).toString('base64'),
      };

      try {
        await this.queue.add('process-bis-crawled-page', jobData);
        pagesQueued++;
      } catch (err) {
        this.logger.error(`Failed to queue page ${page.url}: ${err.message}`);
        // Individual page failures don't stop the crawl run
      }
    }

    pagesSkipped = this.crawler.CRAWL_TARGETS?.length
      ? Math.max(0, (this.crawler as any).CRAWL_TARGETS.length - pages.length)
      : 0;

    this.logger.log(`Crawl run ${crawlRunId} complete. Queued: ${pagesQueued}, Skipped (unchanged): ${pagesSkipped}`);

    return {
      crawlRunId,
      pagesQueued,
      pagesSkipped,
      message: `Crawl run complete. ${pagesQueued} pages queued for ingestion, ${pagesSkipped} skipped (unchanged).`,
    };
  }

  public async getJobStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      return { jobId, status: 'not_found', message: 'Job not found or already cleaned up' };
    }
    const state = await job.getState();
    return {
      jobId: job.id,
      name: job.name,
      state,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      data: { documentId: job.data.documentId, standardNumber: job.data.standardNumber },
    };
  }

  public async getQueueStats() {
    return this.queue.getQueueStats();
  }
}
