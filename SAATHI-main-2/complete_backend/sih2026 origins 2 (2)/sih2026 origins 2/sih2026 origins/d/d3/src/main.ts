import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

    // Security headers — must come before any middleware

    app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // Global API Prefix -> /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
    }),
  );

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`SAATHI D3 Citation & Source Viewer service running on http://localhost:${port}/api/v1`);
  logger.log(`Chunk endpoint: http://localhost:${port}/api/v1/citations/chunk/:chunkId`);
  logger.log(`Document endpoint: http://localhost:${port}/api/v1/citations/document/:documentId`);
}

bootstrap();
