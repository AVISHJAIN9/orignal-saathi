/**
 * X5 — Application Drafts & Autosave Engine (X-series thin wrapper over S29)
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Thin wrapper around S29's ApplicationDraftService.
 * Delegates to the real S29 implementation — no duplicate logic.
 */

const { ApplicationDraftService } = require('../../s/S29_save_and_resume_application_draft');

class ApplicationDraftsService {
  constructor() { this._s29 = new ApplicationDraftService(); }

  async saveDraft(userId, formKey, draftData) {
    if (!userId || !formKey) throw new Error('userId and formKey are required');
    const sessionId = `${userId}::${formKey}`;
    return this._s29.saveDraft(sessionId, draftData);
  }

  async getDraft(userId, formKey) {
    if (!userId || !formKey) throw new Error('userId and formKey are required');
    const sessionId = `${userId}::${formKey}`;
    return this._s29.getDraftBySession(sessionId);
  }

  async deleteDraft(draftId) {
    return this._s29.deleteDraft(draftId);
  }
}

module.exports = { ApplicationDraftsService };
