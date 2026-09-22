/**
 * C35 — Compliance Evidence Vault
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Version-controlled evidence upload. When a new version is uploaded:
 * 1. Prior evidence_versions rows for that document are marked superseded=true
 * 2. A new evidence_versions row is created
 * 3. The version counter on evidence_documents is incremented
 *
 * Tables: evidence_documents, evidence_versions (c/database.js)
 */

const { db } = require('../database');

class ComplianceEvidenceVaultService {
  /**
   * Upload evidence for a requirement. Auto-versions if prior evidence exists.
   */
  async upload({ manufacturer_id, requirement_id, file_ref, submitted_by }) {
    if (!manufacturer_id || !requirement_id || !file_ref) {
      throw new Error('manufacturer_id, requirement_id, and file_ref are required');
    }

    const allDocs = await db.getTable('evidence_documents');

    // Check if evidence already exists for this manufacturer + requirement
    const existing = allDocs.find(d =>
      d.manufacturer_id === manufacturer_id && d.requirement_id === requirement_id
    );

    let docId;
    let newVersion;

    if (existing) {
      // Version upgrade: supersede all existing versions for this document
      const allVersions = await db.getTable('evidence_versions');
      const existingVersions = allVersions.filter(v => v.evidence_id === existing.id && !v.superseded);
      for (const ver of existingVersions) {
        await db.update('evidence_versions', v => v.id === ver.id, { superseded: true });
      }

      newVersion = (existing.version || 0) + 1;
      await db.update('evidence_documents', d => d.id === existing.id, {
        version: newVersion,
        file_ref,
        updated_at: new Date().toISOString()
      });
      docId = existing.id;
    } else {
      // First upload
      newVersion = 1;
      const newDoc = {
        id: 'ev_doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        manufacturer_id,
        requirement_id,
        file_ref,
        version: newVersion,
        created_at: new Date().toISOString()
      };
      await db.insert('evidence_documents', newDoc);
      docId = newDoc.id;
    }

    // Insert new version record
    const versionRow = {
      id: 'ev_ver_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      evidence_id: docId,
      version_number: newVersion,
      file_ref,
      submitted_by: submitted_by || 'SYSTEM',
      superseded: false,
      uploaded_at: new Date().toISOString()
    };
    await db.insert('evidence_versions', versionRow);

    return {
      success: true,
      evidence_id: docId,
      version: newVersion,
      is_new_document: !existing,
      file_ref,
      version_record: versionRow
    };
  }

  /**
   * Get current (non-superseded) evidence for a requirement.
   */
  async getEvidence(requirementId, manufacturer_id) {
    if (!requirementId) throw new Error('requirementId is required');

    const allDocs = await db.getTable('evidence_documents');
    let docs = allDocs.filter(d => d.requirement_id === requirementId);
    if (manufacturer_id) docs = docs.filter(d => d.manufacturer_id === manufacturer_id);

    const allVersions = await db.getTable('evidence_versions');

    return docs.map(doc => {
      const currentVersion = allVersions.find(v => v.evidence_id === doc.id && !v.superseded);
      const versionHistory = allVersions.filter(v => v.evidence_id === doc.id);
      return {
        evidence_id: doc.id,
        manufacturer_id: doc.manufacturer_id,
        requirement_id: doc.requirement_id,
        current_version: doc.version,
        current_file_ref: doc.file_ref,
        current_version_record: currentVersion || null,
        version_count: versionHistory.length,
        version_history: versionHistory.sort((a, b) => a.version_number - b.version_number)
      };
    });
  }

  /**
   * Get version history for a specific evidence document.
   */
  async getVersionHistory(evidenceId) {
    if (!evidenceId) throw new Error('evidenceId is required');
    const doc = await db.findOne('evidence_documents', d => d.id === evidenceId);
    if (!doc) throw new Error(`Evidence document ${evidenceId} not found`);
    const allVersions = await db.getTable('evidence_versions');
    return allVersions
      .filter(v => v.evidence_id === evidenceId)
      .sort((a, b) => a.version_number - b.version_number);
  }

  /**
   * Get all evidence for a manufacturer.
   */
  async getAllEvidence(manufacturer_id) {
    if (!manufacturer_id) throw new Error('manufacturer_id is required');
    const allDocs = await db.getTable('evidence_documents');
    return allDocs.filter(d => d.manufacturer_id === manufacturer_id);
  }
}

module.exports = { ComplianceEvidenceVaultService };