export interface OfflineStandardEntry {
  standardNumber: string;
  title: string;
  category: string;
  scopeSummary: string;
  keyClauses: Array<{ clauseNumber: string; title: string; summary: string }>;
  isMandatoryUnderQCO: boolean;
}

export interface OfflineFaqEntry {
  faqId: string;
  question: string;
  answer: string;
  standardNumber?: string;
  category: string;
  keywords: string[];
}

export interface OfflineSyncBundle {
  bundleVersion: string;
  bundleChecksum: string;
  generatedAt: string;
  topStandards: OfflineStandardEntry[];
  frequentFaqs: OfflineFaqEntry[];
  offlineSearchTerms: Record<string, string[]>;
  clientCacheTtlSeconds: number;
}

export interface OfflineQueryResult {
  isOfflineResult: boolean;
  query: string;
  matchedTitle: string;
  answerOrSummary: string;
  standardNumber?: string;
  clauses?: Array<{ clauseNumber: string; summary: string }>;
  confidence: number;
}

export interface SyncRequestHeaders {
  ifNoneMatch?: string;
  clientBundleVersion?: string;
}

export interface SyncResponsePayload {
  isUpToDate: boolean;
  etag: string;
  bundle?: OfflineSyncBundle;
}
