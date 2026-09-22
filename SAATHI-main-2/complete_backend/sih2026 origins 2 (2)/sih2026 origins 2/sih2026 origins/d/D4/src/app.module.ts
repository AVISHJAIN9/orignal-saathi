import {
  Module
} from '@nestjs/common';
import {
  APP_GUARD
} from '@nestjs/core';
import {
  ConfigModule,
  ConfigService
} from '@nestjs/config';
import {
  TypeOrmModule,
  TypeOrmModuleOptions
} from '@nestjs/typeorm';
import {
  ThrottlerGuard,
  ThrottlerModule
} from '@nestjs/throttler';
import typeormConfig from './config/typeorm.config';
import {
  ConversationsModule
} from './conversations/conversations.module';
import {
  HealthController
} from './common/health/health.controller';

// Root application module coordinating configuration, database connection, throttler, and conversations
@Module(
  {
    imports: [
      ConfigModule.forRoot(
        {
          isGlobal: true,
          load: [
            typeormConfig
          ]
        }
      ),
      TypeOrmModule.forRootAsync(
        {
          inject: [
            ConfigService
          ],
          useFactory: (
            configServiceInstance: ConfigService
          ): TypeOrmModuleOptions => {

            const resolvedDatabaseOptions = configServiceInstance.get<
              TypeOrmModuleOptions
            >(
              'typeorm'
            );

            if (
              !resolvedDatabaseOptions
            ) {
              throw new Error(
                'TypeORM configuration not found'
              );
            }

            return resolvedDatabaseOptions;

          }
        }
      ),
      ThrottlerModule.forRoot(
        [
          {
            ttl: 60000,
            limit: 100
          }
        ]
      ),
      ConversationsModule
    ],
    controllers: [
      HealthController
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
      }
    ]
  }
)
export class AppModule {

}
