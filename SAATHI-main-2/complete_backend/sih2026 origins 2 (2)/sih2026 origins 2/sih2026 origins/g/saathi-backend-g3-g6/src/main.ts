import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModuleG3G6 } from './app.module';

/**
 * G3–G6 Bootstrap — Phase 1.1 / 1.2
 * Port: 7003 (G-series: 7001–7022 range)
 * Services: G3 (Testimonials), G4 (Password Reset), G5 (Email), G6 (Notifications)
 */
async function bootstrap() {
  const logger = new Logger('G3G6Bootstrap');
  const app = await NestFactory.create(AppModuleG3G6, { logger: ['error', 'warn', 'log'] });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 7003);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: (configService.get<string>('CORS_ORIGINS', 'http://localhost:5173') ?? '').split(','),
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SAATHI G3-G6 Services')
    .setDescription('G3 (Testimonials), G4 (Password Reset), G5 (Transactional Email), G6 (Notification Engine)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const server = await app.listen(port);
  logger.log(`G3-G6 service running on port ${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/docs`);

  // Graceful shutdown (Phase 6.3 pattern)
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received — closing G3-G6 service');
    await app.close();
    server.close(() => { logger.log('G3-G6 HTTP server closed'); process.exit(0); });
  });
}
bootstrap().catch((err) => {
  console.error('[G3G6 Bootstrap] Fatal error:', err);
  process.exit(1);
});
