import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

/**
 * Standalone bootstrap for developing/demoing D10 in isolation.
 * When linking into the main SAATHI NestJS monolith, what actually
 * needs to move is this module's imports (UsersModule, RbacModule,
 * ViewsModule) plus the global guards/middleware registered in
 * AppModule - this main.ts itself is disposable scaffolding.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Security headers — must come before any middleware
    app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('SAATHI - D10 Role-Based Views')
    .setDescription(
      'RBAC + per-role feature access scoping backend for SIH26107 SAATHI.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`D10 RBAC service listening on :${port} (docs at /docs)`);
}
bootstrap();
