const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/internationalController');

// I1: Public Search Directory
router.get('/public-directory', ctrl.getPublicDirectory);

// I2: Public Per-Manufacturer Profile
router.get('/manufacturer-profile/:name', ctrl.getManufacturerProfile);

// I3: Live Factory Certification Health
router.get('/factory-health/:license_id', ctrl.getFactoryCertificationHealth);

// I4: Nationwide Searchable Directory of Accredited Labs
router.get('/accredited-labs', ctrl.searchAccreditedLabs);

// I5: Declaration of Conformity Generator
router.post('/doc/generate', ctrl.generateDeclarationOfConformity);

// I6: Upfront Two-Tier Risk Classifier
router.get('/risk-tier', ctrl.getUpfrontRiskClassification);

// I7: Optional Voluntary Trust Badge Layer
router.post('/trust-badges/evaluate', ctrl.evaluateTrustBadges);

// I8: QR Code Payload Generator
router.get('/certificates/qr/:license_id', ctrl.getCertificateQRCode);

// I9: Generate Unit Traceability Codes
router.post('/traceability/generate', ctrl.generateUnitTraceabilityCodes);

// I10: Genuine vs Fake Claim Checker
router.get('/claim/verify', ctrl.verifyClaim);
router.post('/claim/verify', ctrl.verifyClaim);

// I11: Public Trust Score & Consumer Confidence Metrics
router.post('/trust-score/calculate', ctrl.calculateTrustScore);

// I12: Unified Recalls Feed
router.get('/recalls', ctrl.getUnifiedRecallsFeed);

// I13: Consumer-Facing Recall Lookup Tool
router.post('/recalls/lookup', ctrl.lookupRecalls);

// I14: CB Scheme Cross-Recognition Checker
router.get('/cb-scheme/check', ctrl.checkCBSchemeEquivalence);

// I15: Reduced Documentation Pathway for Foreign Brands
router.post('/fast-track/evaluate', ctrl.evaluateReducedDocumentationPathway);

// I16: Category-Wise Test Standard Mapper
router.post('/standards/map-category', ctrl.mapCategoryToStandard);

// I17: QR-Embedded Conformity Mark Generator
router.post('/conformity-mark/payload', ctrl.generateConformityMarkPayload);

// I18: Real-Time Central Certificate Registry
router.get('/registry', ctrl.searchRegistry);

// I19: Cross-Mark Equivalence
router.get('/cross-mark/equivalence', ctrl.checkCrossMarkEquivalence);

// I20: Shared Technical Construction File (TCF) Reuse Tool
router.post('/tcf/reuse-evaluate', ctrl.evaluateTCFReuse);

// I21: Formal Escalation Ladder with Named Responders
router.post('/escalation/tier-resolve', ctrl.resolveEscalationTier);

// I22: Full-Lifecycle Environmental Scorecard
router.post('/environmental/scorecard', ctrl.calculateEnvironmentalScorecard);

// I23: Third-Party Verified Sustainability Badge
router.post('/sustainability/badge-evaluate', ctrl.evaluateSustainabilityBadge);

// I24: GeM Procurement Eligibility
router.get('/gem-eligibility/:license_id', ctrl.checkGeMEligibility);

// I25: Optional Liability Insurance Status
router.post('/insurance/verify', ctrl.verifyLiabilityInsurance);

module.exports = router;
