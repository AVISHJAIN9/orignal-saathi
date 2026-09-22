/**
 * C43 — Batch Compliance Monitor
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Tracks sampling and testing for product batches. Flags batches where
 * sampling_rate < required_rate from batch_sampling_requirements table.
 *
 * Tables: batch_compliance_records, batch_sampling_requirements (c/database.js)
 */

const { db } = require('../database');

class BatchComplianceMonitor {
  async recordBatch({ batch_id, product_id, standard_id, batch_size, sampled_count }) {
    if (!batch_id || !product_id || batch_size === undefined) throw new Error('batch_id, product_id, and batch_size are required');

    const requirements = await db.getTable('batch_sampling_requirements');
    const req = requirements.find(r => r.standard_id === standard_id) || null;
    const required_rate = req ? Number(req.required_sampling_rate) : 0.05; // default 5%
    const actual_rate = sampled_count !== undefined ? sampled_count / batch_size : null;
    const compliant = actual_rate !== null ? actual_rate >= required_rate : null;

    const record = {
      id: 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      batch_id, product_id, standard_id: standard_id || null,
      batch_size, sampled_count: sampled_count || null,
      required_sampling_rate: required_rate,
      actual_sampling_rate: actual_rate,
      sampling_compliant: compliant,
      status: 'RECORDED', created_at: new Date().toISOString()
    };

    await db.insert('batch_compliance_records', record);
    return { success: true, record, compliant, gap: compliant === false ? `Required rate: ${(required_rate * 100).toFixed(1)}%, Actual: ${(actual_rate * 100).toFixed(1)}%` : null };
  }

  async getBatchStatus(batch_id) {
    const record = await db.findOne('batch_compliance_records', r => r.batch_id === batch_id);
    if (!record) throw new Error(`Batch ${batch_id} not found`);
    return record;
  }

  async getNonCompliantBatches(manufacturer_id) {
    const all = await db.getTable('batch_compliance_records');
    return all.filter(r => r.product_id.startsWith(manufacturer_id) && r.sampling_compliant === false);
  }
}

module.exports = { BatchComplianceMonitor };
