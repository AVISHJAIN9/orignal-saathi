import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource } from 'typeorm';

import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

export interface RetentionPurgeResult {
  status: 'SUCCESS' | 'NO_OP' | 'FAILED';
  deletedConversations: number;
  deletedMessages: number;
  retentionDays: number;
  cutoffDate: string;
  durationMs: number;
  executedAt: string;
  errorMessage?: string;
}

export interface RetentionPolicyStatus {
  retentionDays: number;
  cronSchedule: string;
  cronEnabled: boolean;
  totalConversations: number;
  totalMessages: number;
  expiredConversations: number;
  cutoffDate: string;
}

@Injectable()
export class RetentionService implements OnModuleInit {
  private readonly logger = new Logger(RetentionService.name);

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const days = this.configService.get<number>('retention.retentionDays', 90);
    const cron = this.configService.get<string>('retention.cronSchedule', '0 0 * * *');
    const enabled = this.configService.get<boolean>('retention.cronEnabled', true);

    this.logger.log(
      `[P2 Retention] Initialized with policy: Purge records older than ${days} days | Schedule: "${cron}" | Cron active: ${enabled}`,
    );
  }

  /**
   * Automatic nightly scheduled cron job
   * Defaults to midnight daily ('0 0 * * *')
   */
  @Cron(process.env.CRON_SCHEDULE || CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'data-retention-purge-job',
  })
  async handleScheduledPurge(): Promise<RetentionPurgeResult> {
    const cronEnabled = this.configService.get<boolean>('retention.cronEnabled', true);
    if (!cronEnabled) {
      this.logger.warn('[P2 Retention] Scheduled purge skipped because RETENTION_CRON_ENABLED=false');
      return {
        status: 'NO_OP',
        deletedConversations: 0,
        deletedMessages: 0,
        retentionDays: 0,
        cutoffDate: new Date().toISOString(),
        durationMs: 0,
        executedAt: new Date().toISOString(),
      };
    }

    this.logger.log('[P2 Retention] Starting scheduled automated retention purge cycle...');
    return this.purgeExpiredData();
  }

  /**
   * Purge conversations and associated messages older than the retention window.
   * Can be triggered by cron or manually via administrative endpoint.
   *
   * @param customRetentionDays Optional override for retention days threshold
   */
  async purgeExpiredData(customRetentionDays?: number): Promise<RetentionPurgeResult> {
    const startTime = Date.now();
    const retentionDays =
      customRetentionDays ??
      this.configService.get<number>('retention.retentionDays', 90);

    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    const executedAt = new Date().toISOString();

    this.logger.log(
      `[P2 Retention] Purging records older than ${retentionDays} days (Cutoff timestamp: ${cutoffDate.toISOString()})`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Identify IDs of conversations that have expired
      const expiredConversations = await queryRunner.manager
        .createQueryBuilder(Conversation, 'c')
        .select('c.id')
        .where('c.updatedAt < :cutoffDate', { cutoffDate })
        .getMany();

      const conversationIds = expiredConversations.map((c) => c.id);

      if (conversationIds.length === 0) {
        await queryRunner.commitTransaction();
        const durationMs = Date.now() - startTime;
        this.logger.log(
          `[P2 Retention] Purge complete in ${durationMs}ms: 0 expired records found. Database is clean.`,
        );

        return {
          status: 'NO_OP',
          deletedConversations: 0,
          deletedMessages: 0,
          retentionDays,
          cutoffDate: cutoffDate.toISOString(),
          durationMs,
          executedAt,
        };
      }

      // 2. Explicitly count and delete messages associated with expired conversations
      const messageDeleteResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Message)
        .where('conversationId IN (:...ids)', { ids: conversationIds })
        .execute();

      const deletedMessages = messageDeleteResult.affected ?? 0;

      // 3. Delete expired conversations
      const conversationDeleteResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Conversation)
        .where('id IN (:...ids)', { ids: conversationIds })
        .execute();

      const deletedConversations = conversationDeleteResult.affected ?? conversationIds.length;

      // Commit transactional purge
      await queryRunner.commitTransaction();

      const durationMs = Date.now() - startTime;
      this.logger.log(
        `[P2 Retention] ✅ Purge cycle finished successfully in ${durationMs}ms. Removed ${deletedConversations} conversations and ${deletedMessages} messages.`,
      );

      return {
        status: 'SUCCESS',
        deletedConversations,
        deletedMessages,
        retentionDays,
        cutoffDate: cutoffDate.toISOString(),
        durationMs,
        executedAt,
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      const durationMs = Date.now() - startTime;
      this.logger.error(
        `[P2 Retention] ❌ Failed to purge expired data: ${error?.message || error}`,
        error?.stack,
      );

      return {
        status: 'FAILED',
        deletedConversations: 0,
        deletedMessages: 0,
        retentionDays,
        cutoffDate: cutoffDate.toISOString(),
        durationMs,
        executedAt,
        errorMessage: error?.message || 'Database deletion transaction failed',
      };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Retrieve current retention statistics and pending expired record count
   */
  async getRetentionStatus(): Promise<RetentionPolicyStatus> {
    const retentionDays = this.configService.get<number>('retention.retentionDays', 90);
    const cronSchedule = this.configService.get<string>('retention.cronSchedule', '0 0 * * *');
    const cronEnabled = this.configService.get<boolean>('retention.cronEnabled', true);
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const [totalConversations, totalMessages, expiredConversations] = await Promise.all([
      this.conversationRepository.count(),
      this.messageRepository.count(),
      this.conversationRepository.count({
        where: { updatedAt: LessThan(cutoffDate) },
      }),
    ]);

    return {
      retentionDays,
      cronSchedule,
      cronEnabled,
      totalConversations,
      totalMessages,
      expiredConversations,
      cutoffDate: cutoffDate.toISOString(),
    };
  }
}
