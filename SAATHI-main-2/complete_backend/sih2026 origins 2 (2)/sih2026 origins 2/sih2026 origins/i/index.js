/**
 * Master I-Series (International Trust: I1 to I25) MERN Package
 * Exports all 25 microservice classes from their respective folders.
 */

const { PublicSearchDirectoryService, PUBLIC_DIRECTORY_DATABASE } = require('./I1_public_search_directory_(all_certified_p');
const { ManufacturerProfileService } = require('./I2_public_per_manufacturer_certification_pr');
const { FactoryHealthService } = require('./I3_live_factory_certification_health_status');
const { AccreditedLabsService, ACCREDITED_LABS } = require('./I4_nationwide_searchable_directory_of_accre');
const { DeclarationOfConformityGenerator } = require('./I5_automatic_declaration_of_conformity_gene');
const { UpfrontRiskClassifier } = require('./I6_two_tier_risk_classification_shown_upfro');
const { VoluntaryTrustBadgeService } = require('./I7_optional_voluntary_trust_badge_layer');
const { CertificateQRCodeService } = require('./I8_qr_code_generator_on_every_issued_certif');
const { UnitTraceabilityService } = require('./I9_unique_per_unit_traceability_code_(high_');
const { GenuineClaimCheckerService } = require('./I10_genuine_vs_fake_claim_checker_for_consum');
const { ConsumerTrustScoreService } = require('./I11_public_trust_score___consumer_confidence');
const { UnifiedRecallFeedService, RECALL_FEED } = require('./I12_unified_recall_feed_across_all_indian_re');
const { ConsumerRecallLookupService } = require('./I13_consumer_facing_recall_lookup_tool');
const { CBSchemeRecognitionService } = require('./I14_cb_scheme_cross_recognition_checker_(for');
const { ReducedDocumentationPathwayService } = require('./I15_reduced_documentation_pathway_for_verifi');
const { CategoryWiseTestStandardMapperService } = require('./I16_category_wise_test_standard_mapper_by_pr');
const { QREmbeddedConformityMarkService } = require('./I17_qr_embedded_conformity_mark');
const { CentralCertificateRegistryService } = require('./I18_real_time_central_certificate_registry');
const { CrossMarkEquivalenceService } = require('./I19_cross_mark_equivalence_checker');
const { SharedTCFReuseService } = require('./I20_shared_technical_file_reuse_tool_across_');
const { FormalEscalationLadderService } = require('./I21_formal_escalation_ladder_with_named_resp');
const { EnvironmentalScorecardService } = require('./I22_full_lifecycle_environmental_scorecard_p');
const { SustainabilityBadgeService } = require('./I23_third_party_verified_sustainability_badg');
const { GeMEligibilityService } = require('./I24_government_procurement_eligibility_flag');
const { LiabilityInsuranceService } = require('./I25_optional_liability_insurance_status_fiel');

module.exports = {
  PublicSearchDirectoryService,
  PUBLIC_DIRECTORY_DATABASE,
  ManufacturerProfileService,
  FactoryHealthService,
  AccreditedLabsService,
  ACCREDITED_LABS,
  DeclarationOfConformityGenerator,
  UpfrontRiskClassifier,
  VoluntaryTrustBadgeService,
  CertificateQRCodeService,
  UnitTraceabilityService,
  GenuineClaimCheckerService,
  ConsumerTrustScoreService,
  UnifiedRecallFeedService,
  RECALL_FEED,
  ConsumerRecallLookupService,
  CBSchemeRecognitionService,
  ReducedDocumentationPathwayService,
  CategoryWiseTestStandardMapperService,
  QREmbeddedConformityMarkService,
  CentralCertificateRegistryService,
  CrossMarkEquivalenceService,
  SharedTCFReuseService,
  FormalEscalationLadderService,
  EnvironmentalScorecardService,
  SustainabilityBadgeService,
  GeMEligibilityService,
  LiabilityInsuranceService
};
