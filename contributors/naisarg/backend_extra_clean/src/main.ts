import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    }
  });

  // Early middleware to intercept GET /favicon.ico immediately with 204 No Content
  app.use((req: any, res: any, next: any) => {
    if (req.url === '/favicon.ico' || req.originalUrl === '/favicon.ico' || req.path === '/favicon.ico') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  );

  // OpenAPI / Swagger Documentation per T3-06 specification
  const config = new DocumentBuilder()
    .setTitle('SAATHI BIS Standards Assistant — Backend Extra')
    .setDescription('Production API services for 34 features (Tiers 1, 2, 3) under SIH26107.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter standard JWT Bearer token',
        in: 'header'
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port);
  logger.log(`SAATHI Backend Extra running on http://localhost:${port}`);
  logger.log(`Swagger OpenAPI Documentation available at http://localhost:${port}/api/docs`);
}

if (require.main === module) {
  bootstrap();
}

export { bootstrap };
