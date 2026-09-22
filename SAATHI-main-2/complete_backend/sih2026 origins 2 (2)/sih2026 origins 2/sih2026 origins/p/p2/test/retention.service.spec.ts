import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, DataSource } from 'typeorm';

import { RetentionService, RetentionPurgeResult } from '../src/modules/retention/retention.service';
import { Conversation } from '../src/modules/retention/entities/conversation.entity';
import { Message } from '../src/modules/retention/entities/message.entity';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates a date offset by `daysAgo` days behind the current moment.
 */
function daysAgo(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

/**
 * Minimal Conversation factory for test data
 */
function makeConversation(id: string, updatedAtDaysAgo: number): Conversation {
  const c = new Conversation();
  c.id = id;
  c.title = `Test Conversation ${id}`;
  c.userId = 'user-001';
  c.createdAt = daysAgo(updatedAtDaysAgo + 5);
  c.updatedAt = daysAgo(updatedAtDaysAgo);
  c.messages = [];
  return c;
}

// ─── Mocks ────────────────────────────────────────────────────────────────────

/** Builds a jest-mocked QueryRunner with basic transaction lifecycle stubs */
function buildQueryRunnerMock(overrides: Record<string, any> = {}) {
  return {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: {
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        execute: jest.fn().mockResolvedValue({ affected: 0 }),
      }),
    },
    ...overrides,
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('RetentionService (Unit Tests)', () => {
  let service: RetentionService;
  let conversationRepo: jest.Mocked<Repository<Conversation>>;
  let messageRepo: jest.Mocked<Repository<Message>>;
  let mockDataSource: any;
  let configServiceGet: jest.Mock;

  beforeEach(async () => {
    configServiceGet = jest.fn((key: string, defaultVal?: any) => {
      const map: Record<string, any> = {
        'retention.retentionDays': 90,
        'retention.cronSchedule': '0 0 * * *',
        'retention.cronEnabled': true,
      };
      return map[key] ?? defaultVal;
    });

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(buildQueryRunnerMock()),
    };

    const repoFactory = () => ({
      count: jest.fn().mockResolvedValue(0),
      find: jest.fn().mockResolvedValue([]),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetentionService,
        { provide: getRepositoryToken(Conversation), useFactory: repoFactory },
        { provide: getRepositoryToken(Message), useFactory: repoFactory },
        { provide: DataSource, useValue: mockDataSource },
        { provide: ConfigService, useValue: { get: configServiceGet } },
      ],
    })
      .compile();

    service = module.get<RetentionService>(RetentionService);
    conversationRepo = module.get(getRepositoryToken(Conversation));
    messageRepo = module.get(getRepositoryToken(Message));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── purgeExpiredData – NO_OP (nothing to purge) ─────────────────────────────

  describe('purgeExpiredData — NO_OP (no expired records)', () => {
    it('should return NO_OP when no conversations are older than retention window', async () => {
      const qrMock = buildQueryRunnerMock({
        manager: {
          createQueryBuilder: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]), // no expired conversations
            delete: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({ affected: 0 }),
          }),
        },
      });
      mockDataSource.createQueryRunner.mockReturnValue(qrMock);

      const result: RetentionPurgeResult = await service.purgeExpiredData();

      expect(result.status).toBe('NO_OP');
      expect(result.deletedConversations).toBe(0);
      expect(result.deletedMessages).toBe(0);
      expect(result.retentionDays).toBe(90);
      expect(qrMock.commitTransaction).toHaveBeenCalled();
      expect(qrMock.rollbackTransaction).not.toHaveBeenCalled();
      expect(qrMock.release).toHaveBeenCalled();
    });
  });

  // ── purgeExpiredData – SUCCESS ───────────────────────────────────────────────

  describe('purgeExpiredData — SUCCESS (expired records found)', () => {
    it('should delete expired conversations and their messages transactionally', async () => {
      const expiredConvos = [
        makeConversation('uuid-001', 120),
        makeConversation('uuid-002', 95),
      ];
      const expiredIds = expiredConvos.map((c) => c.id);

      // Builder shared for both getMany and execute calls
      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(expiredConvos),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        execute: jest.fn()
          .mockResolvedValueOnce({ affected: 5 })  // message deletion
          .mockResolvedValueOnce({ affected: 2 }), // conversation deletion
      };

      const qrMock = buildQueryRunnerMock({
        manager: {
          createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
        },
      });
      mockDataSource.createQueryRunner.mockReturnValue(qrMock);

      const result = await service.purgeExpiredData();

      expect(result.status).toBe('SUCCESS');
      expect(result.deletedMessages).toBe(5);
      expect(result.deletedConversations).toBe(2);
      expect(result.retentionDays).toBe(90);
      expect(new Date(result.cutoffDate).getTime()).toBeLessThan(Date.now());
      expect(qrMock.commitTransaction).toHaveBeenCalled();
      expect(qrMock.rollbackTransaction).not.toHaveBeenCalled();
      expect(qrMock.release).toHaveBeenCalled();
    });

    it('should accept a custom retention days override', async () => {
      const expiredConvos = [makeConversation('uuid-003', 40)]; // 40 days old

      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(expiredConvos),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        execute: jest.fn()
          .mockResolvedValueOnce({ affected: 2 })
          .mockResolvedValueOnce({ affected: 1 }),
      };

      const qrMock = buildQueryRunnerMock({
        manager: { createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock) },
      });
      mockDataSource.createQueryRunner.mockReturnValue(qrMock);

      const result = await service.purgeExpiredData(30); // override: 30 days

      expect(result.status).toBe('SUCCESS');
      expect(result.retentionDays).toBe(30);
      expect(result.deletedConversations).toBe(1);
      expect(result.deletedMessages).toBe(2);
    });
  });

  // ── purgeExpiredData – FAILED (transaction error) ────────────────────────────

  describe('purgeExpiredData — FAILED (database error)', () => {
    it('should rollback and return FAILED status when a DB error is thrown', async () => {
      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Connection timeout')),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      };

      const qrMock = buildQueryRunnerMock({
        manager: { createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock) },
      });
      mockDataSource.createQueryRunner.mockReturnValue(qrMock);

      const result = await service.purgeExpiredData();

      expect(result.status).toBe('FAILED');
      expect(result.deletedConversations).toBe(0);
      expect(result.deletedMessages).toBe(0);
      expect(result.errorMessage).toContain('Connection timeout');
      expect(qrMock.rollbackTransaction).toHaveBeenCalled();
      expect(qrMock.commitTransaction).not.toHaveBeenCalled();
      expect(qrMock.release).toHaveBeenCalled();
    });
  });

  // ── Cutoff date boundary validation ─────────────────────────────────────────

  describe('cutoffDate — boundary behavior', () => {
    it('should calculate a cutoff date exactly 90 days in the past', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const expectedCutoff = new Date(now - 90 * 24 * 60 * 60 * 1000);

      const qrMock = buildQueryRunnerMock({
        manager: {
          createQueryBuilder: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
            delete: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({ affected: 0 }),
          }),
        },
      });
      mockDataSource.createQueryRunner.mockReturnValue(qrMock);

      const result = await service.purgeExpiredData(90);

      const cutoffDate = new Date(result.cutoffDate);
      const diffMs = Math.abs(cutoffDate.getTime() - expectedCutoff.getTime());
      expect(diffMs).toBeLessThan(1000); // within 1 second tolerance

      jest.spyOn(Date, 'now').mockRestore();
    });
  });

  // ── handleScheduledPurge ─────────────────────────────────────────────────────

  describe('handleScheduledPurge', () => {
    it('should skip purge and return NO_OP when cron is disabled', async () => {
      configServiceGet.mockImplementation((key: string, defaultVal?: any) => {
        if (key === 'retention.cronEnabled') return false;
        return defaultVal;
      });

      const result = await service.handleScheduledPurge();

      expect(result.status).toBe('NO_OP');
      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('should invoke purgeExpiredData when cron is enabled', async () => {
      configServiceGet.mockImplementation((key: string, defaultVal?: any) => {
        if (key === 'retention.cronEnabled') return true;
        if (key === 'retention.retentionDays') return 90;
        return defaultVal;
      });

      const purgeSpy = jest
        .spyOn(service, 'purgeExpiredData')
        .mockResolvedValue({
          status: 'NO_OP',
          deletedConversations: 0,
          deletedMessages: 0,
          retentionDays: 90,
          cutoffDate: new Date().toISOString(),
          durationMs: 10,
          executedAt: new Date().toISOString(),
        });

      const result = await service.handleScheduledPurge();

      expect(purgeSpy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('NO_OP');
    });
  });

  // ── getRetentionStatus ───────────────────────────────────────────────────────

  describe('getRetentionStatus', () => {
    it('should return policy summary including total and expired record counts', async () => {
      conversationRepo.count
        .mockResolvedValueOnce(500)   // totalConversations
        .mockResolvedValueOnce(12);   // expiredConversations

      messageRepo.count.mockResolvedValueOnce(4700); // totalMessages

      const status = await service.getRetentionStatus();

      expect(status.retentionDays).toBe(90);
      expect(status.cronSchedule).toBe('0 0 * * *');
      expect(status.cronEnabled).toBe(true);
      expect(status.totalConversations).toBe(500);
      expect(status.totalMessages).toBe(4700);
      expect(status.expiredConversations).toBe(12);
      expect(status.cutoffDate).toBeDefined();
    });
  });
});
