/**
 * C28 — Knowledge Diff Engine
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Computes semantic diff between two standard versions. Inserts into
 * knowledge_diffs table. Marks existing diffs as superseded before inserting new.
 *
 * Tables: standard_versions, knowledge_diffs (c/database.js)
 */

const { db } = require('../database');

class KnowledgeDiffEngine {
  async computeDiff(standardId, fromVersion, toVersion) {
    if (!standardId || !fromVersion || !toVersion) throw new Error('standardId, fromVersion, and toVersion are required');

    const allVersions = await db.getTable('standard_versions');
    const from = allVersions.find(v => v.standard_id === standardId && v.version_tag === fromVersion);
    const to = allVersions.find(v => v.standard_id === standardId && v.version_tag === toVersion);

    if (!from && !to) {
      throw new Error(`No version records found for ${standardId} in standard_versions. Populate standard_versions before calling computeDiff.`);
    }

    // Compute clause-level diff (structural diff of content arrays)
    const fromClauses = Array.isArray(from && from.clauses_json) ? from.clauses_json : [];
    const toClauses = Array.isArray(to && to.clauses_json) ? to.clauses_json : [];

    const fromIds = new Set((fromClauses).map(c => c.clause_number));
    const toIds = new Set((toClauses).map(c => c.clause_number));

    const added = toClauses.filter(c => !fromIds.has(c.clause_number));
    const removed = fromClauses.filter(c => !toIds.has(c.clause_number));
    const changed = toClauses.filter(c => {
      const oldClause = fromClauses.find(f => f.clause_number === c.clause_number);
      return oldClause && oldClause.requirement_text !== c.requirement_text;
    });

    // Supersede old diffs for this standard pair
    const existingDiffs = await db.getTable('knowledge_diffs');
    for (const old of existingDiffs.filter(d => d.standard_id === standardId && !d.superseded)) {
      await db.update('knowledge_diffs', d => d.id === old.id, { superseded: true });
    }

    const diff = {
      id: 'kdiff_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      standard_id: standardId,
      from_version: fromVersion,
      to_version: toVersion,
      clauses_added_count: added.length,
      clauses_removed_count: removed.length,
      clauses_changed_count: changed.length,
      has_breaking_changes: removed.length > 0 || changed.length > 0,
      added_clauses: added,
      removed_clauses: removed,
      changed_clauses: changed,
      acknowledged_by_manufacturer: false,
      superseded: false,
      computed_at: new Date().toISOString()
    };

    await db.insert('knowledge_diffs', diff);
    return { success: true, diff_id: diff.id, summary: { added: added.length, removed: removed.length, changed: changed.length, has_breaking: diff.has_breaking_changes }, diff };
  }

  async getDiffs(standardId, { includeSuperseded } = {}) {
    const all = await db.getTable('knowledge_diffs');
    return all.filter(d => d.standard_id === standardId && (includeSuperseded || !d.superseded));
  }

  async acknowledgeByManufacturer(diffId) {
    const diff = await db.findOne('knowledge_diffs', d => d.id === diffId);
    if (!diff) throw new Error(`Diff ${diffId} not found`);
    return db.update('knowledge_diffs', d => d.id === diffId, {
      acknowledged_by_manufacturer: true, acknowledged_at: new Date().toISOString()
    });
  }
}

module.exports = { KnowledgeDiffEngine };
