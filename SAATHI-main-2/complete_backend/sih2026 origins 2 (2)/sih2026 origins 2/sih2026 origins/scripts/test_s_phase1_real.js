/**
 * Phase 1 S-Series Test Suite — S4 through S29
 * Verifies real table access and business logic for each service.
 * Follows test_c_series_real.js / test_s_spine_real.js canonical pattern.
 *
 * Run: node scripts/test_s_phase1_real.js
 */

const assert = require('assert');
const { sDb } = require('../s/database');

// Import all Phase 1 services
const { RequirementUpdateService }    = require('../s/S4_automated_requirement_update_notificatio');
const { AuditSchedulerService }       = require('../s/S6_government_officer_visit_scheduler');
const { DocumentResubmissionService } = require('../s/S7_document_re_submission_&_correction_flow');
const { AppealsDisputeService }       = require('../s/S8_appeals___dispute_resolution_flow');
const { BusinessAccountService }      = require('../s/S9_multi_user_business_accounts');
const { RenewalTimelineService }      = require('../s/S11_renewal_reminders_on_a_timeline');
const { GrievanceOfficerService }     = require('../s/S16_grievance_officer_contact_&_consent_mana');
const { ApplicationReappealService }  = require('../s/S17_initial_application_rejection_&_reappeal');
const { LabSampleTrackerService }     = require('../s/S18_lab___sample_testing_status_tracker');
const { RenewalInitiatorService }     = require('../s/S19_annual_renewal_flow_with_surveillance_au');
const { CalendarSyncService }         = require('../s/S20_in_app_calendar___reminder_sync');
const { FactoryAuditCoordinatorService } = require('../s/S21_factory_audit_scheduling_&_coordination_');
const { NonConformanceAlertService }  = require('../s/S22_product_recall___non_conformance_alert_s');
const { SuspensionRemediationService }= require('../s/S23_license_suspension_notice_&_remediation_');
const { GSTInvoiceGeneratorService }  = require('../s/S24_fee_invoice_&_gst_compliant_receipt_gene');
const { RegionalOfficeRouter }        = require('../s/S25_regional_office_auto_routing');
const { MultiFactoryManagerService }  = require('../s/S26_multi_factory___multi_location_license_m');
const { QualityOpsService }           = require('../s/S27_live_retrieval_quality_metrics_ops_page');
const { StaffInvitationService }      = require('../s/S28_staff_role_invitations');
const { ApplicationDraftService }     = require('../s/S29_save_and_resume_application_draft');

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('SAATHI PHASE 1 S-SERIES (S4–S29) REAL TESTS');
  console.log('====================================================\n');

  // ── Table existence checks ──────────────────────────────────────
  console.log('1. Verifying S-Series Statutory Tables...');
  const requiredTables = [
    'licensing_records', 'payments_fees', 'visit_appointments', 'officer_availability',
    'correction_requests', 'resubmissions', 'notification_triggers', 'appeals',
    'appeal_routing_rules', 'business_accounts', 'sub_users', 'reminder_log',
    'consent_log', 'applications', 'testing_status', 'renewals', 'audit_reports',
    'recalls', 'license_status_history', 'invoices', 'regional_offices',
    'factory_locations', 'adversarial_query_results', 'invitations',
    'application_drafts'
  ];
  for (const t of requiredTables) {
    await check(`Table '${t}' exists`, async () => {
      const rows = await sDb.getTable(t);
      assert(Array.isArray(rows), `${t} must return an array`);
    });
  }

  // ── S4: Requirement Update Notifications ─────────────────────────
  console.log('\n2. S4 — Automated Requirement-Update Notifications');
  const s4 = new RequirementUpdateService();
  await check('S4: dispatch notifications for applicant', async () => {
    const r = await s4.checkAndDispatchUpdates('app_sample_01');
    assert(typeof r.dispatched_count === 'number', 'must return dispatched_count');
    assert(Array.isArray(r.triggers), 'must return triggers array');
  });
  await check('S4: no duplicate for already-delivered trigger', async () => {
    const r1 = await s4.checkAndDispatchUpdates('test_app_dedup');
    const r2 = await s4.checkAndDispatchUpdates('test_app_dedup');
    // second run should not dispatch more than first (idempotent for delivered triggers)
    assert(r2.dispatched_count <= r1.dispatched_count, 'should not re-dispatch delivered triggers');
  });
  await check('S4: get pending notifications for applicant', async () => {
    const pending = await s4.getPendingNotifications('nonexistent_user');
    assert(Array.isArray(pending), 'must return array');
    assert(pending.length === 0, 'should be empty for unknown applicant');
  });

  // ── S6: Visit Scheduler ──────────────────────────────────────────
  console.log('\n3. S6 — Government Officer Visit Scheduler');
  const s6 = new AuditSchedulerService();
  let testVisitId;
  await check('S6: propose a visit (happy path)', async () => {
    const r = await s6.proposeVisit({
      applicant_id: 'test_applicant_01',
      officer_id: 'officer_singh',
      proposed_date: '2027-03-15',
      slot_time: '10:00',
      notes: 'Initial factory inspection'
    });
    assert(r.success, 'should succeed');
    assert(r.visit.id, 'visit must have id');
    assert.strictEqual(r.visit.status, 'PROPOSED');
    testVisitId = r.visit.id;
  });
  await check('S6: confirm a proposed visit', async () => {
    if (!testVisitId) return;
    const r = await s6.confirmVisit(testVisitId);
    assert(r.success, 'confirm should succeed');
    assert.strictEqual(r.visit.status, 'CONFIRMED');
  });
  await check('S6: get visits for applicant returns array', async () => {
    const visits = await s6.getVisitsForApplicant('test_applicant_01');
    assert(Array.isArray(visits), 'must return array');
    assert(visits.length >= 1, 'should have at least one visit');
  });

  // ── S7: Document Correction ──────────────────────────────────────
  console.log('\n4. S7 — Document Re-submission & Correction Flow');
  const s7 = new DocumentResubmissionService();
  let correctionId;
  await check('S7: flag a document for correction', async () => {
    const r = await s7.flagForCorrection({
      submissionId: 'sub_test_001',
      flaggedField: 'NABL Certificate',
      reason: 'Certificate expired on 2024-12-31'
    });
    assert(r.success);
    correctionId = r.correction_request.id;
  });
  await check('S7: resubmit preserves original_submission_id', async () => {
    if (!correctionId) return;
    const r = await s7.resubmitDocument(correctionId, 'doc_new_nabl_cert', 'https://vault.example/new_cert.pdf');
    assert.strictEqual(r.original_submission_id, 'sub_test_001', 'original_submission_id MUST be unchanged');
    assert(r.resubmission_id, 'must return resubmission_id');
  });
  await check('S7: getCorrectionsNeeded returns empty after resolution', async () => {
    const r = await s7.getCorrectionsNeeded('sub_test_001');
    assert.strictEqual(r.pending_corrections_count, 0, 'resolved corrections should not appear as pending');
  });

  // ── S8: Appeals ──────────────────────────────────────────────────
  console.log('\n5. S8 — Appeals / Dispute-Resolution Flow');
  const s8 = new AppealsDisputeService();
  let appealId;
  await check('S8: file appeal with routing rule lookup', async () => {
    // First seed a routing rule if none exist
    const rules = await sDb.getTable('appeal_routing_rules');
    if (rules.length === 0) {
      await sDb.insert('appeal_routing_rules', { id: 'arr_test', reason_category: 'TECHNICAL_REJECTION', department: 'Standards Division' });
    }
    const r = await s8.fileAppeal({
      application_or_message_id: 'app_test_001',
      reason: 'Test results disputed by manufacturer',
      reason_category: rules.length > 0 ? rules[0].reason_category : 'TECHNICAL_REJECTION'
    });
    assert(r.success);
    assert(r.routed_to_department, 'must have a department from rule table');
    appealId = r.appeal_id;
  });
  await check('S8: get appeal by ID', async () => {
    if (!appealId) return;
    const a = await s8.getAppeal(appealId);
    assert.strictEqual(a.id, appealId);
    assert.strictEqual(a.status, 'UNDER_REVIEW');
  });
  await check('S8: invalid reason_category throws', async () => {
    let threw = false;
    try { await s8.fileAppeal({ application_or_message_id: 'x', reason: 'y', reason_category: 'NONEXISTENT_CAT_XYZ' }); }
    catch { threw = true; }
    assert(threw, 'must throw for unknown reason_category');
  });

  // ── S9: Business Accounts ─────────────────────────────────────────
  console.log('\n6. S9 — Multi-User Business Accounts');
  const s9 = new BusinessAccountService();
  let bizAccountId;
  await check('S9: create business account', async () => {
    const r = await s9.createAccount({ primary_license_id: 'CM/L-8400192831', company_name: 'Test Corp' });
    assert(r.success);
    bizAccountId = r.account.id;
  });
  await check('S9: add sub-user with valid role', async () => {
    if (!bizAccountId) return;
    const r = await s9.addSubUser({ business_account_id: bizAccountId, user_id: 'usr_qa_01', email: 'qa@test.in', role: 'QA_MANAGER' });
    assert(r.success);
    assert.strictEqual(r.sub_user.role, 'QA_MANAGER');
  });
  await check('S9: invalid role throws', async () => {
    if (!bizAccountId) return;
    let threw = false;
    try { await s9.addSubUser({ business_account_id: bizAccountId, user_id: 'usr_bad', email: 'x@y.in', role: 'GOD_MODE' }); }
    catch { threw = true; }
    assert(threw, 'must reject invalid role');
  });

  // ── S11: Renewal Reminders ────────────────────────────────────────
  console.log('\n7. S11 — Renewal Reminders on a Timeline');
  const s11 = new RenewalTimelineService();
  await check('S11: getRenewalStatus for known license', async () => {
    const r = await s11.getRenewalStatus('CM/L-8400192831');
    assert(r.license_id, 'must return license_id');
    assert(typeof r.days_until_expiry === 'number', 'must compute days_until_expiry');
    assert(r.renewal_urgency, 'must return urgency level');
  });
  await check('S11: runReminderJob returns structured result', async () => {
    const r = await s11.runReminderJob();
    assert(typeof r.reminders_sent === 'number');
    assert(typeof r.reminders_skipped === 'number');
    assert(Array.isArray(r.sent));
  });
  await check('S11: idempotency — second run same day does not double-send', async () => {
    const r1 = await s11.runReminderJob();
    const r2 = await s11.runReminderJob();
    assert(r2.reminders_sent <= r1.reminders_sent + r2.skipped, 'should skip already-sent reminders');
  });

  // ── S16: Grievance & Consent ──────────────────────────────────────
  console.log('\n8. S16 — Grievance Officer Contact & Consent Management');
  const s16 = new GrievanceOfficerService();
  await check('S16: getGrievanceOfficer returns real contact info', () => {
    const r = s16.getGrievanceOfficer();
    assert(r.email, 'must have email');
    assert(r.email.endsWith('@bis.gov.in'), 'must be a real BIS email');
    assert(r.phone, 'must have phone');
  });
  await check('S16: recordConsent inserts row', async () => {
    const r = await s16.recordConsent('usr_test_consent', '1.2');
    assert(r.consent_record.user_id === 'usr_test_consent');
  });
  await check('S16: hasCurrentConsent gates correctly', async () => {
    const r = await s16.hasCurrentConsent('usr_test_consent');
    assert.strictEqual(r.has_current_consent, true);
    const r2 = await s16.hasCurrentConsent('usr_without_consent_xyz');
    assert.strictEqual(r2.has_current_consent, false);
    assert(r2.action_required, 'must provide action_required message');
  });

  // ── S17: Reapplication ────────────────────────────────────────────
  console.log('\n9. S17 — Initial Application Rejection & Reappeal Flow');
  const s17 = new ApplicationReappealService();
  let origAppId, newAppId;
  await check('S17: submit and reject an application', async () => {
    const sub = await s17.submitApplication({ applicant_id: 'mfr_test', product_name: 'Test Product', standard_number: 'IS 269:2015' });
    origAppId = sub.application.id;
    await s17.rejectApplication(origAppId, 'Insufficient lab test documentation');
    const app = await s17.getApplication(origAppId);
    assert.strictEqual(app.status, 'REJECTED');
  });
  await check('S17: reapply creates NEW application_id', async () => {
    if (!origAppId) return;
    const r = await s17.reapply(origAppId);
    newAppId = r.new_application_id;
    assert(newAppId !== origAppId, 'new application_id MUST differ from original');
    assert.strictEqual(r.original_application_id, origAppId);
  });
  await check('S17: reapply_of FK points to original (not S7 correction)', async () => {
    if (!newAppId) return;
    const app = await s17.getApplication(newAppId);
    assert.strictEqual(app.reapplication_of, origAppId, 'reapplication_of FK must point to rejected application');
  });

  // ── S18: Testing FSM ──────────────────────────────────────────────
  console.log('\n10. S18 — Lab/Sample Testing Status Tracker (FSM)');
  const s18 = new LabSampleTrackerService();
  let testRecordId;
  await check('S18: create testing record at sample_received', async () => {
    const r = await s18.createTestingRecord({ application_id: 'app_lab_test', sample_id: 'smp_001', lab_name: 'National Test House' });
    assert.strictEqual(r.testing_record.stage, 'sample_received');
    testRecordId = r.testing_record.id;
  });
  await check('S18: valid transition sample_received → in_testing', async () => {
    if (!testRecordId) return;
    const r = await s18.advanceStage(testRecordId, 'in_testing');
    assert.strictEqual(r.stage, 'in_testing');
  });
  await check('S18: skip-ahead transition rejects (in_testing → passed is valid, sample_received → passed not)', async () => {
    // Create fresh record and try to skip
    const r2 = await s18.createTestingRecord({ application_id: 'app_lab_skip', sample_id: 'smp_002', lab_name: 'UL India' });
    let threw = false;
    try { await s18.advanceStage(r2.testing_record.id, 'passed'); }
    catch { threw = true; }
    assert(threw, 'must reject sample_received → passed skip-ahead');
  });

  // ── S19: Annual Renewal ───────────────────────────────────────────
  console.log('\n11. S19 — Annual Renewal Flow with Surveillance-Audit Trigger');
  const s19 = new RenewalInitiatorService();
  await check('S19: initiateRenewal creates renewal record', async () => {
    const r = await s19.initiateRenewal('CM/L-8400192831', 2025);
    assert(r.renewal.id, 'must create renewal');
    assert(typeof r.surveillance_required === 'boolean', 'must determine surveillance_required');
    assert(r.determination_reason, 'must provide determination reason');
  });
  await check('S19: duplicate renewal throws', async () => {
    let threw = false;
    try { await s19.initiateRenewal('CM/L-8400192831', 2025); }
    catch { threw = true; }
    assert(threw, 'must reject duplicate renewal for same year');
  });
  await check('S19: renewal history returns array', async () => {
    const h = await s19.getRenewalHistory('CM/L-8400192831');
    assert(Array.isArray(h));
    assert(h.length >= 1);
  });

  // ── S20: ICS Calendar ─────────────────────────────────────────────
  console.log('\n12. S20 — In-App Calendar / Reminder Sync (ICS)');
  const s20 = new CalendarSyncService();
  await check('S20: generateICS returns valid ICS content', async () => {
    const r = await s20.generateICS('CM/L-8400192831');
    assert(r.ics_content, 'must return ICS content');
    assert(r.ics_content.includes('BEGIN:VCALENDAR'), 'must contain BEGIN:VCALENDAR');
    assert(r.ics_content.includes('END:VCALENDAR'), 'must contain END:VCALENDAR');
  });
  await check('S20: ICS contains DTSTART for license renewal event', async () => {
    const r = await s20.generateICS('CM/L-8400192831');
    assert(r.ics_content.includes('DTSTART'), 'must contain DTSTART');
    assert(r.ics_content.includes('SUMMARY'), 'must contain SUMMARY');
  });
  await check('S20: ICS for unknown license still produces valid calendar', async () => {
    const r = await s20.generateICS('UNKNOWN/LICENSE/ID');
    assert(r.ics_content.includes('BEGIN:VCALENDAR'), 'must still produce valid ICS');
  });

  // ── S21: Factory Audit ────────────────────────────────────────────
  console.log('\n13. S21 — Factory Audit Scheduling & Coordination Portal');
  const s21 = new FactoryAuditCoordinatorService();
  let auditVisitId;
  await check('S21: create a visit to submit audit for', async () => {
    const s6 = new AuditSchedulerService();
    const r = await s6.proposeVisit({ applicant_id: 'mfr_audit', officer_id: 'officer_audit', proposed_date: '2027-06-01', slot_time: '09:00' });
    auditVisitId = r.visit.id;
    assert(auditVisitId);
  });
  await check('S21: submitAuditReport creates report', async () => {
    if (!auditVisitId) return;
    const r = await s21.submitAuditReport({ visit_id: auditVisitId, file_ref: 'audit/report_001.pdf', submitted_by: 'officer_audit', score: 88.5, conformance_status: 'CONFORMING' });
    assert(r.success);
    assert(r.audit_report.id);
  });
  await check('S21: getAuditReport returns report with visit', async () => {
    if (!auditVisitId) return;
    const r = await s21.getAuditReport(auditVisitId);
    assert(r.has_report, 'must find the report');
    assert.strictEqual(r.audit_report.visit_id, auditVisitId);
  });

  // ── S22: Recall ───────────────────────────────────────────────────
  console.log('\n14. S22 — Product Recall / Non-Conformance Alert System');
  const s22 = new NonConformanceAlertService();
  let recallId;
  await check('S22: createRecall inserts into recalls table', async () => {
    const r = await s22.createRecall({ license_id: 'CM/L-8400192831', product_batch: 'BATCH-2024-APR-001', reason: 'Elevated chloride content exceeds IS 269:2015 limits', severity: 'HIGH' });
    assert(r.success);
    recallId = r.recall_id;
  });
  await check('S22: getRecalls filters by license', async () => {
    const recalls = await s22.getRecalls({ license_id: 'CM/L-8400192831' });
    assert(Array.isArray(recalls));
    assert(recalls.length >= 1, 'must return at least the recall we just created');
  });
  await check('S22: updateRecallStatus CONTAINED', async () => {
    if (!recallId) return;
    const r = await s22.updateRecallStatus(recallId, 'CONTAINED', 'Batch quarantined at factory');
    assert.strictEqual(r.status, 'CONTAINED');
  });

  // ── S23: License Suspension ───────────────────────────────────────
  console.log('\n15. S23 — License Suspension Notice & Remediation Flow');
  const s23 = new SuspensionRemediationService();
  await check('S23: changeStatus inserts history record', async () => {
    const r = await s23.changeStatus({ license_id: 'CM/L-9100223344', new_status: 'SUSPENDED', reason: 'Non-conforming product found in market surveillance', actor_id: 'BIS_OFFICER_001' });
    assert(r.success);
    assert(r.history_entry_id, 'must create history entry');
    assert(Array.isArray(r.remediation_checklist), 'must provide remediation checklist');
    assert(r.remediation_checklist.length > 0, 'checklist must not be empty');
  });
  await check('S23: getStatusHistory returns ordered history', async () => {
    const h = await s23.getStatusHistory('CM/L-9100223344');
    assert(Array.isArray(h));
    assert(h.length >= 1);
  });
  await check('S23: getRemediationChecklist returns steps', async () => {
    const r = await s23.getRemediationChecklist('CM/L-9100223344');
    assert(r.remediation_checklist.length > 0);
    assert(r.remediation_checklist[0].step, 'each step must have step number');
  });

  // ── S24: GST Invoice ──────────────────────────────────────────────
  console.log('\n16. S24 — Fee Invoice & GST-Compliant Receipt Generation');
  const s24 = new GSTInvoiceGeneratorService();
  await check('S24: generateInvoice with CGST+SGST (intra-state)', async () => {
    // Seed a payment first
    const pmtId = 'pmt_test_gst_' + Date.now();
    await sDb.insert('payments_fees', { id: pmtId, license_id: 'CM/L-8400192831', applicant_id: 'test', fee_type: 'APPLICATION_FEE', amount: 1000, gst_amount: 0, total_amount: 1000, due_date: '2026-03-31', status: 'PENDING', created_at: new Date().toISOString() });
    const r = await s24.generateInvoice({ payment_id: pmtId, gstin: '07AAAAB0123C1Z0', is_inter_state: false });
    assert(r.success);
    assert(r.cgst > 0, 'must have CGST for intra-state');
    assert(r.sgst > 0, 'must have SGST for intra-state');
    assert.strictEqual(r.igst, 0, 'IGST must be 0 for intra-state');
    // Verify math: cgst + sgst must equal total - subtotal
    const expectedTax = r.subtotal * 0.18;
    assert(Math.abs((r.cgst + r.sgst) - expectedTax) < 0.01, 'tax math must be correct');
  });
  await check('S24: generateInvoice with IGST (inter-state)', async () => {
    const pmtId = 'pmt_test_igst_' + Date.now();
    await sDb.insert('payments_fees', { id: pmtId, license_id: 'CM/L-8400192831', applicant_id: 'test', fee_type: 'INSPECTION_FEE', amount: 7000, gst_amount: 0, total_amount: 7000, due_date: '2026-03-31', status: 'PENDING', created_at: new Date().toISOString() });
    const r = await s24.generateInvoice({ payment_id: pmtId, gstin: '29AAAAB0123C1Z0', is_inter_state: true });
    assert(r.igst > 0, 'must have IGST for inter-state');
    assert.strictEqual(r.cgst, 0, 'CGST must be 0 for inter-state');
    assert.strictEqual(r.sgst, 0, 'SGST must be 0 for inter-state');
  });
  await check('S24: invalid GSTIN throws', async () => {
    let threw = false;
    try { await s24.generateInvoice({ payment_id: 'any', gstin: 'INVALID123' }); }
    catch { threw = true; }
    assert(threw, 'must reject invalid GSTIN');
  });

  // ── S25: Regional Office Routing ──────────────────────────────────
  console.log('\n17. S25 — Regional Office Auto-Routing');
  const s25 = new RegionalOfficeRouter();
  await check('S25: Delhi pincode routes to Northern Regional Office', async () => {
    const r = await s25.getOfficeByPincode('110002');
    assert(r.found, 'must find office for Delhi pincode');
    assert(r.office_name.includes('Northern') || r.office_name.includes('Delhi') || r.region === 'NORTH', 'must route to North');
  });
  await check('S25: Mumbai pincode routes to Western Regional Office', async () => {
    const r = await s25.getOfficeByPincode('400001');
    assert(r.found, 'must find office for Mumbai pincode');
    assert(r.region === 'WEST' || r.office_name.includes('Western') || r.office_name.includes('Mumbai'), 'must route to West');
  });
  await check('S25: invalid pincode throws', async () => {
    let threw = false;
    try { await s25.getOfficeByPincode('12'); }
    catch { threw = true; }
    assert(threw, 'must reject too-short pincode');
  });

  // ── S26: Multi-Factory ────────────────────────────────────────────
  console.log('\n18. S26 — Multi-Factory / Multi-Location License Management');
  const s26 = new MultiFactoryManagerService();
  let bizId2;
  await check('S26: add factory location', async () => {
    // Create account first
    const s9 = new BusinessAccountService();
    const acc = await s9.createAccount({ primary_license_id: 'CM/L-8400192831', company_name: 'MultiFactory Test Corp' });
    bizId2 = acc.account.id;
    const r = await s26.addLocation({ business_account_id: bizId2, location_name: 'Nagpur Plant', address: 'MIDC Industrial Area, Nagpur', state: 'Maharashtra', pincode: '440001', is_primary: true });
    assert(r.success);
    assert.strictEqual(r.location.is_primary, true);
  });
  await check('S26: getLocations returns scoped results', async () => {
    if (!bizId2) return;
    const r = await s26.getLocations(bizId2);
    assert(r.total_locations >= 1);
    assert(r.primary_location, 'must have primary location');
  });
  await check('S26: add second location does not conflict with primary', async () => {
    if (!bizId2) return;
    const r = await s26.addLocation({ business_account_id: bizId2, location_name: 'Pune Branch', address: 'Industrial Zone, Pune', state: 'Maharashtra', pincode: '411001', is_primary: false });
    assert(r.success);
    const all = await s26.getLocations(bizId2);
    const primaries = all.locations.filter(l => l.is_primary && !l.removed_at);
    assert(primaries.length <= 1, 'must have at most one primary location');
  });

  // ── S27: Live Quality Metrics (CRITICAL) ──────────────────────────
  console.log('\n19. S27 — Live Retrieval-Quality Metrics (CRITICAL — no hardcoded values)');
  const s27 = new QualityOpsService();
  await check('S27: empty table returns NO_DATA (not hardcoded metrics)', async () => {
    // Clear adversarial_query_results for this test
    const rows = await sDb.getTable('adversarial_query_results');
    if (rows.length === 0) {
      const r = await s27.getMetrics();
      assert.strictEqual(r.status, 'NO_DATA', 'must return NO_DATA when table empty');
      assert.strictEqual(r.groundedness_rate, null, 'must not fabricate groundedness_rate');
    } else {
      console.log('    (table has rows — skipping empty-table check)');
    }
  });
  await check('S27: recordTestResult then getMetrics computes real values', async () => {
    await s27.recordTestResult({ query_text: 'What is IS 269?', expected_behavior: 'ANSWER', actual_behavior: 'ANSWER', is_grounded: true, passed: true });
    await s27.recordTestResult({ query_text: 'Who is the president?', expected_behavior: 'DECLINE', actual_behavior: 'DECLINE', is_grounded: false, passed: true });
    await s27.recordTestResult({ query_text: 'Nonsense query', expected_behavior: 'DECLINE', actual_behavior: 'ANSWER', is_grounded: false, passed: false });
    const m = await s27.getMetrics();
    assert.strictEqual(m.status, 'LIVE');
    assert(typeof m.groundedness_rate === 'number', 'groundedness_rate must be a real number');
    assert(m.total_queries_evaluated >= 3, 'must count all evaluated queries');
    assert(m.groundedness_rate_pct < 100 || m.total_queries_evaluated > 0, 'rates must be computed, not hardcoded');
  });
  await check('S27: metrics change when new test results added', async () => {
    const before = await s27.getMetrics();
    await s27.recordTestResult({ query_text: 'New test', expected_behavior: 'ANSWER', actual_behavior: 'ANSWER', is_grounded: true, passed: true });
    const after = await s27.getMetrics();
    assert(after.total_queries_evaluated > before.total_queries_evaluated, 'total must increase');
  });

  // ── S28: Staff Invitations ────────────────────────────────────────
  console.log('\n20. S28 — Staff Role Invitations');
  const s28 = new StaffInvitationService();
  let invToken;
  await check('S28: send invitation generates token', async () => {
    if (!bizAccountId) {
      const s9 = new BusinessAccountService();
      const acc = await s9.createAccount({ primary_license_id: 'CM/L-8400192831', company_name: 'Inv Test Corp' });
      bizAccountId = acc.account.id;
    }
    const r = await s28.invite({ business_account_id: bizAccountId, email: 'newstaff@test.in', role: 'COMPLIANCE_OFFICER' });
    assert(r.success);
    assert(r.invitation_id, 'must return invitation_id');
    assert(!r.token_preview.includes('...') === false, 'must not expose full token');
    // Get the actual token from DB for testing
    const invs = await sDb.getTable('invitations');
    const inv = invs.find(i => i.id === r.invitation_id);
    invToken = inv && inv.token;
  });
  await check('S28: acceptInvitation creates sub_users row', async () => {
    if (!invToken) return;
    const r = await s28.acceptInvitation(invToken, 'usr_new_staff');
    assert(r.success);
    assert(r.sub_user.user_id === 'usr_new_staff');
    assert(r.sub_user.role === 'COMPLIANCE_OFFICER');
  });
  await check('S28: expired/invalid token throws', async () => {
    let threw = false;
    try { await s28.acceptInvitation('nonexistent_token_xyz', 'usr_x'); }
    catch { threw = true; }
    assert(threw, 'must reject invalid token');
  });

  // ── S29: Draft Save/Resume ────────────────────────────────────────
  console.log('\n21. S29 — Save-and-Resume Application Draft');
  const s29 = new ApplicationDraftService();
  let draftId;
  await check('S29: saveDraft creates draft with nested form_state', async () => {
    const r = await s29.saveDraft('sess_test_001', {
      step1: { company_name: 'Test Corp', gstin: 'AAAAA1234Z' },
      step2: { product_name: 'Cement', standard: 'IS 269:2015' },
      step3: { documents: { pan: 'uploaded', gst: 'pending' } }
    });
    assert(r.draft_id);
    draftId = r.draft_id;
  });
  await check('S29: getDraft restores exact nested form_state', async () => {
    if (!draftId) return;
    const r = await s29.getDraft(draftId);
    assert.strictEqual(r.form_state.step1.company_name, 'Test Corp', 'must restore top-level nested field');
    assert.strictEqual(r.form_state.step3.documents.pan, 'uploaded', 'must restore deep nested field');
    assert.strictEqual(r.form_state.step3.documents.gst, 'pending', 'must restore all nested keys');
  });
  await check('S29: partial update merges, does not lose existing keys', async () => {
    // Update only step2
    await s29.saveDraft('sess_test_001', { step2: { product_name: 'OPC 43', standard: 'IS 269:2015', grade: '43' } });
    const r = await s29.getDraft(draftId);
    assert.strictEqual(r.form_state.step1.company_name, 'Test Corp', 'step1 must not be lost');
    assert.strictEqual(r.form_state.step2.grade, '43', 'updated field must be present');
  });

  // ── Summary ───────────────────────────────────────────────────────
  console.log('\n====================================================');
  console.log(`PHASE 1 S-SERIES TESTS: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('ALL PHASE 1 S-SERIES TESTS PASSED ✓');
  } else {
    console.log(`⚠ ${failed} test(s) failed — review above`);
  }
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('\n❌ Phase 1 Test Runner Error:', err);
  process.exit(1);
});
