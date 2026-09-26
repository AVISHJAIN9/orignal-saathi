/**
 * C26 — Compliance Gap Tracker
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Creates, updates, and retrieves compliance gaps. Closure requires
 * evidence_id reference — can't close a gap without pointing to evidence.
 *
 * Tables: compliance_gaps (c/database.js)
 */

const { db } = require('../database');

const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'WAIVED'];

class ComplianceGapTracker {
  async createGap({ manufacturer_id, requirement_id, gap_description, priority }) {
    if (!manufacturer_id || !gap_description) throw new Error('manufacturer_id and gap_description are required');
    const validPriority = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const prio = priority || 'MEDIUM';
    if (!validPriority.includes(prio)) throw new Error(`priority must be one of: ${validPriority.join(', ')}`);

    const gap = {
      id: 'gap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      manufacturer_id,
      requirement_id: requirement_id || null,
      gap_description,
      priority: prio,
      status: 'OPEN',
      evidence_id: null,
      created_at: new Date().toISOString()
    };
    await db.insert('compliance_gaps', gap);
    return { success: true, gap };
  }

  async closeGap(gapId, evidence_id) {
    if (!gapId || !evidence_id) throw new Error('gapId and evidence_id are required to close a gap');
    const gap = await db.findOne('compliance_gaps', g => g.id === gapId);
    if (!gap) throw new Error(`Gap ${gapId} not found`);
    if (gap.status === 'CLOSED') throw new Error('Gap is already closed');

    // Verify evidence exists
    const evDoc = await db.findOne('evidence_documents', e => e.id === evidence_id);
    if (!evDoc) throw new Error(`Evidence document ${evidence_id} not found. Upload evidence via C35 before closing this gap.`);

    return db.update('compliance_gaps', g => g.id === gapId, {
      status: 'CLOSED', evidence_id, closed_at: new Date().toISOString()
    });
  }

  async updateStatus(gapId, newStatus) {
    if (!VALID_STATUSES.includes(newStatus)) throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    const gap = await db.findOne('compliance_gaps', g => g.id === gapId);
    if (!gap) throw new Error(`Gap ${gapId} not found`);
    if (gap.status === 'CLOSED' && newStatus !== 'CLOSED') throw new Error('Cannot reopen a closed gap');
    return db.update('compliance_gaps', g => g.id === gapId, { status: newStatus });
  }

  async getGaps(manufacturer_id, { status, priority } = {}) {
    const all = await db.getTable('compliance_gaps');
    let results = all.filter(g => g.manufacturer_id === manufacturer_id);
    if (status) results = results.filter(g => g.status === status);
    if (priority) results = results.filter(g => g.priority === priority);
    return { manufacturer_id, total: results.length, gaps: results };
  }
}

module.exports = { ComplianceGapTracker };
