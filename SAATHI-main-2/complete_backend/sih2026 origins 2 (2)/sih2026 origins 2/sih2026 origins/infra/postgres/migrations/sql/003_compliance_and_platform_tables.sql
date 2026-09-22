-- ============================================================================
-- Migration 003: Compliance, Lifecycle & Platform Tables (C/S/I/P-Series)
-- Applied: idempotent via IF NOT EXISTS
-- ============================================================================

-- ── C-Series: Compliance Intelligence ──────────────────────────────────────

-- C1: QCO applicability results
CREATE TABLE IF NOT EXISTS qco_applicability_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(128) NOT NULL,
  hsn_code VARCHAR(20),
  product_description TEXT,
  applicable_qcos JSONB NOT NULL DEFAULT '[]',
  applicable_standards JSONB NOT NULL DEFAULT '[]',
  certification_scheme VARCHAR(64),           -- ISI | CRS | FMCS | HALLMARKING | ECOMARK
  is_qco_mandatory BOOLEAN DEFAULT false,
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qco_hsn ON qco_applicability_results(hsn_code);
CREATE INDEX IF NOT EXISTS idx_qco_session ON qco_applicability_results(session_id);

-- C37: Compliance Audit Events (append-only — no UPDATE/DELETE ever)
CREATE TABLE IF NOT EXISTS compliance_audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(64) NOT NULL,            -- QCO_LOOKUP | DOC_UPLOAD | LICENSE_QUERY | etc.
  user_id VARCHAR(128),
  session_id VARCHAR(128),
  entity_type VARCHAR(64),
  entity_id VARCHAR(255),
  event_data JSONB DEFAULT '{}',
  ip_address_hash VARCHAR(64),                -- SHA-256 of IP (never store plaintext)
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prevent any UPDATE or DELETE on audit events (immutable ledger)
CREATE OR REPLACE RULE no_update_audit AS ON UPDATE TO compliance_audit_events DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_audit AS ON DELETE TO compliance_audit_events DO INSTEAD NOTHING;

CREATE INDEX IF NOT EXISTS idx_audit_user ON compliance_audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_type ON compliance_audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_time ON compliance_audit_events(occurred_at DESC);

-- C35: Compliance Evidence Vault
CREATE TABLE IF NOT EXISTS compliance_evidence_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_account_id VARCHAR(128) NOT NULL,
  document_type VARCHAR(64) NOT NULL,         -- FACTORY_LAYOUT | QC_STAFF_CV | TEST_REPORT | etc.
  filename VARCHAR(512) NOT NULL,
  storage_key VARCHAR(1024) NOT NULL,         -- S3/GCS object key (no public URLs stored)
  file_size_bytes BIGINT,
  mime_type VARCHAR(128),
  validity_start DATE,
  validity_end DATE,
  is_expired BOOLEAN GENERATED ALWAYS AS (validity_end < CURRENT_DATE) STORED,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(128),
  checksum_sha256 VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_evidence_account ON compliance_evidence_documents(business_account_id);
CREATE INDEX IF NOT EXISTS idx_evidence_expiry ON compliance_evidence_documents(validity_end);

-- C40: Compliance Risk Heatmap scores
CREATE TABLE IF NOT EXISTS compliance_risk_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_account_id VARCHAR(128) NOT NULL,
  standard_number VARCHAR(128),
  risk_level VARCHAR(16) NOT NULL,            -- LOW | MEDIUM | HIGH | CRITICAL
  risk_score FLOAT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors JSONB DEFAULT '[]',
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP
);

-- C14: License status (CML monitoring)
CREATE TABLE IF NOT EXISTS license_status_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cml_number VARCHAR(128) NOT NULL UNIQUE,
  company_name TEXT,
  standard_number VARCHAR(128),
  status VARCHAR(32) NOT NULL,                -- OPERATIVE_VALID | SUSPENDED | CANCELLED | EXPIRED
  valid_until DATE,
  last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  next_renewal_due DATE,
  source_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_license_cml ON license_status_records(cml_number);
CREATE INDEX IF NOT EXISTS idx_license_expiry ON license_status_records(valid_until);

-- ── S-Series: Licensing Lifecycle ──────────────────────────────────────────

-- S16: DPDP Consent records (immutable — only INSERT allowed)
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(128) NOT NULL,
  consent_version VARCHAR(32) NOT NULL,
  purpose_codes TEXT[] NOT NULL,
  consented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  withdrawn_at TIMESTAMP,
  ip_address_hash VARCHAR(64),
  user_agent_hash VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_version ON consent_records(consent_version);

-- ── P-Series: Platform ──────────────────────────────────────────────────────

-- P1: Rate limiting override rules (per-user or per-plan throttle config)
CREATE TABLE IF NOT EXISTS rate_limit_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(128) NOT NULL UNIQUE,
  plan_name VARCHAR(64) DEFAULT 'FREE',       -- FREE | MSME | ENTERPRISE | INTERNAL
  requests_per_minute INT NOT NULL DEFAULT 60,
  requests_per_day INT NOT NULL DEFAULT 500,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- P4: System health snapshots for the admin monitoring dashboard
CREATE TABLE IF NOT EXISTS system_health_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active_sessions INT,
  queue_depth_ingestion INT,
  queue_depth_dlq INT,
  db_connection_pool_size INT,
  avg_rag_latency_ms FLOAT,
  p95_rag_latency_ms FLOAT,
  error_rate_percent FLOAT,
  metadata JSONB DEFAULT '{}'
);

-- Retention: auto-delete health snapshots older than 90 days
CREATE INDEX IF NOT EXISTS idx_health_snapshot_time ON system_health_snapshots(snapshot_at DESC);

-- X4: User feedback on RAG answers
CREATE TABLE IF NOT EXISTS answer_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(128),
  user_id VARCHAR(128),
  conversation_id UUID,
  query_text TEXT NOT NULL,
  answer_text TEXT,
  rating INT CHECK (rating IN (1, 2, 3, 4, 5)),
  feedback_type VARCHAR(32),                  -- THUMBS_UP | THUMBS_DOWN | DETAILED
  feedback_text TEXT,
  is_grounded BOOLEAN,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_session ON answer_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON answer_feedback(rating);
