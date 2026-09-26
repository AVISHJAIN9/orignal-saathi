import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { ViewsModule } from './modules/views/views.module';
import { FeatureScopeMiddleware } from './common/middleware/feature-scope.middleware';
import { RolesGuard } from './common/guards/roles.guard';
import { FeatureAccessGuard } from './common/guards/feature-access.guard';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User],
        synchronize: false, // migrations only - see src/database/migrations
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    RbacModule,
    ViewsModule,
  ],
  providers: [
    // Applied globally so every feature module mounted under this app
    // automatically gets role + feature scoping without repeating
    // @UseGuards(...) per controller. An auth guard (P1's real one, or
    // DemoJwtAuthGuard here) must still run first to populate req.user -
    // register it globally in main.ts, or per-module as RbacController
    // and ViewsController demonstrate.
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: FeatureAccessGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FeatureScopeMiddleware).forRoutes('*');
  }
}
