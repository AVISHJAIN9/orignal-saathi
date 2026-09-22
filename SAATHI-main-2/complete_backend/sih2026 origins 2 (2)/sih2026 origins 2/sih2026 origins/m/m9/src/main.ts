import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('M9-Bootstrap');
  const app = await NestFactory.create(AppModule);
    // Security headers — must come before any middleware
    app.use(helmet());
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 3000;
  const apiPrefix = configService.get<string>('apiPrefix') || 'api/v1';
  const corsOrigins = configService.get<string[]>('corsOrigins') || ['*'];

  // Global Prefix (e.g. /api/v1)
  app.setGlobalPrefix(apiPrefix);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // CORS Setup
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SAATHI BIS Assistant - Module M9: Session Management & SSE Gateway')
    .setDescription(
      'Gateway & Chat Session Management service for SAATHI BIS Assistant platform. ' +
        'Manages multi-turn conversation sessions and proxies real-time Server-Sent Events (SSE) from Python M5.',
    )
    .setVersion('1.0.0')
    .addTag('Conversations', 'Chat session management and real-time SSE streaming')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  logger.log(`SAATHI M9 Gateway is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger OpenAPI Documentation: http://localhost:${port}/docs`);
}

bootstrap();
