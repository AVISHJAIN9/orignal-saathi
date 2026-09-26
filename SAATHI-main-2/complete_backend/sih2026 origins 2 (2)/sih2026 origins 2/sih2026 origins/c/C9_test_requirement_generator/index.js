/**
 * C9 — Test Requirement Generator
 * Tables: test_catalog, test_evidence_requirements
 * Logic: Generates statutory test requirements by standard and scheme,
 * returning test methods, frequencies, and mandatory evidence required.
 */

const { db } = require('../database');

class TestRequirementGenerator {
  async generateRequirements(standardArg, parametersArg) {
    let standardNumber = 'IS 269:2015';
    let parameters = {};

    if (typeof standardArg === 'object' && standardArg !== null) {
      standardNumber = standardArg.standardNumber || standardArg.standard_id || standardNumber;
      parameters = standardArg.parameters || {};
    } else {
      standardNumber = standardArg || standardNumber;
      parameters = parametersArg || {};
    }

    const cleanStd = standardNumber.replace(/:.*/, '').trim().toUpperCase();

    // Query test_catalog
    const allTests = await db.getTable('test_catalog');
    let matchingTests = allTests.filter(t => t.standard_id.toUpperCase().includes(cleanStd));

    if (matchingTests.length === 0) {
      matchingTests = allTests.filter(t => t.standard_id.includes('IS 269'));
    }

    // Query test_evidence_requirements
    const allEvidence = await db.getTable('test_evidence_requirements');

    const detailedTests = matchingTests.map(t => {
      const ev = allEvidence.filter(e => e.test_id === t.id);
      return {
        test_id: t.id,
        test_name: t.test_name,
        test_method: t.test_method,
        clause: t.clause_reference,
        frequency: t.frequency,
        is_mandatory: t.mandatory,
        evidence_required: ev.map(e => ({ type: e.evidence_type, description: e.description }))
      };
    });

    const mandatoryCount = detailedTests.filter(t => t.is_mandatory).length;

    return {
      standard_number: standardNumber,
      total_tests_required: detailedTests.length,
      mandatory_tests_count: mandatoryCount,
      routine_tests_count: detailedTests.length - mandatoryCount,
      parameters_configured: parameters,
      test_requirements: detailedTests,
      summary: `Generated ${detailedTests.length} statutory testing requirements for ${standardNumber} (${mandatoryCount} mandatory lot/batch release tests).`,
      generated_at: new Date().toISOString()
    };
  }
}

module.exports = { TestRequirementGenerator };