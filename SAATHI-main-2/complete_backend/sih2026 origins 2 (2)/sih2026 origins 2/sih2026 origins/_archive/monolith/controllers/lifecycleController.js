/**
 * Application Lifecycle (S-Series: S1 to S44) Controller in MERN Stack
 * Delegates all lifecycle operations to the native MERN modules located in the `s/` directory.
 */

const {
  AccountBindingService,
  PersonalizedDashboardService,
  RegistrationWizardService,
  RequirementUpdateService,
  PaymentsGSTService,
  AuditSchedulerService,
  DocumentResubmissionService,
  AppealsDisputeService,
  BusinessAccountService,
  CertificateVerificationService,
  RenewalTimelineService,
  VoiceNavigationService,
  SMSFallbackService,
  DocumentChecklistEngine,
  GrievanceOfficerService,
  ApplicationReappealService,
  LabSampleTrackerService,
  CalendarSyncService,
  NonConformanceAlertService,
  SuspensionRemediationService,
  GSTInvoiceGeneratorService,
  RegionalOfficeRouter,
  MultiFactoryManagerService,
  QualityOpsService,
  ApplicationDraftService,
  ProgressBarCalculatorService,
  DocumentUploadService,
  OCRAutoScanService,
  DuplicateApplicationDetectorService,
  LabSlotBookingService,
  EMIOptionService,
  LiveAuditChecklistService,
  ApplicationTimelineService,
  DisputeStatusTrackerService,
  SatisfactionSurveyService,
  SignLanguageAssistantService,
  MissedCallCallbackService,
  WebPushNotificationService,
  DigitalSignageFeedService
} = require('../../s');

// Singletons
const accountBindingSvc = new AccountBindingService();
const personalizedDashboardSvc = new PersonalizedDashboardService();
const registrationSvc = new RegistrationWizardService();
const requirementUpdateSvc = new RequirementUpdateService();
const paymentsGSTSvc = new PaymentsGSTService();
const auditSchedulerSvc = new AuditSchedulerService();
const resubmissionSvc = new DocumentResubmissionService();
const appealsSvc = new AppealsDisputeService();
const businessAccountSvc = new BusinessAccountService();
const certificateVerificationSvc = new CertificateVerificationService();
const renewalTimelineSvc = new RenewalTimelineService();
const voiceNavSvc = new VoiceNavigationService();
const smsFallbackSvc = new SMSFallbackService();
const checklistEngine = new DocumentChecklistEngine();
const grievanceSvc = new GrievanceOfficerService();
const reappealSvc = new ApplicationReappealService();
const labTrackerSvc = new LabSampleTrackerService();
const calendarSyncSvc = new CalendarSyncService();
const alertBroadcastSvc = new NonConformanceAlertService();
const suspensionSvc = new SuspensionRemediationService();
const gstInvoiceSvc = new GSTInvoiceGeneratorService();
const regionalRouter = new RegionalOfficeRouter();
const multiFactorySvc = new MultiFactoryManagerService();
const qualityOpsSvc = new QualityOpsService();
const draftSvc = new ApplicationDraftService();
const progressBarSvc = new ProgressBarCalculatorService();
const docUploadSvc = new DocumentUploadService();
const ocrScanSvc = new OCRAutoScanService();
const duplicateDetectorSvc = new DuplicateApplicationDetectorService();
const labSlotSvc = new LabSlotBookingService();
const emiOptionSvc = new EMIOptionService();
const liveAuditSvc = new LiveAuditChecklistService();
const timelineSvc = new ApplicationTimelineService();
const disputeTrackerSvc = new DisputeStatusTrackerService();
const surveySvc = new SatisfactionSurveyService();
const signLanguageSvc = new SignLanguageAssistantService();
const missedCallSvc = new MissedCallCallbackService();
const pushNotificationSvc = new WebPushNotificationService();
const digitalSignageSvc = new DigitalSignageFeedService();

// S1: ID-Linked Account Binding
exports.bindAccount = async (req, res) => {
  try {
    const result = await accountBindingSvc.bindAccount(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// S2: Personalized Status Dashboard
exports.getPersonalizedDashboard = (req, res) => {
  res.json(personalizedDashboardSvc.getDashboard(req.params.user_id || req.query.user_id));
};

// S3: New Applicant Registration Wizard
exports.submitNewApplication = async (req, res) => {
  try {
    const result = await registrationSvc.submitApplication(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationDetails = async (req, res) => {
  try {
    const result = await registrationSvc.getApplication(req.params.app_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// S4: Automated Requirement Updates
exports.getRequirementUpdates = (req, res) => {
  res.json(requirementUpdateSvc.getUpdates(req.query.license_id));
};

// S5: Payments & GST Calculator
exports.calculateGSTAndFee = async (req, res) => {
  try {
    const result = await paymentsGSTSvc.calculateFees(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// S6 & S21: Government Officer Visit / Audit Scheduler
exports.getAvailableAuditSlots = (req, res) => {
  res.json(auditSchedulerSvc.getAvailableSlots(req.query.officer_id));
};

exports.bookAuditSlot = (req, res) => {
  res.json(auditSchedulerSvc.bookAudit(req.body));
};

// S7: Document Re-Submission & Correction Flow
exports.resubmitDocument = (req, res) => {
  res.json(resubmissionSvc.resubmit(req.body));
};

// S8: Appeals & Dispute Resolution Flow
exports.fileAppeal = (req, res) => {
  res.json(appealsSvc.fileAppeal(req.body));
};

// S9: Multi-User Business Accounts
exports.getTeamMembers = (req, res) => {
  res.json(businessAccountSvc.getTeamMembers(req.params.license_id));
};

// S10: Certificate Download & Public Verification
exports.verifyCertificate = async (req, res) => {
  try {
    const result = await certificateVerificationSvc.verifyCertificate(req.params.cml_number);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// S11 & S19: License Renewal Status
exports.getRenewalStatus = (req, res) => {
  res.json(renewalTimelineSvc.getStatus(req.params.license_id));
};

// S12 & S13: Full Voice Assistant Navigation
exports.getVoiceNavigation = (req, res) => {
  res.json(voiceNavSvc.navigate(req.body));
};

// S14: SMS / Offline Fallback Channel
exports.sendSMSFallback = (req, res) => {
  res.json(smsFallbackSvc.sendSMS(req.body));
};

// S15: Document Checklist Engine
exports.getCustomDocumentChecklist = async (req, res) => {
  try {
    const result = await checklistEngine.getCustomChecklist(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// S16: Grievance Officer Contact
exports.getGrievanceInfo = (req, res) => {
  res.json(grievanceSvc.getGrievanceDetails());
};

// S17: Rejection Re-appeal
exports.submitRejectionReappeal = (req, res) => {
  res.json(reappealSvc.submitReappeal(req.body));
};

// S18: Lab Testing Sample Tracker
exports.getSampleTestingStatus = (req, res) => {
  res.json(labTrackerSvc.getSampleStatus(req.params.sample_id));
};

// S20: In-App Calendar Sync
exports.generateCalendarSync = (req, res) => {
  res.json(calendarSyncSvc.generateSync(req.query.license_id));
};

// S22: Recall Alert System
exports.broadcastNonConformanceAlert = (req, res) => {
  res.json(alertBroadcastSvc.broadcastAlert(req.body));
};

// S23: License Suspension Remediation
exports.submitSuspensionRemediation = (req, res) => {
  res.json(suspensionSvc.submitRemediation(req.body));
};

// S24: GST Tax Invoice Generator
exports.createGSTTaxInvoice = (req, res) => {
  res.json(gstInvoiceSvc.createInvoice(req.body));
};

// S25: Regional Office Auto-Routing
exports.getRegionalOfficeByPincode = (req, res) => {
  res.json(regionalRouter.routeByPincode(req.query.pincode));
};

// S26: Multi-Factory Locations List
exports.getFactoryLocations = (req, res) => {
  res.json(multiFactorySvc.getFactories(req.params.corporate_id));
};

// S27: Live Retrieval Quality Metrics
exports.getLiveQualityMetrics = (req, res) => {
  res.json(qualityOpsSvc.getMetrics());
};

// S28: Invite Staff Role
exports.inviteStaffRole = (req, res) => {
  res.json(businessAccountSvc.inviteStaffRole(req.body));
};

// S29: Save and Resume Application Draft
exports.saveApplicationDraft = (req, res) => {
  res.json(draftSvc.saveDraft(req.body));
};

exports.getApplicationDraft = (req, res) => {
  res.json(draftSvc.getDraft(req.params.draft_id));
};

// S30: Application Progress Bar
exports.calculateProgressBar = (req, res) => {
  res.json(progressBarSvc.calculateProgress(req.query.step));
};

// S31: Document Upload
exports.uploadDocument = (req, res) => {
  res.json(docUploadSvc.uploadFile(req.body));
};

// S32: OCR Document Auto-Scan
exports.ocrAutoScan = (req, res) => {
  res.json(ocrScanSvc.autoScan(req.body));
};

// S33: Duplicate Application Detector
exports.checkDuplicateApplication = (req, res) => {
  res.json(duplicateDetectorSvc.checkDuplicate(req.body));
};

// S34: Lab Slot Booking
exports.bookLabSlot = (req, res) => {
  res.json(labSlotSvc.bookLabSlot(req.body));
};

// S35: EMI & Installment Option
exports.calculateFeeEMI = (req, res) => {
  res.json(emiOptionSvc.calculateEMI(req.body));
};

// S36: Live Audit Checklist for Officers
exports.recordAuditChecklistItem = (req, res) => {
  res.json(liveAuditSvc.recordItem(req.body));
};

exports.getLiveAuditRecords = (req, res) => {
  res.json(liveAuditSvc.getRecords(req.params.audit_id));
};

// S37 & S38: Application Timeline & Milestones
exports.getApplicationTimeline = (req, res) => {
  res.json(timelineSvc.getTimeline(req.params.application_id));
};

// S39: Dispute Tracker
exports.getDisputeStatus = (req, res) => {
  res.json(disputeTrackerSvc.getStatus(req.params.dispute_id));
};

// S40: Satisfaction Survey Submission
exports.submitSatisfactionSurvey = (req, res) => {
  res.json(surveySvc.submitSurvey(req.body));
};

// S41: Sign Language Video Assistant
exports.getSignLanguageVideo = (req, res) => {
  res.json(signLanguageSvc.getVideo(req.query.module));
};

// S42: Missed Call Callback
exports.requestMissedCallCallback = (req, res) => {
  res.json(missedCallSvc.requestCallback(req.body));
};

// S43: Web Push Subscription
exports.subscribeWebPush = (req, res) => {
  res.json(pushNotificationSvc.subscribe(req.body));
};

// S44: Digital Signage Feed
exports.getDigitalSignageFeed = (req, res) => {
  res.json(digitalSignageSvc.getFeed(req.query.office));
};
