import { OfflineBundleBuilder } from './offline-bundle-builder';
import {
  OfflineQueryResult,
  OfflineSyncBundle,
  SyncRequestHeaders,
  SyncResponsePayload,
} from './offline-sync.types';

export class OfflineSyncService {
  private readonly builder: OfflineBundleBuilder;
  private cachedBundle: OfflineSyncBundle | null = null;

  constructor(builder?: OfflineBundleBuilder) {
    this.builder = builder || new OfflineBundleBuilder();
  }

  public getBundle(): OfflineSyncBundle {
    if (!this.cachedBundle) {
      this.cachedBundle = this.builder.buildBundle();
    }
    return this.cachedBundle;
  }

  public invalidateAndRebuild(): OfflineSyncBundle {
    this.cachedBundle = this.builder.buildBundle();
    return this.cachedBundle;
  }

  public handleSyncRequest(headers: SyncRequestHeaders): SyncResponsePayload {
    const bundle = this.getBundle();
    const serverEtag = `"${bundle.bundleChecksum}"`;

    if (
      headers.ifNoneMatch === serverEtag ||
      headers.clientBundleVersion === bundle.bundleVersion
    ) {
      return {
        isUpToDate: true,
        etag: serverEtag,
      };
    }

    return {
      isUpToDate: false,
      etag: serverEtag,
      bundle,
    };
  }

  /**
   * Resolves a user query offline against the cached standards & FAQ bundle
   */
  public resolveQueryOffline(queryText: string): OfflineQueryResult | null {
    if (!queryText) return null;
    const q = queryText.toLowerCase();
    const bundle = this.getBundle();

    // Check FAQs first
    for (const faq of bundle.frequentFaqs) {
      const matchKeywords = faq.keywords.some((k) => q.includes(k.toLowerCase()));
      if (matchKeywords || q.includes(faq.question.toLowerCase().substring(0, 15))) {
        return {
          isOfflineResult: true,
          query: queryText,
          matchedTitle: faq.question,
          answerOrSummary: faq.answer,
          standardNumber: faq.standardNumber,
          confidence: 0.95,
        };
      }
    }

    // Check Standards
    for (const std of bundle.topStandards) {
      const stdNum = std.standardNumber.toLowerCase();
      const title = std.title.toLowerCase();

      if (q.includes(stdNum) || q.includes(title) || (q.includes('water') && stdNum.includes('10500')) || (q.includes('concrete') && stdNum.includes('456'))) {
        return {
          isOfflineResult: true,
          query: queryText,
          matchedTitle: `${std.standardNumber} — ${std.title}`,
          answerOrSummary: std.scopeSummary,
          standardNumber: std.standardNumber,
          clauses: std.keyClauses.map((k) => ({ clauseNumber: k.clauseNumber, summary: k.summary })),
          confidence: 0.90,
        };
      }
    }

    return null;
  }

  public offlineSearch(keyword: string): Array<{ type: 'STANDARD' | 'FAQ'; ref: string }> {
    const bundle = this.getBundle();
    const cleanKey = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    const refs = bundle.offlineSearchTerms[cleanKey] || [];

    return refs.map((ref) => ({
      type: ref.startsWith('FAQ') ? 'FAQ' : 'STANDARD',
      ref,
    }));
  }
}
