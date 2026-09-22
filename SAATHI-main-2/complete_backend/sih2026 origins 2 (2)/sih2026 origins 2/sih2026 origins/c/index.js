/**
 * Master C-Series (Compliance Intelligence: C1 to C46) MERN Package
 */
const { QCOApplicabilityEngine } = require('./C1_qco_applicability_engine');
const { StandardRevisionDiffEngine } = require('./C2_standard_revision___what_changed');
const { ComplianceGapAnalyzer } = require('./C3_compliance_gap_analyzer');
const { ApplicationReadinessCalculator } = require('./C4_application_readiness_score');
const { SchemeSelectorService } = require('./C5_intelligent_scheme_selector');
const { ProductComplianceChainResolver } = require('./C6_product_standard_scheme_test_lab_chain');
const { IntelligentLaboratoryMatcher } = require('./C7_intelligent_laboratory_matcher');
const { RegulatoryChangeAlertService } = require('./C8_regulatory_change_alerts');
const { TestRequirementGenerator } = require('./C9_test_requirement_generator');
const { TechnicalFileGenerator } = require('./C10_technical_file_generator');
const { BISFeeEstimator } = require('./C11_bis_fee_estimator');
const { CertificationTimelineSimulator } = require('./C12_certification_timeline_simulator');
const { ManufacturerTypeIntelligence } = require('./C13_manufacturer_type_intelligence');
const { RenewalIntelligenceService } = require('./C14_renewal_&_expiry_intelligence');
const { ComplianceCalendarService } = require('./C15_compliance_calendar_and_proactive_schedu');
const { EvidenceBasedAnswerBuilder } = require('./C16_evidence_based_answer_builder');
const { SafetyGuardrailService } = require('./C17_saathi_refuses_to_guess');
const { HumanEscalationService } = require('./C18_human_escalation_packet');
const { CompliancePassportService } = require('./C19_compliance_passport');
const { ComplianceImpactSimulator } = require('./C20_regulatory_change_impact_simulator');
const { ProductClassificationAssistant } = require('./C21_product_classification_assistant');
const { MultiStandardConflictEngine } = require('./C22_multi_standard_conflict_detector');
let WhyNotThisStandardEngine;
try { WhyNotThisStandardEngine = require('./C23_why_not_this_standard').WhyNotThisStandardEngine; } catch (_) {
  try { WhyNotThisStandardEngine = require('./C23_why_not_this_standard?').WhyNotThisStandardEngine; } catch (_) {}
}
const { StandardScopeCheckerService } = require('./C24_standard_scope_checker');
const { ClauseRequirementExtractor } = require('./C25_clause_level_requirement_extraction');
// C26-C46 Dual Wiring (Canonical + Archived MERN implementations)
const C26_can = require('./C26_compliance_gap_tracker');
let C26_arc; try { C26_arc = require('../_archive/c-series-duplicates/C26_requirement_dependency_graph'); } catch (_) {}
const RequirementDependencyGraphService = C26_arc?.RequirementDependencyGraphService || C26_can.ComplianceGapTracker;
const ComplianceGapTracker = C26_can.ComplianceGapTracker;

const C27_can = require('./C27_corrective_action_plan_generator');
let C27_arc; try { C27_arc = require('../_archive/c-series-duplicates/C27_what_if_i_change_my_product'); } catch (_) {
  try { C27_arc = require('../_archive/c-series-duplicates/C27_what_if_i_change_my_product?'); } catch (_) {}
}
const WhatIfProductChangeSandbox = C27_arc?.WhatIfProductChangeSandbox || C27_can.CorrectiveActionPlanBuilder;
const CorrectiveActionPlanBuilder = C27_can.CorrectiveActionPlanBuilder;

const C28_can = require('./C28_knowledge_diff_engine');
let C28_arc; try { C28_arc = require('../_archive/c-series-duplicates/C28_product_family___variant_manager'); } catch (_) {}
const ProductFamilyManagerService = C28_arc?.ProductFamilyManagerService || C28_can.KnowledgeDiffEngine;
const KnowledgeDiffEngine = C28_can.KnowledgeDiffEngine;

const C29_can = require('./C29_bis_circular_&_amendment_tracker');
let C29_arc; try { C29_arc = require('../_archive/c-series-duplicates/C29_certification_scope_manager'); } catch (_) {}
const CertificationScopeManager = C29_arc?.CertificationScopeManager || C29_can.BISCircularTracker;
const BISCircularTracker = C29_can.BISCircularTracker;

const C30_can = require('./C30_multi_region_compliance_advisor');
let C30_arc; try { C30_arc = require('../_archive/c-series-duplicates/C30_change_of_product_impact_analysis'); } catch (_) {}
const ChangeOfProductAnalysisService = C30_arc?.ChangeOfProductAnalysisService || C30_can.MultiRegionAdvisor;
const MultiRegionAdvisor = C30_can.MultiRegionAdvisor;

const C31_can = require('./C31_supplier_compliance_aggregator');
let C31_arc; try { C31_arc = require('../_archive/c-series-duplicates/C31_supplier_compliance_checker'); } catch (_) {}
const SupplierComplianceCheckerService = C31_arc?.SupplierComplianceCheckerService || C31_can.SupplierComplianceAggregator;
const SupplierComplianceAggregator = C31_can.SupplierComplianceAggregator;

const C32_can = require('./C32_export_compliance_advisor');
let C32_arc; try { C32_arc = require('../_archive/c-series-duplicates/C32_importer_compliance_mode'); } catch (_) {}
const ImporterComplianceService = C32_arc?.ImporterComplianceService || C32_can.ExportComplianceAdvisor;
const ExportComplianceAdvisor = C32_can.ExportComplianceAdvisor;

const C33_can = require('./C33_compliance_health_score');
let C33_arc; try { C33_arc = require('../_archive/c-series-duplicates/C33_msme_simplification_mode'); } catch (_) {}
const MSMESimplificationService = C33_arc?.MSMESimplificationService || C33_can.ComplianceHealthScorer;
const ComplianceHealthScorer = C33_can.ComplianceHealthScorer;

const C34_can = require('./C34_compliance_chatbot_memory');
let C34_arc; try { C34_arc = require('../_archive/c-series-duplicates/C34_explain_like_i_am_a_manufacturer'); } catch (_) {}
const PlainLanguageManufacturerExplainer = C34_arc?.PlainLanguageManufacturerExplainer || C34_can.ComplianceChatbotMemory;
const ComplianceChatbotMemory = C34_can.ComplianceChatbotMemory;

const C35_can = require('./C35_compliance_evidence_vault');
const EvidenceVaultManager = C35_can.ComplianceEvidenceVaultService;
const ComplianceEvidenceVaultService = C35_can.ComplianceEvidenceVaultService;

const { EvidenceFreshnessService } = require('./C36_evidence_freshness___expiry_detection');

const C37_can = require('./C37_compliance_trend_analytics');
let C37_arc; try { C37_arc = require('../_archive/c-series-duplicates/C37_compliance_audit_trail'); } catch (_) {}
const ComplianceAuditTrailService = C37_arc?.ComplianceAuditTrailService || C37_can.ComplianceTrendAnalytics;
const ComplianceTrendAnalytics = C37_can.ComplianceTrendAnalytics;

const C38_can = require('./C38_automated_compliance_report_generator');
let C38_arc; try { C38_arc = require('../_archive/c-series-duplicates/C38_answer_versioning'); } catch (_) {}
const AnswerVersioningService = C38_arc?.AnswerVersioningService || C38_can.AutomatedComplianceReporter;
const AutomatedComplianceReporter = C38_can.AutomatedComplianceReporter;

const C39_can = require('./C39_notification_orchestrator');
let C39_arc; try { C39_arc = require('../_archive/c-series-duplicates/C39_regulatory_knowledge_diff'); } catch (_) {}
const RegulatoryKnowledgeDiffEngine = C39_arc?.RegulatoryKnowledgeDiffEngine || C39_can.NotificationOrchestrator;
const NotificationOrchestrator = C39_can.NotificationOrchestrator;

const C40_can = require('./C40_compliance_risk_heatmap');
const ComplianceRiskHeatmapEngine = C40_can.RiskHeatmapService;
const RiskHeatmapService = C40_can.RiskHeatmapService;

const C41_can = require('./C41_regulatory_precedent_engine');
let C41_arc; try { C41_arc = require('../_archive/c-series-duplicates/C41_compliance_digital_twin'); } catch (_) {}
const ComplianceDigitalTwinService = C41_arc?.ComplianceDigitalTwinService || C41_can.RegulatoryPrecedentEngine;
const RegulatoryPrecedentEngine = C41_can.RegulatoryPrecedentEngine;

const C42_can = require('./C42_product_lifecycle_compliance_tracker');
let C42_arc; try { C42_arc = require('../_archive/c-series-duplicates/C42_adaptive_compliance_interview'); } catch (_) {}
const AdaptiveComplianceInterviewService = C42_arc?.AdaptiveComplianceInterviewService || C42_can.ProductLifecycleComplianceTracker;
const ProductLifecycleComplianceTracker = C42_can.ProductLifecycleComplianceTracker;

const C43_can = require('./C43_batch_compliance_monitor');
let C43_arc; try { C43_arc = require('../_archive/c-series-duplicates/C43_compliance_second_opinion_mode'); } catch (_) {}
const ComplianceSecondOpinionService = C43_arc?.ComplianceSecondOpinionService || C43_can.BatchComplianceMonitor;
const BatchComplianceMonitor = C43_can.BatchComplianceMonitor;

const C44_can = require('./C44_document_authenticity_verifier');
let C44_arc; try { C44_arc = require('../_archive/c-series-duplicates/C44_bis_expert___officer_copilot'); } catch (_) {}
const BISOfficerCopilotService = C44_arc?.BISOfficerCopilotService || C44_can.DocumentAuthenticityVerifier;
const DocumentAuthenticityVerifier = C44_can.DocumentAuthenticityVerifier;

const C45_can = require('./C45_compliance_peer_benchmarker');
let C45_arc; try { C45_arc = require('../_archive/c-series-duplicates/C45_industry_benchmark_comparison'); } catch (_) {}
const IndustryBenchmarkInsightsService = C45_arc?.IndustryBenchmarkInsightsService || C45_can.CompliancePeerBenchmarker;
const CompliancePeerBenchmarker = C45_can.CompliancePeerBenchmarker;
const compareIndustryBenchmark = (category) => new IndustryBenchmarkInsightsService().getBenchmarks({ product_category: category });

const C46_can = require('./C46_adaptive_learning_engine');
let C46_arc; try { C46_arc = require('../_archive/c-series-duplicates/C46_peer_manufacturer_compliance_insights'); } catch (_) {}
const PeerManufacturerInsightsService = C46_arc?.PeerManufacturerInsightsService || C46_can.AdaptiveLearningEngine;
const AdaptiveLearningEngine = C46_can.AdaptiveLearningEngine;
const getPeerComplianceInsights = C46_arc?.getPeerComplianceInsights || (() => ({}));

module.exports = {
  QCOApplicabilityEngine,
  StandardRevisionDiffEngine,
  ComplianceGapAnalyzer,
  ApplicationReadinessCalculator,
  SchemeSelectorService,
  ProductComplianceChainResolver,
  IntelligentLaboratoryMatcher,
  RegulatoryChangeAlertService,
  TestRequirementGenerator,
  TechnicalFileGenerator,
  BISFeeEstimator,
  CertificationTimelineSimulator,
  ManufacturerTypeIntelligence,
  RenewalIntelligenceService,
  ComplianceCalendarService,
  EvidenceBasedAnswerBuilder,
  SafetyGuardrailService,
  HumanEscalationService,
  CompliancePassportService,
  ComplianceImpactSimulator,
  ProductClassificationAssistant,
  MultiStandardConflictEngine,
  WhyNotThisStandardEngine,
  StandardScopeCheckerService,
  ClauseRequirementExtractor,
  RequirementDependencyGraphService,
  WhatIfProductChangeSandbox,
  ProductFamilyManagerService,
  CertificationScopeManager,
  ChangeOfProductAnalysisService,
  SupplierComplianceCheckerService,
  ImporterComplianceService,
  MSMESimplificationService,
  PlainLanguageManufacturerExplainer,
  EvidenceVaultManager,
  EvidenceFreshnessService,
  ComplianceAuditTrailService,
  AnswerVersioningService,
  RegulatoryKnowledgeDiffEngine,
  ComplianceRiskHeatmapEngine,
  ComplianceDigitalTwinService,
  AdaptiveComplianceInterviewService,
  ComplianceSecondOpinionService,
  BISOfficerCopilotService,
  IndustryBenchmarkInsightsService,
  compareIndustryBenchmark,
  PeerManufacturerInsightsService,
  getPeerComplianceInsights
};
