/**
 * Master S-Series (Application Lifecycle: S1 to S44) MERN Package
 * Exports all 44 microservice classes from their respective folders.
 */

const { AccountBindingService } = require('./S1_id_linked_account_binding');
const { PersonalizedDashboardService } = require('./S2_personalized_status_&_deadline_dashboard');
const { RegistrationWizardService, APPLICATIONS_STORE } = require('./S3_new_applicant_registration_wizard');
const { RequirementUpdateService } = require('./S4_automated_requirement_update_notificatio');
const { PaymentsGSTService } = require('./S5_payment_&_fee_status_tracker');
const { AuditSchedulerService } = require('./S6_government_officer_visit_scheduler');
const { DocumentResubmissionService } = require('./S7_document_re_submission_&_correction_flow');
const { AppealsDisputeService } = require('./S8_appeals___dispute_resolution_flow');
const { BusinessAccountService, TEAM_MEMBERS_STORE } = require('./S9_multi_user_business_accounts');
const { CertificateVerificationService } = require('./S10_certificate_download_&_public_verificati');
const { RenewalTimelineService } = require('./S11_renewal_reminders_on_a_timeline');
const { VoiceNavigationService } = require('./S12_full_voice_assistant_navigation');
const { VoiceNavigationService: LocaleVoiceNavigationService } = require('./S13_locale_aware_multilingual_voice_output');
const { SMSFallbackService } = require('./S14_sms___offline_fallback_channel');
const { DocumentChecklistEngine } = require('./S15_registration_specific_document_checklist');
const { GrievanceOfficerService } = require('./S16_grievance_officer_contact_&_consent_mana');
const { ApplicationReappealService } = require('./S17_initial_application_rejection_&_reappeal');
const { LabSampleTrackerService } = require('./S18_lab___sample_testing_status_tracker');
const { RenewalInitiatorService } = require('./S19_annual_renewal_flow_with_surveillance_au');
const { CalendarSyncService } = require('./S20_in_app_calendar___reminder_sync');
const { FactoryAuditCoordinatorService } = require('./S21_factory_audit_scheduling_&_coordination_');
const { NonConformanceAlertService } = require('./S22_product_recall___non_conformance_alert_s');
const { SuspensionRemediationService } = require('./S23_license_suspension_notice_&_remediation_');
const { GSTInvoiceGeneratorService } = require('./S24_fee_invoice_&_gst_compliant_receipt_gene');
const { RegionalOfficeRouter } = require('./S25_regional_office_auto_routing');
const { MultiFactoryManagerService } = require('./S26_multi_factory___multi_location_license_m');
const { QualityOpsService } = require('./S27_live_retrieval_quality_metrics_ops_page');
const { StaffInvitationService } = require('./S28_staff_role_invitations');
const { ApplicationDraftService, DRAFTS_STORE } = require('./S29_save_and_resume_application_draft');
const { ProgressBarCalculatorService } = require('./S30_application_progress_bar');
const { DocumentUploadService } = require('./S31_document_upload_with_drag_and_drop');
const { OCRAutoScanService } = require('./S32_auto_scan_&_auto_fill_from_uploaded_docu');
const { DuplicateApplicationDetectorService } = require('./S33_duplicate_application_detector');
const { LabSlotBookingService } = require('./S34_lab_appointment_booking');
const { EMIOptionService } = require('./S35_emi___installment_payment_option_for_fee');
const { LiveAuditChecklistService, LIVE_AUDIT_STORE } = require('./S36_live_audit_checklist_for_officers');
const { ApplicationTimelineService } = require('./S37_milestone_progress_tracker');
const { ApplicationTimelineService: TimelineVisualizationService } = require('./S38_application_timeline_visualization');
const { DisputeStatusTrackerService } = require('./S39_dispute_status_tracker');
const { SatisfactionSurveyService } = require('./S40_satisfaction_survey_after_resolution');
const { SignLanguageAssistantService } = require('./S41_sign_language_video_assistant');
const { MissedCallCallbackService } = require('./S42_missed_call_callback_service');
const { WebPushNotificationService } = require('./S43_push_notifications');
const { DigitalSignageFeedService } = require('./S44_digital_signage_integration_for_bis_regi');

module.exports = {
  AccountBindingService,
  PersonalizedDashboardService,
  RegistrationWizardService,
  APPLICATIONS_STORE,
  RequirementUpdateService,
  PaymentsGSTService,
  AuditSchedulerService,
  DocumentResubmissionService,
  AppealsDisputeService,
  BusinessAccountService,
  TEAM_MEMBERS_STORE,
  CertificateVerificationService,
  RenewalTimelineService,
  VoiceNavigationService,
  LocaleVoiceNavigationService,
  SMSFallbackService,
  DocumentChecklistEngine,
  GrievanceOfficerService,
  ApplicationReappealService,
  LabSampleTrackerService,
  RenewalInitiatorService,
  CalendarSyncService,
  FactoryAuditCoordinatorService,
  NonConformanceAlertService,
  SuspensionRemediationService,
  GSTInvoiceGeneratorService,
  RegionalOfficeRouter,
  MultiFactoryManagerService,
  QualityOpsService,
  StaffInvitationService,
  ApplicationDraftService,
  DRAFTS_STORE,
  ProgressBarCalculatorService,
  DocumentUploadService,
  OCRAutoScanService,
  DuplicateApplicationDetectorService,
  LabSlotBookingService,
  EMIOptionService,
  LiveAuditChecklistService,
  LIVE_AUDIT_STORE,
  ApplicationTimelineService,
  TimelineVisualizationService,
  DisputeStatusTrackerService,
  SatisfactionSurveyService,
  SignLanguageAssistantService,
  MissedCallCallbackService,
  WebPushNotificationService,
  DigitalSignageFeedService
};
