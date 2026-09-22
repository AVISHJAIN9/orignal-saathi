const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lifecycleController');

// S1: ID-Linked Account Binding
router.post('/bind-account', ctrl.bindAccount);

// S2: Personalized Status Dashboard
router.get('/dashboard/:user_id', ctrl.getPersonalizedDashboard);
router.get('/dashboard', ctrl.getPersonalizedDashboard);

// S3: New Applicant Registration Wizard
router.post('/register', ctrl.submitNewApplication);
router.get('/application/:app_id', ctrl.getApplicationDetails);

// S4: Automated Requirement Updates
router.get('/updates', ctrl.getRequirementUpdates);

// S5: Payments & GST Calculator
router.post('/calculate-gst', ctrl.calculateGSTAndFee);

// S6 & S21: Visit & Audit Scheduler
router.get('/audit/slots', ctrl.getAvailableAuditSlots);
router.post('/audit/book', ctrl.bookAuditSlot);

// S7: Document Re-Submission & Correction
router.post('/resubmission/submit', ctrl.resubmitDocument);

// S8: Appeals & Dispute Resolution
router.post('/appeals/file', ctrl.fileAppeal);

// S9: Multi-User Business Accounts
router.get('/team/:license_id/members', ctrl.getTeamMembers);

// S10: Certificate Download & Public Verification
router.get('/certificates/verify/:cml_number', ctrl.verifyCertificate);

// S11 & S19: License Renewal Status
router.get('/renewals/status/:license_id', ctrl.getRenewalStatus);

// S12 & S13: Full Voice Navigation & Audio TTS
router.post('/voice/navigate', ctrl.getVoiceNavigation);

// S14: SMS Fallback Channel
router.post('/notifications/sms', ctrl.sendSMSFallback);

// S15: Document Checklist Engine
router.post('/checklist/custom-requirements', ctrl.getCustomDocumentChecklist);

// S16: Grievance Officer Contact
router.get('/grievance/info', ctrl.getGrievanceInfo);

// S17: Rejection Re-appeal
router.post('/appeals/rejection-reappeal', ctrl.submitRejectionReappeal);

// S18: Lab Testing Sample Tracker
router.get('/samples/status/:sample_id', ctrl.getSampleTestingStatus);

// S20: In-App Calendar Sync
router.get('/calendar/sync', ctrl.generateCalendarSync);

// S22: Recall Alert System
router.post('/alerts/broadcast', ctrl.broadcastNonConformanceAlert);

// S23: License Suspension Remediation
router.post('/suspension/remediate', ctrl.submitSuspensionRemediation);

// S24: GST Tax Invoice Generator
router.post('/payments/create-invoice', ctrl.createGSTTaxInvoice);

// S25: Regional Office Auto-Routing
router.get('/routing/regional-office', ctrl.getRegionalOfficeByPincode);

// S26: Multi-Factory Locations List
router.get('/factories/:corporate_id', ctrl.getFactoryLocations);

// S27: Live Retrieval Quality Metrics
router.get('/ops/quality-metrics', ctrl.getLiveQualityMetrics);

// S28: Invite Staff Role
router.post('/team/invite', ctrl.inviteStaffRole);

// S29: Save and Resume Application Draft
router.post('/draft/save', ctrl.saveApplicationDraft);
router.get('/draft/:draft_id', ctrl.getApplicationDraft);

// S30: Application Progress Bar
router.get('/progress-bar', ctrl.calculateProgressBar);

// S31: Document Upload
router.post('/documents/upload', ctrl.uploadDocument);

// S32: OCR Document Auto-Scan
router.post('/ocr/auto-scan', ctrl.ocrAutoScan);

// S33: Duplicate Application Detector
router.post('/check-duplicate', ctrl.checkDuplicateApplication);

// S34: Lab Slot Booking
router.post('/lab-slot/book', ctrl.bookLabSlot);

// S35: EMI & Installment Option
router.post('/payments/emi-options', ctrl.calculateFeeEMI);

// S36: Live Audit Checklist for Officers
router.post('/audit-live/record', ctrl.recordAuditChecklistItem);
router.get('/audit-live/:audit_id', ctrl.getLiveAuditRecords);

// S37 & S38: Application Timeline & Milestones
router.get('/timeline/:application_id', ctrl.getApplicationTimeline);

// S39: Dispute Tracker
router.get('/disputes/:dispute_id', ctrl.getDisputeStatus);

// S40: Satisfaction Survey Submission
router.post('/disputes/survey', ctrl.submitSatisfactionSurvey);

// S41: Sign Language Video Assistant
router.get('/accessibility/sign-language', ctrl.getSignLanguageVideo);

// S42: Missed Call Callback
router.post('/callbacks/missed-call', ctrl.requestMissedCallCallback);

// S43: Web Push Subscription
router.post('/notifications/push/subscribe', ctrl.subscribeWebPush);

// S44: Digital Signage Feed
router.get('/signage/feed', ctrl.getDigitalSignageFeed);

module.exports = router;
