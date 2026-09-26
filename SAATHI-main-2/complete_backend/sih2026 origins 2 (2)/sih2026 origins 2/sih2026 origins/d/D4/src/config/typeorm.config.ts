import {
  registerAs
} from '@nestjs/config';
import {
  TypeOrmModuleOptions
} from '@nestjs/typeorm';
import {
  Conversation
} from '../conversations/entities/conversation.entity';
import {
  Message
} from '../conversations/entities/message.entity';

// TypeORM Configuration Factory (typeorm)
// Registered using registerAs to lazily resolve configuration values inside NestJS.
// Guarantees process.env.DATABASE_URL is read after ConfigModule loads env variables.
export default registerAs(
  'typeorm',
  (
  ): TypeOrmModuleOptions => {

    let sslOptionsRecord: boolean | {
      rejectUnauthorized: boolean;
    } = false;

    if (
      process.env.PGSSL === 'true'
    ) {
      sslOptionsRecord = {
        rejectUnauthorized: false
      };
    } else {
      sslOptionsRecord = false;
    }

    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: sslOptionsRecord,
      entities: [
        Conversation,
        Message
      ],
      synchronize: false,
      autoLoadEntities: true
    };

  }
);