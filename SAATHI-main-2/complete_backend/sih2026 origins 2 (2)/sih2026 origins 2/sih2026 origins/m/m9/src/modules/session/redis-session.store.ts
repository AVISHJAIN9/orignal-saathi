/**
 * M9 Redis Session Store
 *
 * Replaces the implicit TypeORM-only session handling with explicit Redis-backed
 * active session tracking with TTL. This enables:
 * - Multi-replica deployment (session created on pod A, retrievable on pod B)
 * - Fast session presence check without DB query (O(1) Redis GET)
 * - Automatic session expiry via Redis TTL (no cron job needed)
 * - Revokable sessions (admin can DELETE redis key to force logout)
 *
 * Coexists with TypeORM: TypeORM stores the durable conversation history,
 * Redis stores the ephemeral active session pointer + metadata.
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SessionData {
  sessionId: string;
  userId?: string;
  conversationId?: string;
  createdAt: string;
  lastActiveAt: string;
  language: string;
  metadata?: Record<string, unknown>;
}

const SESSION_TTL_SECONDS = 60 * 60 * 2; // 2 hours idle timeout
const SESSION_KEY_PREFIX = 'saathi:session:';

@Injectable()
export class RedisSessionStore implements OnModuleInit {
  private readonly logger = new Logger(RedisSessionStore.name);
  private client: any = null;
  private readonly isProduction: boolean;
  private readonly isLocalDev: boolean;
  private readonly fallbackStore = new Map<string, { data: string; expiresAt: number }>();

  constructor(private readonly config: ConfigService) {
    this.isProduction = config.get<string>('NODE_ENV') === 'production';
    this.isLocalDev = process.env.LOCAL_DEV === 'true';
  }

  async onModuleInit() {
    const redisUrl = this.config.get<string>('REDIS_URL');

    if (!redisUrl) {
      if (this.isProduction) {
        throw new Error(
          'REDIS_URL not configured. M9 session store requires Redis in production. ' +
          'Multi-replica deployment will not work without Redis.',
        );
      }
      this.logger.warn(
        '⚠️  [LOCAL-DEV] REDIS_URL not set. Using in-process session Map. ' +
        'Sessions will NOT survive pod restarts or scale-out. ' +
        'Start Redis: docker run -p 6379:6379 redis:7-alpine',
      );
      return;
    }

    try {
      const { createClient } = require('redis');
      this.client = createClient({ url: redisUrl });
      this.client.on('error', (err: Error) => {
        this.logger.error(`Redis client error: ${err.message}`);
      });
      await this.client.connect();
      await this.client.ping();
      this.logger.log('✅ M9 RedisSessionStore: connected to Redis');
    } catch (err) {
      if (this.isProduction) {
        throw new Error(`M9 Redis connection failed: ${err.message}`);
      }
      this.logger.warn(
        `⚠️  [LOCAL-DEV] Redis unreachable (${err.message}). Falling back to in-process store.`,
      );
    }
  }

  async set(sessionId: string, data: SessionData): Promise<void> {
    const key = `${SESSION_KEY_PREFIX}${sessionId}`;
    const value = JSON.stringify(data);

    if (this.client) {
      await this.client.set(key, value, { EX: SESSION_TTL_SECONDS });
    } else {
      // Local-dev fallback
      this.fallbackStore.set(key, {
        data: value,
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
      });
    }
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const key = `${SESSION_KEY_PREFIX}${sessionId}`;

    if (this.client) {
      const raw = await this.client.get(key);
      if (!raw) return null;
      // Refresh TTL on access (sliding expiry)
      await this.client.expire(key, SESSION_TTL_SECONDS);
      return JSON.parse(raw);
    }

    // Local-dev fallback
    const entry = this.fallbackStore.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.fallbackStore.delete(key);
      return null;
    }
    return JSON.parse(entry.data);
  }

  async touch(sessionId: string): Promise<void> {
    const key = `${SESSION_KEY_PREFIX}${sessionId}`;
    if (this.client) {
      const raw = await this.client.get(key);
      if (raw) {
        const data: SessionData = JSON.parse(raw);
        data.lastActiveAt = new Date().toISOString();
        await this.client.set(key, JSON.stringify(data), { EX: SESSION_TTL_SECONDS });
      }
    }
  }

  async delete(sessionId: string): Promise<void> {
    const key = `${SESSION_KEY_PREFIX}${sessionId}`;
    if (this.client) {
      await this.client.del(key);
    } else {
      this.fallbackStore.delete(key);
    }
  }

  async exists(sessionId: string): Promise<boolean> {
    return (await this.get(sessionId)) !== null;
  }

  /** Admin: get all active session IDs (production: scans Redis keys) */
  async listActiveSessions(userId?: string): Promise<string[]> {
    if (!this.client) {
      return Array.from(this.fallbackStore.keys())
        .filter(k => Date.now() < (this.fallbackStore.get(k)?.expiresAt ?? 0))
        .map(k => k.replace(SESSION_KEY_PREFIX, ''));
    }
    const keys: string[] = await this.client.keys(`${SESSION_KEY_PREFIX}*`);
    if (!userId) return keys.map((k: string) => k.replace(SESSION_KEY_PREFIX, ''));

    const results: string[] = [];
    for (const key of keys) {
      const raw = await this.client.get(key);
      if (raw) {
        const data: SessionData = JSON.parse(raw);
        if (data.userId === userId) results.push(data.sessionId);
      }
    }
    return results;
  }
}
