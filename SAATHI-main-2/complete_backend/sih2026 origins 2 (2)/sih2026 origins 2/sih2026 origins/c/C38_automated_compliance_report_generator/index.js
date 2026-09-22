/**
 * C38 — Automated Compliance Report Generator
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Assembles a full compliance report by joining C19 passport + C33 health + C40 risk + C37 trend.
 * Marks report as DRAFT — never auto-submits.
 *
 * Tables: compliance_reports (c/database.js)
 */

const { db } = require('../database');

class AutomatedComplianceReporter {
  async generateReport(manufacturer_id, reportingPeriod) {
    if (!manufacturer_id) throw new Error('manufacturer_id is required');
    const period = reportingPeriod || { year: new Date().getFullYear(), quarter: Math.ceil((new Date().getMonth() + 1) / 3) };

    // Pull from sibling services (direct DB access to avoid circular deps)
    const licRecords = await db.getTable('licensing_records');
    const lic = licRecords.find(l => l.license_id === manufacturer_id);

    const allGaps = await db.getTable('compliance_gaps');
    const openGaps = allGaps.filter(g => g.manufacturer_id === manufacturer_id && g.status === 'OPEN');
    const closedGaps = allGaps.filter(g => g.manufacturer_id === manufacturer_id && g.status === 'CLOSED');

    const evidenceDocs = await db.getTable('evidence_documents');
    const myEvidence = evidenceDocs.filter(e => e.manufacturer_id === manufacturer_id);

    const riskScores = await db.getTable('risk_scores');
    const latestRisk = riskScores.filter(s => s.manufacturer_id === manufacturer_id).sort((a, b) => new Date(b.computed_at || 0) - new Date(a.computed_at || 0))[0];

    const snapshots = await db.getTable('compliance_health_snapshots');
    const mySnaps = snapshots.filter(s => s.manufacturer_id === manufacturer_id).slice(-2);

    const report = {
      id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      manufacturer_id,
      reporting_period: period,
      status: 'DRAFT', // Never auto-submits
      sections: {
        license_status: lic ? { license_id: lic.license_id, status: lic.status, valid_till: lic.valid_till } : { error: 'No license found' },
        compliance_gaps: { open: openGaps.length, closed: closedGaps.length, detail: openGaps.slice(0, 5) },
        evidence_status: { total_documents: myEvidence.length },
        risk_profile: latestRisk ? { score: latestRisk.score, risk_tier: latestRisk.risk_tier } : { note: 'No risk score' },
        health_trend: mySnaps.length >= 2 ? { from: mySnaps[0].score, to: mySnaps[mySnaps.length - 1].score } : { note: 'Insufficient snapshots for trend' }
      },
      generated_at: new Date().toISOString()
    };

    await db.insert('compliance_reports', report);
    return { success: true, report_id: report.id, status: 'DRAFT', report };
  }
}

module.exports = { AutomatedComplianceReporter };
