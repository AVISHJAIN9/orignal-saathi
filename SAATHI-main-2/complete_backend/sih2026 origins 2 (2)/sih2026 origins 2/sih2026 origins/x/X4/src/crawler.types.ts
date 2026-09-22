import * as crypto from 'crypto';

export type DocumentLifecycleStatus = 'ACTIVE' | 'SUPERSEDED' | 'WITHDRAWN' | 'DRAFT';

export interface StandardClauseChunk {
  clauseNumber: string;
  clauseTitle?: string;
  content: string;
  tableNumber?: string;
  annexNumber?: string;
  figureNumber?: string;
  clauseHash?: string;
}

export interface GazetteQualityControlOrder {
  qcoId: string;
  orderNumber: string;
  notifyingMinistry: string;
  gazetteNotificationDate: string;
  mandatoryComplianceDeadline: string;
  msmeExemptionGracePeriodDays?: number;
  coveredStandardNumbers: string[];
}

export interface StandardDocumentVersion {
  documentId: string;
  standardNumber: string;
  title: string;
  edition: string;
  year: number;
  status: DocumentLifecycleStatus;
  supersededByDocumentId?: string;
  supersedesDocumentId?: string;
  effectiveFrom: string;
  withdrawnDate?: string;
  fullDocumentChecksum: string;
  clauses: StandardClauseChunk[];
  qcoDetails?: GazetteQualityControlOrder;
  createdAt: string;
  updatedAt: string;
}

export interface BisCircularItem {
  circularId: string;
  title: string;
  sourceUrl: string;
  publishedDate: string;
  affectedStandardNumber: string;
  amendmentSummary: string;
  amendedClauses: Array<{
    clauseNumber: string;
    title?: string;
    newContent: string;
    previousContent?: string;
  }>;
}

export interface InvalidationEventPayload {
  standardNumber: string;
  previousDocumentId: string;
  newDocumentId: string;
  affectedClauses: string[];
  invalidatedAt: string;
  triggerReEmbedding: boolean;
  triggerOfflineBundleRebuild: boolean;
}

export interface DiffDetectionResult {
  hasChanges: boolean;
  totalOriginalClauses: number;
  totalNewClauses: number;
  addedClauses: StandardClauseChunk[];
  modifiedClauses: Array<{
    original: StandardClauseChunk;
    updated: StandardClauseChunk;
  }>;
  changedClauses: StandardClauseChunk[];
  unchangedClauses: StandardClauseChunk[];
  removedClauseNumbers: string[];
  reEmbeddingRequiredCount: number;
  markdownDiffReport: string;
}

export type ClauseDiffResult = DiffDetectionResult;

export interface CrawlerIngestionReport {
  timestamp: string;
  newCircularsCount: number;
  modifiedStandardsCount: number;
  totalClausesChanged: number;
  affectedStandards: string[];
  diffsSummary: DiffDetectionResult[];
}

export function computeSha256(text: string): string {
  return crypto.createHash('sha256').update(text.trim()).digest('hex');
}
