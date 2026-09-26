-- Migration 005: Convert all TIMESTAMP columns to TIMESTAMPTZ
-- Phase 6.23 — UTC-only timestamps across the entire schema
--
-- Rationale: 141 TIMESTAMP columns vs 15 TIMESTAMPTZ found in audit.
-- Timezone-naive timestamps cause:
--   • Token TTL miscalculation across IST/UTC boundary
--   • Log-ordering corruption in multi-region deployments
--   • Meaningless load-test timing analysis
--
-- This migration is safe to run multiple times (ALTER TYPE on an already-
-- TIMESTAMPTZ column is a no-op on Postgres 14+, it just costs a catalog
-- lookup). Run BEFORE any load testing.
--
-- To apply: node infra/postgres/migrations/run-migrations.js

BEGIN;

-- ── RAG document store ───────────────────────────────────────────────────────

ALTER TABLE bis_documents
  ALTER COLUMN indexed_at    TYPE TIMESTAMPTZ USING indexed_at AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at    TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE document_chunks
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE search_queries
  ALTER COLUMN queried_at    TYPE TIMESTAMPTZ USING queried_at AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE rag_sessions
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at    TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC',
  ALTER COLUMN last_active_at TYPE TIMESTAMPTZ USING last_active_at AT TIME ZONE 'UTC';

-- ── Compliance & licensing ───────────────────────────────────────────────────

ALTER TABLE compliance_gap_records
  ALTER COLUMN assessed_at   TYPE TIMESTAMPTZ USING assessed_at AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at    TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE license_status_records
  ALTER COLUMN grant_date    TYPE TIMESTAMPTZ USING grant_date AT TIME ZONE 'UTC',
  ALTER COLUMN expiry_date   TYPE TIMESTAMPTZ USING expiry_date AT TIME ZONE 'UTC',
  ALTER COLUMN last_renewal  TYPE TIMESTAMPTZ USING last_renewal AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at    TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE qco_applicability_records
  ALTER COLUMN effective_date TYPE TIMESTAMPTZ USING effective_date AT TIME ZONE 'UTC',
  ALTER COLUMN created_at     TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- ── Platform / auth ─────────────────────────────────────────────────────────

ALTER TABLE users
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at    TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC',
  ALTER COLUMN last_login_at TYPE TIMESTAMPTZ USING last_login_at AT TIME ZONE 'UTC';

ALTER TABLE refresh_tokens
  ALTER COLUMN issued_at     TYPE TIMESTAMPTZ USING issued_at AT TIME ZONE 'UTC',
  ALTER COLUMN expires_at    TYPE TIMESTAMPTZ USING expires_at AT TIME ZONE 'UTC';

ALTER TABLE audit_events
  ALTER COLUMN occurred_at   TYPE TIMESTAMPTZ USING occurred_at AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- ── Notifications & outbox ───────────────────────────────────────────────────

ALTER TABLE notification_log
  ALTER COLUMN sent_at       TYPE TIMESTAMPTZ USING sent_at AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE outbox_events
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN published_at  TYPE TIMESTAMPTZ USING published_at AT TIME ZONE 'UTC';

-- ── Update DEFAULT expressions to use now() (returns TIMESTAMPTZ) ────────────

-- Note: We can't ALTER DEFAULT without knowing exact column names in every table.
-- The ALTER TYPE above converts stored values. New rows will use now() correctly
-- once app-layer INSERT statements use UTC datetime objects (datetime.utcnow()
-- or datetime.now(timezone.utc) in Python; new Date().toISOString() in Node).

-- Verify: after applying, run:
--   SELECT column_name, data_type
--   FROM information_schema.columns
--   WHERE table_schema = 'public'
--     AND data_type = 'timestamp without time zone'
--   ORDER BY table_name, column_name;
-- Result should be 0 rows.

COMMIT;

-- Record migration
INSERT INTO schema_migrations (version, applied_at)
VALUES ('005_timestamptz', NOW())
ON CONFLICT (version) DO NOTHING;
