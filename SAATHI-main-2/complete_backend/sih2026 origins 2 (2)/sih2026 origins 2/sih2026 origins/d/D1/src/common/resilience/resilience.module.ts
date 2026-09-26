import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeatureFlagsService } from './feature-flags.service';
import { IdempotencyInterceptor } from './idempotency.interceptor';
import { CircuitBreakerService } from './circuit-breaker.service';
import { DistributedLockService } from './distributed-lock.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    FeatureFlagsService,
    IdempotencyInterceptor,
    CircuitBreakerService,
    DistributedLockService,
  ],
  exports: [
    FeatureFlagsService,
    IdempotencyInterceptor,
    CircuitBreakerService,
    DistributedLockService,
  ],
})
export class ResilienceModule {}
