/**
 * Phase 2 C-Series A-tier Anchor Tests — C14, C16, C17, C18, C25, C35, C36, C40
 * Run: node scripts/test_c_phase2_real.js
 */

const assert = require('assert');
const { db } = require('../c/database');

const { RenewalIntelligenceService }     = require('../c/C14_renewal_&_expiry_intelligence');
const { EvidenceBasedAnswerBuilder }     = require('../c/C16_evidence_based_answer_builder');
const { SafetyGuardrailService }         = require('../c/C17_saathi_refuses_to_guess');
const { HumanEscalationService }         = require('../c/C18_human_escalation_packet');
const { ClauseRequirementExtractor }     = require('../c/C25_clause_level_requirement_extraction');
const { ComplianceEvidenceVaultService } = require('../c/C35_compliance_evidence_vault');
const { EvidenceFreshnessService }       = require('../c/C36_evidence_freshness___expiry_detection');
const { RiskHeatmapService }             = require('../c/C40_compliance_risk_heatmap');

let passed = 0; let failed = 0;
async function check(name, fn) {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.error(`  ✗ ${name}: ${err.message}`); failed++; }
}

async function runTests() {
  console.log('====================================================');
  console.log('SAATHI PHASE 2 C-SERIES (A-TIER ANCHORS) REAL TESTS');
  console.log('====================================================\n');

  // ── C14: Renewal Intelligence ─────────────────────────────────────
  console.log('1. C14 — Renewal & Expiry Intelligence');
  const c14 = new RenewalIntelligenceService();
  await check('C14: forecastExpiry returns real days_until_expiry (not hardcoded 457)', async () => {
    const r = await c14.forecastExpiry('CM/L-8400192831');
    assert(typeof r.days_until_expiry === 'number', 'must be a number');
    assert.notStrictEqual(r.days_until_expiry, 457, 'must NOT be the hardcoded stub value 457');
    assert(r.expiry_date, 'must have expiry_date');
    assert(r.renewal_window_status, 'must have renewal_window_status');
    assert(r.computed_at, 'must have computed_at timestamp');
  });
  await check('C14: renewal_window_status consistent with days_until_expiry', async () => {
    const r = await c14.forecastExpiry('CM/L-8400192831');
    if (r.days_until_expiry < 0) assert.strictEqual(r.renewal_window_status, 'EXPIRED');
    else if (r.days_until_expiry <= 30) assert.strictEqual(r.renewal_window_status, 'CRITICAL_RENEWAL_WINDOW');
    else if (r.days_until_expiry <= 90) assert.strictEqual(r.renewal_window_status, 'HIGH_PRIORITY_RENEWAL');
  });
  await check('C14: unknown license throws', async () => {
    let threw = false;
    try { await c14.forecastExpiry('CM/L-NONEXISTENT-99999'); } catch { threw = true; }
    assert(threw, 'must throw for unknown license');
  });
  await check('C14: getUpcomingRenewals returns structured result', async () => {
    const r = await c14.getUpcomingRenewals(365);
    assert(typeof r.count === 'number');
    assert(Array.isArray(r.upcoming));
    for (const item of r.upcoming) {
      assert(item.days_until_expiry >= 0, 'only non-expired should appear');
      assert(item.days_until_expiry <= 365);
    }
  });

  // ── C16: Evidence-Based Answer Builder ───────────────────────────
  console.log('\n2. C16 — Evidence-Based Answer Builder');
  const c16 = new EvidenceBasedAnswerBuilder();
  await check('C16: grounded claim matched to clause_requirements', async () => {
    const r = await c16.answerQuery('What is the compressive strength requirement for IS 269?', [
      { claim: 'Compressive strength at 28 days shall not be less than 43 MPa', standard_id: 'IS 269:2015', clause_number: 'Clause 6.2' }
    ]);
    assert(r.grounded_claim_count >= 1, 'must ground at least one claim');
    assert.strictEqual(r.ungrounded_claim_count, 0, 'must have no ungrounded claims for valid clause');
    assert(r.provenance[0].source_ref, 'must have source_ref');
    assert(r.provenance[0].is_grounded, 'must be grounded');
  });
  await check('C16: ungrounded claim flagged (not silently passed)', async () => {
    const r = await c16.answerQuery('What about IS 9999?', [
      { claim: 'Some fabricated claim', standard_id: 'IS 9999:NONEXISTENT', clause_number: 'Clause X.1' }
    ]);
    assert.strictEqual(r.ungrounded_claim_count, 1, 'must flag ungrounded claim');
    assert(r.warning, 'must include warning message');
  });
  await check('C16: attachProvenance inserts real provenance rows', async () => {
    const r = await c16.attachProvenance('msg_test_001', [
      { claim: 'Cement must meet 28-day strength', standard_id: 'IS 269:2015' }
    ]);
    assert(r.provenance_attached >= 1);
    const stored = await db.getTable('answer_provenance');
    const row = stored.find(p => p.answer_id === 'msg_test_001');
    assert(row, 'provenance row must be in database');
  });

  // ── C17: SAATHI Refuses to Guess ──────────────────────────────────
  console.log('\n3. C17 — SAATHI Refuses to Guess (Confidence Guardrail)');
  const c17 = new SafetyGuardrailService();
  await check('C17: high confidence score yields ANSWER decision', async () => {
    // Seed a confidence threshold if none exist
    const thresholds = await db.getTable('confidence_thresholds');
    if (thresholds.length === 0) {
      await db.insert('confidence_thresholds', { id: 'ct_global', intent: 'GLOBAL', minimum_score: 0.65, is_default: true });
    }
    const r = await c17.evaluateSafety('msg_high_conf', 0.90, 'COMPLIANCE_QUERY');
    assert.strictEqual(r.decision, 'ANSWER', 'high confidence must ANSWER');
    assert(r.log_id, 'must log the decision');
  });
  await check('C17: low confidence score yields DECLINE decision', async () => {
    const r = await c17.evaluateSafety('msg_low_conf', 0.30, 'COMPLIANCE_QUERY');
    assert.strictEqual(r.decision, 'DECLINE', 'low confidence must DECLINE');
    assert.strictEqual(r.next_action, 'ESCALATE_TO_HUMAN_VIA_C18');
  });
  await check('C17: decision logged in confidence_audit_log', async () => {
    await c17.evaluateSafety('msg_audit_check', 0.50, 'UNKNOWN');
    const log = await c17.getAuditLog('msg_audit_check');
    assert(Array.isArray(log));
    assert(log.length >= 1, 'must have at least one log entry');
    assert(log[0].score !== undefined, 'log must include score');
    assert(log[0].decision, 'log must include decision');
  });

  // ── C18: Human Escalation Packet ─────────────────────────────────
  console.log('\n4. C18 — Human Escalation Packet');
  const c18 = new HumanEscalationService();
  let packetId;
  await check('C18: createPacket inserts into escalation_packets', async () => {
    const r = await c18.createPacket({
      question: 'Does IS 1489 apply to my PPC blend?',
      context_chunks: ['PPC is defined under IS 1489:1991 Part 1 as blended cement...'],
      confidence_score: 0.28,
      reason: 'Ambiguous product classification — C17 DECLINED',
      priority: 'HIGH'
    });
    assert(r.success);
    packetId = r.packet_id;
    assert(packetId, 'must return packet_id');
    assert.strictEqual(r.packet.status, 'OPEN');
    assert.strictEqual(r.packet.priority, 'HIGH');
  });
  await check('C18: getPacket retrieves stored packet', async () => {
    if (!packetId) return;
    const p = await c18.getPacket(packetId);
    assert.strictEqual(p.id, packetId);
    assert(Array.isArray(p.context_chunks), 'context_chunks must be array');
  });
  await check('C18: assignToExpert changes status to ASSIGNED', async () => {
    if (!packetId) return;
    const p = await c18.assignToExpert(packetId, 'expert_patel');
    assert.strictEqual(p.status, 'ASSIGNED');
    assert.strictEqual(p.assigned_expert_id, 'expert_patel');
  });

  // ── C25: Clause Extraction ────────────────────────────────────────
  console.log('\n5. C25 — Clause-Level Requirement Extraction');
  const c25 = new ClauseRequirementExtractor();
  await check('C25: extracts real clauses for IS 269:2015', async () => {
    const r = await c25.extract('IS 269:2015');
    assert(r.total_clauses >= 3, 'must return at least 3 real clauses');
    for (const c of r.clauses) {
      assert(c.clause_number, 'every clause must have clause_number');
      assert(c.requirement_text, 'every clause must have requirement_text');
      assert(!c.clause_number.includes('FABRICATED'), 'must not have fabricated clauses');
    }
  });
  await check('C25: clauses sorted by clause number', async () => {
    const r = await c25.extract('IS 269:2015');
    if (r.clauses.length < 2) return;
    for (let i = 1; i < r.clauses.length; i++) {
      const prev = parseFloat(r.clauses[i-1].clause_number.replace(/[^0-9.]/g, '') || '0');
      const curr = parseFloat(r.clauses[i].clause_number.replace(/[^0-9.]/g, '') || '0');
      assert(curr >= prev, `clauses must be sorted: ${r.clauses[i-1].clause_number} before ${r.clauses[i].clause_number}`);
    }
  });
  await check('C25: unknown standard returns empty (not fabricated clauses)', async () => {
    const r = await c25.extract('IS 99999:NONEXISTENT');
    assert.strictEqual(r.total_clauses, 0, 'must return 0 for unknown standard — never fabricate');
    assert(r.message, 'must explain why no clauses were found');
  });

  // ── C35: Evidence Vault ───────────────────────────────────────────
  console.log('\n6. C35 — Compliance Evidence Vault');
  const c35 = new ComplianceEvidenceVaultService();
  let evidenceId;
  await check('C35: upload creates evidence document with version 1', async () => {
    const r = await c35.upload({ manufacturer_id: 'CORP-BHARAT-MINERALS', requirement_id: 'req_test_01', file_ref: 'vault/test_v1.pdf' });
    assert(r.success);
    assert.strictEqual(r.version, 1);
    assert(r.is_new_document, 'first upload must be a new document');
    evidenceId = r.evidence_id;
  });
  await check('C35: second upload supersedes v1 and creates v2', async () => {
    if (!evidenceId) return;
    const r = await c35.upload({ manufacturer_id: 'CORP-BHARAT-MINERALS', requirement_id: 'req_test_01', file_ref: 'vault/test_v2.pdf' });
    assert.strictEqual(r.version, 2, 'version must increment to 2');
    assert(!r.is_new_document, 'must not be new — same requirement');
    // Verify old version is now superseded
    const history = await c35.getVersionHistory(evidenceId);
    const superseded = history.filter(v => v.superseded);
    assert(superseded.length >= 1, 'must have at least one superseded version');
    const current = history.filter(v => !v.superseded);
    assert.strictEqual(current.length, 1, 'must have exactly one current version');
  });
  await check('C35: getEvidence returns only non-superseded version', async () => {
    const r = await c35.getEvidence('req_test_01', 'CORP-BHARAT-MINERALS');
    assert(r.length >= 1);
    for (const ev of r) {
      assert(ev.current_version_record === null || !ev.current_version_record.superseded, 'current version must not be superseded');
    }
  });

  // ── C36: Evidence Freshness ───────────────────────────────────────
  console.log('\n7. C36 — Evidence Freshness / Expiry Detection');
  const c36 = new EvidenceFreshnessService();
  await check('C36: getExpiring returns structured result', async () => {
    const r = await c36.getExpiring(365);
    assert(typeof r.expiring_soon_count === 'number');
    assert(typeof r.already_expired_count === 'number');
    assert(Array.isArray(r.expiring_soon));
    assert(Array.isArray(r.already_expired));
  });
  await check('C36: checkFreshness returns status for known evidence', async () => {
    // Check against the seeded evidence_validity row
    const validityRows = await db.getTable('evidence_validity');
    if (validityRows.length === 0) {
      console.log('    (no evidence_validity rows seeded — skipping)');
      return;
    }
    const r = await c36.checkFreshness(validityRows[0].evidence_id);
    assert(r.freshness_status, 'must return a freshness_status');
    assert(typeof r.days_until_expiry === 'number');
  });
  await check('C36: runExpiryNotificationJob is idempotent', async () => {
    const r1 = await c36.runExpiryNotificationJob(365);
    const r2 = await c36.runExpiryNotificationJob(365);
    assert(typeof r1.notifications_dispatched === 'number');
    assert(r2.notifications_skipped >= r1.notifications_dispatched, 'second run must skip what first sent');
  });

  // ── C40: Compliance Risk Heatmap ──────────────────────────────────
  console.log('\n8. C40 — Compliance Risk Heatmap (Dynamic Score)');
  const c40 = new RiskHeatmapService();
  await check('C40: computeRiskScore returns score with contributing factors', async () => {
    const r = await c40.computeRiskScore('CORP-BHARAT-MINERALS', 'PROD_OPC_43');
    assert(typeof r.score === 'number', 'score must be a number');
    assert(r.risk_tier, 'must have a risk tier');
    assert(r.contributing_factors, 'must have contributing_factors');
    assert(r.formula, 'must document the formula used');
  });
  await check('C40: adding open gap increases risk score', async () => {
    const before = await c40.computeRiskScore('TEST_MFR_RISK', null);
    await c40.addComplianceGap({ manufacturer_id: 'TEST_MFR_RISK', gap_description: 'Missing calibration cert for compression tester' });
    const after = await c40.computeRiskScore('TEST_MFR_RISK', null);
    assert(after.score > before.score, `score must increase after adding open gap: before=${before.score} after=${after.score}`);
    assert.strictEqual(after.contributing_factors.open_gaps_count, before.contributing_factors.open_gaps_count + 1);
  });
  await check('C40: getHeatmap returns sorted descending by score', async () => {
    const heatmap = await c40.getHeatmap();
    assert(Array.isArray(heatmap));
    for (let i = 1; i < heatmap.length; i++) {
      assert(heatmap[i-1].score >= heatmap[i].score, 'heatmap must be sorted descending by score');
    }
  });

  // ── Summary ───────────────────────────────────────────────────────
  console.log('\n====================================================');
  console.log(`PHASE 2 C-SERIES A-TIER TESTS: ${passed} passed, ${failed} failed`);
  if (failed === 0) console.log('ALL PHASE 2 TESTS PASSED ✓');
  else console.log(`⚠ ${failed} test(s) failed`);
  console.log('====================================================');
  if (failed > 0) process.exit(1);
}

runTests().catch(err => { console.error('\n❌ Phase 2 Error:', err); process.exit(1); });
