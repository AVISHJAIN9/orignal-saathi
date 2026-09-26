import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('SAATHI-BIS-P1');
  const app = await NestFactory.create(AppModule);

    // Security headers — must come before any middleware

    app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8001);
  const host = configService.get<string>('HOST', '0.0.0.0');
  const corsOrigins = configService.get<string>('CORS_ORIGINS', '*');

  // Enable CORS for frontend & other microservices
  app.enableCors({
    origin: corsOrigins === '*' ? '*' : corsOrigins.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global Input Validation & Transformation
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

  logger.log(`=======================================================`);
  logger.log(`🚀 Module P1 (Auth & Rate Limiting) is running`);
  logger.log(`📍 URL: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  logger.log(`🛡️  Rate Limiting: Global Redis-backed Throttler active`);
  logger.log(`🔐 Auth Endpoints: /api/v1/auth/login | /api/v1/auth/anonymous`);
  logger.log(`=======================================================`);
}

bootstrap().catch((err) => {
  console.error('Fatal error starting Module P1:', err);
  process.exit(1);
});
