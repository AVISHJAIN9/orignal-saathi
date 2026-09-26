/**
 * Test Suite for Task 9 (S-Series Spine Features: S1, S3, S5, S10, S15)
 * Verifies relational schema, tables, queries, and business logic
 */

const assert = require('assert');
const {
  AccountBindingService,
  RegistrationWizardService,
  PaymentsGSTService,
  CertificateVerificationService,
  DocumentChecklistEngine
} = require('../s');
const { sDb } = require('../s/database');

async function runTests() {
  console.log('====================================================');
  console.log('STARTING S-SERIES SPINE (S1, S3, S5, S10, S15) TESTS');
  console.log('====================================================\n');

  // 1. Verify S-Series Relational Tables
  console.log('1. Checking Statutory Relational Tables in Schema...');
  const expectedTables = [
    'licensing_records',
    'applicant_business_profiles',
    'checklist_templates',
    'payments_fees',
    'certificates'
  ];

  for (const table of expectedTables) {
    const rows = await sDb.getTable(table);
    assert(Array.isArray(rows), `Table ${table} should return an array`);
    console.log(`  ✓ Table '${table}' verified (${rows.length} records)`);
  }

  // 2. Testing S1: ID-Linked Account Binding
  console.log('\n2. Testing S1: ID-Linked Account Binding...');
  const s1 = new AccountBindingService();

  // Test binding valid license
  const s1Valid = await s1.bindAccount({
    user_id: 'usr_enterprise_01',
    bis_license_id: 'CM/L-8400192831'
  });
  assert.strictEqual(s1Valid.status, 'ACCOUNT_BOUND_SUCCESS');
  assert.strictEqual(s1Valid.is_bound, true);
  assert.strictEqual(s1Valid.linked_company, 'Bharat Minerals & Cement Ltd.');
  assert.strictEqual(s1Valid.standard_number, 'IS 269:2015');
  console.log('  ✓ S1 Valid License Binding passed:', s1Valid.linked_company);

  // Test binding expired license
  const s1Expired = await s1.bindAccount({
    user_id: 'usr_enterprise_02',
    bis_license_id: 'CM/L-7200554411'
  });
  assert.strictEqual(s1Expired.status, 'BINDING_REJECTED');
  assert.strictEqual(s1Expired.is_bound, false);
  console.log('  ✓ S1 Expired License Rejection passed');

  // Test binding invalid license
  const s1Invalid = await s1.bindAccount({
    user_id: 'usr_enterprise_03',
    bis_license_id: 'CM/L-0000000000'
  });
  assert.strictEqual(s1Invalid.status, 'BINDING_FAILED');
  console.log('  ✓ S1 Non-existent License Rejection passed');

  // 3. Testing S15: Registration-Specific Document Checklist Generator
  console.log('\n3. Testing S15: Document Checklist Generator...');
  const s15 = new DocumentChecklistEngine();

  const s15Isi = await s15.generateChecklist({
    license_type: 'ISI',
    product_category: 'cement',
    business_scale: 'SMALL',
    standard_number: 'IS 269:2015'
  });
  assert(s15Isi.total_required_documents > 5);
  assert(s15Isi.required_checklists.some(d => d.doc_type === 'DOC_UDYAM_CONCESSION'));
  assert(s15Isi.statutory_forms.some(f => f.form_number === 'Form-V'));
  console.log(`  ✓ S15 ISI Checklist generation passed: ${s15Isi.total_required_documents} documents (including Udyam 50% concession).`);

  const s15Crs = await s15.generateChecklist({
    license_type: 'CRS',
    product_category: 'electronics',
    business_scale: 'LARGE',
    standard_number: 'IS 16046:2018'
  });
  assert(s15Crs.required_checklists.some(d => d.doc_type === 'DOC_NABL_REPORT'));
  assert(s15Crs.statutory_forms.some(f => f.form_number.includes('CRS')));
  console.log(`  ✓ S15 CRS Checklist generation passed: ${s15Crs.total_required_documents} documents.`);

  // 4. Testing S3: New-Applicant Registration Wizard (Coupled to S15)
  console.log('\n4. Testing S3: New-Applicant Registration Wizard...');
  const s3 = new RegistrationWizardService();
  const s3Result = await s3.submitApplication({
    business_name: 'SolarTech Manufacturing India Pvt. Ltd.',
    registration_number: 'CIN-U31909MH2024PTC109928',
    business_type: 'PRIVATE_LTD',
    business_size: 'MEDIUM',
    product_category: 'solar_inverter',
    applicable_standard: 'IS 16221:Part 2:2015',
    license_type: 'CRS',
    contact_email: 'compliance@solartech-india.com',
    contact_phone: '+91-9820112233'
  });
  assert.strictEqual(s3Result.status, 'APPLICATION_SUBMITTED_SUCCESS');
  assert(s3Result.application_id.startsWith('BIS-APP-'));
  assert(s3Result.registration_checklist);
  assert(s3Result.registration_checklist.total_required_documents > 0);
  console.log(`  ✓ S3 Registration Wizard passed: Created application ${s3Result.application_id} and generated tailored checklist of ${s3Result.registration_checklist.total_required_documents} documents.`);

  // 5. Testing S5: Payment & Fee Status Tracker
  console.log('\n5. Testing S5: Payment & Fee Status Tracker...');
  const s5 = new PaymentsGSTService();

  // Test fee lookup
  const s5Lookup = await s5.getFeesForLicense('CM/L-8400192831');
  assert(s5Lookup.total_records > 0);
  console.log(`  ✓ S5 Fee lookup passed: ${s5Lookup.total_records} fee record(s) on file.`);

  // Test invoice creation
  const s5Invoice = await s5.createFeeInvoice({
    license_id: 'CM/L-8400192831',
    fee_type: 'MINIMUM_MARKING_FEE',
    business_scale: 'SMALL'
  });
  assert.strictEqual(s5Invoice.status, 'INVOICE_GENERATED');
  assert(s5Invoice.payment_gateway.order_id.startsWith('order_rzp_'));
  assert(s5Invoice.payment_gateway.amount_inr > 0);
  console.log(`  ✓ S5 Razorpay test-mode invoice generated: INR ${s5Invoice.payment_gateway.amount_inr} (Order: ${s5Invoice.payment_gateway.order_id})`);

  // Test fee reconciliation
  const s5Reconcile = await s5.reconcilePayment({
    fee_id: s5Invoice.fee_record.id,
    payment_id: 'pay_rzp_test_' + Date.now(),
    status: 'SUCCESS'
  });
  assert.strictEqual(s5Reconcile.status, 'PAYMENT_RECONCILED_SUCCESS');
  assert(s5Reconcile.receipt_number.startsWith('REC-BIS-'));
  console.log(`  ✓ S5 Payment reconciliation passed: Receipt ${s5Reconcile.receipt_number} for INR ${s5Reconcile.amount_paid}`);

  // 6. Testing S10: Certificate Download & Public Verification Center
  console.log('\n6. Testing S10: Certificate Download & Public Verification...');
  const s10 = new CertificateVerificationService();

  // Test public minimal verification (privacy-preserving)
  const s10VerifyValid = await s10.publicVerify('CM/L-8400192831');
  assert.strictEqual(s10VerifyValid.is_valid, true);
  assert.strictEqual(s10VerifyValid.status, 'VALID');
  // Confirm NO private applicant data is exposed
  assert.strictEqual(s10VerifyValid.company_name, undefined);
  assert.strictEqual(s10VerifyValid.factory_address, undefined);
  console.log(`  ✓ S10 Minimal Public Verification passed: Status ${s10VerifyValid.status}, Valid till ${s10VerifyValid.valid_till}`);

  // Test verification of non-existent certificate
  const s10VerifyInvalid = await s10.publicVerify('CM/L-9999999999');
  assert.strictEqual(s10VerifyInvalid.is_valid, false);
  console.log('  ✓ S10 Non-existent Certificate Verification passed (rejected)');

  // Test certificate download endpoint
  const s10Download = await s10.getCertificateDownload('CM/L-8400192831');
  assert.strictEqual(s10Download.download_available, true);
  assert(s10Download.pdf_url.includes('.pdf'));
  console.log(`  ✓ S10 Certificate PDF retrieval passed: ${s10Download.pdf_url}`);

  console.log('\n====================================================');
  console.log('ALL S-SERIES SPINE (S1, S3, S5, S10, S15) TESTS PASSED! (100%)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('\n❌ S-Series Spine Test Failed:', err);
  process.exit(1);
});
