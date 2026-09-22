-- G10 (CAPTCHA) and G13 (XML Sitemap) need no schema changes — see the
-- Feature Matrix (Data & Storage Work Required: NO for both).
--
-- G11 (2FA) adds columns to P1's existing admin credentials table rather
-- than a new table, per spec. This migration assumes that table is named
-- `users` with a UUID primary key `id` — adjust the table name to match
-- whatever P1 actually calls it.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS two_factor_pending_secret VARCHAR(64),
  ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(64),
  ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS two_factor_backup_code_hashes TEXT[] NOT NULL DEFAULT '{}';
