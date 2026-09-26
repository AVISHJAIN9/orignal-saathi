import 'reflect-metadata';
import {
  Logger,
  ValidationPipe
} from '@nestjs/common';
import {
  NestFactory
} from '@nestjs/core';
import {
  AppModule
} from './app.module';
import {
import helmet from 'helmet';
  AllExceptionsFilter
} from './common/filters/all-exceptions.filter';

async function bootstrap(
): Promise<void> {

  const bootstrapLoggerInstance = new Logger(
    'Bootstrap'
  );

  const applicationInstance = await NestFactory.create(
    AppModule,
    {
      cors: true
    }
  );

    // Security headers — must come before any middleware

    applicationInstance.use(helmet());

  applicationInstance.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      }
    )
  );

  applicationInstance.useGlobalFilters(
    new AllExceptionsFilter(
    )
  );

  let targetListeningPortNumber = 5004;
  if (
    process.env.PORT
  ) {
    targetListeningPortNumber = parseInt(
      process.env.PORT,
      10
    );
  } else {
    targetListeningPortNumber = 5004;
  }

  await applicationInstance.listen(
    targetListeningPortNumber
  );

  bootstrapLoggerInstance.log(
    `SAATHI D4 (Conversation History) listening on port ${targetListeningPortNumber}`
  );

}

bootstrap(
);
