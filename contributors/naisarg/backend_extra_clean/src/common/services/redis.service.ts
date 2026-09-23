import Redis, { RedisOptions } from 'ioredis';

export const getRedisConnectionOptions = (): RedisOptions => ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

export const createRedisClient = (): Redis => {
  return new Redis(getRedisConnectionOptions());
};
