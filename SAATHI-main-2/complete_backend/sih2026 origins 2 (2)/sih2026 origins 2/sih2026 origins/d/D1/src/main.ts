import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

    // Security headers — must come before any middleware

    app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5001);

  // Global Prefix -> /api/v1
  app.setGlobalPrefix('api/v1');

  // CORS — never allow wildcard in production
  const corsOriginsEnv = configService.get<string>('CORS_ORIGINS', '');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const allowedOrigins: string[] = corsOriginsEnv
    ? corsOriginsEnv.split(',').map((o) => o.trim())
    : [];
  if (!isProduction) {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
  }
  if (isProduction && allowedOrigins.length === 0) {
    logger.error('CORS_ORIGINS env var is required in production but not set. Refusing to start with wildcard CORS.');
    process.exit(1);
  }
  app.enableCors({
    origin: isProduction ? allowedOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Accept, Authorization, Last-Event-ID, x-user-id, accept-language',
    credentials: true,
  });

  // Global Validation Pipe: whitelist strips unknown fields, transform converts types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger OpenAPI Specs
  const config = new DocumentBuilder()
    .setTitle('SAATHI Backend API Contract')
    .setDescription(
      'Production API documentation covering RAG Chat, Sarvam Indic Translation, Admin Panel, and Webhooks for Bureau of Indian Standards (BIS)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('D1 - Conversational Engine', 'RAG Chat and SSE streaming endpoints')
    .addTag('D5 - Admin Panel', 'Document uploading and pipeline control')
    .addTag('D8 - Hindi & Indic Language Hand-off', 'Multi-lingual processing pipeline')
    .addTag('X6 - WhatsApp Integration', 'Meta Cloud API webhook handlers')
    .addTag('Health', 'System health checks and readiness probes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Graceful shutdown hooks (NestJS built-in)
  app.enableShutdownHooks();

  const server = await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`Backend Application running on: http://localhost:${port}/api/v1`);
  logger.log(`Swagger OpenAPI Contract live at: http://localhost:${port}/api/docs`);
  logger.log(`=======================================================`);

  // Phase 6.3 — explicit SIGTERM / SIGINT handler for clean k8s rolling deploy
  // k8s sends SIGTERM before killing the pod. We stop accepting new connections,
  // allow in-flight SSE streams up to 30 s to complete, then close the DB pool.
  const GRACEFUL_SHUTDOWN_MS = 30_000;
  const shutdown = async (signal: string) => {
    logger.warn(`[Shutdown] Received ${signal}. Stopping new connections…`);
    server.close(() => logger.log('[Shutdown] HTTP server closed'));
    setTimeout(async () => {
      logger.warn('[Shutdown] Grace period elapsed — forcing close');
      await app.close();
      process.exit(0);
    }, GRACEFUL_SHUTDOWN_MS);
    // Allow NestJS lifecycle hooks (TypeORM connection close, Redis disconnect) to run
    await app.close();
    logger.log('[Shutdown] Clean exit');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap();
