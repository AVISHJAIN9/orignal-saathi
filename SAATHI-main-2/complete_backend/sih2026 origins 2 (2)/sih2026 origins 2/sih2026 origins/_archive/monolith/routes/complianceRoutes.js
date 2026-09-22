const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');

// Status
router.get('/status', complianceController.getModuleStatus);

// C1 - C10
router.post('/c1/applicability', complianceController.c1_checkQco);
router.post('/c2/standard-revision', complianceController.c2_compareStandards);
router.post('/c3/gap-analysis', complianceController.c3_analyzeGaps);
router.post('/c4/readiness-score', complianceController.c4_calculateReadiness);
router.post('/c5/scheme-selector', complianceController.c5_selectScheme);
router.get('/c6/product-scheme-chain', complianceController.c6_getChain);
router.post('/c7/lab-matcher', complianceController.c7_matchLab);
router.get('/c8/regulatory-alerts', complianceController.c8_getAlerts);
router.post('/c9/test-requirements', complianceController.c9_getTestRequirements);
router.post('/c10/technical-file', complianceController.c10_generateTechFile);

// C11 - C20
router.post('/c11/fee-estimator', complianceController.c11_estimateFee);
router.post('/c12/timeline-simulator', complianceController.c12_simulateTimeline);
router.post('/c13/manufacturer-type', complianceController.c13_classifyManufacturer);
router.post('/c14/renewal-expiry', complianceController.c14_trackRenewal);
router.get('/c15/calendar', complianceController.c15_getCalendar);
router.post('/c16/answer-builder', complianceController.c16_buildAnswer);
router.post('/c17/refuse-guess', complianceController.c17_refuseGuess);
router.post('/c18/escalation-packet', complianceController.c18_createEscalationPacket);
router.get('/c19/compliance-passport/:licenseId', complianceController.c19_getPassport);
router.post('/c20/impact-simulator', complianceController.c20_simulateImpact);

// C21 - C30
router.post('/c21/classification-assistant', complianceController.c21_classifyProduct);
router.post('/c22/conflict-detector', complianceController.c22_detectConflicts);
router.post('/c23/why-not-standard', complianceController.c23_explainWhyNotStandard);
router.post('/c24/scope-checker', complianceController.c24_checkScope);
router.post('/c25/clause-extraction', complianceController.c25_extractClauses);
router.get('/c26/dependency-graph/:standardNumber', complianceController.c26_getDependencyGraph);
router.post('/c27/change-product-sim', complianceController.c27_simulateProductChange);
router.post('/c28/variant-manager', complianceController.c28_manageVariants);
router.post('/c29/scope-manager', complianceController.c29_manageScope);
router.post('/c30/change-impact', complianceController.c30_analyzeProductChange);

// C31 - C40
router.post('/c31/supplier-checker', complianceController.c31_checkSupplier);
router.post('/c32/importer-mode', complianceController.c32_importerMode);
router.post('/c33/msme-mode', complianceController.c33_msmeMode);
router.post('/c34/eli5-mode', complianceController.c34_explainLikeManufacturer);
router.post('/c35/evidence-vault', complianceController.c35_vaultUpload);
router.post('/c36/evidence-freshness', complianceController.c36_checkFreshness);
router.get('/c37/audit-trail/:entityId', complianceController.c37_getAuditTrail);
router.get('/c38/answer-versioning/:questionId', complianceController.c38_getVersionHistory);
router.post('/c39/knowledge-diff', complianceController.c39_diffKnowledge);
router.get('/c40/risk-heatmap/:factoryId', complianceController.c40_getRiskHeatmap);

// C41 - C46
router.get('/c41/digital-twin/:factoryId', complianceController.c41_getDigitalTwin);
router.post('/c42/adaptive-interview', complianceController.c42_conductInterview);
router.post('/c43/second-opinion', complianceController.c43_secondOpinion);
router.post('/c44/officer-copilot', complianceController.c44_officerCopilot);
router.post('/c45/benchmark', complianceController.c45_getBenchmark);
router.get('/c46/peer-insights', complianceController.c46_getPeerInsights);

module.exports = router;
