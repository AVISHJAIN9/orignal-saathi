import {
  Injectable,
  Logger
} from '@nestjs/common';
import {
  InjectQueue
} from '@nestjs/bullmq';
import {
  Queue
} from 'bullmq';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  Repository
} from 'typeorm';
import to from 'await-to-js';
import {
  EmailLog,
  EmailStatus
} from './email-log.entity';
import {
  EmailPayload,
  EmailJobData
} from './interfaces/email-job.interface';

export const EMAIL_QUEUE = 'email-dispatch';
export const EMAIL_DLQ = 'email-dispatch-dlq';

@Injectable(
)
export class EmailService {

  private readonly logger = new Logger(
    EmailService.name
  );

  constructor(
    @InjectQueue(
      EMAIL_QUEUE
    )
    private readonly emailQueue: Queue<
      EmailJobData
    >,
    @InjectRepository(
      EmailLog
    )
    private readonly emailLogRepository: Repository<
      EmailLog
    >
  ) {

  }

  // Persists email log entry and queues background dispatch job
  async enqueue(
    recipientEmailAddress: string,
    emailPayloadData: EmailPayload
  ): Promise<
    EmailLog
  > {

    const initialLogRecord = this.emailLogRepository.create(
      {
        to: recipientEmailAddress,
        template: emailPayloadData.template,
        payload: emailPayloadData.data as unknown as Record<
          string,
          unknown
        >,
        status: EmailStatus.QUEUED
      }
    );

    const [
      saveLogError,
      savedEmailLogRecord
    ] = await to(
      this.emailLogRepository.save(
        initialLogRecord
      )
    );

    if (
      saveLogError || !savedEmailLogRecord
    ) {
      this.logger.error(
        `Failed to save email log for ${recipientEmailAddress}`
      );
      throw saveLogError;
    }

    const [
      queueError
    ] = await to(
      this.emailQueue.add(
        'send',
        {
          to: recipientEmailAddress,
          logId: savedEmailLogRecord.id,
          payload: emailPayloadData
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000
          },
          removeOnComplete: 500,
          removeOnFail: 1000
        }
      )
    );

    if (
      queueError
    ) {
      this.logger.error(
        `Failed to enqueue email dispatch for log ${savedEmailLogRecord.id}`
      );
      throw queueError;
    }

    return savedEmailLogRecord;

  }

}
