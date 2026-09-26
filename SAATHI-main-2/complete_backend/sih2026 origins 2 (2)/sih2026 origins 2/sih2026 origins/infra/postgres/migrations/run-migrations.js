/**
 * SAATHI — Unified Database Migration Runner
 *
 * Runs all schema migrations in order at startup. Each migration is idempotent
 * (uses IF NOT EXISTS / ON CONFLICT DO NOTHING) so re-running is safe.
 *
 * Usage:
 *   node infra/postgres/migrations/run-migrations.js
 *   OR: call runMigrations(pool) from your NestJS AppModule bootstrap
 *
 * Ordering: Migrations are numbered and run in ascending numeric order.
 * Add new migrations as new numbered files; never modify existing ones.
 */

'use strict';

const path = require('path');
const fs = require('fs');

/**
 * Run all pending migrations against a pg.Pool.
 * @param {import('pg').Pool} pool
 */
async function runMigrations(pool) {
  const client = await pool.connect();

  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _saathi_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get already-applied migrations
    const applied = await client.query(
      'SELECT name FROM _saathi_migrations ORDER BY id'
    );
    const appliedSet = new Set(applied.rows.map(r => r.name));

    // Load migration files in order
    const migrationsDir = path.join(__dirname, 'sql');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    let ran = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  ✓ Already applied: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO _saathi_migrations (name) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`  ✅ Applied migration: ${file}`);
        ran++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  🔴 Migration failed: ${file} — ${err.message}`);
        throw err;
      }
    }

    if (ran === 0) {
      console.log('  ✓ All migrations already applied. Database is up-to-date.');
    } else {
      console.log(`  ✅ Applied ${ran} migration(s) successfully.`);
    }
  } finally {
    client.release();
  }
}

// CLI runner
if (require.main === module) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  runMigrations(pool)
    .then(() => { pool.end(); process.exit(0); })
    .catch(err => { console.error(err.message); pool.end(); process.exit(1); });
}

module.exports = { runMigrations };
