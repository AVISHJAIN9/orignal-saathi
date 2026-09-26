-- G3 (Testimonials), G4 (Password Reset), G5 (Transactional Email), G6 (Notifications)
-- Reference migration mirroring the TypeORM entities in src/. If the project uses
-- TypeORM migrations, generate the real one with:
--   npm run typeorm migration:generate -- -n AddG3ToG6Tables
-- This file exists so the DB owner (M2's schema notes mention Person 4/6 on
-- vector storage) can review the shape without spinning up the Nest app.

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- G3: Testimonials -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(120) NOT NULL,
  organization VARCHAR(160),
  quote        TEXT NOT NULL,
  approved     BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials (approved);

-- G4: Password reset tokens ---------------------------------------------------
-- FK to the real users/credentials table (owned by P1) is intentionally
-- omitted here since that table doesn't exist in this migration's scope —
-- add `REFERENCES users(id)` once merged into the real schema.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens (user_id);

-- G5: Email delivery log ------------------------------------------------------
CREATE TYPE email_status AS ENUM ('queued', 'sent', 'failed');
CREATE TYPE email_template_name AS ENUM (
  'password_reset',
  'escalation_ticket_confirmation',
  'admin_ingestion_failure'
);

CREATE TABLE IF NOT EXISTS email_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "to"                VARCHAR(320) NOT NULL,
  template            email_template_name NOT NULL,
  payload             JSONB NOT NULL,
  status              email_status NOT NULL DEFAULT 'queued',
  provider_message_id VARCHAR(255),
  error               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at             TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_email_logs_to ON email_logs ("to");
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs (status);

-- G6: Notifications ------------------------------------------------------------
CREATE TYPE notification_type AS ENUM (
  'escalation_ticket_update',
  'session_activity',
  'system'
);

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  type       notification_type NOT NULL,
  message    TEXT NOT NULL,
  metadata   JSONB,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications (user_id, created_at);
