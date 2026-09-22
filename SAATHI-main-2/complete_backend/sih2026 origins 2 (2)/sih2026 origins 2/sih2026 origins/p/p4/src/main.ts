import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('SAATHI-BIS-P4');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8004);
  const host = configService.get<string>('HOST', '0.0.0.0');
  const origins = configService.get<string>('CORS_ORIGINS', '*');

  app.enableCors({
    origin: origins === '*' ? '*' : origins.split(',').map((o) => o.trim()),
    methods: ['GET', 'OPTIONS'],
    credentials: false,
  });

  await app.listen(port, host);

  logger.log(`================================================================`);
  logger.log(`🩺 Module P4 (System Health & Ops API) is running`);
  logger.log(`📍 URL: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  logger.log(`🔍 Health Check:     GET /api/v1/ops/health`);
  logger.log(`📦 Vector Freshness: GET /api/v1/ops/ingestion`);
  logger.log(`⏱️  Uptime & Memory:  GET /api/v1/ops/uptime`);
  logger.log(`🚦 Readiness Probe:  GET /api/v1/ops/ready`);
  logger.log(`================================================================`);
}

bootstrap().catch((err) => {
  console.error('Fatal error starting Module P4:', err);
  process.exit(1);
});
