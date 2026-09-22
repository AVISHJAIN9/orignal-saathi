/**
 * C33 — Compliance Health Score
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Weighted aggregate of 5 dimensions from real tables.
 * Each dimension can be 0–20 pts. Total max = 100.
 * Formula:
 *   license_validity_score = daysLeft > 180 ? 20 : daysLeft > 90 ? 15 : daysLeft > 30 ? 10 : 0
 *   evidence_coverage_score = (evDocs / reqClauses) * 20, capped at 20
 *   gap_free_score = max(0, 20 - openGaps * 5)
 *   risk_score = max(0, 20 - riskScore / 5)
 *   renewal_score = hasCompletedRenewal ? 20 : 0
 *
 * Tables: licensing_records, evidence_documents, compliance_gaps, risk_scores, renewals (c/database.js)
 */

const { db } = require('../database');

class ComplianceHealthScorer {
  async score(manufacturer_id) {
    if (!manufacturer_id) throw new Error('manufacturer_id is required');

    const now = new Date();

    // License validity
    const licRecords = await db.getTable('licensing_records');
    const lic = licRecords.find(l => l.license_id === manufacturer_id);
    let licScore = 0, licDetail = 'No license found';
    if (lic) {
      const daysLeft = Math.ceil((new Date(lic.valid_till) - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 180) { licScore = 20; licDetail = `${daysLeft} days remaining — excellent`; }
      else if (daysLeft > 90) { licScore = 15; licDetail = `${daysLeft} days remaining — good`; }
      else if (daysLeft > 30) { licScore = 10; licDetail = `${daysLeft} days remaining — needs attention`; }
      else { licScore = 0; licDetail = `${daysLeft} days remaining — CRITICAL`; }
    }

    // Evidence coverage
    const evidenceDocs = await db.getTable('evidence_documents');
    const clauseReqs = await db.getTable('clause_requirements');
    const myDocs = evidenceDocs.filter(e => e.manufacturer_id === manufacturer_id);
    const relevantClauses = clauseReqs.filter(c => lic && c.standard_id.includes(lic.standard_number ? lic.standard_number.replace(/:.*/, '') : ''));
    const coverage = relevantClauses.length > 0 ? (myDocs.length / relevantClauses.length) : myDocs.length > 0 ? 1 : 0;
    const evScore = Math.min(20, Math.round(coverage * 20));

    // Gap free score
    const allGaps = await db.getTable('compliance_gaps');
    const openGaps = allGaps.filter(g => g.manufacturer_id === manufacturer_id && g.status === 'OPEN').length;
    const gapScore = Math.max(0, 20 - openGaps * 5);

    // Risk score (inverted — lower risk = higher health)
    const riskScores = await db.getTable('risk_scores');
    const latestRisk = riskScores.filter(s => s.manufacturer_id === manufacturer_id).sort((a, b) => new Date(b.computed_at) - new Date(a.computed_at))[0];
    const riskHealth = latestRisk ? Math.max(0, Math.round(20 - Number(latestRisk.score) / 5)) : 10;

    // Renewal score
    const renewals = await db.getTable('renewals');
    const hasApprovedRenewal = renewals.some(r => r.license_id === manufacturer_id && r.status === 'APPROVED');
    const renewalScore = hasApprovedRenewal ? 20 : 0;

    const total = licScore + evScore + gapScore + riskHealth + renewalScore;

    let grade;
    if (total >= 90) grade = 'A+';
    else if (total >= 75) grade = 'A';
    else if (total >= 60) grade = 'B';
    else if (total >= 45) grade = 'C';
    else grade = 'F';

    return {
      manufacturer_id,
      total_score: total,
      max_score: 100,
      grade,
      breakdown: {
        license_validity: { score: licScore, max: 20, detail: licDetail },
        evidence_coverage: { score: evScore, max: 20, detail: `${myDocs.length} docs for ${relevantClauses.length} clauses` },
        gap_free: { score: gapScore, max: 20, detail: `${openGaps} open gaps × 5 pts penalty` },
        risk_profile: { score: riskHealth, max: 20, detail: latestRisk ? `Risk score: ${latestRisk.score}` : 'No risk score computed' },
        renewal_status: { score: renewalScore, max: 20, detail: hasApprovedRenewal ? 'Approved renewal on file' : 'No approved renewal' }
      },
      scored_at: new Date().toISOString()
    };
  }
}

module.exports = { ComplianceHealthScorer };
