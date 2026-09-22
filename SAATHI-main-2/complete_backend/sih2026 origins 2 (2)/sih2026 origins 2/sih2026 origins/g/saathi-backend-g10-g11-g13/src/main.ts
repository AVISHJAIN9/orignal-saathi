import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModuleG10G13 } from './app.module';

/**
 * G10–G13 Bootstrap — Phase 1.1 / 1.2
 * Port: 7010 (G-series: 7001–7022 range)
 * Services: G10 (Captcha/Bot Protection), G11 (2FA), G13 (Sitemap)
 */
async function bootstrap() {
  const logger = new Logger('G10G13Bootstrap');
  const app = await NestFactory.create(AppModuleG10G13, { logger: ['error', 'warn', 'log'] });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 7010);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: (configService.get<string>('CORS_ORIGINS', 'http://localhost:5173') ?? '').split(','),
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SAATHI G10-G13 Services')
    .setDescription('G10 (Captcha/Bot Protection), G11 (Two-Factor Auth), G13 (Sitemap Generator)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const server = await app.listen(port);
  logger.log(`G10-G13 service running on port ${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/docs`);

  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received — closing G10-G13 service');
    await app.close();
    server.close(() => { logger.log('G10-G13 HTTP server closed'); process.exit(0); });
  });
}
bootstrap().catch((err) => {
  console.error('[G10G13 Bootstrap] Fatal error:', err);
  process.exit(1);
});
