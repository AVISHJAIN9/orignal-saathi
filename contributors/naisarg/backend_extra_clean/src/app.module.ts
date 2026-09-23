import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { StructuredLoggingInterceptor } from './common/interceptors/structured-logging.interceptor';
import { Tier1Module } from './modules/tier1/tier1.module';
import { Tier2Module } from './modules/tier2/tier2.module';
import { Tier3Module } from './modules/tier3/tier3.module';

@Module({
  imports: [
    DatabaseModule,
    Tier1Module,
    Tier2Module,
    Tier3Module
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StructuredLoggingInterceptor
    }
  ]
})
export class AppModule {}
