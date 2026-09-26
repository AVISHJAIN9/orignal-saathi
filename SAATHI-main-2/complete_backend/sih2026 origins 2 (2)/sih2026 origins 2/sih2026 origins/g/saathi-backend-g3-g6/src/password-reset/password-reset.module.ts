import {
  Module
} from '@nestjs/common';
import {
  TypeOrmModule
} from '@nestjs/typeorm';
import {
  ConfigModule
} from '@nestjs/config';
import {
  PasswordResetToken
} from './password-reset-token.entity';
import {
  PasswordResetService
} from './password-reset.service';
import {
  PasswordResetController
} from './password-reset.controller';
import {
  EmailModule
} from '../email/email.module';
import {
  USERS_PORT
} from '../common/ports/users.port';
import {
  InMemoryUsersPort
} from './in-memory-users.port';

@Module(
  {
    imports: [
      ConfigModule,
      TypeOrmModule.forFeature(
        [
          PasswordResetToken
        ]
      ),
      EmailModule
    ],
    controllers: [
      PasswordResetController
    ],
    providers: [
      PasswordResetService,
      {
        provide: USERS_PORT,
        useClass: InMemoryUsersPort
      }
    ],
    exports: [
      PasswordResetService
    ]
  }
)
export class PasswordResetModule {

}
