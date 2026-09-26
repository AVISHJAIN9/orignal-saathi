import { registerAs } from '@nestjs/config';

export interface RetentionConfig {
  retentionDays: number;
  cronSchedule: string;
  cronEnabled: boolean;
  port: number;
  host: string;
  databaseUrl?: string;
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbPassword: string;
  dbDatabase: string;
  dbLogging: boolean;
}

export default registerAs(
  'retention',
  (): RetentionConfig => ({
    retentionDays: parseInt(process.env.RETENTION_DAYS || '90', 10),
    cronSchedule: process.env.CRON_SCHEDULE || '0 0 * * *',
    cronEnabled: process.env.RETENTION_CRON_ENABLED !== 'false',
    port: parseInt(process.env.PORT || '8002', 10),
    host: process.env.HOST || '0.0.0.0',
    databaseUrl: process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '5432', 10),
    dbUsername: process.env.DB_USERNAME || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'postgres',
    dbDatabase: process.env.DB_DATABASE || process.env.DB_NAME || 'bis_db',
    dbLogging: process.env.DB_LOGGING === 'true',
  }),
);
