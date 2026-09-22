import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Conversation } from '../modules/conversation/entities/conversation.entity';
import { Message } from '../modules/conversation/entities/message.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const dbUrl = configService.get<string>('database.url');

  if (dbUrl) {
    return {
      type: 'postgres',
      url: dbUrl,
      entities: [Conversation, Message],
      synchronize: false, // Critical: Disable auto-sync to protect shared Postgres tables
      logging: configService.get<boolean>('database.logging'),
      autoLoadEntities: true,
      ssl: configService.get<string>('nodeEnv') === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    type: 'postgres',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    entities: [Conversation, Message],
    synchronize: false, // Critical: Disable auto-sync to protect shared Postgres tables
    logging: configService.get<boolean>('database.logging'),
    autoLoadEntities: true,
  };
};
