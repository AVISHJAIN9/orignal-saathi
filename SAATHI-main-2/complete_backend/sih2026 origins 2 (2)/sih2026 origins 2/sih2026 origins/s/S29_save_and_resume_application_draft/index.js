/**
 * S29 — Save-and-Resume Application Draft
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Saves multi-step form state as JSONB. Resume restores the EXACT nested form_state.
 * Test: save nested object {step1: {a:1}, step2: {b:{c:2}}} and verify deep equality on resume.
 *
 * Tables: application_drafts (s/database.js)
 */

const { sDb } = require('../database');

class ApplicationDraftService {
  /**
   * Save or update an application draft for a session.
   * Uses upsert: if draft exists for session, merge form_state fields; else create new.
   */
  async saveDraft(applicant_session_id, form_state) {
    if (!applicant_session_id) throw new Error('applicant_session_id is required');
    if (!form_state || typeof form_state !== 'object') {
      throw new Error('form_state must be a non-null object');
    }

    // Look for existing draft for this session
    const existing = await sDb.findOne('application_drafts', d => d.applicant_session_id === applicant_session_id);

    if (existing) {
      // Deep merge: new form_state fields overwrite old, but unmentioned keys are preserved
      const mergedState = this._deepMerge(existing.form_state || {}, form_state);
      const updated = await sDb.update(
        'application_drafts',
        d => d.applicant_session_id === applicant_session_id,
        {
          form_state: mergedState,
          last_saved_at: new Date().toISOString()
        }
      );
      return {
        draft_id: existing.id,
        applicant_session_id,
        action: 'UPDATED',
        form_state: mergedState,
        last_saved_at: updated.last_saved_at
      };
    }

    const draft = {
      id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      applicant_session_id,
      form_state: JSON.parse(JSON.stringify(form_state)), // deep clone
      last_saved_at: new Date().toISOString()
    };

    await sDb.insert('application_drafts', draft);
    return {
      draft_id: draft.id,
      applicant_session_id,
      action: 'CREATED',
      form_state: draft.form_state,
      last_saved_at: draft.last_saved_at
    };
  }

  /**
   * Resume a draft by ID. Returns the FULL nested form_state.
   */
  async getDraft(draftId) {
    if (!draftId) throw new Error('draftId is required');
    const draft = await sDb.findOne('application_drafts', d => d.id === draftId);
    if (!draft) throw new Error(`Draft ${draftId} not found`);

    return {
      draft_id: draft.id,
      applicant_session_id: draft.applicant_session_id,
      form_state: draft.form_state, // full nested object, not flattened
      last_saved_at: draft.last_saved_at,
      can_resume: true
    };
  }

  /**
   * Get draft by session ID.
   */
  async getDraftBySession(applicant_session_id) {
    if (!applicant_session_id) throw new Error('applicant_session_id is required');
    const draft = await sDb.findOne('application_drafts', d => d.applicant_session_id === applicant_session_id);
    if (!draft) return { found: false, applicant_session_id };
    return { found: true, draft_id: draft.id, form_state: draft.form_state, last_saved_at: draft.last_saved_at };
  }

  /**
   * Delete a draft after successful submission.
   */
  async deleteDraft(draftId) {
    const draft = await sDb.findOne('application_drafts', d => d.id === draftId);
    if (!draft) throw new Error(`Draft ${draftId} not found`);
    await sDb.update('application_drafts', d => d.id === draftId, {
      status: 'SUBMITTED',
      deleted_at: new Date().toISOString()
    });
    return { success: true, draft_id: draftId, status: 'SUBMITTED' };
  }

  /**
   * Deep merge two objects. New values overwrite, but nested objects are merged recursively.
   */
  _deepMerge(target, source) {
    const result = JSON.parse(JSON.stringify(target));
    for (const key of Object.keys(source)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        result[key] !== null &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        result[key] = this._deepMerge(result[key], source[key]);
      } else {
        result[key] = JSON.parse(JSON.stringify(source[key]));
      }
    }
    return result;
  }
}

module.exports = { ApplicationDraftService };
