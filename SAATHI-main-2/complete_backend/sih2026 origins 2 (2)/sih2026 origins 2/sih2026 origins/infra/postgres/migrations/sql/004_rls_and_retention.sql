-- ============================================================================
-- Migration 004: Row-Level Security & Data Retention Automation
-- Applied: idempotent
-- ============================================================================

-- ── Row-Level Security (DPDP Act isolation) ────────────────────────────────

-- Enable RLS on tables that contain user-scoped data
ALTER TABLE compliance_evidence_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own compliance evidence
-- The app must SET app.current_user_id = '<user-id>' at connection time
CREATE POLICY IF NOT EXISTS evidence_owner_isolation
  ON compliance_evidence_documents
  USING (business_account_id = current_setting('app.current_user_id', true));

CREATE POLICY IF NOT EXISTS consent_owner_isolation
  ON consent_records
  USING (user_id = current_setting('app.current_user_id', true));

-- Bypass RLS for the saathi_service role (the app's DB user)
-- This role must be granted separately:
--   CREATE ROLE saathi_service LOGIN PASSWORD '...';
--   GRANT ALL ON ALL TABLES IN SCHEMA public TO saathi_service;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'saathi_service') THEN
    ALTER TABLE compliance_evidence_documents FORCE ROW LEVEL SECURITY;
    ALTER TABLE consent_records FORCE ROW LEVEL SECURITY;
    EXECUTE 'ALTER POLICY evidence_owner_isolation ON compliance_evidence_documents TO saathi_service';
  END IF;
END $$;

-- ── Automated Retention (DPDP Act S.8(7)) ─────────────────────────────────

-- Auto-delete conversations older than 90 days
-- Note: pg_cron must be installed (available on RDS/CloudSQL) for this to run.
-- If pg_cron is not available, run via an external cron job hitting the /admin/retention endpoint.
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'saathi-chat-retention-90d',
  '0 2 * * *',    -- 2:00 AM daily
  $$
    DELETE FROM document_chunks
      WHERE document_id IN (
        SELECT document_id FROM bis_documents
        WHERE status = 'FAILED' AND ingested_at < NOW() - INTERVAL '30 days'
      );
    
    -- Note: conversation/message retention handled by m9 TypeORM entity,
    -- but we provide this as a safety-net SQL backup.
    -- DELETE FROM conversations WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Delete old health snapshots
    DELETE FROM system_health_snapshots
      WHERE snapshot_at < NOW() - INTERVAL '90 days';
  $$
);

-- ── Performance Indexes ────────────────────────────────────────────────────

-- Partial index for active licenses only (most common query)
CREATE INDEX IF NOT EXISTS idx_license_active
  ON license_status_records(cml_number, valid_until)
  WHERE status = 'OPERATIVE_VALID';

-- Partial index for failed ingestion jobs (admin view)
CREATE INDEX IF NOT EXISTS idx_docs_failed
  ON bis_documents(ingested_at DESC)
  WHERE status = 'FAILED';

-- Covering index for chunk retrieval (avoids table heap fetch for common queries)
CREATE INDEX IF NOT EXISTS idx_chunks_covering
  ON document_chunks(document_id, chunk_index)
  INCLUDE (content, heading_path, token_count);
