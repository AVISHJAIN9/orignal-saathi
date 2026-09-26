import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';

/**
 * Standalone TypeORM CLI data source for D10's migration. In the real
 * monolith this should be merged into the shared data source the rest
 * of the team already runs migrations against - duplicating connection
 * config per feature module doesn't scale past the hackathon.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
