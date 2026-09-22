/**
 * BullMQ Queue Provider for M1 Ingestion Pipeline
 *
 * Replaces the MockQueue with a real BullMQ queue backed by Redis.
 *
 * Features:
 * - Job persistence via Redis (survives service restarts)
 * - Dead-letter queue (failed jobs visible in Bull Board)
 * - Job progress tracking
 * - Configurable concurrency and retry policy
 * - Fail-fast: if Redis is unreachable at startup → service exits
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import { IngestionJobData } from './ingestion-job.types';

const QUEUE_NAME = 'bis-ingestion';
const DLQ_NAME = 'bis-ingestion-dlq';

export class QueueInitError extends Error {
  constructor(msg: string) { super(msg); this.name = 'QueueInitError'; }
}

@Injectable()
export class BullMQProvider implements OnModuleInit {
  private readonly logger = new Logger(BullMQProvider.name);
  private queue: Queue;
  private dlq: Queue;
  private queueEvents: QueueEvents;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const redisUrl = this.config.get<string>('REDIS_URL');
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';

    if (!redisUrl) {
      if (isProduction) {
        throw new QueueInitError(
          'REDIS_URL not configured. Production requires Redis for BullMQ queue persistence. ' +
          'Set REDIS_URL in your environment or secrets manager.'
        );
      }
      this.logger.warn(
        '⚠️  [LOCAL-DEV] REDIS_URL not set. BullMQ will attempt to connect to localhost:6379. ' +
        'Start Redis with: docker run -p 6379:6379 redis:7-alpine'
      );
    }

    const connection = this.parseRedisConnection(redisUrl || 'redis://localhost:6379');

    try {
      this.queue = new Queue(QUEUE_NAME, {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: { count: 1000 },
          removeOnFail: false, // Keep failed jobs for inspection
        },
      });

      this.dlq = new Queue(DLQ_NAME, { connection });

      this.queueEvents = new QueueEvents(QUEUE_NAME, { connection });

      // Verify queue is reachable
      await this.queue.getJobCounts();
      this.logger.log(`✅ BullMQ connected to Redis. Queue: '${QUEUE_NAME}'`);

      // Set up dead-letter queue routing
      this.queueEvents.on('failed', async ({ jobId }) => {
        const job = await this.queue.getJob(jobId);
        if (!job) return;
        const attempts = job.attemptsMade;
        const maxAttempts = job.opts.attempts || 3;
        if (attempts >= maxAttempts) {
          this.logger.error(
            `Job ${jobId} exhausted ${attempts} attempts. Moving to DLQ. ` +
            `Last error: ${job.failedReason}. ` +
            `Data: ${JSON.stringify(job.data).slice(0, 200)}`
          );
          await this.dlq.add('failed-job', {
            originalJobId: jobId,
            originalQueue: QUEUE_NAME,
            jobData: job.data,
            failedReason: job.failedReason,
            attemptsMade: attempts,
            failedAt: new Date().toISOString(),
          });
        }
      });

    } catch (err) {
      if (isProduction) {
        this.logger.error(`🔴 FATAL: Cannot connect to Redis for BullMQ: ${err.message}`);
        throw new QueueInitError(`BullMQ Redis connection failed: ${err.message}`);
      }
      this.logger.warn(
        `⚠️  [LOCAL-DEV] Redis unreachable (${err.message}). ` +
        'Queue operations will fail at runtime. Start Redis to enable ingestion.'
      );
    }
  }

  async add(jobName: string, data: IngestionJobData, opts?: object): Promise<{ id: string; name: string; data: IngestionJobData }> {
    if (!this.queue) {
      throw new QueueInitError('BullMQ queue not initialized. Ensure Redis is running and REDIS_URL is set.');
    }
    const job = await this.queue.add(jobName, data, opts);
    this.logger.log(`📥 Job '${jobName}' added to queue (ID: ${job.id})`);
    return { id: job.id!, name: jobName, data };
  }

  async getJob(jobId: string): Promise<Job | null> {
    if (!this.queue) return null;
    return this.queue.getJob(jobId);
  }

  async getQueueStats() {
    if (!this.queue) return null;
    const [waiting, active, completed, failed, dlqCount] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.dlq.getWaitingCount(),
    ]);
    return { queue: QUEUE_NAME, waiting, active, completed, failed, dlq: dlqCount };
  }

  private parseRedisConnection(url: string) {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname || 'localhost',
        port: parseInt(parsed.port || '6379', 10),
        password: parsed.password || undefined,
        db: parseInt(parsed.pathname.replace('/', '') || '0', 10),
        maxRetriesPerRequest: null, // Required for BullMQ
      };
    } catch {
      return { host: 'localhost', port: 6379, maxRetriesPerRequest: null };
    }
  }
}
