-- ============================================================================
-- Migration 001: Enable Required Extensions
-- Applied: once on first run; safe to re-apply (IF NOT EXISTS)
-- ============================================================================

-- pgvector for semantic search embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search configuration for Indian English
-- (falls back to English if hindi configuration not installed)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'hindi') THEN
    CREATE TEXT SEARCH CONFIGURATION hindi (COPY = english);
  END IF;
END $$;
