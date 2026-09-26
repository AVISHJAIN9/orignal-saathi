/**
 * Comprehensive Test Suite for Task 7 (C1 through C8)
 * Verifies relational schema, statutory tables, queries, and business logic
 */

const assert = require('assert');
const {
  QCOApplicabilityEngine,
  StandardRevisionDiffEngine,
  ComplianceGapAnalyzer,
  ApplicationReadinessCalculator,
  SchemeSelectorService,
  ProductComplianceChainResolver,
  IntelligentLaboratoryMatcher,
  RegulatoryChangeAlertService
} = require('../c');
const { db } = require('../c/database');

async function runTests() {
  console.log('====================================================');
  console.log('STARTING C-SERIES (C1 - C8) RELATIONAL TESTS');
  console.log('====================================================\n');

  // Verify DB tables exist
  console.log('1. Checking Statutory Relational Tables in Schema...');
  const expectedTables = [
    'qcos', 'qco_notifications', 'qco_product_mappings',
    'standard_versions', 'clause_diffs', 'snapshot_sources',
    'compliance_gaps', 'evidence_metadata', 'requirement_audits',
    'readiness_scores', 'readiness_blockers', 'readiness_history',
    'scheme_rules', 'scheme_eligibility_criteria',
    'compliance_graph_nodes', 'compliance_graph_edges',
    'labs', 'lab_test_scopes', 'lab_locations',
    'regulatory_change_events', 'user_subscriptions'
  ];

  for (const table of expectedTables) {
    const rows = await db.getTable(table);
    assert(Array.isArray(rows), `Table ${table} should return an array`);
    console.log(`  ✓ Table '${table}' verified (${rows.length} records)`);
  }

  // C1: QCO Applicability Engine
  console.log('\n2. Testing C1: QCO Applicability Engine...');
  const c1 = new QCOApplicabilityEngine();
  const c1Res1 = await c1.check('Ordinary Portland Cement 43 Grade', '25232910');
  assert.strictEqual(c1Res1.is_qco_mandatory, true);
  assert.strictEqual(c1Res1.mandatory_standard, 'IS 269:2015');
  assert.strictEqual(c1Res1.status, 'MANDATORY_ENFORCED');
  console.log('  ✓ C1 Enforced QCO Check passed:', c1Res1.verdict);

  const c1Res2 = await c1.check('Utility-Interconnected Photovoltaic Inverters');
  assert.strictEqual(c1Res2.is_qco_mandatory, true);
  assert(c1Res2.status === 'MANDATORY_ENFORCED' || c1Res2.status === 'UPCOMING_MANDATORY');
  console.log('  ✓ C1 Solar QCO Check passed (Scheme: ' + c1Res2.scheme + ')');

  const c1Res3 = await c1.check('Handmade Woolen Carpet');
  assert.strictEqual(c1Res3.is_qco_mandatory, false);
  assert.strictEqual(c1Res3.status, 'VOLUNTARY_SCHEME');
  console.log('  ✓ C1 Voluntary Standard Check passed');

  // C2: Standard Revision / What Changed
  console.log('\n3. Testing C2: Standard Revision & Clause Diff Engine...');
  const c2 = new StandardRevisionDiffEngine();
  const c2Res = await c2.compareRevisions('IS 269');
  assert.strictEqual(c2Res.standard_number, 'IS 269');
  assert.strictEqual(c2Res.current_version, '2015');
  assert(c2Res.impacted_clauses.length > 0);
  assert(c2Res.severity_summary.critical >= 1);
  console.log(`  ✓ C2 Revision Diff passed: ${c2Res.impacted_clauses.length} clause(s) impacted. Critical: ${c2Res.severity_summary.critical}`);

  // C3: Compliance Gap Analyzer
  console.log('\n4. Testing C3: Compliance Gap Analyzer...');
  const c3 = new ComplianceGapAnalyzer();
  const c3Res = await c3.analyzeGaps(['Compressive Strength Test', 'Setting Time'], 'IS 269:2015');
  assert(typeof c3Res.overall_compliance_percentage === 'number');
  assert(c3Res.unmet_gaps.length > 0);
  assert(c3Res.audit_id.startsWith('audit_'));
  console.log(`  ✓ C3 Gap Analysis passed: Compliance ${c3Res.overall_compliance_percentage}%, identified ${c3Res.unmet_gaps.length} gaps.`);

  // C4: Application Readiness Score
  console.log('\n5. Testing C4: Application Readiness Score...');
  const c4 = new ApplicationReadinessCalculator();
  const c4Res = await c4.calculateScore({
    nablTestReportUploaded: true,
    inHouseTestRecords: true,
    calibrationCertificates: true,
    qcPersonnelQualified: true,
    plantLayout: true,
    processFlowchart: true,
    machineryList: true,
    panGstUdyam: true,
    brandAuthorization: false
  }, 'demo_manufacturer');
  assert(c4Res.readiness_score > 75);
  assert.strictEqual(c4Res.status, 'READY_TO_APPLY');
  console.log(`  ✓ C4 Readiness Score passed: ${c4Res.readiness_percentage} (${c4Res.status})`);

  // C5: Intelligent Scheme Selector
  console.log('\n6. Testing C5: Intelligent Scheme Selector...');
  const c5 = new SchemeSelectorService();
  const c5Res1 = await c5.selectScheme('lithium battery', 'INDIA');
  assert.strictEqual(c5Res1.scheme_code, 'CRS');
  console.log('  ✓ C5 Electronics/Battery route passed: ' + c5Res1.recommended_scheme);

  const c5Res2 = await c5.selectScheme('cement', 'GERMANY', 'OVERSEAS_IMPORTER');
  assert.strictEqual(c5Res2.scheme_code, 'FMCS');
  console.log('  ✓ C5 Foreign manufacturer route passed: ' + c5Res2.recommended_scheme);

  // C6: Product Compliance Chain Resolver (Graph)
  console.log('\n7. Testing C6: Product -> Standard -> Scheme -> Test -> Lab Chain...');
  const c6 = new ProductComplianceChainResolver();
  const c6Res = await c6.resolveChain('Ordinary Portland Cement');
  assert(c6Res.chain.standards.length > 0);
  assert(c6Res.chain.schemes.length > 0);
  assert(c6Res.chain.required_tests.length > 0);
  assert(c6Res.chain.accredited_labs.length > 0);
  console.log(`  ✓ C6 Graph traversal passed: ${c6Res.chain.standards.length} standard(s), ${c6Res.chain.required_tests.length} tests, ${c6Res.chain.accredited_labs.length} labs.`);

  // C7: Intelligent Laboratory Matcher
  console.log('\n8. Testing C7: Intelligent Laboratory Matcher...');
  const c7 = new IntelligentLaboratoryMatcher();
  const c7Res = await c7.matchLabs('IS 269:2015', 'Ghaziabad');
  assert(c7Res.matched_laboratories.length > 0);
  assert.strictEqual(c7Res.matched_laboratories[0].city, 'Ghaziabad');
  console.log(`  ✓ C7 Lab Matcher passed: ${c7Res.matched_laboratories.length} lab(s) matched. Top match: ${c7Res.matched_laboratories[0].lab_name}`);

  // C8: Regulatory Change Alerts
  console.log('\n9. Testing C8: Regulatory Change Alerts & Email Dispatch...');
  const c8 = new RegulatoryChangeAlertService();
  const c8Alerts = await c8.getAlerts('cement');
  assert(c8Alerts.total_active_alerts > 0);
  console.log(`  ✓ C8 Query Alerts passed: ${c8Alerts.total_active_alerts} alert(s) found for cement.`);

  const c8Dispatch = await c8.publishAndNotify({
    type: 'STANDARD_REVISION',
    subject: 'IS 269:2024 Gazette Notification',
    summary: 'Updated Blaine fineness and tensile parameters gazetted by DPIIT.',
    impactLevel: 'CRITICAL'
  });
  assert.strictEqual(c8Dispatch.status, 'PUBLISHED_AND_DISPATCHED');
  assert(c8Dispatch.dispatched_emails_count > 0);
  console.log(`  ✓ C8 Notification Dispatch passed: Dispatched ${c8Dispatch.dispatched_emails_count} alert email(s) via real G5 TransactionalEmailService.`);

  console.log('\n====================================================');
  console.log('ALL C-SERIES (C1 - C8) RELATIONAL TESTS PASSED! (100%)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('\n❌ C-Series Test Failed:', err);
  process.exit(1);
});
