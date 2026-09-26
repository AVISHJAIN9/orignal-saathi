import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

    // Security headers — must come before any middleware

    app.use(helmet());

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('SAATHI M1 — Document Ingestion Pipeline')
    .setDescription('Ingestion and text extraction pipeline for Bureau of Indian Standards (BIS)')
    .setVersion('1.0')
    .addTag('M1 - Document Ingestion')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5011;
  await app.listen(port);
  logger.log(`M1 Ingestion Service running on http://localhost:${port}/api/v1`);
}

bootstrap();
