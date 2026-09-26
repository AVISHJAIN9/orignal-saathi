import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('SAATHI-BIS-P2');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('retention.port', 8002);
  const host = configService.get<string>('retention.host', '0.0.0.0');
  const retentionDays = configService.get<number>('retention.retentionDays', 90);
  const cronSchedule = configService.get<string>('retention.cronSchedule', '0 0 * * *');
  const cronEnabled = configService.get<boolean>('retention.cronEnabled', true);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS === '*' ? '*' : (process.env.CORS_ORIGINS || '*').split(','),
    methods: ['GET', 'POST'],
    credentials: false,
  });

  // Global input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port, host);

  logger.log(`=============================================================`);
  logger.log(`🗄️  Module P2 (Data Retention & Privacy Controls) is running`);
  logger.log(`📍 URL: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  logger.log(`📅 Retention Policy: ${retentionDays} days rolling window`);
  logger.log(`⏰ Cron Schedule: "${cronSchedule}" | Active: ${cronEnabled}`);
  logger.log(`🔁 Trigger: POST /api/v1/retention/trigger`);
  logger.log(`📊 Status:  GET  /api/v1/retention/status`);
  logger.log(`=============================================================`);
}

bootstrap().catch((err) => {
  console.error('Fatal error starting Module P2:', err);
  process.exit(1);
});
