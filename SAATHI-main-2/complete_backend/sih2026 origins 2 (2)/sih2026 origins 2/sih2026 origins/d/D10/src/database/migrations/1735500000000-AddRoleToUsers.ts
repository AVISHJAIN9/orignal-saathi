import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds D10's role column to the existing `users` table owned by P1.
 * Written as an additive ALTER rather than a CREATE TABLE, since P1's
 * migration is expected to create `users` first - run this one after it.
 */
export class AddRoleToUsers1735500000000 implements MigrationInterface {
  name = 'AddRoleToUsers1735500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "users_role_enum" AS ENUM ('public', 'industry', 'admin');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "role" "users_role_enum" NOT NULL DEFAULT 'public';
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_role";`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum";`);
  }
}
