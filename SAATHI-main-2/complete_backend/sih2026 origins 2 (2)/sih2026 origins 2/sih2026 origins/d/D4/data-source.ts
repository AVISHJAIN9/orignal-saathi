import 'dotenv/config';
import {
  DataSource
} from 'typeorm';
import {
  Conversation
} from './src/conversations/entities/conversation.entity';
import {
  Message
} from './src/conversations/entities/message.entity';

// Used only by the typeorm-ts-node-commonjs CLI (migration:run / migration:generate / migration:revert scripts in package.json).
// NestJS's own connection is configured separately in src/config/typeorm.config.ts.
// Standalone CLI script has no Nest module graph to race against.

let sslConfigurationOption: boolean | {
  rejectUnauthorized: boolean;
} = false;

if (
  process.env.PGSSL === 'true'
) {
  sslConfigurationOption = {
    rejectUnauthorized: false
  };
} else {
  sslConfigurationOption = false;
}

export default new DataSource(
  {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: sslConfigurationOption,
    entities: [
      Conversation,
      Message
    ],
    migrations: [
      'migrations/*.ts'
    ],
    synchronize: false
  }
);
