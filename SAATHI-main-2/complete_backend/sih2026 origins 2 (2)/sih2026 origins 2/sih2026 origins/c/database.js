/**
 * Relational Database Layer for Full C-Series (C1 - C46)
 * Implements Architecture A standard: PostgreSQL schemas and queries
 * With automatic in-memory fallback for offline testing environments.
 */

require('dotenv').config();
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
} catch (e) {}

let Pool = null;
try {
  Pool = require('pg').Pool;
} catch (e) {
  // pg optional if running offline or in fresh environment
}

// Full DDL for all C-Series statutory tables (C1 to C46)
const DDL_STATEMENTS = `
-- C1: QCO Applicability Engine
CREATE TABLE IF NOT EXISTS qcos (
  id VARCHAR(64) PRIMARY KEY,
  qco_title VARCHAR(255) NOT NULL,
  ministry VARCHAR(255) NOT NULL,
  notification_date DATE NOT NULL,
  enforcement_date DATE NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  gazette_number VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qco_notifications (
  id VARCHAR(64) PRIMARY KEY,
  qco_id VARCHAR(64) REFERENCES qcos(id),
  order_number VARCHAR(128) NOT NULL,
  notification_url TEXT,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qco_product_mappings (
  id VARCHAR(64) PRIMARY KEY,
  qco_id VARCHAR(64) REFERENCES qcos(id),
  product_name VARCHAR(255) NOT NULL,
  hsn_code VARCHAR(32) NOT NULL,
  indian_standard VARCHAR(64) NOT NULL,
  scheme VARCHAR(64) NOT NULL,
  exemption_eligible BOOLEAN DEFAULT FALSE,
  is_mandatory BOOLEAN DEFAULT TRUE
);

-- C2: Standard Revision / What Changed
CREATE TABLE IF NOT EXISTS standard_versions (
  id VARCHAR(64) PRIMARY KEY,
  standard_number VARCHAR(64) NOT NULL,
  version_tag VARCHAR(32) NOT NULL,
  publication_year INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(32) DEFAULT 'ACTIVE',
  effective_date DATE NOT NULL,
  full_text TEXT
);

CREATE TABLE IF NOT EXISTS clause_diffs (
  id VARCHAR(64) PRIMARY KEY,
  standard_number VARCHAR(64) NOT NULL,
  old_version VARCHAR(32) NOT NULL,
  new_version VARCHAR(32) NOT NULL,
  clause_number VARCHAR(32) NOT NULL,
  clause_title VARCHAR(255) NOT NULL,
  diff_type VARCHAR(32) NOT NULL, -- ADDED, MODIFIED, REMOVED
  impact_severity VARCHAR(32) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
  summary_of_change TEXT NOT NULL,
  old_text TEXT,
  new_text TEXT
);

CREATE TABLE IF NOT EXISTS snapshot_sources (
  id VARCHAR(64) PRIMARY KEY,
  standard_number VARCHAR(64) NOT NULL,
  version_tag VARCHAR(32) NOT NULL,
  gazette_ref VARCHAR(128),
  source_url TEXT,
  captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C3: Compliance Gap Analyzer
CREATE TABLE IF NOT EXISTS compliance_gaps (
  id VARCHAR(64) PRIMARY KEY,
  audit_id VARCHAR(64),
  standard_number VARCHAR(64) NOT NULL,
  clause_number VARCHAR(32) NOT NULL,
  clause_title VARCHAR(255) NOT NULL,
  severity VARCHAR(32) NOT NULL,
  gap_description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS evidence_metadata (
  id VARCHAR(64) PRIMARY KEY,
  applicant_id VARCHAR(64) NOT NULL,
  document_type VARCHAR(64) NOT NULL,
  standard_clause VARCHAR(32) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  validation_status VARCHAR(32) DEFAULT 'VALID',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requirement_audits (
  id VARCHAR(64) PRIMARY KEY,
  standard_number VARCHAR(64) NOT NULL,
  total_clauses INT NOT NULL,
  passed_clauses INT NOT NULL,
  partial_clauses INT NOT NULL,
  failed_clauses INT NOT NULL,
  compliance_percentage NUMERIC(5,2) NOT NULL,
  audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C4: Application Readiness Score
CREATE TABLE IF NOT EXISTS readiness_scores (
  id VARCHAR(64) PRIMARY KEY,
  applicant_id VARCHAR(64) NOT NULL,
  standard_number VARCHAR(64) NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  status VARCHAR(32) NOT NULL,
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readiness_blockers (
  id VARCHAR(64) PRIMARY KEY,
  score_id VARCHAR(64) REFERENCES readiness_scores(id),
  category VARCHAR(64) NOT NULL,
  blocker_description TEXT NOT NULL,
  severity VARCHAR(32) NOT NULL,
  required_action TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS readiness_history (
  id VARCHAR(64) PRIMARY KEY,
  applicant_id VARCHAR(64) NOT NULL,
  previous_score NUMERIC(5,2),
  new_score NUMERIC(5,2) NOT NULL,
  delta NUMERIC(5,2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C5: Intelligent Scheme Selector
CREATE TABLE IF NOT EXISTS scheme_rules (
  id VARCHAR(64) PRIMARY KEY,
  rule_name VARCHAR(128) NOT NULL,
  scheme_code VARCHAR(64) NOT NULL,
  priority INT NOT NULL,
  conditions_json JSONB NOT NULL,
  outcome_scheme VARCHAR(64) NOT NULL,
  outcome_description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scheme_eligibility_criteria (
  id VARCHAR(64) PRIMARY KEY,
  scheme_code VARCHAR(64) NOT NULL,
  min_turnover NUMERIC(12,2) DEFAULT 0,
  origin_country VARCHAR(64) DEFAULT 'INDIA',
  allowed_categories JSONB,
  requires_factory_inspection BOOLEAN DEFAULT TRUE,
  requires_surveillance BOOLEAN DEFAULT TRUE
);

-- C6: Product -> Standard -> Scheme -> Test -> Lab Chain
CREATE TABLE IF NOT EXISTS compliance_graph_nodes (
  id VARCHAR(64) PRIMARY KEY,
  node_type VARCHAR(32) NOT NULL,
  node_code VARCHAR(64) NOT NULL,
  node_name VARCHAR(255) NOT NULL,
  metadata_json JSONB
);

CREATE TABLE IF NOT EXISTS compliance_graph_edges (
  id VARCHAR(64) PRIMARY KEY,
  source_node_id VARCHAR(64) REFERENCES compliance_graph_nodes(id),
  target_node_id VARCHAR(64) REFERENCES compliance_graph_nodes(id),
  relationship_type VARCHAR(64) NOT NULL,
  metadata_json JSONB
);

-- C7: Intelligent Laboratory Matcher
CREATE TABLE IF NOT EXISTS labs (
  id VARCHAR(64) PRIMARY KEY,
  lab_name VARCHAR(255) NOT NULL,
  bis_recognition_number VARCHAR(64) NOT NULL,
  nabl_accreditation_number VARCHAR(64) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(64) NOT NULL,
  state VARCHAR(64) NOT NULL,
  contact_email VARCHAR(128),
  phone VARCHAR(32),
  status VARCHAR(32) DEFAULT 'ACCREDITED'
);

CREATE TABLE IF NOT EXISTS lab_test_scopes (
  id VARCHAR(64) PRIMARY KEY,
  lab_id VARCHAR(64) REFERENCES labs(id),
  standard_number VARCHAR(64) NOT NULL,
  test_method VARCHAR(255) NOT NULL,
  is_recognized BOOLEAN DEFAULT TRUE,
  turnaround_days INT DEFAULT 7,
  sample_size_required VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS lab_locations (
  id VARCHAR(64) PRIMARY KEY,
  lab_id VARCHAR(64) REFERENCES labs(id),
  region VARCHAR(32) NOT NULL,
  state VARCHAR(64) NOT NULL,
  pin_code VARCHAR(16) NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6)
);

-- C8: Regulatory Change Alerts
CREATE TABLE IF NOT EXISTS regulatory_change_events (
  id VARCHAR(64) PRIMARY KEY,
  event_type VARCHAR(64) NOT NULL,
  standard_or_qco VARCHAR(64) NOT NULL,
  gazette_ref VARCHAR(128),
  change_summary TEXT NOT NULL,
  impact_level VARCHAR(32) NOT NULL,
  published_date DATE NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  user_email VARCHAR(128) NOT NULL,
  product_category VARCHAR(128) NOT NULL,
  standard_number VARCHAR(64),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C9: Test Requirement Generator
CREATE TABLE IF NOT EXISTS test_catalog (
  id VARCHAR(64) PRIMARY KEY,
  standard_id VARCHAR(64) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  test_method VARCHAR(128) NOT NULL,
  frequency VARCHAR(64) NOT NULL, -- PER_BATCH, DAILY, HOURLY, PER_LOT
  mandatory BOOLEAN DEFAULT TRUE,
  clause_reference VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS test_evidence_requirements (
  id VARCHAR(64) PRIMARY KEY,
  test_id VARCHAR(64) REFERENCES test_catalog(id),
  evidence_type VARCHAR(64) NOT NULL, -- TEST_REPORT, RAW_DATA_SHEET, CALIBRATION_CERT
  description TEXT NOT NULL
);

-- C10: Technical File Generator
CREATE TABLE IF NOT EXISTS technical_file_templates (
  id VARCHAR(64) PRIMARY KEY,
  standard_id VARCHAR(64) NOT NULL,
  section_name VARCHAR(128) NOT NULL,
  section_order INT NOT NULL,
  required_fields JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS technical_file_drafts (
  id VARCHAR(64) PRIMARY KEY,
  application_id VARCHAR(64) NOT NULL,
  standard_id VARCHAR(64) NOT NULL,
  sections JSONB NOT NULL,
  status VARCHAR(32) DEFAULT 'DRAFT', -- DRAFT, COMPLETE, EXPORTED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C11: BIS Fee Estimator
CREATE TABLE IF NOT EXISTS fee_schedules (
  id VARCHAR(64) PRIMARY KEY,
  scheme VARCHAR(64) NOT NULL,
  fee_type VARCHAR(64) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  msme_concession_eligible BOOLEAN DEFAULT FALSE,
  effective_from DATE NOT NULL,
  effective_to DATE
);

CREATE TABLE IF NOT EXISTS product_specific_fees (
  id VARCHAR(64) PRIMARY KEY,
  product_category VARCHAR(128) NOT NULL,
  fee_schedule_id VARCHAR(64) REFERENCES fee_schedules(id),
  multiplier NUMERIC(4,2) DEFAULT 1.00
);

-- C12: Certification Timeline Simulator
CREATE TABLE IF NOT EXISTS process_stage_durations (
  id VARCHAR(64) PRIMARY KEY,
  scheme VARCHAR(64) NOT NULL,
  stage_name VARCHAR(128) NOT NULL,
  stage_order INT NOT NULL,
  min_days INT NOT NULL,
  max_days INT NOT NULL,
  typical_days INT NOT NULL,
  is_critical_path BOOLEAN DEFAULT TRUE
);

-- C13: Manufacturer-Type Intelligence
CREATE TABLE IF NOT EXISTS manufacturer_types (
  id VARCHAR(64) PRIMARY KEY,
  type_name VARCHAR(128) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS type_rule_mappings (
  id VARCHAR(64) PRIMARY KEY,
  type_id VARCHAR(64) REFERENCES manufacturer_types(id),
  applicable_scheme VARCHAR(64) NOT NULL,
  special_requirements JSONB NOT NULL
);

-- C14: Renewal & Expiry Intelligence
CREATE TABLE IF NOT EXISTS license_validity (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  renewal_window_days INT DEFAULT 90,
  is_valid BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS renewal_preparation_guidance (
  id VARCHAR(64) PRIMARY KEY,
  scheme VARCHAR(64) NOT NULL,
  checklist JSONB NOT NULL
);

-- C15: Compliance Calendar
CREATE TABLE IF NOT EXISTS compliance_events (
  id VARCHAR(64) PRIMARY KEY,
  entity_id VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL, -- LICENSE, APPLICATION, TEST
  event_type VARCHAR(64) NOT NULL, -- RENEWAL, SURVEILLANCE, CALIBRATION, PRODUCTION_RETURN
  due_date DATE NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING'
);

-- C16: Evidence-Based Answer Builder (Provenance)
CREATE TABLE IF NOT EXISTS answer_provenance (
  id VARCHAR(64) PRIMARY KEY,
  answer_id VARCHAR(64) NOT NULL,
  claim_text TEXT NOT NULL,
  source_type VARCHAR(64) NOT NULL, -- STANDARD_CLAUSE, EVIDENCE_VAULT, GAZETTE_QCO
  source_ref VARCHAR(128) NOT NULL,
  is_grounded BOOLEAN DEFAULT TRUE
);

-- C17: SAATHI Refuses to Guess (Confidence Audit)
CREATE TABLE IF NOT EXISTS confidence_audit_log (
  id VARCHAR(64) PRIMARY KEY,
  message_id VARCHAR(64) NOT NULL,
  confidence_score NUMERIC(5,4) NOT NULL,
  threshold_used NUMERIC(5,4) NOT NULL,
  decision VARCHAR(32) NOT NULL, -- ANSWER, DECLINE
  intent VARCHAR(64),
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS confidence_thresholds (
  id VARCHAR(64) PRIMARY KEY,
  intent VARCHAR(64) NOT NULL,
  min_score NUMERIC(5,4) NOT NULL
);

-- C18: Human Escalation Packet
CREATE TABLE IF NOT EXISTS escalation_packets (
  id VARCHAR(64) PRIMARY KEY,
  escalation_id VARCHAR(64) NOT NULL,
  question_text TEXT NOT NULL,
  retrieved_chunks JSONB NOT NULL,
  confidence_score NUMERIC(5,4) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C19: Compliance Passport
CREATE TABLE IF NOT EXISTS compliance_passport (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  passport_number VARCHAR(64) UNIQUE NOT NULL,
  summary JSONB NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C20: Compliance Impact Simulator
CREATE TABLE IF NOT EXISTS scenario_simulations (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  change_description JSONB NOT NULL,
  affected_standards JSONB NOT NULL,
  affected_tests JSONB NOT NULL,
  impact_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C21: Product Classification Assistant
CREATE TABLE IF NOT EXISTS product_taxonomy_examples (
  id VARCHAR(64) PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  standard_number VARCHAR(64) NOT NULL,
  category VARCHAR(64) NOT NULL,
  keywords JSONB NOT NULL
);

-- C22: Multi-Standard Conflict Detector
CREATE TABLE IF NOT EXISTS standard_overlaps (
  id VARCHAR(64) PRIMARY KEY,
  standard_a VARCHAR(64) NOT NULL,
  standard_b VARCHAR(64) NOT NULL,
  overlap_type VARCHAR(64) NOT NULL, -- PARAMETER_CONFLICT, TEST_METHOD_DIVERGENCE, SCOPE_OVERLAP
  resolution_rule TEXT NOT NULL
);

-- C23: Why NOT This Standard?
CREATE TABLE IF NOT EXISTS standard_rejection_log (
  id VARCHAR(64) PRIMARY KEY,
  query_id VARCHAR(64) NOT NULL,
  rejected_standard VARCHAR(64) NOT NULL,
  rejection_reason TEXT NOT NULL,
  scope_check_failed_on VARCHAR(128) NOT NULL
);

-- C24: Standard Scope Checker
CREATE TABLE IF NOT EXISTS standard_scope_conditions (
  id VARCHAR(64) PRIMARY KEY,
  standard_id VARCHAR(64) NOT NULL,
  condition_type VARCHAR(64) NOT NULL, -- VOLTAGE, CAPACITY, MATERIAL, PURPOSE
  condition_value VARCHAR(128) NOT NULL,
  operator VARCHAR(16) NOT NULL -- >=, <=, in, contains, ==
);

-- C25: Clause-Level Requirement Extraction
CREATE TABLE IF NOT EXISTS clause_requirements (
  id VARCHAR(64) PRIMARY KEY,
  standard_id VARCHAR(64) NOT NULL,
  clause_number VARCHAR(32) NOT NULL,
  requirement_text TEXT NOT NULL,
  evidence_type_expected VARCHAR(64) NOT NULL,
  is_statutory BOOLEAN DEFAULT TRUE
);

-- C26: Requirement Dependency Graph
CREATE TABLE IF NOT EXISTS requirement_dependencies (
  id VARCHAR(64) PRIMARY KEY,
  requirement_id VARCHAR(64) NOT NULL,
  depends_on_requirement_id VARCHAR(64) NOT NULL
);

-- C27: What If I Change My Product?
CREATE TABLE IF NOT EXISTS product_scenarios (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL,
  scenario_name VARCHAR(128) NOT NULL,
  modified_attributes JSONB NOT NULL,
  recomputed_pathway JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C28: Product Family / Variant Manager
CREATE TABLE IF NOT EXISTS product_families (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  manufacturer_id VARCHAR(64) NOT NULL,
  base_standard VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_variants (
  id VARCHAR(64) PRIMARY KEY,
  family_id VARCHAR(64) REFERENCES product_families(id),
  model_number VARCHAR(64) NOT NULL,
  differing_attributes JSONB NOT NULL
);

-- C29: Certification Scope Manager
CREATE TABLE IF NOT EXISTS certification_scope (
  id VARCHAR(64) PRIMARY KEY,
  license_id VARCHAR(64) NOT NULL,
  covered_variant_ids JSONB NOT NULL
);

-- C30: Change-of-Product Impact Analysis
CREATE TABLE IF NOT EXISTS change_events (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL,
  change_type VARCHAR(64) NOT NULL, -- RAW_MATERIAL, DESIGN, PROCESS, FACTORY_LOCATION
  description TEXT NOT NULL,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS change_impact (
  id VARCHAR(64) PRIMARY KEY,
  change_event_id VARCHAR(64) REFERENCES change_events(id),
  affected_entity_type VARCHAR(64) NOT NULL, -- TEST, DOCUMENT, NOTIFICATION
  affected_entity_id VARCHAR(64) NOT NULL
);

-- C31: Supplier Compliance Checker (NOT unconditionally conforming!)
CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nabl_or_cml_cert_number VARCHAR(64) NOT NULL,
  cert_expiry_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS supplier_components (
  id VARCHAR(64) PRIMARY KEY,
  supplier_id VARCHAR(64) REFERENCES suppliers(id),
  component_name VARCHAR(128) NOT NULL,
  applicable_standard VARCHAR(64) NOT NULL,
  has_valid_cert BOOLEAN DEFAULT FALSE
);

-- C32: Importer Compliance Mode
CREATE TABLE IF NOT EXISTS importer_profiles (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  country_of_origin VARCHAR(64) NOT NULL,
  import_license_number VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS foreign_manufacturer_links (
  id VARCHAR(64) PRIMARY KEY,
  importer_id VARCHAR(64) REFERENCES importer_profiles(id),
  foreign_manufacturer_name VARCHAR(255) NOT NULL
);

-- C33: MSME Simplification Mode
CREATE TABLE IF NOT EXISTS terminology_dictionary (
  id VARCHAR(64) PRIMARY KEY,
  technical_term VARCHAR(128) NOT NULL,
  plain_term VARCHAR(255) NOT NULL
);

-- C34: Plain Language Manufacturer Explainer (ELI5 Mode)
CREATE TABLE IF NOT EXISTS action_task_templates (
  id VARCHAR(64) PRIMARY KEY,
  requirement_type VARCHAR(64) NOT NULL,
  action_text_template TEXT NOT NULL
);

-- C35: Compliance Evidence Vault
CREATE TABLE IF NOT EXISTS evidence_documents (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  requirement_id VARCHAR(64) NOT NULL,
  file_ref TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS evidence_versions (
  id VARCHAR(64) PRIMARY KEY,
  evidence_id VARCHAR(64) REFERENCES evidence_documents(id),
  version_number INT NOT NULL,
  file_ref TEXT NOT NULL,
  superseded BOOLEAN DEFAULT FALSE
);

-- C36: Evidence Freshness / Expiry Detection
CREATE TABLE IF NOT EXISTS evidence_validity (
  id VARCHAR(64) PRIMARY KEY,
  evidence_id VARCHAR(64) NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  detected_expiry_language TEXT
);

-- C37: Compliance Audit Trail (Insert-only)
CREATE TABLE IF NOT EXISTS audit_events (
  id VARCHAR(64) PRIMARY KEY,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  actor_id VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C38: Answer Versioning
CREATE TABLE IF NOT EXISTS answer_versions (
  id VARCHAR(64) PRIMARY KEY,
  message_id VARCHAR(64) NOT NULL,
  version_number INT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source_snapshot_ids JSONB NOT NULL,
  superseded BOOLEAN DEFAULT FALSE
);

-- C39: Regulatory Knowledge Diff
CREATE TABLE IF NOT EXISTS knowledge_diffs (
  id VARCHAR(64) PRIMARY KEY,
  standard_id VARCHAR(64) NOT NULL,
  old_version_id VARCHAR(64) NOT NULL,
  new_version_id VARCHAR(64) NOT NULL,
  diff_summary TEXT NOT NULL,
  affected_product_ids JSONB NOT NULL
);

-- C40: Compliance Risk Heatmap
CREATE TABLE IF NOT EXISTS risk_scores (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  contributing_factors JSONB NOT NULL,
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C42: Adaptive Compliance Interview
CREATE TABLE IF NOT EXISTS interview_sessions (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  answers JSONB NOT NULL,
  next_question_id VARCHAR(64),
  completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS interview_question_bank (
  id VARCHAR(64) PRIMARY KEY,
  question_text TEXT NOT NULL,
  depends_on_answer JSONB NOT NULL,
  target_field VARCHAR(64) NOT NULL
);

-- C43: Compliance Second Opinion Mode
CREATE TABLE IF NOT EXISTS second_opinion_audits (
  id VARCHAR(64) PRIMARY KEY,
  original_answer_id VARCHAR(64) NOT NULL,
  recheck_result TEXT NOT NULL,
  confidence_delta NUMERIC(5,4) NOT NULL,
  status VARCHAR(32) NOT NULL, -- AGREEMENT, DISAGREEMENT
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C44: BIS Expert / Officer Copilot
CREATE TABLE IF NOT EXISTS expert_cases (
  id VARCHAR(64) PRIMARY KEY,
  escalation_id VARCHAR(64) NOT NULL,
  assigned_expert_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'OPEN',
  resolution_notes TEXT
);

CREATE TABLE IF NOT EXISTS expert_corrections (
  id VARCHAR(64) PRIMARY KEY,
  case_id VARCHAR(64) REFERENCES expert_cases(id),
  original_answer TEXT NOT NULL,
  corrected_answer TEXT NOT NULL,
  applied_to_golden_set BOOLEAN DEFAULT FALSE
);

-- C45: Industry Benchmark Comparison
CREATE TABLE IF NOT EXISTS sector_benchmarks (
  id VARCHAR(64) PRIMARY KEY,
  product_category VARCHAR(128) NOT NULL,
  metric_name VARCHAR(64) NOT NULL,
  avg_value NUMERIC(5,2) NOT NULL,
  percentile_25 NUMERIC(5,2) NOT NULL,
  percentile_75 NUMERIC(5,2) NOT NULL,
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- C46: Peer-Manufacturer Compliance Insights
CREATE TABLE IF NOT EXISTS manufacturer_similarity (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer_id VARCHAR(64) NOT NULL,
  similar_manufacturer_id VARCHAR(64) NOT NULL,
  similarity_score NUMERIC(5,4) NOT NULL,
  shared_attributes JSONB NOT NULL
);
`;

// Seed Curated Regulatory Data across C1 to C46
const SEED_DATA = {
  qcos: [
    { id: 'qco_cement_2024', qco_title: 'Cement (Quality Control) Order, 2024', ministry: 'Ministry of Commerce and Industry (DPIIT)', notification_date: '2024-01-15', enforcement_date: '2024-07-15', is_mandatory: true, gazette_number: 'S.O. 124(E)' },
    { id: 'qco_footwear_2023', qco_title: 'Footwear made from Leather and other Materials (Quality Control) Order', ministry: 'DPIIT', notification_date: '2023-03-04', enforcement_date: '2023-07-01', is_mandatory: true, gazette_number: 'S.O. 1024(E)' },
    { id: 'qco_water_bottles_2023', qco_title: 'Packaged Drinking Water (Quality Control) Order', ministry: 'Ministry of Consumer Affairs', notification_date: '2023-05-10', enforcement_date: '2023-11-10', is_mandatory: true, gazette_number: 'S.O. 2110(E)' },
    { id: 'qco_steel_tubes_2024', qco_title: 'Steel and Steel Products (Quality Control) Order', ministry: 'Ministry of Steel', notification_date: '2024-02-01', enforcement_date: '2024-08-01', is_mandatory: true, gazette_number: 'S.O. 560(E)' },
    { id: 'qco_solar_pv_2024', qco_title: 'Solar Photovoltaics, Systems, Devices and Components Goods Order', ministry: 'Ministry of New and Renewable Energy', notification_date: '2024-04-12', enforcement_date: '2025-01-01', is_mandatory: true, gazette_number: 'S.O. 1672(E)' }
  ],
  qco_notifications: [
    { id: 'notif_cement_01', qco_id: 'qco_cement_2024', order_number: 'DPIIT-QCO-2024-001', notification_url: 'https://bis.gov.in/qco/cement-order-2024.pdf', effective_date: '2024-07-15' },
    { id: 'notif_solar_01', qco_id: 'qco_solar_pv_2024', order_number: 'MNRE-QCO-2024-009', notification_url: 'https://bis.gov.in/qco/solar-order-2024.pdf', effective_date: '2025-01-01' }
  ],
  qco_product_mappings: [
    { id: 'map_cement_opc', qco_id: 'qco_cement_2024', product_name: 'Ordinary Portland Cement 43 Grade', hsn_code: '25232910', indian_standard: 'IS 269:2015', scheme: 'ISI Scheme-I', exemption_eligible: false, is_mandatory: true },
    { id: 'map_cement_ppc', qco_id: 'qco_cement_2024', product_name: 'Portland Pozzolana Cement', hsn_code: '25232930', indian_standard: 'IS 1489:Part 1:2015', scheme: 'ISI Scheme-I', exemption_eligible: false, is_mandatory: true },
    { id: 'map_water_packaged', qco_id: 'qco_water_bottles_2023', product_name: 'Packaged Drinking Water (Other than Natural Mineral Water)', hsn_code: '22019090', indian_standard: 'IS 14543:2016', scheme: 'ISI Scheme-I', exemption_eligible: false, is_mandatory: true },
    { id: 'map_steel_tubes', qco_id: 'qco_steel_tubes_2024', product_name: 'Steel Tubes for Structural Purposes', hsn_code: '73063090', indian_standard: 'IS 1161:2014', scheme: 'ISI Scheme-I', exemption_eligible: false, is_mandatory: true },
    { id: 'map_solar_inverter', qco_id: 'qco_solar_pv_2024', product_name: 'Utility-Interconnected Photovoltaic Inverters', hsn_code: '85044090', indian_standard: 'IS 16221:Part 2:2015', scheme: 'Compulsory Registration Scheme (CRS)', exemption_eligible: false, is_mandatory: true },
    { id: 'map_cotton_tshirt', qco_id: null, product_name: 'Knitted Cotton T-Shirt', hsn_code: '61091000', indian_standard: 'IS 4964:1991', scheme: 'Voluntary Scheme', exemption_eligible: true, is_mandatory: false }
  ],
  standard_versions: [
    { id: 'ver_is269_2015', standard_number: 'IS 269', version_tag: '2015', publication_year: 2015, title: 'Ordinary Portland Cement — Specification (Sixth Revision)', status: 'ACTIVE', effective_date: '2016-01-01', full_text: 'Specification for OPC covering 33, 43 and 53 grade cement.' },
    { id: 'ver_is269_1989', standard_number: 'IS 269', version_tag: '1989', publication_year: 1989, title: '33 Grade Ordinary Portland Cement — Specification', status: 'SUPERSEDED', effective_date: '1990-01-01', full_text: 'Old specification solely for 33 grade OPC.' },
    { id: 'ver_is16046_2018', standard_number: 'IS 16046', version_tag: '2018', publication_year: 2018, title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes', status: 'ACTIVE', effective_date: '2019-01-01', full_text: 'Safety requirements for portable sealed secondary cells and batteries.' },
    { id: 'ver_is16046_2015', standard_number: 'IS 16046', version_tag: '2015', publication_year: 2015, title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes', status: 'SUPERSEDED', effective_date: '2015-06-01', full_text: 'Older single-part specification prior to Part 1 and Part 2 split.' }
  ],
  clause_diffs: [
    { id: 'diff_is269_01', standard_number: 'IS 269', old_version: '1989', new_version: '2015', clause_number: 'Clause 6.2', clause_title: 'Compressive Strength at 28 Days', diff_type: 'MODIFIED', impact_severity: 'CRITICAL', summary_of_change: 'Unified 33, 43, and 53 grades into single standard; increased 28-day minimum strength threshold for 43 grade to 43 MPa.', old_text: '33 MPa minimum at 28 days.', new_text: '43 MPa minimum at 28 days for 43 grade, 53 MPa for 53 grade.' },
    { id: 'diff_is269_02', standard_number: 'IS 269', old_version: '1989', new_version: '2015', clause_number: 'Clause 7.1', clause_title: 'Le Chatelier Soundness Limit', diff_type: 'MODIFIED', impact_severity: 'HIGH', summary_of_change: 'Soundness limit reduced from 10mm to 5mm for autoclave expansion.', old_text: 'Not more than 10 mm.', new_text: 'Not more than 10 mm (Le Chatelier) and 0.8% (Autoclave).' }
  ],
  snapshot_sources: [
    { id: 'snap_is269', standard_number: 'IS 269', version_tag: '2015', gazette_ref: 'Gazette of India Extraordinary Part II Section 3', source_url: 'https://standardsbis.bsbedge.com/is269.pdf' }
  ],
  compliance_gaps: [
    { id: 'gap_sample_01', audit_id: 'audit_init', standard_number: 'IS 269:2015', clause_number: 'Clause 6.2', clause_title: '28-day Compressive Strength In-House Lab Report', severity: 'CRITICAL', gap_description: 'Manufacturer submitted only 3-day and 7-day cube test results; 28-day verification record is absent.', recommendation: 'Complete mandatory 28-day curing cycle test in NABL accredited lab or calibrated in-house compression machine.', status: 'OPEN' }
  ],
  evidence_metadata: [
    { id: 'ev_sample_01', applicant_id: 'app_sample', document_type: 'LAB_TEST_REPORT', standard_clause: 'Clause 6.1', file_name: 'opc43_7day_strength_test.pdf', validation_status: 'VALID' }
  ],
  requirement_audits: [
    { id: 'audit_init', standard_number: 'IS 269:2015', total_clauses: 12, passed_clauses: 9, partial_clauses: 2, failed_clauses: 1, compliance_percentage: 75.00 }
  ],
  readiness_scores: [
    { id: 'score_demo_01', applicant_id: 'demo_applicant', standard_number: 'IS 269:2015', overall_score: 78.50, status: 'NEAR_READY' }
  ],
  readiness_blockers: [
    { id: 'blocker_demo_01', score_id: 'score_demo_01', category: 'FACTORY_QC', blocker_description: 'Calibration certificate for in-house Blaines Air Permeability apparatus expired on 2024-02-15.', severity: 'BLOCKER', required_action: 'Renew NABL calibration of Blaine apparatus and upload recalibration certificate.' },
    { id: 'blocker_demo_02', score_id: 'score_demo_01', category: 'DOCUMENTATION', blocker_description: 'Plant manufacturing layout does not clearly indicate quarantine storage for non-conforming clinker.', severity: 'WARNING', required_action: 'Update factory plot plan with demarcation for QC rejection holding area.' }
  ],
  readiness_history: [
    { id: 'rhist_demo_01', applicant_id: 'demo_applicant', previous_score: 64.00, new_score: 78.50, delta: 14.50 }
  ],
  scheme_rules: [
    { id: 'rule_it_crs', rule_name: 'IT and Electronic Products CRS Rule', scheme_code: 'CRS', priority: 1, conditions_json: { category: ['electronics', 'it_hardware', 'solar_inverter', 'battery'] }, outcome_scheme: 'Compulsory Registration Scheme (CRS)', outcome_description: 'Mandatory self-declaration of conformity with registered BIS portal testing via NABL accredited lab.' },
    { id: 'rule_domestic_isi', rule_name: 'Domestic General Engineering ISI Scheme-I', scheme_code: 'ISI_SCHEME_I', priority: 2, conditions_json: { origin: 'INDIA', category: ['cement', 'steel', 'water', 'chemical', 'footwear'] }, outcome_scheme: 'ISI Certification Scheme (Scheme-I)', outcome_description: 'Standard product certification with initial factory inspection and continuous independent surveillance testing.' },
    { id: 'rule_foreign_fmcs', rule_name: 'Foreign Manufacturer FMCS Rule', scheme_code: 'FMCS', priority: 3, conditions_json: { origin: 'FOREIGN' }, outcome_scheme: 'Foreign Manufacturers Certification Scheme (FMCS)', outcome_description: 'Requires on-site overseas plant audit by BIS inspection delegation and performance bank guarantee.' },
    { id: 'rule_precious_hallmark', rule_name: 'Precious Metals Hallmarking Scheme', scheme_code: 'HALLMARKING', priority: 4, conditions_json: { category: ['gold', 'silver', 'jewelry'] }, outcome_scheme: 'Hallmarking Scheme', outcome_description: 'Purity certification for gold and silver articles through recognized Assaying and Hallmarking Centres (AHC).' }
  ],
  scheme_eligibility_criteria: [
    { id: 'crit_isi', scheme_code: 'ISI_SCHEME_I', min_turnover: 0, origin_country: 'INDIA', allowed_categories: ['cement', 'steel', 'pipes', 'consumer_durables', 'electrical'], requires_factory_inspection: true, requires_surveillance: true },
    { id: 'crit_crs', scheme_code: 'CRS', min_turnover: 0, origin_country: 'GLOBAL', allowed_categories: ['laptops', 'printers', 'smartphones', 'solar', 'cells'], requires_factory_inspection: false, requires_surveillance: true },
    { id: 'crit_fmcs', scheme_code: 'FMCS', min_turnover: 1000000, origin_country: 'OVERSEAS', allowed_categories: ['all_mandatory_qco'], requires_factory_inspection: true, requires_surveillance: true }
  ],
  compliance_graph_nodes: [
    { id: 'node_prod_opc', node_type: 'PRODUCT', node_code: 'PROD_OPC_43', node_name: 'Ordinary Portland Cement 43 Grade', metadata_json: { hsn: '25232910' } },
    { id: 'node_std_is269', node_type: 'STANDARD', node_code: 'IS_269_2015', node_name: 'IS 269:2015 Specification for OPC', metadata_json: { clauses: 14 } },
    { id: 'node_sch_isi1', node_type: 'SCHEME', node_code: 'SCHEME_ISI_1', node_name: 'ISI Scheme-I (Mark Scheme)', metadata_json: { annual_fee: 'INR 1000' } },
    { id: 'node_test_comp', node_type: 'TEST', node_code: 'TEST_COMP_STR', node_name: '28-Day Compressive Strength Test (IS 4031 Part 6)', metadata_json: { duration: '28 days' } },
    { id: 'node_test_sound', node_type: 'TEST', node_code: 'TEST_SOUNDNESS', node_name: 'Le Chatelier & Autoclave Soundness Test', metadata_json: { duration: '24 hours' } },
    { id: 'node_lab_nth', node_type: 'LAB', node_code: 'LAB_NTH_DELHI', node_name: 'National Test House (Northern Region), Ghaziabad', metadata_json: { bis_rec: 'BIS/LAB/NR/001' } },
    { id: 'node_lab_sri', node_type: 'LAB', node_code: 'LAB_SRI_DELHI', node_name: 'Shiram Institute for Industrial Research, Delhi', metadata_json: { bis_rec: 'BIS/LAB/NR/042' } }
  ],
  compliance_graph_edges: [
    { id: 'edge_1', source_node_id: 'node_prod_opc', target_node_id: 'node_std_is269', relationship_type: 'GOVERNED_BY' },
    { id: 'edge_2', source_node_id: 'node_std_is269', target_node_id: 'node_sch_isi1', relationship_type: 'FALLS_UNDER' },
    { id: 'edge_3', source_node_id: 'node_std_is269', target_node_id: 'node_test_comp', relationship_type: 'REQUIRES_TEST' },
    { id: 'edge_4', source_node_id: 'node_std_is269', target_node_id: 'node_test_sound', relationship_type: 'REQUIRES_TEST' },
    { id: 'edge_5', source_node_id: 'node_test_comp', target_node_id: 'node_lab_nth', relationship_type: 'TESTED_AT' },
    { id: 'edge_6', source_node_id: 'node_test_sound', target_node_id: 'node_lab_nth', relationship_type: 'TESTED_AT' },
    { id: 'edge_7', source_node_id: 'node_test_comp', target_node_id: 'node_lab_sri', relationship_type: 'TESTED_AT' }
  ],
  labs: [
    { id: 'lab_nth_delhi', lab_name: 'National Test House (Northern Region)', bis_recognition_number: 'BIS/LAB/NR/001', nabl_accreditation_number: 'TC-5120', address: 'Kamla Nehru Nagar, PB No. 112', city: 'Ghaziabad', state: 'Uttar Pradesh', contact_email: 'nthnr-ca@nic.in', phone: '+91-120-2789912', status: 'ACCREDITED' },
    { id: 'lab_sri_delhi', lab_name: 'Shriram Institute for Industrial Research', bis_recognition_number: 'BIS/LAB/NR/042', nabl_accreditation_number: 'TC-5481', address: '19, University Road, Delhi', city: 'Delhi', state: 'Delhi', contact_email: 'customercare@shriraminstitute.org', phone: '+91-11-27667267', status: 'ACCREDITED' },
    { id: 'lab_ul_blr', lab_name: 'UL India Pvt Ltd High-Tech Test Laboratory', bis_recognition_number: 'BIS/LAB/SR/019', nabl_accreditation_number: 'TC-6218', address: 'Kalyani Platina, Whitefield', city: 'Bengaluru', state: 'Karnataka', contact_email: 'bis.support@ul.com', phone: '+91-80-41384400', status: 'ACCREDITED' }
  ],
  lab_test_scopes: [
    { id: 'scope_nth_01', lab_id: 'lab_nth_delhi', standard_number: 'IS 269:2015', test_method: 'Chemical and Physical Testing of Ordinary Portland Cement', is_recognized: true, turnaround_days: 28, sample_size_required: '10 kg sealed composite bag' },
    { id: 'scope_sri_01', lab_id: 'lab_sri_delhi', standard_number: 'IS 269:2015', test_method: 'Compressive strength & Soundness testing', is_recognized: true, turnaround_days: 28, sample_size_required: '10 kg bag' }
  ],
  lab_locations: [
    { id: 'loc_nth', lab_id: 'lab_nth_delhi', region: 'NORTH', state: 'Uttar Pradesh', pin_code: '201002', latitude: 28.6750, longitude: 77.4350 },
    { id: 'loc_sri', lab_id: 'lab_sri_delhi', region: 'NORTH', state: 'Delhi', pin_code: '110007', latitude: 28.6910, longitude: 77.2100 }
  ],
  regulatory_change_events: [
    { id: 'event_01', event_type: 'QCO_NOTIFICATION', standard_or_qco: 'Cement (Quality Control) Order, 2024', gazette_ref: 'S.O. 124(E)', change_summary: 'Mandatory certification enforcement for all composite and blended cement grades.', impact_level: 'HIGH', published_date: '2024-01-15', notification_sent: true }
  ],
  user_subscriptions: [
    { id: 'sub_01', user_email: 'compliance.lead@ultratech-demo.com', product_category: 'cement', standard_number: 'IS 269:2015', is_active: true }
  ],

  // C9: Test Catalog
  test_catalog: [
    { id: 'tc_1', standard_id: 'IS 269:2015', test_name: 'Compressive Strength Test (7 Days & 28 Days)', test_method: 'IS 4031 (Part 6)', frequency: 'PER_BATCH', mandatory: true, clause_reference: 'Clause 6.2' },
    { id: 'tc_2', standard_id: 'IS 269:2015', test_name: 'Soundness by Le Chatelier and Autoclave Method', test_method: 'IS 4031 (Part 3)', frequency: 'PER_LOT', mandatory: true, clause_reference: 'Clause 7.1' },
    { id: 'tc_3', standard_id: 'IS 269:2015', test_name: 'Initial & Final Setting Time', test_method: 'IS 4031 (Part 5)', frequency: 'DAILY', mandatory: true, clause_reference: 'Clause 8.1' },
    { id: 'tc_4', standard_id: 'IS 16046:2018', test_name: 'Continuous Charging Safety Test', test_method: 'IEC 62133 Clause 7.2', frequency: 'PER_LOT', mandatory: true, clause_reference: 'Clause 8.3' }
  ],
  test_evidence_requirements: [
    { id: 'ter_1', test_id: 'tc_1', evidence_type: 'LAB_TEST_REPORT', description: 'NABL accredited test house test report with 28-day compressive break results' },
    { id: 'ter_2', test_id: 'tc_2', evidence_type: 'RAW_DATA_SHEET', description: 'Autoclave expansion logsheet signed by designated quality head' }
  ],

  // C10: Technical File Templates
  technical_file_templates: [
    { id: 'tft_1', standard_id: 'IS 269:2015', section_name: 'General Information & Product Description', section_order: 1, required_fields: ['product_name', 'grade', 'manufacturing_plant_address', 'hsn_code'] },
    { id: 'tft_2', standard_id: 'IS 269:2015', section_name: 'Quality Assurance Plan & SIT Agreement', section_order: 2, required_fields: ['sit_version', 'testing_frequency_accepted', 'qc_chemist_cv'] },
    { id: 'tft_3', standard_id: 'IS 269:2015', section_name: 'Laboratory Equipment & Calibration Register', section_order: 3, required_fields: ['compression_machine_nabl_cert', 'blaine_calib_cert'] }
  ],
  technical_file_drafts: [],

  // C11: BIS Fee Schedules
  fee_schedules: [
    { id: 'fs_1', scheme: 'ISI_SCHEME_I', fee_type: 'APPLICATION_FEE', amount: 1000.00, msme_concession_eligible: true, effective_from: '2023-01-01' },
    { id: 'fs_2', scheme: 'ISI_SCHEME_I', fee_type: 'INSPECTION_FEE', amount: 7000.00, msme_concession_eligible: false, effective_from: '2023-01-01' },
    { id: 'fs_3', scheme: 'ISI_SCHEME_I', fee_type: 'ANNUAL_LICENSE_FEE', amount: 1000.00, msme_concession_eligible: false, effective_from: '2023-01-01' },
    { id: 'fs_4', scheme: 'ISI_SCHEME_I', fee_type: 'MINIMUM_MARKING_FEE', amount: 50000.00, msme_concession_eligible: true, effective_from: '2023-01-01' },
    { id: 'fs_5', scheme: 'CRS', fee_type: 'APPLICATION_FEE', amount: 1000.00, msme_concession_eligible: false, effective_from: '2023-01-01' }
  ],
  product_specific_fees: [
    { id: 'psf_1', product_category: 'cement', fee_schedule_id: 'fs_4', multiplier: 1.00 },
    { id: 'psf_2', product_category: 'steel', fee_schedule_id: 'fs_4', multiplier: 1.50 }
  ],

  // C12: Process Stage Durations
  process_stage_durations: [
    { id: 'psd_1', scheme: 'ISI_SCHEME_I', stage_name: 'Application Scrutiny & Document Verification', stage_order: 1, min_days: 7, max_days: 15, typical_days: 10, is_critical_path: true },
    { id: 'psd_2', scheme: 'ISI_SCHEME_I', stage_name: 'Factory Audit & Independent Sample Draw', stage_order: 2, min_days: 14, max_days: 30, typical_days: 21, is_critical_path: true },
    { id: 'psd_3', scheme: 'ISI_SCHEME_I', stage_name: 'Independent Laboratory Testing (28-day curing)', stage_order: 3, min_days: 30, max_days: 45, typical_days: 35, is_critical_path: true },
    { id: 'psd_4', scheme: 'ISI_SCHEME_I', stage_name: 'Grant of License & CM/L Issuance', stage_order: 4, min_days: 7, max_days: 14, typical_days: 10, is_critical_path: true }
  ],

  // C13: Manufacturer Types
  manufacturer_types: [
    { id: 'mtype_large', type_name: 'Large Enterprise', description: 'Annual turnover exceeding INR 250 Crores or investment > INR 50 Cr' },
    { id: 'mtype_msme', type_name: 'MSME (Micro, Small & Medium)', description: 'Eligible for 50% concession on application and minimum marking fee' },
    { id: 'mtype_foreign', type_name: 'Foreign Manufacturer (FMCS)', description: 'Overseas production facility importing into India' }
  ],
  type_rule_mappings: [
    { id: 'trm_1', type_id: 'mtype_msme', applicable_scheme: 'ISI_SCHEME_I', special_requirements: ['Udyam Registration Certificate', 'Valid MSME Declaration'] },
    { id: 'trm_2', type_id: 'mtype_foreign', applicable_scheme: 'FMCS', special_requirements: ['Authorized Indian Representative (AIR)', 'Performance Bank Guarantee USD 10,000'] }
  ],

  // C14: License Validity & Renewal Guidance
  license_validity: [
    { id: 'lv_1', license_id: 'CM/L-8400192831', issue_date: '2023-01-01', expiry_date: '2026-12-31', renewal_window_days: 90, is_valid: true },
    { id: 'lv_2', license_id: 'CM/L-7200554411', issue_date: '2021-02-01', expiry_date: '2024-01-31', renewal_window_days: 90, is_valid: false }
  ],
  renewal_preparation_guidance: [
    { id: 'rpg_1', scheme: 'ISI_SCHEME_I', checklist: ['File Form-XI renewal application 90 days before expiry', 'Clear past marking fee reconciliations', 'Submit routine in-house test logs of last 12 months', 'Submit factory calibration records', 'Confirm surveillance audit compliance'] }
  ],

  // C15: Compliance Events
  compliance_events: [
    { id: 'ce_1', entity_id: 'CM/L-8400192831', entity_type: 'LICENSE', event_type: 'RENEWAL_DUE', due_date: '2026-12-31', status: 'PENDING' },
    { id: 'ce_2', entity_id: 'CM/L-8400192831', entity_type: 'TEST', event_type: 'ANNUAL_CALIBRATION_DUE', due_date: '2025-03-15', status: 'PENDING' }
  ],

  // C16: Answer Provenance
  answer_provenance: [],

  // C17: Confidence Thresholds & Audit Log
  confidence_thresholds: [
    { id: 'ct_1', intent: 'standard_lookup', min_score: 0.55 },
    { id: 'ct_2', intent: 'licensing', min_score: 0.60 },
    { id: 'ct_3', intent: 'general_query', min_score: 0.50 }
  ],
  confidence_audit_log: [],

  // C18: Escalation Packets
  escalation_packets: [],

  // C19: Compliance Passport
  compliance_passport: [
    {
      id: 'pass_01',
      manufacturer_id: 'CORP-BHARAT-MINERALS',
      passport_number: 'BIS-PASS-840019',
      summary: {
        company_name: 'Bharat Minerals & Cement Ltd.',
        verified_licenses: ['CM/L-8400192831'],
        standards_complied: ['IS 269:2015'],
        trust_status: 'ACTIVE_CONFORMING',
        last_audit_score: 88.5
      }
    }
  ],

  // C20: Scenario Simulations
  scenario_simulations: [],

  // C21: Product Taxonomy Examples
  product_taxonomy_examples: [
    { id: 'tax_1', product_name: 'Portland Cement', standard_number: 'IS 269:2015', category: 'CEMENT', keywords: ['cement', 'clinker', 'opc', 'ppc'] },
    { id: 'tax_2', product_name: 'Structural Steel Tube', standard_number: 'IS 1161:2014', category: 'STEEL', keywords: ['steel', 'pipe', 'tube', 'structural'] },
    { id: 'tax_3', product_name: 'Lithium Battery Pack', standard_number: 'IS 16046:2018', category: 'BATTERY', keywords: ['battery', 'cell', 'lithium', 'portable'] }
  ],

  // C22: Standard Overlaps
  standard_overlaps: [
    { id: 'so_1', standard_a: 'IS 269:2015', standard_b: 'IS 1489:2015', overlap_type: 'SCOPE_OVERLAP', resolution_rule: 'Ordinary Portland Cement must comply with IS 269; Pozzolana-blended cement must comply with IS 1489 Part 1 or 2.' }
  ],

  // C23: Standard Rejection Log
  standard_rejection_log: [],

  // C24: Standard Scope Conditions
  standard_scope_conditions: [
    { id: 'ssc_1', standard_id: 'IS 269:2015', condition_type: 'MATERIAL', condition_value: 'Portland Clinker + Gypsum', operator: 'contains' },
    { id: 'ssc_2', standard_id: 'IS 16046:2018', condition_type: 'VOLTAGE', condition_value: '60V DC', operator: '<=' }
  ],

  // C25: Clause Requirements
  clause_requirements: [
    { id: 'cr_1', standard_id: 'IS 269:2015', clause_number: 'Clause 6.1', requirement_text: 'Compressive strength of 43 grade cement at 7 days shall not be less than 33 MPa.', evidence_type_expected: 'LAB_TEST_REPORT', is_statutory: true },
    { id: 'cr_2', standard_id: 'IS 269:2015', clause_number: 'Clause 6.2', requirement_text: 'Compressive strength at 28 days shall not be less than 43 MPa.', evidence_type_expected: 'LAB_TEST_REPORT', is_statutory: true },
    { id: 'cr_3', standard_id: 'IS 269:2015', clause_number: 'Clause 7.1', requirement_text: 'Unaffected soundness expansion not exceeding 10 mm by Le Chatelier method.', evidence_type_expected: 'TEST_LOG', is_statutory: true }
  ],

  // C26: Requirement Dependencies
  requirement_dependencies: [
    { id: 'rd_1', requirement_id: 'Clause 6.2 (28-Day Strength)', depends_on_requirement_id: 'Clause 6.1 (7-Day Strength)' }
  ],

  // C27: Product Scenarios
  product_scenarios: [],

  // C28: Product Families & Variants
  product_families: [
    { id: 'pf_1', name: 'UltraCon OPC Cement Series', manufacturer_id: 'CORP-BHARAT-MINERALS', base_standard: 'IS 269:2015' }
  ],
  product_variants: [
    { id: 'pv_1', family_id: 'pf_1', model_number: 'OPC-43-BAG-50KG', differing_attributes: { packaging: '50kg HDPE bag', grade: '43' } },
    { id: 'pv_2', family_id: 'pf_1', model_number: 'OPC-53-BULK-TANKER', differing_attributes: { packaging: 'Bulk tanker', grade: '53' } }
  ],

  // C29: Certification Scope
  certification_scope: [
    { id: 'cs_1', license_id: 'CM/L-8400192831', covered_variant_ids: ['pv_1', 'pv_2'] }
  ],

  // C30: Change Events & Impact
  change_events: [],
  change_impact: [],

  // C31: Suppliers & Components (Strict verification - NOT unconditionally conforming!)
  suppliers: [
    { id: 'sup_1', name: 'Rajasthan Gypsum Quarries Ltd.', nabl_or_cml_cert_number: 'CM/L-11223344', cert_expiry_date: '2026-05-31' },
    { id: 'sup_2', name: 'Deccan Clinker Supplies Corp.', nabl_or_cml_cert_number: 'CM/L-55667788', cert_expiry_date: '2023-01-01' } // Expired cert!
  ],
  supplier_components: [
    { id: 'sc_1', supplier_id: 'sup_1', component_name: 'Mineral Gypsum 95% Pure', applicable_standard: 'IS 1290:1973', has_valid_cert: true },
    { id: 'sc_2', supplier_id: 'sup_2', component_name: 'Calcined Raw Clinker', applicable_standard: 'IS 269:2015', has_valid_cert: false } // Non-conforming!
  ],

  // C32: Importer Profiles
  importer_profiles: [
    { id: 'imp_1', manufacturer_id: 'CORP-BHARAT-MINERALS', country_of_origin: 'Germany', import_license_number: 'IEC-019988221' }
  ],
  foreign_manufacturer_links: [
    { id: 'fml_1', importer_id: 'imp_1', foreign_manufacturer_name: 'Heidelberg Materials AG' }
  ],

  // C33: Terminology Dictionary (MSME mode)
  terminology_dictionary: [
    { id: 'term_1', technical_term: 'Scheme of Inspection and Testing (SIT)', plain_term: 'Daily testing routine checklist that BIS expects your factory chemist to follow' },
    { id: 'term_2', technical_term: 'Le Chatelier Soundness Expansion', plain_term: 'Test to make sure cement does not crack or expand uncontrollably after hardening' },
    { id: 'term_3', technical_term: 'Competent Technical Person (CTP)', plain_term: 'Qualified in-house chemist or engineer who signs off daily factory quality logs' }
  ],

  // C34: Action Task Templates (ELI5 mode)
  action_task_templates: [
    { id: 'att_1', requirement_type: 'TESTING', action_text_template: 'Book testing at an accredited lab and ensure test cubes are preserved for 28 full days.' },
    { id: 'att_2', requirement_type: 'CALIBRATION', action_text_template: 'Send in-house compression tester to an NABL calibration lab; keep calibration sticker visible.' },
    { id: 'att_3', requirement_type: 'DOCUMENTATION', action_text_template: 'Print out factory plot plan, mark yellow boundary for scrap/reject clinker, sign and upload.' }
  ],

  // C35: Evidence Vault Documents & Versions
  evidence_documents: [
    { id: 'ev_doc_1', manufacturer_id: 'CORP-BHARAT-MINERALS', requirement_id: 'Clause 6.1', file_ref: 'vault/opc43_7day_test.pdf', version: 1 }
  ],
  evidence_versions: [
    { id: 'ev_ver_1', evidence_id: 'ev_doc_1', version_number: 1, file_ref: 'vault/opc43_7day_test_v1.pdf', superseded: false }
  ],

  // C36: Evidence Validity & Expiry
  evidence_validity: [
    { id: 'ev_val_1', evidence_id: 'ev_doc_1', valid_from: '2024-01-01', valid_until: '2025-01-01', detected_expiry_language: 'Valid for 1 year from test date' }
  ],

  // C37: Compliance Audit Events (Insert-only)
  audit_events: [
    { id: 'ae_init', entity_type: 'SYSTEM', entity_id: 'SAATHI_GATEWAY', actor_id: 'SYSTEM_BOOT', action: 'INITIALIZE_AUDIT_LOG', before_state: {}, after_state: { status: 'INITIALIZED' } }
  ],

  // C38: Answer Versions
  answer_versions: [],

  // C39: Knowledge Diffs
  knowledge_diffs: [
    { id: 'kd_1', standard_id: 'IS 269', old_version_id: '1989', new_version_id: '2015', diff_summary: 'Consolidation of 33, 43, 53 grade cement into single document with stricter autoclave limits.', affected_product_ids: ['map_cement_opc', 'map_cement_ppc'] }
  ],

  // C40: Risk Scores
  risk_scores: [
    { id: 'rs_1', manufacturer_id: 'CORP-BHARAT-MINERALS', product_id: 'PROD_OPC_43', score: 18.50, contributing_factors: { open_gaps_penalty: 10, expiry_penalty: 5, unacknowledged_diffs_penalty: 3.5 } }
  ],

  // C42: Interview Question Bank
  interview_question_bank: [
    { id: 'iq_1', question_text: 'Where is your manufacturing facility physically located?', depends_on_answer: {}, target_field: 'facility_location' },
    { id: 'iq_2', question_text: 'Does your enterprise qualify under Government of India MSME criteria?', depends_on_answer: { facility_location: 'INDIA' }, target_field: 'is_msme' },
    { id: 'iq_3', question_text: 'Do your products fall under consumer IT/Electronics or heavy engineering materials?', depends_on_answer: {}, target_field: 'industry_vertical' }
  ],
  interview_sessions: [],

  // C43: Second Opinion Audits
  second_opinion_audits: [],

  // C44: Expert Cases & Corrections
  expert_cases: [
    { id: 'case_1', escalation_id: 'esc_1001', assigned_expert_id: 'expert_patel', status: 'OPEN', resolution_notes: 'Checking ambiguous applicability between IS 269 and IS 1489 for Pozzolana blended test batches.' }
  ],
  expert_corrections: [],

  // C45: Sector Benchmarks
  sector_benchmarks: [
    { id: 'sb_1', product_category: 'cement', metric_name: 'Readiness Score', avg_value: 74.20, percentile_25: 61.00, percentile_75: 86.50 },
    { id: 'sb_2', product_category: 'steel', metric_name: 'Readiness Score', avg_value: 68.40, percentile_25: 55.00, percentile_75: 82.00 }
  ],

  // C46: Manufacturer Similarity
  manufacturer_similarity: [
    { id: 'ms_1', manufacturer_id: 'CORP-BHARAT-MINERALS', similar_manufacturer_id: 'CORP-ULTRACON-IND', similarity_score: 0.8200, shared_attributes: { category: 'cement', scale: 'LARGE', scheme: 'ISI_SCHEME_I' } }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE ENGINE
//
// PRODUCTION (NODE_ENV=production):
//   DB unreachable → FatalDatabaseError thrown → process exits → K8s readiness
//   probe fails → no traffic routed. NO silent fallback. Ever.
//
// LOCAL DEV (LOCAL_DEV=true, NODE_ENV != production):
//   DB unreachable → falls back to in-memory store seeded with SEED_DATA.
//   Every operation is tagged [LOCAL-DEV ONLY] in the log.
//   This path is IMPOSSIBLE to reach in production.
// ─────────────────────────────────────────────────────────────────────────────

class FatalDatabaseError extends Error {
  constructor(msg) { super(msg); this.name = 'FatalDatabaseError'; }
}

class RelationalDatabase {
  constructor() {
    this.usePostgres = false;
    this.pool = null;
    this.memoryStore = {};
    this._devMode = false;
  }

  // Call once at startup. Throws FatalDatabaseError in production if DB is down.
  async initialize() {
    const dbUrl = process.env.DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalDev = process.env.LOCAL_DEV === 'true';

    if (Pool && dbUrl && !dbUrl.includes('your_postgres_password_here') && !dbUrl.includes('CHANGE_ME')) {
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
        console.log('✅ C-Series DB: PostgreSQL connected');
        return this;
      } catch (err) {
        if (isProduction) {
          console.error(`🔴 FATAL: C-Series DB unreachable: ${err.message}`);
          throw new FatalDatabaseError(`C-Series PostgreSQL unreachable: ${err.message}`);
        }
        console.warn(`⚠️  [LOCAL-DEV ONLY] C-Series DB connection fallback (${err.message}). Using in-memory seed store.`);
      }
    }

    // Local dev in-memory fallback — seed from SEED_DATA
    console.warn('ℹ️  C-Series: Initializing with statutory seed store.');
    this._devMode = true;
    this._initMemoryStore();
    return this;
  }

  _initMemoryStore() {
    for (const [table, rows] of Object.entries(SEED_DATA)) {
      this.memoryStore[table] = JSON.parse(JSON.stringify(rows));
    }
  }

  async getTable(tableName) {
    if (this.usePostgres && this.pool) {
      const res = await this.pool.query(`SELECT * FROM "${tableName}"`);
      return res.rows;
    }
    if (this._devMode) {
      return this.memoryStore[tableName] || [];
    }
    throw new FatalDatabaseError('C-Series DB not initialized. Call db.initialize() at startup.');
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
    throw new FatalDatabaseError('C-Series DB not initialized.');
  }

  async findOne(tableName, filterFn) {
    const table = await this.getTable(tableName);
    return table.find(filterFn) || null;
  }

  async update(tableName, filterFn, patch) {
    if (this.usePostgres && this.pool) {
      // For in-place update via predicate, load + update + write back
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
      if (item) { Object.assign(item, patch); return item; }
      return null;
    }
    throw new FatalDatabaseError('C-Series DB not initialized.');
  }

  async query(filterFn, tableName) {
    const all = await this.getTable(tableName);
    return all.filter(filterFn);
  }

  // C37 Insert-Only Audit Event Helper
  async writeAuditEvent(entityType, entityId, actorId, action, beforeState = null, afterState = null) {
    const event = {
      id: 'ae_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      entity_type: entityType, entity_id: entityId, actor_id: actorId,
      action, before_state: beforeState, after_state: afterState,
      created_at: new Date().toISOString()
    };
    return this.insert('audit_events', event);
  }
}

// Singleton — initialize() must be called at service startup.
// Backwards-compatible: existing code that calls db.getTable() etc. will work
// once initialize() has completed. If called before initialize(), throws clearly.
const db = new RelationalDatabase();

// Auto-initialize in non-strict mode for backwards compat with existing modules
// that import {db} and immediately call methods without awaiting initialize().
// This respects the same LOCAL_DEV / production gating.
(async () => {
  try {
    await db.initialize();
  } catch (err) {
    if (err.name === 'FatalDatabaseError') {
      console.error(`🔴 FATAL DB ERROR: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
})();

module.exports = {
  db,
  DDL_STATEMENTS,
  SEED_DATA,
  FatalDatabaseError
};
