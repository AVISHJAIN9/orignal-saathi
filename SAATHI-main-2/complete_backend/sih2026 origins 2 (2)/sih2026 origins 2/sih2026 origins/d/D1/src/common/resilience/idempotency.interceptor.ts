import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface StoredIdempotentResponse {
  statusCode: number;
  data: any;
  timestamp: number;
}

/**
 * IdempotencyInterceptor (Phase 6.2)
 * Ensures mutating operations (POST, PUT, PATCH, DELETE) with an Idempotency-Key
 * header execute at most once. Duplicate requests return the cached response with
 * an X-Cache-Lookup: HIT header or prevent double-charging/double-creation.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);
  private static readonly cache = new Map<string, StoredIdempotentResponse>();
  private static readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const idempotencyKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];

    // Only apply to mutating methods with an idempotency key header
    if (!idempotencyKey || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next.handle();
    }

    const key = `${req.method}:${req.url}:${idempotencyKey}`;
    const cached = IdempotencyInterceptor.cache.get(key);

    if (cached) {
      if (Date.now() - cached.timestamp < IdempotencyInterceptor.TTL_MS) {
        this.logger.log(`Idempotent cache hit for key ${idempotencyKey}`);
        res.setHeader('X-Idempotent-Replay', 'true');
        res.status(cached.statusCode);
        return of(cached.data);
      } else {
        IdempotencyInterceptor.cache.delete(key);
      }
    }

    return next.handle().pipe(
      tap((data) => {
        const statusCode = res.statusCode || 200;
        IdempotencyInterceptor.cache.set(key, {
          statusCode,
          data,
          timestamp: Date.now(),
        });
      }),
    );
  }
}
