import Redis, { RedisOptions } from 'ioredis';
import { Logger } from '@nestjs/common';

const logger = new Logger('RedisService');

export const getRedisConnectionOptions = (): RedisOptions => {
  const redisUrl = process.env.REDIS_URL;
  let host = process.env.REDIS_HOST || '127.0.0.1';
  let port = parseInt(process.env.REDIS_PORT || '6379', 10);
  let password = process.env.REDIS_PASSWORD || undefined;
  let username = process.env.REDIS_USERNAME || undefined;
  let isTls = process.env.REDIS_TLS === 'true' || (process.env.REDIS_HOST && process.env.REDIS_HOST.includes('upstash.io'));

  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl);
      host = parsed.hostname || host;
      port = parsed.port ? parseInt(parsed.port, 10) : port;
      username = parsed.username || username;
      password = parsed.password || password;
      if (parsed.protocol === 'rediss:' || parsed.hostname.includes('upstash.io')) {
        isTls = true;
      }
    } catch {
      // ignore parsing error if string is malformed
    }
  }

  const options: RedisOptions = {
    host,
    port,
    username,
    password,
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
    autoResubscribe: true,
    autoResendUnfulfilledCommands: true,
    lazyConnect: false,
    retryStrategy(times: number) {
      const delay = Math.min(times * 200, 3000);
      return delay;
    },
    reconnectOnError(err: Error) {
      const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'];
      if (targetErrors.some((target) => err.message.includes(target))) {
        return true; // Reconnect automatically
      }
      return false;
    }
  };

  if (isTls) {
    options.tls = {
      rejectUnauthorized: false
    };
  }

  return options;
};

export const createRedisClient = (): Redis => {
  const options = getRedisConnectionOptions();
  const client = new Redis(options);

  client.on('error', (err: any) => {
    console.error('Redis error:', err?.message || err);
    logger.warn(`[Redis Notification] ${err?.message || err}`);
  });

  client.on('connect', () => {
    logger.log('Redis client connected successfully.');
  });

  client.on('ready', () => {
    logger.log('Redis client ready.');
  });

  client.on('reconnecting', (delay: any) => {
    logger.debug(`Redis client reconnecting (delay: ${delay})...`);
  });

  return client;
};


