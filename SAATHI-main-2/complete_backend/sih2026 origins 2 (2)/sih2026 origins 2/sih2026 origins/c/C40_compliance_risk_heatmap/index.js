/**
 * C40 — Compliance Risk Heatmap
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Computes a risk score from documented weighted formula:
 *   open_gaps_penalty   = count(compliance_gaps WHERE status='OPEN') × 5
 *   expiry_penalty      = days_until_expiry < 30 ? 20 : days_until_expiry < 90 ? 10 : 0
 *   diffs_penalty       = count(knowledge_diffs affecting manufacturer or product) × 3.5
 *
 * Score is inserted into risk_scores table. Formula is deterministic — adding an open
 * gap MUST increase the score (test-verified).
 *
 * Tables: risk_scores, compliance_gaps, knowledge_diffs, license_validity (c/database.js)
 */

const { db } = require('../database');

// Documented formula weights — NEVER change without updating this comment and README
const WEIGHTS = {
  open_gap: 5.0,
  expiry_critical: 20.0,   // < 30 days
  expiry_high: 10.0,        // 30–90 days
  expiry_ok: 0.0,           // > 90 days or no expiry record
  unacknowledged_diff: 3.5
};

class RiskHeatmapService {
  /**
   * Compute and persist risk score for a manufacturer+product.
   * Formula is fully documented in this file and README.md.
   */
  async computeRiskScore(manufacturerId, productId) {
    if (!manufacturerId) throw new Error('manufacturerId is required');

    const now = new Date();

    // 1. Open gaps penalty
    const allGaps = await db.getTable('compliance_gaps');
    const openGaps = allGaps.filter(g =>
      (g.manufacturer_id === manufacturerId || g.product_id === productId) &&
      g.status === 'OPEN'
    );
    const open_gaps_penalty = openGaps.length * WEIGHTS.open_gap;

    // 2. Expiry penalty (from license_validity, fallback to licensing_records)
    let expiry_penalty = WEIGHTS.expiry_ok;
    let days_until_expiry = null;
    let expiry_source = null;

    const validityRows = await db.getTable('license_validity');
    const expiryRow = validityRows.find(v => v.license_id === manufacturerId || v.license_id === productId);

    if (!expiryRow) {
      // Try licensing_records
      const licRecords = await db.getTable('licensing_records');
      const lic = licRecords.find(l => l.license_id === manufacturerId);
      if (lic) {
        days_until_expiry = Math.ceil((new Date(lic.valid_till) - now) / (1000 * 60 * 60 * 24));
        expiry_source = 'licensing_records';
      }
    } else {
      days_until_expiry = Math.ceil((new Date(expiryRow.expiry_date) - now) / (1000 * 60 * 60 * 24));
      expiry_source = 'license_validity';
    }

    if (days_until_expiry !== null) {
      if (days_until_expiry < 30) expiry_penalty = WEIGHTS.expiry_critical;
      else if (days_until_expiry < 90) expiry_penalty = WEIGHTS.expiry_high;
      else expiry_penalty = WEIGHTS.expiry_ok;
    }

    // 3. Unacknowledged knowledge diffs penalty
    const allDiffs = await db.getTable('knowledge_diffs');
    const unreviewedDiffs = allDiffs.filter(d => {
      const affectsThis = !productId || !d.affected_product_ids ||
        (Array.isArray(d.affected_product_ids) && d.affected_product_ids.includes(productId));
      return affectsThis && !d.acknowledged_by_manufacturer;
    });
    const diffs_penalty = unreviewedDiffs.length * WEIGHTS.unacknowledged_diff;

    const total_score = parseFloat((open_gaps_penalty + expiry_penalty + diffs_penalty).toFixed(2));

    // Determine risk tier
    let risk_tier;
    if (total_score >= 40) risk_tier = 'CRITICAL';
    else if (total_score >= 25) risk_tier = 'HIGH';
    else if (total_score >= 10) risk_tier = 'MEDIUM';
    else risk_tier = 'LOW';

    const scoreRecord = {
      id: 'rs_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      manufacturer_id: manufacturerId,
      product_id: productId || null,
      score: total_score,
      risk_tier,
      contributing_factors: {
        open_gaps_count: openGaps.length,
        open_gaps_penalty,
        days_until_expiry,
        expiry_source,
        expiry_penalty,
        unreviewed_diffs_count: unreviewedDiffs.length,
        diffs_penalty
      },
      formula_version: 'v1.0',
      formula_doc: 'open_gaps×5 + expiry_penalty(20/10/0) + unacknowledged_diffs×3.5',
      computed_at: now.toISOString()
    };

    await db.insert('risk_scores', scoreRecord);

    return {
      score_id: scoreRecord.id,
      manufacturer_id: manufacturerId,
      product_id: productId || null,
      score: total_score,
      risk_tier,
      contributing_factors: scoreRecord.contributing_factors,
      formula: scoreRecord.formula_doc
    };
  }

  /**
   * Get latest risk score for a manufacturer.
   */
  async getLatestScore(manufacturerId) {
    if (!manufacturerId) throw new Error('manufacturerId is required');
    const all = await db.getTable('risk_scores');
    const scores = all
      .filter(s => s.manufacturer_id === manufacturerId)
      .sort((a, b) => new Date(b.computed_at) - new Date(a.computed_at));
    if (scores.length === 0) return { manufacturer_id: manufacturerId, score: null, message: 'No risk score computed yet. Call computeRiskScore first.' };
    return scores[0];
  }

  /**
   * Get all manufacturers in a given risk tier (for heatmap dashboard).
   */
  async getHeatmap(tier) {
    const all = await db.getTable('risk_scores');
    // Get latest score per manufacturer
    const latestByMfr = {};
    for (const s of all) {
      if (!latestByMfr[s.manufacturer_id] || new Date(s.computed_at) > new Date(latestByMfr[s.manufacturer_id].computed_at)) {
        latestByMfr[s.manufacturer_id] = s;
      }
    }
    let results = Object.values(latestByMfr);
    if (tier) results = results.filter(s => s.risk_tier === tier);
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  /**
   * Add a compliance gap (for testing — increases risk score on next compute).
   */
  async addComplianceGap({ manufacturer_id, product_id, gap_description }) {
    if (!manufacturer_id || !gap_description) throw new Error('manufacturer_id and gap_description are required');
    const gap = {
      id: 'gap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      manufacturer_id,
      product_id: product_id || null,
      gap_description,
      status: 'OPEN',
      created_at: new Date().toISOString()
    };
    await db.insert('compliance_gaps', gap);
    return gap;
  }
}

module.exports = { RiskHeatmapService };