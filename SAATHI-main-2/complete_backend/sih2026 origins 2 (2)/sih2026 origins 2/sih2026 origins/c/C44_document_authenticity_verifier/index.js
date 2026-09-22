/**
 * C44 — Document Authenticity Verifier
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Verifies document authenticity by checking SHA-256 hash against
 * document_hash_registry table. Timestamps the verification in auth_log.
 *
 * Tables: document_hash_registry, document_auth_log (c/database.js)
 */

const { db } = require('../database');

class DocumentAuthenticityVerifier {
  async verify(documentId, hashHex) {
    if (!documentId || !hashHex) throw new Error('documentId and hashHex are required');

    // Validate hash format (SHA-256 = 64 hex chars)
    if (!/^[a-fA-F0-9]{64}$/.test(hashHex)) {
      throw new Error(`Invalid hash format. Must be a 64-character SHA-256 hex string, got ${hashHex.length} chars.`);
    }

    const registry = await db.getTable('document_hash_registry');
    const entry = registry.find(r => r.document_id === documentId);

    let result;
    if (!entry) {
      result = {
        document_id: documentId,
        verified: false,
        status: 'NOT_REGISTERED',
        reason: `Document ${documentId} not found in hash registry. Only documents registered with SAATHI at upload time can be verified.`
      };
    } else if (entry.hash_sha256.toLowerCase() !== hashHex.toLowerCase()) {
      result = {
        document_id: documentId,
        verified: false,
        status: 'HASH_MISMATCH',
        reason: 'Hash does not match registered value. Document may have been altered.',
        registered_at: entry.registered_at,
        issuer: entry.issuer
      };
    } else {
      result = {
        document_id: documentId,
        verified: true,
        status: 'AUTHENTIC',
        registered_at: entry.registered_at,
        issuer: entry.issuer,
        document_type: entry.document_type
      };
    }

    // Append verification attempt to audit log (insert-only)
    const logEntry = {
      id: 'authlog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      document_id: documentId,
      hash_provided: hashHex,
      verification_result: result.status,
      verified_at: new Date().toISOString()
    };
    await db.insert('document_auth_log', logEntry);

    return { ...result, log_id: logEntry.id, verified_at: logEntry.verified_at };
  }

  async register(documentId, hashHex, { document_type, issuer } = {}) {
    if (!/^[a-fA-F0-9]{64}$/.test(hashHex)) throw new Error('Invalid SHA-256 hash format');
    const existing = await db.findOne('document_hash_registry', r => r.document_id === documentId);
    if (existing) throw new Error(`Document ${documentId} is already registered. Use a new version ID if the document has changed.`);
    const entry = {
      id: 'dhr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      document_id: documentId, hash_sha256: hashHex.toLowerCase(),
      document_type: document_type || 'GENERAL', issuer: issuer || 'UNKNOWN',
      registered_at: new Date().toISOString()
    };
    await db.insert('document_hash_registry', entry);
    return { success: true, document_id: documentId, registered_at: entry.registered_at };
  }
}

module.exports = { DocumentAuthenticityVerifier };
