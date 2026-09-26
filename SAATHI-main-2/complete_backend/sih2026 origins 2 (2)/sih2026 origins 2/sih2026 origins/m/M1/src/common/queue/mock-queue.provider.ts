import { Logger } from '@nestjs/common';

export interface IngestionJobData {
  documentId: string;
  standardNumber: string;
  sourceUrl?: string;
  fileBufferBase64?: string;
  filename?: string;
  uploadedAt: string;
}

export class MockQueue {
  private readonly logger = new Logger('MockQueue');
  private readonly inMemoryJobs = new Map<string, any>();

  async add(jobName: string, data: IngestionJobData, opts?: any) {
    const jobId = `mock-job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.logger.log(`[In-Memory Mock Queue] Job '${jobName}' (ID: ${jobId}) accepted. Redis is offline or not configured.`);
    
    const jobRecord = {
      id: jobId,
      name: jobName,
      data,
      opts,
      progress: 100,
      timestamp: Date.now(),
      status: 'completed',
    };
    this.inMemoryJobs.set(jobId, jobRecord);
    return jobRecord;
  }

  async getJob(jobId: string) {
    return this.inMemoryJobs.get(jobId) || null;
  }
}
