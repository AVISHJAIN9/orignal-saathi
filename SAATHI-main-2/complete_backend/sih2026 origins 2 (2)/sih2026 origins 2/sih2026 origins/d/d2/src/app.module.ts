import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('CacheModule');
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        const redisPassword = configService.get<string>('REDIS_PASSWORD') || undefined;
        const ttlSeconds = configService.get<number>('CACHE_TTL_SECONDS', 3600);
        const ttlMs = ttlSeconds * 1000;

        try {
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: Number(redisPort),
              connectTimeout: 5000,
              reconnectStrategy: (retries) => {
                if (retries > 5) {
                  logger.warn(`Redis connection retry limit reached (${retries}).`);
                  return new Error('Redis retry limit reached');
                }
                return Math.min(retries * 500, 3000);
              },
            },
            password: redisPassword,
            ttl: ttlMs,
          });

          logger.log(`Initialized Redis cache store at ${redisHost}:${redisPort} (TTL: ${ttlSeconds}s)`);
          return {
            store: () => store,
            ttl: ttlMs,
          };
        } catch (err: any) {
          logger.warn(
            `Could not connect to Redis at ${redisHost}:${redisPort}: ${err.message}. Falling back to default in-memory cache store.`,
          );
          return {
            ttl: ttlMs,
          };
        }
      },
    }),
    SearchModule,
  ],
})
export class AppModule {}
