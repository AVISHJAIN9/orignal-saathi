import { Worker, Job } from 'bullmq';
import { getRedisConnectionOptions } from '../common/services/redis.service';
import { extractTextFromBuffer } from '../common/utils/ocr-extractor.util';
import { evaluateCertificateText } from '../common/utils/cert-evaluation.util';

console.log('🚀 Starting SAATHI BullMQ Background Worker...');

const connection = getRedisConnectionOptions();

// 1. Worker for 'cert-validation' queue
export const certWorker = new Worker(
  'cert-validation',
  async (job: Job) => {
    console.log(`[cert-validation] Processing job ${job.id} (name: ${job.name})...`);
    const { fileBufferBase64, originalName, mimeType, standardNumber, rawText } = job.data;
    const stdNumber = standardNumber || 'IS 10500:2012';

    let extractedText = rawText || '';
    if (fileBufferBase64) {
      const buffer = Buffer.from(fileBufferBase64, 'base64');
      extractedText = await extractTextFromBuffer(buffer, mimeType, originalName);
    }

    const evaluated = evaluateCertificateText(extractedText, stdNumber);
    const overallStatus = evaluated.every((p) => p.pass) ? 'PASS' : 'FAIL';

    const result = {
      jobId: job.id,
      standardNumber: stdNumber,
      overallStatus,
      parameters: evaluated,
      extractedTextLength: extractedText.length,
      processedAt: new Date().toISOString()
    };

    console.log(`[cert-validation] Job ${job.id} completed. Overall: ${overallStatus}`);
    return result;
  },
  { connection }
);

certWorker.on('completed', (job: Job) => {
  console.log(`[cert-validation] Job ${job.id} marked COMPLETED in Redis.`);
});

certWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`[cert-validation] Job ${job?.id} FAILED:`, err);
});

// 2. Worker for 'consignment-bulk' queue
export const consignmentWorker = new Worker(
  'consignment-bulk',
  async (job: Job) => {
    console.log(`[consignment-bulk] Processing bulk consignment job ${job.id}...`);
    const { rows } = job.data;
    const passedItems = (rows || []).filter((r: any) => r.complianceStatus === 'PASS').length;
    const failedItems = (rows || []).length - passedItems;

    return {
      isAsync: true,
      jobId: job.id,
      totalItems: (rows || []).length,
      passedItems,
      failedItems,
      clearanceStatus: failedItems === 0 ? 'CLEARED_FOR_CUSTOMS' : 'HELD_AT_PORT_DEFECT_FOUND',
      rowResults: rows || [],
      timestamp: new Date().toISOString()
    };
  },
  { connection }
);

// 3. Worker for 'officer-escalations' queue
export const escalationWorker = new Worker(
  'officer-escalations',
  async (job: Job) => {
    console.log(`[officer-escalations] Enqueued ticket ${job.data?.ticketId} assigned to officer queue.`);
    return {
      ticketId: job.data?.ticketId,
      status: 'QUEUED',
      assignedQueue: 'REDIS_OFFICER_DISTRIBUTION_MAIN',
      enqueuedAt: new Date().toISOString()
    };
  },
  { connection }
);

console.log('✅ SAATHI BullMQ Workers listening on cert-validation, consignment-bulk, and officer-escalations queues.');
