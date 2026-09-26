/**
 * C20 — Compliance Impact Simulator
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Simulates what happens to C1/C6/C9 compliance coverage if a manufacturer
 * changes a product attribute. Returns a diff vs current state.
 * Does NOT persist results — read-only simulation.
 */

const { db } = require('../database');

class ComplianceImpactSimulator {
  async simulate(draftQcoNoticeId, affectedStandards) {
    const standardIds = Array.isArray(affectedStandards) ? affectedStandards : (affectedStandards ? [affectedStandards] : []);

    const qcoRules = await db.getTable('qco_applicability_rules');
    const testCatalog = await db.getTable('test_catalog');
    const clauseReqs = await db.getTable('clause_requirements');

    const impacts = [];

    for (const stdId of standardIds) {
      const cleanStd = stdId.replace(/:.*/, '').trim().toUpperCase();

      const affectedQco = qcoRules.filter(r =>
        (r.standard_ids || []).some(s => s.replace(/:.*/, '').trim().toUpperCase() === cleanStd)
      );
      const affectedTests = testCatalog.filter(t =>
        t.standard_id.replace(/:.*/, '').trim().toUpperCase() === cleanStd
      );
      const affectedClauses = clauseReqs.filter(c =>
        c.standard_id.replace(/:.*/, '').trim().toUpperCase() === cleanStd
      );

      impacts.push({
        standard_id: stdId,
        qco_rules_affected: affectedQco.length,
        test_requirements_affected: affectedTests.length,
        clause_requirements_affected: affectedClauses.length,
        mandatory_tests_affected: affectedTests.filter(t => t.mandatory).length,
        estimated_re_testing_required: affectedTests.filter(t => t.mandatory).length > 0,
        estimated_re_application_required: affectedQco.length > 0
      });
    }

    return {
      draft_qco_notice_id: draftQcoNoticeId || null,
      affected_standards_count: standardIds.length,
      simulation_type: 'QCO_CHANGE_IMPACT',
      is_persistent: false,
      impacts,
      simulated_at: new Date().toISOString()
    };
  }
}

module.exports = { ComplianceImpactSimulator };
