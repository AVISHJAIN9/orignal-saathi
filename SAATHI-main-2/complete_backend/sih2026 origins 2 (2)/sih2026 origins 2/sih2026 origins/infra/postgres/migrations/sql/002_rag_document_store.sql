-- ============================================================================
-- Migration 002: RAG Document Store (M-Series Tables)
-- Applied: idempotent via IF NOT EXISTS
-- ============================================================================

-- M1: Ingested documents
CREATE TABLE IF NOT EXISTS bis_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id VARCHAR(255) NOT NULL UNIQUE,       -- deterministic ID from ingestion service
  standard_number VARCHAR(128),
  source_url TEXT,
  filename VARCHAR(512),
  checksum_sha256 VARCHAR(64) NOT NULL,
  source_type VARCHAR(32) DEFAULT 'upload',        -- upload | crawler | gazette
  status VARCHAR(32) DEFAULT 'PENDING',           -- PENDING | PROCESSING | INDEXED | FAILED | SUPERSEDED
  character_count INT,
  chunk_count INT DEFAULT 0,
  ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  indexed_at TIMESTAMP,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_bis_documents_standard ON bis_documents(standard_number);
CREATE INDEX IF NOT EXISTS idx_bis_documents_status ON bis_documents(status);
CREATE INDEX IF NOT EXISTS idx_bis_documents_checksum ON bis_documents(checksum_sha256);

-- M1: Crawl run history (which pages were crawled, when, with what checksum)
CREATE TABLE IF NOT EXISTS crawl_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crawl_run_id VARCHAR(128) NOT NULL UNIQUE,
  pages_queued INT DEFAULT 0,
  pages_skipped INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(32) DEFAULT 'RUNNING'            -- RUNNING | COMPLETED | FAILED
);

CREATE TABLE IF NOT EXISTS crawl_page_checksums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  checksum_sha256 VARCHAR(64) NOT NULL,
  last_crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- M2/M3: Vector chunks for semantic retrieval
-- Using pgvector HNSW for approximate nearest-neighbour search at scale
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id VARCHAR(255) NOT NULL REFERENCES bis_documents(document_id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  content_tsvector TSVECTOR,                      -- FTS index column (auto-updated via trigger)
  heading_path TEXT,                              -- e.g. "Clause 6.1 > Sub-clause 6.1.2"
  page_number INT,
  embedding vector(1536),                         -- pgvector embedding (1536 = OpenAI / Gemini dim)
  token_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HNSW index for fast approximate nearest-neighbour embedding search
-- Significantly outperforms IVFFlat at <10M rows with good recall
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- FTS index for hybrid sparse retrieval
CREATE INDEX IF NOT EXISTS idx_chunks_fts
  ON document_chunks
  USING GIN (content_tsvector);

CREATE INDEX IF NOT EXISTS idx_chunks_document
  ON document_chunks(document_id);

-- Auto-update tsvector on insert/update
CREATE OR REPLACE FUNCTION update_chunk_tsvector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_tsvector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_chunk_tsvector ON document_chunks;
CREATE TRIGGER trg_update_chunk_tsvector
  BEFORE INSERT OR UPDATE OF content ON document_chunks
  FOR EACH ROW EXECUTE FUNCTION update_chunk_tsvector();

-- M7: Confidence scores for RAG answers
CREATE TABLE IF NOT EXISTS confidence_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  retrieval_scores JSONB,                         -- per-chunk retrieval similarity scores
  groundedness_score FLOAT,
  evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- M9: Session state (Redis-backed; this table is backup/audit only)
CREATE TABLE IF NOT EXISTS session_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(128) NOT NULL,
  user_id VARCHAR(128),
  action VARCHAR(64) NOT NULL,                    -- CREATED | UPDATED | EXPIRED | DESTROYED
  session_data JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
