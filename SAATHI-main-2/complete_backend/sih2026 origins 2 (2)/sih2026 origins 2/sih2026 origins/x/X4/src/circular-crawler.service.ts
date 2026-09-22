import { Injectable, Logger } from '@nestjs/common';
import {
  BisCircularItem,
  ClauseDiffResult,
  CrawlerIngestionReport,
  InvalidationEventPayload,
} from './crawler.types';
import { DiffDetector } from './diff-detector';
import { DocumentLifecycleManager } from './document-lifecycle.manager';
import { HttpCircularFetcherService } from './http-circular-fetcher.service';

@Injectable()
export class CircularCrawlerService {
  private readonly logger = new Logger(CircularCrawlerService.name);
  private readonly processedCirculars: Set<string> = new Set();
  private readonly invalidationListeners: Array<(payload: InvalidationEventPayload) => void> = [];

  constructor(
    private readonly diffDetector?: DiffDetector,
    private readonly lifecycleManager?: DocumentLifecycleManager,
    private readonly httpFetcher?: HttpCircularFetcherService
  ) {}

  public onCacheInvalidation(callback: (payload: InvalidationEventPayload) => void): void {
    this.invalidationListeners.push(callback);
  }

  public async pollAndCrawl(): Promise<CrawlerIngestionReport> {
    const fetcher = this.httpFetcher || new HttpCircularFetcherService();
    const circulars = await fetcher.fetchLatestCirculars();
    return this.processCirculars(circulars);
  }

  public processCirculars(circulars: BisCircularItem[]): CrawlerIngestionReport {
    const detector = this.diffDetector || new DiffDetector();
    const manager = this.lifecycleManager || new DocumentLifecycleManager();

    let newCircularsCount = 0;
    let modifiedStandardsCount = 0;
    let totalClausesChanged = 0;
    const diffsSummary: ClauseDiffResult[] = [];
    const affectedStandardsList: string[] = [];

    for (const circular of circulars) {
      if (this.processedCirculars.has(circular.circularId)) {
        continue;
      }

      newCircularsCount++;
      this.processedCirculars.add(circular.circularId);

      const activeDoc = manager.getActiveVersion(circular.affectedStandardNumber);

      if (activeDoc) {
        const diffReport = detector.detectDiffs(activeDoc, circular);

        if (diffReport.hasChanges) {
          modifiedStandardsCount++;
          totalClausesChanged += diffReport.changedClauses.length;
          diffsSummary.push(diffReport);
          affectedStandardsList.push(circular.affectedStandardNumber);

          const newDoc = manager.createNewVersion(activeDoc, circular);
          this.logger.log(`Created revised version: ${newDoc.documentId} for standard: ${newDoc.standardNumber}`);

          // Trigger cache invalidation event
          const changedClauseNumbers = diffReport.changedClauses.map((c) => c.clauseNumber);
          this.dispatchCacheInvalidation(
            circular.affectedStandardNumber,
            activeDoc.documentId,
            newDoc.documentId,
            changedClauseNumbers
          );
        }
      }
    }

    return {
      timestamp: new Date().toISOString(),
      newCircularsCount,
      modifiedStandardsCount,
      totalClausesChanged,
      affectedStandards: affectedStandardsList,
      diffsSummary,
    };
  }

  public dispatchCacheInvalidation(
    standardNumber: string,
    previousDocId: string,
    newDocId: string,
    affectedClauses: string[]
  ): void {
    const payload: InvalidationEventPayload = {
      standardNumber,
      previousDocumentId: previousDocId,
      newDocumentId: newDocId,
      affectedClauses,
      invalidatedAt: new Date().toISOString(),
      triggerReEmbedding: true,
      triggerOfflineBundleRebuild: true,
    };

    for (const listener of this.invalidationListeners) {
      try {
        listener(payload);
      } catch (err) {
        this.logger.error(`Error in cache invalidation listener: ${(err as Error).message}`);
      }
    }
  }
}
