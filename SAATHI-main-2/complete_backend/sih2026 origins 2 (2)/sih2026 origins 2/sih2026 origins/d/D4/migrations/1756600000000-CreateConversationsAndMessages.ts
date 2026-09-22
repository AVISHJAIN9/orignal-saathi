import {
  MigrationInterface,
  QueryRunner
} from 'typeorm';

// Reference definition of the conversations and messages tables D4 reads from.
// Schema is cross-cutting infrastructure.
export class CreateConversationsAndMessages1756600000000 implements MigrationInterface {

  name = 'CreateConversationsAndMessages1756600000000';

  public async up(
    queryRunner: QueryRunner
  ): Promise<void> {

    // gen_random_uuid() lives in pgcrypto on Postgres < 13
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
    );

    await queryRunner.query(
      `
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(128) NOT NULL,
        title VARCHAR(512),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `
    );

    // Composite index for list endpoint sorting: (user_id, updated_at DESC)
    await queryRunner.query(
      `
      CREATE INDEX IF NOT EXISTS idx_conversations_user_updated
      ON conversations (user_id, updated_at DESC);
    `
    );

    await queryRunner.query(
      `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(16) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        citations JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `
    );

    // Supports the resume endpoint's ORDER BY created_at ASC
    await queryRunner.query(
      `
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
      ON messages (conversation_id, created_at ASC);
    `
    );

  }

  public async down(
    queryRunner: QueryRunner
  ): Promise<void> {

    await queryRunner.query(
      `DROP TABLE IF EXISTS messages;`
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS conversations;`
    );

  }

}
