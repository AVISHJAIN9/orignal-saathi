const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platformController');

// Status
router.get('/status', platformController.getPlatformStatus);

// P1: Identity & Authentication
router.post('/auth/login', platformController.p1_login);
router.post('/auth/verify', platformController.p1_verify);

// P2: RBAC
router.post('/rbac/check', platformController.p2_checkRbac);

// P3: Audit Logging & Telemetry
router.post('/audit/log', platformController.p3_logEvent);
router.get('/audit/logs', platformController.p3_getLogs);

// P4: Health & Diagnostics
router.get('/health', platformController.p4_getHealth);

// P5: Developer Sandbox
router.post('/sandbox/app', platformController.p5_createSandbox);
router.post('/sandbox/webhook-test', platformController.p5_simulateWebhook);

// P6: DR Drill Dashboard
router.get('/dr/status', platformController.p6_getDrillStatus);
router.post('/dr/drill', platformController.p6_triggerDrill);

// P7: Citizen Uptime Page
router.get('/uptime', platformController.p7_getCitizenUptime);

module.exports = router;
