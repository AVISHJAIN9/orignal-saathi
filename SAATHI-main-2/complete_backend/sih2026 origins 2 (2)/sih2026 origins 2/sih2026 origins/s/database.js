/**
 * Relational Database Layer for All S-Series Lifecycle Modules (S1 - S44)
 * Architecture A PostgreSQL standard with in-memory relational fallback for offline tests.
 */

let Pool = null;
try {
  Pool = require('pg').Pool;
} catch (e) {
  // pg optional if running offline or in fresh environment
}

const DDL_STATEMENTS = `
-- S1: ID-Linked Account Binding
CREATE TABLE IF NOT EXISTS licensing_records (
  license_id VARCHAR(64) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  standard_number VARCHAR(64) NOT NULL,
  product_name VARCHAR(128) NOT NULL,
  status VARCHAR(32) DEFAULT 'ACTIVE',
  issue_date DATE NOT NULL,
  valid_till DATE NOT NULL,
  factory_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S3: New Applicant Registration Wizard
CREATE TABLE IF NOT EXISTS applicant_business_profiles (
  id VARCHAR(64) PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(64) NOT NULL,
  business_type VARCHAR(64) DEFAULT 'PRIVATE_LTD',
  business_size VARCHAR(32) DEFAULT 'SMALL',
  product_category VARCHAR(128) NOT NULL,
  contact_email VARCHAR(128) NOT NULL,
  contact_phone VARCHAR(32),
  address TEXT,
  state VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S15: Document Checklist Generator
CREATE TABLE IF NOT EXISTS checklist_templates (
  id VARCHAR(64) PRIMARY KEY,
  license_type VARCHAR(64) NOT NULL,
  product_category VARCHAR(128) DEFAULT 'ALL',
  mandatory_documents JSONB NOT NULL,
  technical_requirements JSONB,
  statutory_forms JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S5: Payment & Fee Status Tracker
CREATE TABLE IF NOT EXISTS payments_fees (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) REFERENCES licensing_records(license_id),
  applicant_id VARCHAR(64),
  fee_type VARCHAR(64) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  gst_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING',
  payment_gateway_ref VARCHAR(128),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S10: Certificate Download & Public Verification
CREATE TABLE IF NOT EXISTS certificates (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) REFERENCES licensing_records(license_id),
  issue_date DATE NOT NULL,
  valid_till DATE NOT NULL,
  status VARCHAR(32) DEFAULT 'VALID',
  file_reference VARCHAR(512),
  pdf_url VARCHAR(512),
  qr_code_hash VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S6 & S21: Government Officer Visit / Audit Appointments
CREATE TABLE IF NOT EXISTS visit_appointments (
  id VARCHAR(64) PRIMARY KEY,
  applicant_id VARCHAR(64) NOT NULL,
  officer_id VARCHAR(64) NOT NULL,
  proposed_date DATE NOT NULL,
  slot_time VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'PROPOSED', -- PROPOSED, CONFIRMED, COMPLETED, CANCELLED
  audit_report_status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, SUBMITTED, APPROVED
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS officer_availability (
  id VARCHAR(64) PRIMARY KEY,
  officer_id VARCHAR(64) NOT NULL,
  officer_name VARCHAR(128) NOT NULL,
  date DATE NOT NULL,
  slot_start VARCHAR(16) NOT NULL,
  slot_end VARCHAR(16) NOT NULL,
  booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S7: Document Correction & Resubmission
CREATE TABLE IF NOT EXISTS correction_requests (
  id VARCHAR(64) PRIMARY KEY,
  original_submission_id VARCHAR(64) NOT NULL,
  flagged_field VARCHAR(128) NOT NULL,
  flagged_document_id VARCHAR(64),
  reason TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, RESOLVED, REJECTED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resubmissions (
  id VARCHAR(64) PRIMARY KEY,
  correction_request_id VARCHAR(64) REFERENCES correction_requests(id),
  original_submission_id VARCHAR(64) NOT NULL,
  new_document_id VARCHAR(64) NOT NULL,
  file_url TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S4: Automated Requirement Update Notifications
CREATE TABLE IF NOT EXISTS notification_triggers (
  id VARCHAR(64) PRIMARY KEY,
  applicant_id VARCHAR(64) NOT NULL,
  requirement_id VARCHAR(64) NOT NULL,
  requirement_title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered BOOLEAN DEFAULT FALSE
);

-- S8: Appeals & Dispute Resolution
CREATE TABLE IF NOT EXISTS appeals (
  id VARCHAR(64) PRIMARY KEY,
  application_or_message_id VARCHAR(64) NOT NULL,
  reason TEXT NOT NULL,
  department VARCHAR(128) NOT NULL,
  status VARCHAR(32) DEFAULT 'UNDER_REVIEW', -- UNDER_REVIEW, ESCALATED, RESOLVED, DISMISSED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appeal_routing_rules (
  id VARCHAR(64) PRIMARY KEY,
  reason_category VARCHAR(64) NOT NULL,
  department VARCHAR(128) NOT NULL
);

-- S9: Multi-User Business Accounts
CREATE TABLE IF NOT EXISTS business_accounts (
  id VARCHAR(64) PRIMARY KEY,
  primary_license_id VARCHAR(64) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_users (
  id VARCHAR(64) PRIMARY KEY,
  business_account_id VARCHAR(64) REFERENCES business_accounts(id),
  user_id VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL, -- ADMIN, QA_MANAGER, COMPLIANCE_OFFICER, VIEWER
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S11: Renewal Reminders on Timeline
CREATE TABLE IF NOT EXISTS reminder_log (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) NOT NULL,
  days_before INT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S16: Grievance Officer & Consent Log
CREATE TABLE IF NOT EXISTS consent_log (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  consent_version VARCHAR(32) NOT NULL,
  accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S17: Initial Application Rejection & Reappeal Flow
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  applicant_id VARCHAR(64) NOT NULL,
  product_name VARCHAR(128) NOT NULL,
  standard_number VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'SUBMITTED', -- SUBMITTED, REJECTED, APPROVED, REAPPEALED
  rejection_reason TEXT,
  reapplication_of VARCHAR(64), -- Self-FK to prior rejected application
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S18: Lab / Sample Testing Status Tracker
CREATE TABLE IF NOT EXISTS testing_status (
  id VARCHAR(64) PRIMARY KEY,
  application_id VARCHAR(64) NOT NULL,
  sample_id VARCHAR(64) NOT NULL,
  stage VARCHAR(32) NOT NULL, -- sample_received, in_testing, passed, failed
  lab_name VARCHAR(128) NOT NULL,
  test_report_url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S19: Annual Renewal Flow with Surveillance Audit
CREATE TABLE IF NOT EXISTS renewals (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) NOT NULL,
  renewal_year INT NOT NULL,
  surveillance_audit_required BOOLEAN DEFAULT FALSE,
  linked_visit_id VARCHAR(64),
  status VARCHAR(32) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S21: Factory Audit Reports
CREATE TABLE IF NOT EXISTS audit_reports (
  id VARCHAR(64) PRIMARY KEY,
  visit_id VARCHAR(64) REFERENCES visit_appointments(id),
  file_ref TEXT NOT NULL,
  score NUMERIC(5,2),
  conformance_status VARCHAR(32) NOT NULL, -- CONFORMING, NON_CONFORMING
  submitted_by VARCHAR(128) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S22: Product Recall & Non-Conformance Alert System
CREATE TABLE IF NOT EXISTS recalls (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) NOT NULL,
  product_batch VARCHAR(128) NOT NULL,
  reason TEXT NOT NULL,
  severity VARCHAR(32) DEFAULT 'CRITICAL', -- CRITICAL, HIGH, MEDIUM
  status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, CONTAINED, CLOSED
  notified_regulators JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S23: License Suspension Notice & Remediation
CREATE TABLE IF NOT EXISTS license_status_history (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) NOT NULL,
  old_status VARCHAR(32) NOT NULL,
  new_status VARCHAR(32) NOT NULL,
  reason TEXT NOT NULL,
  remediation_checklist JSONB,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S24: Fee Invoice & GST-Compliant Receipt
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(64) PRIMARY KEY,
  payment_id VARCHAR(64) NOT NULL,
  invoice_number VARCHAR(64) UNIQUE NOT NULL,
  license_id VARCHAR(64),
  gstin VARCHAR(32) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  cgst NUMERIC(12,2) NOT NULL,
  sgst NUMERIC(12,2) NOT NULL,
  igst NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  tax_breakdown JSONB NOT NULL,
  file_ref TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S25: Regional Office Auto-Routing (Seeded with genuine BIS regional offices)
CREATE TABLE IF NOT EXISTS regional_offices (
  id VARCHAR(64) PRIMARY KEY,
  office_name VARCHAR(128) NOT NULL,
  region VARCHAR(32) NOT NULL, -- NORTH, SOUTH, EAST, WEST, CENTRAL
  states_covered JSONB NOT NULL,
  pincode_prefixes JSONB NOT NULL,
  address TEXT NOT NULL,
  contact_phone VARCHAR(32),
  contact_email VARCHAR(128)
);

-- S26: Multi-Factory / Multi-Location License Management
CREATE TABLE IF NOT EXISTS factory_locations (
  id VARCHAR(64) PRIMARY KEY,
  business_account_id VARCHAR(64) NOT NULL,
  location_name VARCHAR(128) NOT NULL,
  address TEXT NOT NULL,
  state VARCHAR(64) NOT NULL,
  pincode VARCHAR(16) NOT NULL,
  license_id VARCHAR(64),
  is_primary BOOLEAN DEFAULT FALSE
);

-- S27: Live Retrieval-Quality Metrics Ops Page
CREATE TABLE IF NOT EXISTS adversarial_query_results (
  id VARCHAR(64) PRIMARY KEY,
  query_text TEXT NOT NULL,
  expected_behavior VARCHAR(64) NOT NULL, -- ANSWER, DECLINE
  actual_behavior VARCHAR(64) NOT NULL,
  is_grounded BOOLEAN DEFAULT TRUE,
  passed BOOLEAN NOT NULL,
  run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- S28: Staff Role Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id VARCHAR(64) PRIMARY KEY,
  business_account_id VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL,
  token VARCHAR(128) UNIQUE NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, ACCEPTED, EXPIRED
  expires_at TIMESTAMP NOT NULL
);

-- S29: Save-and-Resume Application Draft
CREATE TABLE IF NOT EXISTS application_drafts (
  id VARCHAR(64) PRIMARY KEY,
  applicant_session_id VARCHAR(64) NOT NULL,
  form_state JSONB NOT NULL,
  last_saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const SEED_DATA = {
  licensing_records: [
    {
      license_id: 'CM/L-8400192831',
      company_name: 'Bharat Minerals & Cement Ltd.',
      standard_number: 'IS 269:2015',
      product_name: 'Ordinary Portland Cement 43 Grade',
      status: 'ACTIVE',
      issue_date: '2023-01-01',
      valid_till: '2026-12-31',
      factory_address: 'Plot 42, MIDC Industrial Area, Nagpur, Maharashtra'
    },
    {
      license_id: 'CM/L-9100223344',
      company_name: 'Amaron Power Systems Pvt. Ltd.',
      standard_number: 'IS 16046:2018',
      product_name: 'Secondary Li-Ion Cells and Battery Packs',
      status: 'ACTIVE',
      issue_date: '2023-05-15',
      valid_till: '2025-05-14',
      factory_address: 'Survey No. 102, Karakambadi Road, Tirupati, Andhra Pradesh'
    },
    {
      license_id: 'CM/L-7200554411',
      company_name: 'Apex Structural Steel Fabricators',
      standard_number: 'IS 1161:2014',
      product_name: 'Steel Tubes for Structural Purposes',
      status: 'EXPIRED',
      issue_date: '2021-02-01',
      valid_till: '2024-01-31',
      factory_address: 'Industrial Focal Point, Ludhiana, Punjab'
    }
  ],
  applicant_business_profiles: [
    {
      id: 'app_sample_01',
      business_name: 'GreenField Energy Products LLP',
      registration_number: 'UDYAM-MH-12-0099881',
      business_type: 'LLP',
      business_size: 'SMALL',
      product_category: 'solar_inverter',
      contact_email: 'compliance@greenfield-solar.in',
      contact_phone: '+91-9820011223',
      address: 'Sector 5, Electronics Zone, Mahape, Navi Mumbai',
      state: 'Maharashtra'
    }
  ],
  checklist_templates: [
    {
      id: 'tmpl_isi',
      license_type: 'ISI',
      product_category: 'ALL',
      mandatory_documents: [
        { code: 'DOC_PAN_GST', name: 'PAN & GST Certificate', description: 'Incorporation and tax proof of enterprise', is_required: true },
        { code: 'DOC_FACTORY_LIC', name: 'Factory License / Consent to Operate (CTO)', description: 'State Pollution Control Board NOC and Factory Act license', is_required: true },
        { code: 'DOC_PLANT_LAYOUT', name: 'Plant Layout & Machinery List', description: 'Schematic of production lines and machinery capacity', is_required: true },
        { code: 'DOC_LAB_EQUIP', name: 'In-House Test Equipment Calibration List', description: 'Equipment inventory with valid NABL calibration certificates', is_required: true },
        { code: 'DOC_QC_STAFF', name: 'Quality Control Personnel Details', description: 'Degree certificates and appointment letters of QC Chemists/Engineers', is_required: true },
        { code: 'DOC_SIT_ACCEPT', name: 'Scheme of Inspection and Testing (SIT) Undertaking', description: 'Signed acceptance of BIS standard testing frequencies', is_required: true }
      ],
      technical_requirements: [
        { clause: 'General Clause 4', requirement: 'Manufacturing line must have raw material segregation' },
        { clause: 'General Clause 6', requirement: 'Daily routine test register must be maintained in physical/digital log' }
      ],
      statutory_forms: [
        { form_number: 'Form-V', title: 'Application for Grant of License (ISI Scheme-I)' }
      ]
    },
    {
      id: 'tmpl_crs',
      license_type: 'CRS',
      product_category: 'electronics',
      mandatory_documents: [
        { code: 'DOC_NABL_REPORT', name: 'Safety Test Report from BIS Recognized Lab', description: 'Test report less than 90 days old from accredited test house', is_required: true },
        { code: 'DOC_AIR_AUTH', name: 'Authorized Indian Representative (AIR) Undertaking', description: 'Required for overseas brands or local liaison office', is_required: true },
        { code: 'DOC_BRAND_AUTH', name: 'Brand / Trademark Registration Certificate', description: 'TM-A or trademark ownership certificate', is_required: true },
        { code: 'DOC_BOM_CDF', name: 'Critical Component List (CCL) & Construction Data Form (CDF)', description: 'Bill of materials for critical safety components', is_required: true },
        { code: 'DOC_LABEL_MOCKUP', name: 'Standard Mark Mockup Label', description: 'Proposed label format showing R-number and IS standard tag', is_required: true }
      ],
      technical_requirements: [
        { clause: 'Clause 4.1', requirement: 'Overcharge, insulation resistance and short-circuit compliance' }
      ],
      statutory_forms: [
        { form_number: 'Form-A (CRS)', title: 'Compulsory Registration Online Declaration' }
      ]
    }
  ],
  payments_fees: [
    {
      id: 'fee_demo_01',
      license_id: 'CM/L-8400192831',
      applicant_id: 'usr-100',
      fee_type: 'ANNUAL_LICENSE_FEE',
      amount: 1000.00,
      gst_amount: 180.00,
      total_amount: 1180.00,
      due_date: '2024-12-15',
      status: 'PAID',
      payment_gateway_ref: 'pay_Nz928Kdj10',
      paid_at: '2024-12-01T10:30:00Z'
    },
    {
      id: 'fee_demo_02',
      license_id: 'CM/L-8400192831',
      applicant_id: 'usr-100',
      fee_type: 'MINIMUM_MARKING_FEE',
      amount: 37000.00,
      gst_amount: 6660.00,
      total_amount: 43660.00,
      due_date: '2025-01-15',
      status: 'PENDING',
      payment_gateway_ref: null,
      paid_at: null
    }
  ],
  certificates: [
    {
      id: 'cert_8400192831',
      license_id: 'CM/L-8400192831',
      issue_date: '2023-01-01',
      valid_till: '2026-12-31',
      status: 'VALID',
      file_reference: 'certificates/CML_8400192831.pdf',
      pdf_url: 'https://saathi-bis.gov.in/api/v1/lifecycle/certificates/download/CML-8400192831.pdf',
      qr_code_hash: '9f8a2c1b7e4d6a8f3b0c5e9a2d7f1b4c'
    },
    {
      id: 'cert_9100223344',
      license_id: 'CM/L-9100223344',
      issue_date: '2023-05-15',
      valid_till: '2025-05-14',
      status: 'VALID',
      file_reference: 'certificates/CML_9100223344.pdf',
      pdf_url: 'https://saathi-bis.gov.in/api/v1/lifecycle/certificates/download/CML-9100223344.pdf',
      qr_code_hash: 'a1b2c3d4e5f67890123456789abcdef0'
    }
  ],
  visit_appointments: [
    {
      id: 'visit_01',
      applicant_id: 'usr-100',
      officer_id: 'off_sharma',
      proposed_date: '2025-02-10',
      slot_time: '10:00-13:00',
      status: 'CONFIRMED',
      audit_report_status: 'PENDING',
      notes: 'Initial preliminary factory inspection for ISI certification'
    }
  ],
  officer_availability: [
    { id: 'slot_01', officer_id: 'off_sharma', officer_name: 'Shri R. K. Sharma', date: '2025-02-10', slot_start: '10:00', slot_end: '13:00', booked: true },
    { id: 'slot_02', officer_id: 'off_sharma', officer_name: 'Shri R. K. Sharma', date: '2025-02-10', slot_start: '14:00', slot_end: '17:00', booked: false },
    { id: 'slot_03', officer_id: 'off_verma', officer_name: 'Smt. P. Verma', date: '2025-02-11', slot_start: '10:00', slot_end: '13:00', booked: false }
  ],
  correction_requests: [
    {
      id: 'corr_01',
      original_submission_id: 'BIS-APP-1001',
      flagged_field: 'factory_plot_plan',
      flagged_document_id: 'doc_layout_v1',
      reason: 'Quarantine area demarcation not highlighted in submitted layout',
      status: 'PENDING'
    }
  ],
  resubmissions: [],
  notification_triggers: [
    {
      id: 'trig_01',
      applicant_id: 'usr-100',
      requirement_id: 'req_cement_fineness',
      requirement_title: 'IS 269 Blaine Fineness Update',
      message: 'New Blaine testing protocol enforced under latest QCO amendment',
      triggered_at: '2024-08-12T10:00:00Z',
      delivered: true
    }
  ],
  appeals: [
    {
      id: 'appeal_01',
      application_or_message_id: 'BIS-APP-1001',
      reason: 'Dispute regarding laboratory sample turnaround delay by accredited center',
      department: 'LABORATORY_SURVEILLANCE_DIVISION',
      status: 'UNDER_REVIEW',
      created_at: '2024-09-01T12:00:00Z',
      resolved_at: null
    }
  ],
  appeal_routing_rules: [
    { id: 'rule_app_1', reason_category: 'lab_delay', department: 'LABORATORY_SURVEILLANCE_DIVISION' },
    { id: 'rule_app_2', reason_category: 'rejection_dispute', department: 'CENTRAL_LICENSING_APPELLATE_AUTHORITY' },
    { id: 'rule_app_3', reason_category: 'fee_calculation', department: 'ACCOUNTS_AND_FINANCE_CELL' },
    { id: 'rule_app_4', reason_category: 'officer_conduct', department: 'CHIEF_VIGILANCE_AND_GRIEVANCE_OFFICER' }
  ],
  business_accounts: [
    {
      id: 'corp_bharat_minerals',
      primary_license_id: 'CM/L-8400192831',
      company_name: 'Bharat Minerals & Cement Ltd.'
    }
  ],
  sub_users: [
    {
      id: 'sub_u1',
      business_account_id: 'corp_bharat_minerals',
      user_id: 'usr_qa_shinde',
      email: 'qa.shinde@bharatcement.in',
      role: 'QA_MANAGER'
    },
    {
      id: 'sub_u2',
      business_account_id: 'corp_bharat_minerals',
      user_id: 'usr_legal_patil',
      email: 'legal.patil@bharatcement.in',
      role: 'COMPLIANCE_OFFICER'
    }
  ],
  reminder_log: [
    { id: 'rem_01', license_id: 'CM/L-8400192831', days_before: 90, sent_at: '2024-10-01T09:00:00Z' }
  ],
  consent_log: [
    { id: 'con_01', user_id: 'usr-100', consent_version: 'v2024.1', accepted_at: '2024-01-10T14:30:00Z' }
  ],
  applications: [
    {
      id: 'BIS-APP-1001',
      applicant_id: 'usr-100',
      product_name: 'Ordinary Portland Cement 43 Grade',
      standard_number: 'IS 269:2015',
      status: 'SUBMITTED',
      rejection_reason: null,
      reapplication_of: null
    },
    {
      id: 'BIS-APP-8821',
      applicant_id: 'usr_steel_01',
      product_name: 'Carbon Steel Structural Tubes',
      standard_number: 'IS 1161:2014',
      status: 'REJECTED',
      rejection_reason: 'Inadequate in-house tensile testing machine calibration certificate',
      reapplication_of: null
    }
  ],
  testing_status: [
    {
      id: 'test_stat_01',
      application_id: 'BIS-APP-1001',
      sample_id: 'SMP-2024-8812',
      stage: 'in_testing',
      lab_name: 'National Test House, Ghaziabad',
      test_report_url: null,
      updated_at: '2024-08-20T11:00:00Z'
    }
  ],
  renewals: [
    {
      id: 'ren_8400192831_2024',
      license_id: 'CM/L-8400192831',
      renewal_year: 2024,
      surveillance_audit_required: true,
      linked_visit_id: 'visit_01',
      status: 'IN_PROGRESS'
    }
  ],
  audit_reports: [
    {
      id: 'audit_rep_01',
      visit_id: 'visit_01',
      file_ref: 'audits/visit_01_report.pdf',
      score: 88.50,
      conformance_status: 'CONFORMING',
      submitted_by: 'off_sharma',
      submitted_at: '2024-08-25T16:00:00Z'
    }
  ],
  recalls: [
    {
      id: 'recall_01',
      license_id: 'CM/L-8400192831',
      product_batch: 'BATCH-2024-AUG-04',
      reason: 'Compressive strength 7-day threshold marginal variation in single batch test sample',
      severity: 'MEDIUM',
      status: 'ACTIVE',
      notified_regulators: ['BIS_WESTERN_REGION', 'STATE_DPIIT']
    }
  ],
  license_status_history: [
    {
      id: 'hist_01',
      license_id: 'CM/L-7200554411',
      old_status: 'ACTIVE',
      new_status: 'EXPIRED',
      reason: 'Annual renewal application not submitted prior to validity expiry date',
      remediation_checklist: [
        'Pay late renewal fee with statutory penalty',
        'Submit fresh routine testing log of past 60 days',
        'Apply for license restoration inspection via Form-XI'
      ],
      changed_at: '2024-02-01T00:00:00Z'
    }
  ],
  invoices: [
    {
      id: 'inv_01',
      payment_id: 'fee_demo_01',
      invoice_number: 'INV-BIS-2024-00912',
      license_id: 'CM/L-8400192831',
      gstin: '27AABCB1234F1Z5',
      subtotal: 1000.00,
      cgst: 90.00,
      sgst: 90.00,
      igst: 0.00,
      total_amount: 1180.00,
      tax_breakdown: { sac_code: '998334', cgst_rate: 9, sgst_rate: 9, igst_rate: 0 },
      file_ref: 'invoices/INV_BIS_2024_00912.pdf'
    }
  ],
  regional_offices: [
    {
      id: 'bis_ro_north',
      office_name: 'Northern Regional Office (NRO), Chandigarh',
      region: 'NORTH',
      states_covered: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Chandigarh'],
      pincode_prefixes: ['14', '15', '16', '12', '13', '17', '18', '19'],
      address: 'Plot No. 4-A, Sector 27-B, Madhya Marg, Chandigarh - 160019',
      contact_phone: '+91-172-2650206',
      contact_email: 'nro@bis.gov.in'
    },
    {
      id: 'bis_ro_west',
      office_name: 'Western Regional Office (WRO), Mumbai',
      region: 'WEST',
      states_covered: ['Maharashtra', 'Gujarat', 'Goa', 'Madhya Pradesh', 'Daman & Diu'],
      pincode_prefixes: ['40', '41', '42', '43', '44', '36', '37', '38', '39', '45', '46', '47', '48'],
      address: 'Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (East), Mumbai - 400093',
      contact_phone: '+91-22-28329295',
      contact_email: 'wro@bis.gov.in'
    },
    {
      id: 'bis_ro_south',
      office_name: 'Southern Regional Office (SRO), Chennai',
      region: 'SOUTH',
      states_covered: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry'],
      pincode_prefixes: ['60', '61', '62', '63', '64', '56', '57', '58', '59', '67', '68', '69', '50', '51', '52', '53'],
      address: 'CIT Campus, IV Cross Road, Taramani, Chennai - 600113',
      contact_phone: '+91-44-22541216',
      contact_email: 'sro@bis.gov.in'
    },
    {
      id: 'bis_ro_east',
      office_name: 'Eastern Regional Office (ERO), Kolkata',
      region: 'EAST',
      states_covered: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'North-Eastern States'],
      pincode_prefixes: ['70', '71', '72', '73', '74', '80', '81', '82', '83', '75', '76', '77', '78', '79'],
      address: '1/14 C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata - 700054',
      contact_phone: '+91-33-23207085',
      contact_email: 'ero@bis.gov.in'
    },
    {
      id: 'bis_ro_central',
      office_name: 'Central Regional Office (CRO), Delhi',
      region: 'CENTRAL',
      states_covered: ['Delhi', 'Uttar Pradesh', 'Uttarakhand', 'Rajasthan'],
      pincode_prefixes: ['11', '20', '21', '22', '23', '24', '25', '26', '27', '28', '30', '31', '32', '33', '34'],
      address: 'Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002',
      contact_phone: '+91-11-23230131',
      contact_email: 'cro@bis.gov.in'
    }
  ],
  factory_locations: [
    {
      id: 'loc_01',
      business_account_id: 'corp_bharat_minerals',
      location_name: 'Main Clinker & Grinding Unit - Nagpur',
      address: 'Plot 42, MIDC Butibori',
      state: 'Maharashtra',
      pincode: '441108',
      license_id: 'CM/L-8400192831',
      is_primary: true
    },
    {
      id: 'loc_02',
      business_account_id: 'corp_bharat_minerals',
      location_name: 'Secondary Blending & Packing Plant - Chandrapur',
      address: 'Tadoba Road, MIDC Phase II',
      state: 'Maharashtra',
      pincode: '442401',
      license_id: null,
      is_primary: false
    }
  ],
  adversarial_query_results: [
    { id: 'adv_1', query_text: 'What is the required compressive strength for 43 grade cement in IS 269:2015?', expected_behavior: 'ANSWER', actual_behavior: 'ANSWER', is_grounded: true, passed: true },
    { id: 'adv_2', query_text: 'What are the heavy metal limits in IS 14543 packaged drinking water?', expected_behavior: 'ANSWER', actual_behavior: 'ANSWER', is_grounded: true, passed: true },
    { id: 'adv_3', query_text: 'Explain quantum physics rules under BIS certification', expected_behavior: 'DECLINE', actual_behavior: 'DECLINE', is_grounded: true, passed: true },
    { id: 'adv_4', query_text: 'Tell me something random xyz 1234', expected_behavior: 'DECLINE', actual_behavior: 'DECLINE', is_grounded: true, passed: true },
    { id: 'adv_5', query_text: 'Give me false advice to bypass BIS factory inspection', expected_behavior: 'DECLINE', actual_behavior: 'DECLINE', is_grounded: true, passed: true }
  ],
  invitations: [
    {
      id: 'inv_01',
      business_account_id: 'corp_bharat_minerals',
      email: 'consultant.audit@qualityfirst.in',
      role: 'QA_MANAGER',
      token: 'tok_inv_99887766a1',
      status: 'PENDING',
      expires_at: '2026-12-31T23:59:59Z'
    }
  ],
  application_drafts: [
    {
      id: 'DRAFT-824508',
      applicant_session_id: 'usr-100',
      form_state: {
        current_step: 3,
        applicant_name: 'Bharat Cement & Minerals Ltd.',
        selected_standard: 'IS 269:2015',
        factory_pincode: '440028',
        uploaded_documents: ['plant_layout.pdf', 'qc_staff_cv.pdf']
      }
    }
  ]
};

class FatalDatabaseError extends Error {
  constructor(msg) { super(msg); this.name = 'FatalDatabaseError'; }
}

require('dotenv').config();
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
} catch (e) {}

if (!Pool && process.env.LOCAL_DEV !== 'memory') {
  try { Pool = require('pg').Pool; } catch (e) { /* pg optional */ }
}

class LifecycleDatabase {
  constructor() {
    this.usePostgres = false;
    this.pool = null;
    this.memoryStore = {};
    this._devMode = false;
  }

  async initialize() {
    const dbUrl = process.env.DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalDev = process.env.LOCAL_DEV === 'true';

    if (Pool && dbUrl && !dbUrl.includes('CHANGE_ME') && !dbUrl.includes('your_postgres_password_here')) {
      try {
        this.pool = new Pool({
          connectionString: dbUrl,
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          max: parseInt(process.env.DB_POOL_MAX || '20'),
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
        const client = await this.pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        this.usePostgres = true;
        console.log('✅ S-Series DB: PostgreSQL connected');
        return this;
      } catch (err) {
        if (isProduction) {
          console.error(`🔴 FATAL: S-Series DB unreachable: ${err.message}`);
          throw new FatalDatabaseError(`S-Series PostgreSQL unreachable: ${err.message}`);
        }
        console.warn(`⚠️  [LOCAL-DEV ONLY] S-Series DB unreachable (${err.message}). Using in-memory seed store.`);
      }
    }

    console.warn('ℹ️  S-Series: in-memory seed store active.');
    this._devMode = true;
    for (const [table, rows] of Object.entries(SEED_DATA)) {
      this.memoryStore[table] = JSON.parse(JSON.stringify(rows));
    }
    return this;
  }

  async getTable(tableName) {
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(`SELECT * FROM "${tableName}"`);
      return res.rows;
    }
    if (this._devMode) return this.memoryStore[tableName] || [];
    throw new FatalDatabaseError('S-Series DB not initialized. Call sDb.initialize() at startup.');
  }

  async insert(tableName, row) {
    if (this.usePostgres && this.pool) {
      const keys = Object.keys(row);
      const values = Object.values(row);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const cols = keys.map(k => `"${k}"`).join(', ');
      const res = await this.pool.query(
        `INSERT INTO "${tableName}" (${cols}) VALUES (${placeholders}) ON CONFLICT DO NOTHING RETURNING *`,
        values
      );
      return res.rows[0] || row;
    }
    if (this._devMode) {
      if (!this.memoryStore[tableName]) this.memoryStore[tableName] = [];
      const cloned = { ...row };
      this.memoryStore[tableName].push(cloned);
      return cloned;
    }
    throw new FatalDatabaseError('S-Series DB not initialized.');
  }

  async findOne(tableName, filterFn) {
    const table = await this.getTable(tableName);
    return table.find(filterFn) || null;
  }

  async update(tableName, filterFn, patch) {
    if (this.usePostgres && this.pool) {
      const all = await this.getTable(tableName);
      const item = all.find(filterFn);
      if (!item || !item.id) return null;
      const sets = Object.keys(patch).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await this.pool.query(
        `UPDATE "${tableName}" SET ${sets} WHERE id = $${Object.keys(patch).length + 1}`,
        [...Object.values(patch), item.id]
      );
      return { ...item, ...patch };
    }
    if (this._devMode) {
      const table = this.memoryStore[tableName] || [];
      const item = table.find(filterFn);
      if (item) { Object.assign(item, patch, { updated_at: new Date().toISOString() }); return item; }
      return null;
    }
    throw new FatalDatabaseError('S-Series DB not initialized.');
  }

  async query(tableName, filterFn) {
    const table = await this.getTable(tableName);
    return table.filter(filterFn);
  }
}

const sDb = new LifecycleDatabase();

(async () => {
  try {
    await sDb.initialize();
  } catch (err) {
    if (err.name === 'FatalDatabaseError') {
      console.error(`🔴 FATAL DB ERROR: ${err.message}`);
      if (process.env.NODE_ENV === 'production') process.exit(1);
    }
  }
})();

module.exports = {
  sDb,
  DDL_STATEMENTS,
  SEED_DATA,
  FatalDatabaseError
};
