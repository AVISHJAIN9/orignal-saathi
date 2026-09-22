import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('SAATHI-BIS-P3');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port    = configService.get<number>('PORT', 8003);
  const host    = configService.get<string>('HOST', '0.0.0.0');
  const origins = configService.get<string>('CORS_ORIGINS', '*');

  app.enableCors({
    origin: origins === '*' ? '*' : origins.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST'],
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port, host);

  logger.log(`================================================================`);
  logger.log(`📊 Module P3 (LLM Cost & Usage Monitoring) is running`);
  logger.log(`📍 URL: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  logger.log(`📥 Ingest:  POST /api/v1/telemetry/llm-usage`);
  logger.log(`📈 Stats:   GET  /api/v1/telemetry/stats`);
  logger.log(`💲 Pricing: GET  /api/v1/telemetry/pricing`);
  logger.log(`================================================================`);
}

bootstrap().catch((err) => {
  console.error('Fatal error starting Module P3:', err);
  process.exit(1);
});
