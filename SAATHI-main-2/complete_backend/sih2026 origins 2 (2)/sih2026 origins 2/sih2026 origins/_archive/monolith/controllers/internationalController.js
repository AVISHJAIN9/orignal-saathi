/**
 * International Trust (I-Series: I1 to I25) Controller in MERN Stack
 * Delegates all business logic to the native MERN modules located in the `i/` directory.
 */

const {
  PublicSearchDirectoryService,
  ManufacturerProfileService,
  FactoryHealthService,
  AccreditedLabsService,
  DeclarationOfConformityGenerator,
  UpfrontRiskClassifier,
  VoluntaryTrustBadgeService,
  CertificateQRCodeService,
  UnitTraceabilityService,
  GenuineClaimCheckerService,
  ConsumerTrustScoreService,
  UnifiedRecallFeedService,
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
} = require('../../i');

// Service singletons
const publicDirectorySvc = new PublicSearchDirectoryService();
const manufacturerProfileSvc = new ManufacturerProfileService();
const factoryHealthSvc = new FactoryHealthService();
const accreditedLabsSvc = new AccreditedLabsService();
const docGenerator = new DeclarationOfConformityGenerator();
const riskClassifier = new UpfrontRiskClassifier();
const trustBadgeSvc = new VoluntaryTrustBadgeService();
const qrCodeSvc = new CertificateQRCodeService();
const traceabilitySvc = new UnitTraceabilityService();
const genuineClaimSvc = new GenuineClaimCheckerService();
const consumerTrustSvc = new ConsumerTrustScoreService();
const recallFeedSvc = new UnifiedRecallFeedService();
const recallLookupSvc = new ConsumerRecallLookupService();
const cbSchemeSvc = new CBSchemeRecognitionService();
const fastTrackSvc = new ReducedDocumentationPathwayService();
const standardMapperSvc = new CategoryWiseTestStandardMapperService();
const conformityMarkSvc = new QREmbeddedConformityMarkService();
const registrySvc = new CentralCertificateRegistryService();
const crossMarkSvc = new CrossMarkEquivalenceService();
const tcfReuseSvc = new SharedTCFReuseService();
const escalationLadderSvc = new FormalEscalationLadderService();
const environmentalSvc = new EnvironmentalScorecardService();
const sustainabilitySvc = new SustainabilityBadgeService();
const gemEligibilitySvc = new GeMEligibilityService();
const liabilityInsuranceSvc = new LiabilityInsuranceService();

// I1: Public Search Directory
exports.getPublicDirectory = (req, res) => {
  const results = publicDirectorySvc.search(req.query.q);
  res.json({ total: results.length, data: results });
};

// I2: Public Per-Manufacturer Profile
exports.getManufacturerProfile = (req, res) => {
  res.json(manufacturerProfileSvc.getProfile(req.params.name));
};

// I3: Live Factory Certification Health
exports.getFactoryCertificationHealth = (req, res) => {
  res.json(factoryHealthSvc.getHealth(req.params.license_id));
};

// I4: Nationwide Searchable Directory of Accredited Labs
exports.searchAccreditedLabs = (req, res) => {
  res.json(accreditedLabsSvc.searchLabs(req.query));
};

// I5: Automatic Declaration of Conformity (DoC) Generator
exports.generateDeclarationOfConformity = (req, res) => {
  res.json(docGenerator.generateDoC(req.body));
};

// I6: Upfront Two-Tier Risk Classifier
exports.getUpfrontRiskClassification = (req, res) => {
  res.json(riskClassifier.classify(req.query.subject));
};

// I7: Optional Voluntary Trust Badge Layer
exports.evaluateTrustBadges = (req, res) => {
  res.json(trustBadgeSvc.evaluate(req.body));
};

// I8: QR Code Generator on Every Issued Certificate
exports.getCertificateQRCode = (req, res) => {
  res.json(qrCodeSvc.generateQR(req.params.license_id));
};

// I9: Unique Per-Unit Traceability Code Generator
exports.generateUnitTraceabilityCodes = (req, res) => {
  res.json(traceabilitySvc.generateCodes(req.body));
};

// I10: Genuine vs Fake Claim Checker
exports.verifyClaim = (req, res) => {
  const params = Object.keys(req.body || {}).length > 0 ? req.body : req.query;
  res.json(genuineClaimSvc.verify(params));
};

// I11: Public Trust Score & Consumer Confidence Metrics
exports.calculateTrustScore = (req, res) => {
  res.json(consumerTrustSvc.calculateScore(req.body));
};

// I12: Unified Recall Feed Across All Indian Regulators
exports.getUnifiedRecallsFeed = (req, res) => {
  res.json(recallFeedSvc.getRecalls());
};

// I13: Consumer-Facing Recall Lookup Tool
exports.lookupRecalls = (req, res) => {
  res.json(recallLookupSvc.lookup(req.body.query_term));
};

// I14: CB Scheme Cross-Recognition Checker
exports.checkCBSchemeEquivalence = (req, res) => {
  res.json(cbSchemeSvc.checkEquivalence(req.query.foreign_standard));
};

// I15: Reduced Documentation Pathway for Foreign Brands
exports.evaluateReducedDocumentationPathway = (req, res) => {
  res.json(fastTrackSvc.evaluate(req.body));
};

// I16: Category-Wise Test Standard Mapper by Product
exports.mapCategoryToStandard = (req, res) => {
  res.json(standardMapperSvc.mapCategory(req.body.product_category));
};

// I17: QR-Embedded Conformity Mark Generator
exports.generateConformityMarkPayload = (req, res) => {
  res.json(conformityMarkSvc.generatePayload(req.body));
};

// I18: Real-Time Central Certificate Registry
exports.searchRegistry = (req, res) => {
  res.json(registrySvc.searchRegistry(req.query.q));
};

// I19: Cross-Mark Equivalence Checker
exports.checkCrossMarkEquivalence = (req, res) => {
  res.json(crossMarkSvc.checkEquivalence(req.query.foreign_mark));
};

// I20: Shared Technical Construction File (TCF) Reuse Tool
exports.evaluateTCFReuse = (req, res) => {
  res.json(tcfReuseSvc.evaluate(req.body));
};

// I21: Formal Escalation Ladder with Named Responders
exports.resolveEscalationTier = (req, res) => {
  res.json(escalationLadderSvc.resolveTier(req.body));
};

// I22: Full-Lifecycle Environmental Scorecard
exports.calculateEnvironmentalScorecard = (req, res) => {
  res.json(environmentalSvc.calculateScorecard(req.body));
};

// I23: Third-Party Verified Sustainability Badge
exports.evaluateSustainabilityBadge = (req, res) => {
  res.json(sustainabilitySvc.evaluate(req.body));
};

// I24: Government Procurement (GeM) Green Eligibility Flag
exports.checkGeMEligibility = (req, res) => {
  res.json(gemEligibilitySvc.checkEligibility(req.params.license_id));
};

// I25: Optional Liability Insurance Status Field
exports.verifyLiabilityInsurance = (req, res) => {
  res.json(liabilityInsuranceSvc.verifyInsurance(req.body));
};
