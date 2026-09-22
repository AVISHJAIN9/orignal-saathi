import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentChunk } from './modules/citation/entities/chunk.entity';
import { CitationModule } from './modules/citation/citation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbHost = configService.get<string>('DB_HOST', 'localhost');
        const dbPort = configService.get<number>('DB_PORT', 5432);
        const dbUsername = configService.get<string>('DB_USERNAME', 'postgres');
        const dbPassword = configService.get<string>('DB_PASSWORD', 'postgres');
        const dbDatabase = configService.get<string>('DB_DATABASE', 'bis_db');
        const synchronize = configService.get<string>('DB_SYNCHRONIZE') === 'true';
        const logging = configService.get<string>('DB_LOGGING') === 'true';
        const sslEnabled = configService.get<string>('DB_SSL') === 'true';

        logger.log(
          `Configuring PostgreSQL connection (${databaseUrl ? 'via DATABASE_URL' : `${dbHost}:${dbPort}/${dbDatabase}`})`,
        );

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [DocumentChunk],
            synchronize,
            logging,
            ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres',
          host: dbHost,
          port: Number(dbPort),
          username: dbUsername,
          password: dbPassword,
          database: dbDatabase,
          entities: [DocumentChunk],
          synchronize,
          logging,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    CitationModule,
  ],
})
export class AppModule {}
