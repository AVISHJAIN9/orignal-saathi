/**
 * C42 — Product Lifecycle Compliance Tracker
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Tracks compliance status at each lifecycle stage: DESIGN → PROTOTYPE → TESTING → LAUNCH → ACTIVE → RETIRED.
 * Stage advancement requires all mandatory checklist items for that stage to be satisfied.
 *
 * Tables: product_lifecycle_records, lifecycle_stage_checklists (c/database.js)
 */

const { db } = require('../database');

const STAGE_ORDER = ['DESIGN', 'PROTOTYPE', 'TESTING', 'LAUNCH', 'ACTIVE', 'RETIRED'];

class ProductLifecycleComplianceTracker {
  async createRecord({ product_id, standard_id, manufacturer_id }) {
    if (!product_id || !standard_id || !manufacturer_id) throw new Error('product_id, standard_id, and manufacturer_id are required');
    const record = {
      id: 'lc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      product_id, standard_id, manufacturer_id, current_stage: 'DESIGN',
      stage_history: [{ stage: 'DESIGN', entered_at: new Date().toISOString() }],
      created_at: new Date().toISOString()
    };
    await db.insert('product_lifecycle_records', record);
    return { success: true, record };
  }

  async advanceStage(recordId) {
    const record = await db.findOne('product_lifecycle_records', r => r.id === recordId);
    if (!record) throw new Error(`Lifecycle record ${recordId} not found`);
    if (record.current_stage === 'RETIRED') throw new Error('Product is already RETIRED — no further stages');

    const currentIdx = STAGE_ORDER.indexOf(record.current_stage);
    const nextStage = STAGE_ORDER[currentIdx + 1];

    // Check mandatory checklist items for current stage
    const checklists = await db.getTable('lifecycle_stage_checklists');
    const mandatoryItems = checklists.filter(c => c.stage === record.current_stage && c.standard_id === record.standard_id && c.is_mandatory);
    const unsatisfied = mandatoryItems.filter(c => !(record.satisfied_items || []).includes(c.id));

    if (unsatisfied.length > 0) {
      return {
        advanced: false,
        current_stage: record.current_stage,
        blocked_by: unsatisfied.map(i => ({ item_id: i.id, requirement: i.requirement })),
        message: `Cannot advance to ${nextStage} — ${unsatisfied.length} mandatory checklist item(s) not satisfied.`
      };
    }

    const history = [...(record.stage_history || []), { stage: nextStage, entered_at: new Date().toISOString() }];
    await db.update('product_lifecycle_records', r => r.id === recordId, { current_stage: nextStage, stage_history: history });
    return { advanced: true, from_stage: record.current_stage, to_stage: nextStage };
  }

  async satisfyChecklistItem(recordId, checklist_item_id) {
    const record = await db.findOne('product_lifecycle_records', r => r.id === recordId);
    if (!record) throw new Error(`Record ${recordId} not found`);
    const items = [...new Set([...(record.satisfied_items || []), checklist_item_id])];
    return db.update('product_lifecycle_records', r => r.id === recordId, { satisfied_items: items });
  }
}

module.exports = { ProductLifecycleComplianceTracker };
