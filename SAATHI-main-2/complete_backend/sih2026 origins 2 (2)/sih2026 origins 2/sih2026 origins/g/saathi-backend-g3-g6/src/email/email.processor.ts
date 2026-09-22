import {
  InjectQueue,
  Processor,
  WorkerHost
} from '@nestjs/bullmq';
import {
  Inject,
  Logger,
  Optional
} from '@nestjs/common';
import {
  ConfigService
} from '@nestjs/config';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  Repository
} from 'typeorm';
import {
  Job,
  Queue
} from 'bullmq';
import * as nodemailer from 'nodemailer';
import to from 'await-to-js';
import {
  EMAIL_QUEUE,
  EMAIL_DLQ
} from './email.service';
import {
  EmailLog,
  EmailStatus
} from './email-log.entity';
import {
  EmailJobData
} from './interfaces/email-job.interface';
import {
  renderEmail
} from './templates/email-templates';
import {
  MAIL_TRANSPORT
} from './mail-transport.provider';

@Processor(
  EMAIL_QUEUE
)
export class EmailProcessor extends WorkerHost {

  private readonly logger = new Logger(
    EmailProcessor.name
  );

  constructor(
    @Inject(
      MAIL_TRANSPORT
    )
    private readonly mailTransport: nodemailer.Transporter,
    @InjectRepository(
      EmailLog
    )
    private readonly emailLogRepository: Repository<
      EmailLog
    >,
    private readonly configurationService: ConfigService,
    @Optional()
    @InjectQueue(
      EMAIL_DLQ
    )
    private readonly emailDlq?: Queue
  ) {

    super(
    );

  }

  async process(
    queueJobItem: Job<
      EmailJobData
    >
  ): Promise<
    void
  > {

    const {
      to: recipientEmailAddress,
      logId: emailLogId,
      payload: emailPayloadData
    } = queueJobItem.data;

    const renderedEmailContent = renderEmail(
      emailPayloadData
    );
    const senderEmailAddress = this.configurationService.get<
      string
    >(
      'EMAIL_FROM',
      'no-reply@saathi.example.gov.in'
    );

    const [
      sendMailError,
      sentMailInfo
    ] = await to(
      this.mailTransport.sendMail(
        {
          from: senderEmailAddress,
          to: recipientEmailAddress,
          subject: renderedEmailContent.subject,
          text: renderedEmailContent.text,
          html: renderedEmailContent.html
        }
      )
    );

    if (
      sendMailError
    ) {
      const failureErrorMessage = sendMailError.message || 'Unknown error sending email';
      this.logger.error(
        `Email dispatch failed for log ${emailLogId}: ${failureErrorMessage}`
      );
      await to(
        this.emailLogRepository.update(
          emailLogId,
          {
            status: EmailStatus.FAILED,
            error: failureErrorMessage
          }
        )
      );

      // Route permanently failed job to Dead-Letter Queue (DLQ)
      const maxAttempts = queueJobItem.opts?.attempts || 3;
      if (queueJobItem.attemptsMade >= maxAttempts && this.emailDlq) {
        this.logger.warn(
          `[DLQ] Email job ${queueJobItem.id} permanently failed after ${queueJobItem.attemptsMade} attempts. Routing to DLQ.`
        );
        await to(
          this.emailDlq.add('dead-letter-email', {
            originalJobId: queueJobItem.id,
            data: queueJobItem.data,
            error: failureErrorMessage,
            attempts: queueJobItem.attemptsMade,
            failedAt: new Date().toISOString()
          })
        );
      }

      throw sendMailError;
    }

    let resolvedProviderMessageId: string | null = null;
    if (
      sentMailInfo?.messageId
    ) {
      resolvedProviderMessageId = sentMailInfo.messageId;
    } else {
      resolvedProviderMessageId = null;
    }

    await to(
      this.emailLogRepository.update(
        emailLogId,
        {
          status: EmailStatus.SENT,
          providerMessageId: resolvedProviderMessageId,
          sentAt: new Date(
          )
        }
      )
    );

  }

}
