/**
 * Shared type definitions for M1 ingestion jobs.
 * Used by both BullMQProvider and IngestionService.
 */
export interface IngestionJobData {
  documentId: string;
  standardNumber: string;
  sourceUrl?: string;
  fileBufferBase64?: string;
  filename?: string;
  uploadedAt: string;
  checksumSha256?: string;
  sourceType?: 'upload' | 'crawler' | 'gazette';
}

export interface CrawlJobData {
  crawlRunId: string;
  requestedAt: string;
  existingChecksums?: Record<string, string>;
}
