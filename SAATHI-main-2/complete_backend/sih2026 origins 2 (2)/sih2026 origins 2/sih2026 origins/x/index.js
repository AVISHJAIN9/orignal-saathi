/**
 * Master Experience Series (X1 to X15) MERN Stack Exports
 * Status: IMPLEMENTED_AND_VERIFIED
 */

const { UserDashboardService } = require('./X1/index.js');
const { ComplianceFeedbackService } = require('./X2/index.js');
const { NotificationPreferencesService } = require('./X3/index.js');
const { MultilingualPreferencesService } = require('./X4/index.js');
const { ApplicationDraftsService } = require('./X5/index.js');
const { ExportReportingService } = require('./X6/index.js');
const { TeamCollaborationService } = require('./X7/index.js');
const { DocumentPreviewAnnotationService } = require('./X8/index.js');
const { SearchHistoryService } = require('./X9/index.js');
const { ComplianceTaggingService } = require('./X10/index.js');
const { ComplianceAnalyticsService } = require('./X11/index.js');
const { WebhookDispatchService } = require('./X12/index.js');
const { SavedSearchesService } = require('./X13_saved_searches/index.js');
const { BookmarkedStandardsService } = require('./X14_bookmarked_standards/index.js');
const { AnswerPdfSummaryService } = require('./X15_downloadable_pdf_summary_of_any_answer/index.js');

// Convenient functional helper wrappers
const getDashboardOverview = (userId) => UserDashboardService.getDashboardOverview(userId);
const submitFeedback = (arg1, arg2) => {
  if (typeof arg1 === 'object' && arg1 !== null && !arg2) {
    return ComplianceFeedbackService.submitFeedback(arg1);
  }
  const payload = arg2 || {};
  return ComplianceFeedbackService.submitFeedback({
    user_id: typeof arg1 === 'string' ? arg1 : payload.user_id,
    answer_id: payload.answer_id || payload.answerId,
    rating: payload.rating !== undefined ? payload.rating : payload.score,
    feedback_text: payload.feedback_text || payload.feedbackText || payload.comment,
    feature_area: payload.feature_area || payload.featureArea
  });
};
const getPreferences = (userId) => NotificationPreferencesService.getPreferences(userId);
const updatePreferences = (userId, payload) => NotificationPreferencesService.savePreferences(userId, payload);
const getSupportedLanguages = () => MultilingualPreferencesService.getSupportedLanguages();
const setUserLanguage = (userId, lang) => MultilingualPreferencesService.setPreferences(userId, { language: lang });
const saveDraft = (userId, formKey, data) => new ApplicationDraftsService().saveDraft(userId, formKey, data);
const getDraft = (userId, formKey) => new ApplicationDraftsService().getDraft(userId, formKey);
const generateReport = (userId, type, format) => ExportReportingService.requestExport(userId, type, format);
const getTeamMembers = (orgId) => TeamCollaborationService.getTeamMembers(orgId);
const inviteMember = (orgId, email, role) => TeamCollaborationService.inviteMember(orgId, email, role);
const getDocumentAnnotations = (docId) => DocumentPreviewAnnotationService.getAnnotations(docId);
const addAnnotation = (docId, userId, data) => DocumentPreviewAnnotationService.addAnnotation(docId, userId, data);
const getRecentSearches = (userId, limit) => SearchHistoryService.getRecentSearches(userId, limit);
const addSearchEntry = (userId, query, filters) => SearchHistoryService.recordSearch(userId, query, filters);
const getUserTags = (userId) => ComplianceTaggingService.getUserTags(userId);
const assignTag = (tagId, itemType, itemId) => ComplianceTaggingService.tagItem(tagId, itemType, itemId);
const getAnalyticsOverview = (windowHours) => ComplianceAnalyticsService.getMetrics(windowHours);
const registerWebhook = (userId, url, events, secret) => WebhookDispatchService.registerWebhook(userId, url, events, secret);
const getSavedSearches = (userId) => SavedSearchesService.getSavedSearches(userId);
const saveSearch = (userId, data) => SavedSearchesService.saveSearch(userId, data);
const getBookmarks = (userId) => BookmarkedStandardsService.getBookmarks(userId);
const toggleBookmark = (userId, std, meta) => BookmarkedStandardsService.toggleBookmark(userId, std, meta);
const generateAnswerPdf = (payload) => AnswerPdfSummaryService.generateAnswerPdf(payload);

module.exports = {
  // Service Classes
  UserDashboardService,
  ComplianceFeedbackService,
  NotificationPreferencesService,
  MultilingualPreferencesService,
  ApplicationDraftsService,
  ExportReportingService,
  TeamCollaborationService,
  DocumentPreviewAnnotationService,
  SearchHistoryService,
  ComplianceTaggingService,
  ComplianceAnalyticsService,
  WebhookDispatchService,
  SavedSearchesService,
  BookmarkedStandardsService,
  AnswerPdfSummaryService,

  // Functional Wrappers
  getDashboardOverview,
  submitFeedback,
  getPreferences,
  updatePreferences,
  getSupportedLanguages,
  setUserLanguage,
  saveDraft,
  getDraft,
  generateReport,
  getTeamMembers,
  inviteMember,
  getDocumentAnnotations,
  addAnnotation,
  getRecentSearches,
  addSearchEntry,
  getUserTags,
  assignTag,
  getAnalyticsOverview,
  registerWebhook,
  getSavedSearches,
  saveSearch,
  getBookmarks,
  toggleBookmark,
  generateAnswerPdf
};
