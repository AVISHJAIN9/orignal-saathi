import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface StructuredLogEntry {
  timestamp: string;
  featureId: string;
  method: string;
  url: string;
  statusCode: number;
  durationMs: number;
  outcome: 'SUCCESS' | 'ERROR';
  errorMessage?: string;
  clientIp?: string;
}

@Injectable()
export class StructuredLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestLogger');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const startTime = Date.now();

    // Map URL path or route handler to featureId
    const featureId = this.extractFeatureId(req.url, req.method);

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startTime;
        const statusCode = res.statusCode || 200;
        const logEntry: StructuredLogEntry = {
          timestamp: new Date().toISOString(),
          featureId,
          method: req.method,
          url: req.originalUrl || req.url,
          statusCode,
          durationMs,
          outcome: 'SUCCESS',
          clientIp: req.ip || req.connection?.remoteAddress
        };
        // Print structured JSON
        console.log(JSON.stringify(logEntry));
      }),
      catchError((err) => {
        const durationMs = Date.now() - startTime;
        const statusCode = err.status || 500;
        const logEntry: StructuredLogEntry = {
          timestamp: new Date().toISOString(),
          featureId,
          method: req.method,
          url: req.originalUrl || req.url,
          statusCode,
          durationMs,
          outcome: 'ERROR',
          errorMessage: err.message,
          clientIp: req.ip || req.connection?.remoteAddress
        };
        console.log(JSON.stringify(logEntry));
        throw err;
      })
    );
  }

  private extractFeatureId(url: string, method: string): string {
    const cleanUrl = (url || '').split('?')[0];

    // Tier 1
    if (cleanUrl.includes('/standards/diff')) return 'T1-02';
    if (cleanUrl.includes('/certificates/validate') || cleanUrl.includes('/jobs/')) return 'T1-03';
    if (cleanUrl.includes('/datasheets/scan')) return 'T1-04';
    if (cleanUrl.includes('/authenticity/verify')) return 'T1-05';
    if (cleanUrl.includes('/tenders/match')) return 'T1-09';
    if (cleanUrl.includes('/sandbox/simulate')) return 'T1-10';
    if (cleanUrl.includes('/certification/paths')) return 'T1-15';
    if (cleanUrl.includes('/genealogy')) return 'T1-16';
    if (cleanUrl.includes('/letters/appeal')) return 'T1-17';
    if (cleanUrl.includes('/explain')) return 'T1-18';
    if (cleanUrl.includes('/renewal-status') || cleanUrl.includes('/renewal-draft')) return 'T1-13/20';
    if (cleanUrl.includes('/monitoring/stream')) return 'T1-20';
    if (cleanUrl.includes('/labels/check')) return 'T1-21';
    if (cleanUrl.includes('/consignments/bulk-check')) return 'T1-22';
    if (cleanUrl.includes('/gazette/parse')) return 'T1-23';
    if (cleanUrl.includes('/alerts/feed')) return 'T1-24';
    if (cleanUrl.includes('/calendar/')) return 'T1-25';
    if (cleanUrl.includes('/qa/strict')) return 'T1-26';
    if (cleanUrl.includes('/whatsapp/webhook')) return 'T1-27';
    if (cleanUrl.includes('/widget/verify')) return 'T1-28';
    if (cleanUrl.includes('/self-audit/')) return 'T1-29';

    // Tier 2
    if (cleanUrl.includes('/forecast/qco')) return 'T2-01';
    if (cleanUrl.includes('/state-overlay')) return 'T2-07';
    if (cleanUrl.includes('/complaints/insights')) return 'T2-12';
    if (cleanUrl.includes('/wait-estimate')) return 'T2-14';
    if (cleanUrl.includes('/conflicts')) return 'T2-19';
    if (cleanUrl.includes('/counterfeit/hotspots')) return 'T2-30';
    if (cleanUrl.includes('/benchmark/')) return 'T2-31';
    if (cleanUrl.includes('/risk/sector-heatmap')) return 'T2-32';

    // Tier 3
    if (cleanUrl.includes('/dev/api-keys') || cleanUrl.includes('/dev/webhooks')) return 'T3-06';
    if (cleanUrl.includes('/supply-chain/trace')) return 'T3-08';
    if (cleanUrl.includes('/provenance')) return 'T3-11';
    if (cleanUrl.includes('/escalations')) return 'T3-33';
    if (cleanUrl.includes('/grievances')) return 'T3-34';

    return 'GENERAL';
  }
}
