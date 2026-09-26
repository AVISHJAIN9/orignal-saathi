import { CircularCrawlerService } from '../src/circular-crawler.service';
import { InvalidationEventPayload } from '../src/crawler.types';

describe('X4: Circular Crawler Service', () => {
  let crawler: CircularCrawlerService;

  beforeEach(() => {
    crawler = new CircularCrawlerService();
  });

  it('should process circulars, update standards, and emit invalidation events', () => {
    let capturedPayload: InvalidationEventPayload | null = null;
    crawler.onCacheInvalidation((payload) => {
      capturedPayload = payload;
    });

    const circular: any = {
      circularId: 'CIRC-WATER-2026',
      affectedStandardNumber: 'IS 10500:2012',
      publishedDate: '2026-05-15',
      amendedClauses: [
        { clauseNumber: '4.2', title: 'TDS Limits', newContent: 'New TDS 300 mg/l.' },
      ],
    };

    const report = crawler.processCirculars([circular]);
    expect(report.newCircularsCount).toBe(1);
    expect(report.modifiedStandardsCount).toBe(1);
    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload?.standardNumber).toBe('IS 10500:2012');
    expect(capturedPayload?.triggerOfflineBundleRebuild).toBe(true);
  });
});
