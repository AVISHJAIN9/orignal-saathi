/**
 * C3 — Compliance Gap Analyzer
 * Tables: compliance_gaps, evidence_metadata, requirement_audits
 * Logic: Compares uploaded user evidence/specifications against normalized
 * standard requirements; computes pass/partial/fail per clause.
 */

const { db } = require('../database');

class ComplianceGapAnalyzer {
  async analyzeGaps(testingArg, standardArg) {
    let currentTesting = [];
    let standardNumber = 'IS 269:2015';

    if (typeof testingArg === 'object' && testingArg !== null && !Array.isArray(testingArg)) {
      currentTesting = testingArg.currentTesting || testingArg.tests || [];
      standardNumber = testingArg.standardNumber || testingArg.standard || standardNumber;
    } else {
      currentTesting = Array.isArray(testingArg) ? testingArg : (testingArg ? [testingArg] : []);
      standardNumber = standardArg || standardNumber;
    }

    // Normalized standard requirements checklist
    const standardClauses = [
      { clause: 'Clause 6.1', title: '7-Day Compressive Strength Test', category: 'TESTING', required: true },
      { clause: 'Clause 6.2', title: '28-Day Compressive Strength Verification', category: 'TESTING', required: true },
      { clause: 'Clause 7.1', title: 'Soundness by Le Chatelier & Autoclave Method', category: 'TESTING', required: true },
      { clause: 'Clause 8.1', title: 'Initial and Final Setting Time Determination', category: 'TESTING', required: true },
      { clause: 'Clause 9.1', title: 'In-House Testing Laboratory Setup & Equipment Calibration', category: 'FACTORY_QC', required: true },
      { clause: 'Clause 10.1', title: 'Scheme of Inspection and Testing (SIT) Agreement', category: 'DOCUMENTATION', required: true },
      { clause: 'Clause 11.1', title: 'Raw Material Test Certificates (Clinker/Gypsum/Flyash)', category: 'DOCUMENTATION', required: true },
      { clause: 'Clause 12.1', title: 'ISI Standard Mark Package Labeling Design & Mockup', category: 'PACKAGING', required: true }
    ];

    // Evaluate evidence / tests
    const normalizedTests = currentTesting.map(t => String(t).toLowerCase());
    const gaps = [];
    let passed = 0;
    let partial = 0;
    let failed = 0;

    for (const item of standardClauses) {
      const match = normalizedTests.some(t =>
        t.includes(item.clause.toLowerCase()) ||
        t.includes(item.title.toLowerCase()) ||
        (item.title.includes('Compressive') && t.includes('compressive')) ||
        (item.title.includes('Setting') && t.includes('setting')) ||
        (item.title.includes('Soundness') && t.includes('soundness')) ||
        (item.title.includes('Laboratory') && t.includes('in-house'))
      );

      if (match) {
        passed++;
      } else {
        if (item.category === 'DOCUMENTATION') {
          partial++;
          gaps.push({
            clause_number: item.clause,
            clause_title: item.title,
            severity: 'MEDIUM',
            gap_description: `Missing mandatory documented evidence for ${item.title}.`,
            recommendation: `Upload certified copy or signed manufacturer undertaking satisfying ${item.clause}.`
          });
        } else {
          failed++;
          gaps.push({
            clause_number: item.clause,
            clause_title: item.title,
            severity: item.category === 'TESTING' ? 'CRITICAL' : 'HIGH',
            gap_description: `Required statutory evaluation for ${item.title} has not been completed.`,
            recommendation: `Conduct testing at an accredited BIS/NABL lab or calibrate factory testing apparatus for ${item.clause}.`
          });
        }
      }
    }

    const total = standardClauses.length;
    const complianceScore = Number(((passed / total) * 100).toFixed(2));

    // Persist audit result into requirement_audits table
    const auditId = 'audit_' + Date.now();
    await db.insert('requirement_audits', {
      id: auditId,
      standard_number: standardNumber,
      total_clauses: total,
      passed_clauses: passed,
      partial_clauses: partial,
      failed_clauses: failed,
      compliance_percentage: complianceScore,
      audited_at: new Date().toISOString()
    });

    // Record open gaps into compliance_gaps table
    for (const g of gaps) {
      await db.insert('compliance_gaps', {
        id: 'gap_' + Math.random().toString(36).substring(2, 9),
        audit_id: auditId,
        standard_number: standardNumber,
        clause_number: g.clause_number,
        clause_title: g.clause_title,
        severity: g.severity,
        gap_description: g.gap_description,
        recommendation: g.recommendation,
        status: 'OPEN'
      });
    }

    return {
      audit_id: auditId,
      standard_number: standardNumber,
      overall_compliance_percentage: complianceScore,
      status: complianceScore >= 80 ? 'READY_FOR_AUDIT' : (complianceScore >= 50 ? 'SUBSTANTIAL_GAPS' : 'CRITICAL_NON_COMPLIANCE'),
      total_clauses_evaluated: total,
      clause_breakdown: {
        passed,
        partial,
        failed
      },
      unmet_gaps: gaps,
      summary: `Evaluated ${total} statutory clauses under ${standardNumber}: ${passed} compliant, ${gaps.length} actionable compliance gaps identified.`,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { ComplianceGapAnalyzer };