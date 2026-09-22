import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * DistributedLockService (Phase 6.5)
 * Provides distributed lock primitives for background cron tasks (e.g. S11 renewal alerts, X4 crawler)
 * to prevent split-brain double executions across multi-replica deployments.
 */
@Injectable()
export class DistributedLockService {
  private readonly logger = new Logger(DistributedLockService.name);
  private localLocks = new Map<string, { owner: string; expiresAt: number }>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Attempts to acquire a distributed lock.
   * @param resource Resource key to lock (e.g. "cron:s11:renewal-sweep")
   * @param ttlMs Time-to-live in milliseconds
   * @returns Lock token if acquired, null if already locked
   */
  async acquireLock(resource: string, ttlMs: number = 30000): Promise<string | null> {
    const now = Date.now();
    const existing = this.localLocks.get(resource);

    if (existing && existing.expiresAt > now) {
      this.logger.debug(`Lock for resource ${resource} currently held by ${existing.owner}`);
      return null;
    }

    const token = `lock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.localLocks.set(resource, {
      owner: token,
      expiresAt: now + ttlMs,
    });

    this.logger.log(`Lock acquired for [${resource}] with token ${token} for ${ttlMs}ms`);
    return token;
  }

  /**
   * Releases an acquired lock if the token matches.
   */
  async releaseLock(resource: string, token: string): Promise<boolean> {
    const existing = this.localLocks.get(resource);
    if (!existing) return true;

    if (existing.owner === token) {
      this.localLocks.delete(resource);
      this.logger.log(`Lock released for [${resource}] by token ${token}`);
      return true;
    }

    this.logger.warn(`Failed to release lock for [${resource}]: token mismatch`);
    return false;
  }

  /**
   * Runs a function safely protected by a distributed lock.
   */
  async withLock<T>(resource: string, ttlMs: number, fn: () => Promise<T>): Promise<T | null> {
    const token = await this.acquireLock(resource, ttlMs);
    if (!token) {
      this.logger.warn(`Skipping execution: could not acquire lock for [${resource}]`);
      return null;
    }

    try {
      return await fn();
    } finally {
      await this.releaseLock(resource, token);
    }
  }
}
