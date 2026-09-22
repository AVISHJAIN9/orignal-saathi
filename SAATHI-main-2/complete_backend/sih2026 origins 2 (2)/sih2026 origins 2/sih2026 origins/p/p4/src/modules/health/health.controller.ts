import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import {
  HealthService,
  OverallHealthReport,
  IngestionPipelineStatus,
} from './health.service';

@Controller('api/v1/ops')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly healthService: HealthService) {}

  /**
   * Overall system health — NestJS uptime, Postgres, Redis.
   *
   * Designed for both the D6 Admin Dashboard and external uptime monitors
   * (e.g. UptimeRobot, Better Stack). Returns HTTP 503 when any core
   * component is unreachable.
   *
   * GET /api/v1/ops/health
   */
  @Get('health')
  async getHealth(): Promise<OverallHealthReport> {
    this.logger.debug('[P4 Ops] Health check requested');
    const report = await this.healthService.getOverallHealth();

    // Intentionally still return 200 for degraded so monitoring dashboards
    // can parse partial JSON. Only flip to 503 when fully unreachable.
    return report;
  }

  /**
   * Vector index freshness and ingestion pipeline status.
   *
   * Queries `document_chunks` for the latest `created_at` timestamp and
   * probes downstream microservices (M3, M5, M9) for liveness.
   *
   * GET /api/v1/ops/ingestion
   */
  @Get('ingestion')
  async getIngestionStatus(): Promise<IngestionPipelineStatus> {
    this.logger.debug('[P4 Ops] Ingestion status requested');
    return this.healthService.getIngestionStatus();
  }

  /**
   * Process uptime and memory snapshot — lightweight, no DB call.
   * Useful for container liveness probes that need minimal cost.
   *
   * GET /api/v1/ops/uptime
   */
  @Get('uptime')
  @HttpCode(HttpStatus.OK)
  getUptime() {
    return {
      ...this.healthService.checkSystemUptime(),
      service: 'SAATHI-BIS-Module-P4-HealthOps',
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Kubernetes / load-balancer readiness probe.
   * Returns 200 only when Postgres is reachable (Redis degraded is tolerated).
   *
   * GET /api/v1/ops/ready
   */
  @Get('ready')
  async readinessProbe() {
    const pg = await this.healthService.checkPostgres();
    const statusCode = pg.status === 'healthy' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    return {
      ready: pg.status === 'healthy',
      postgres: pg,
      checkedAt: new Date().toISOString(),
    };
  }
}
