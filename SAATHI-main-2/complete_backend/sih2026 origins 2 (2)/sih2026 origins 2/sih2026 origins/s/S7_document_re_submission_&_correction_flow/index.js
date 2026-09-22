/**
 * S7 — Document Re-submission & Correction Flow
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Handles document corrections without changing the application_id (that is S17's job).
 * Resubmit creates a new resubmission row but keeps the original_submission_id intact.
 *
 * Tables: correction_requests, resubmissions (s/database.js)
 */

const { sDb } = require('../database');

class DocumentResubmissionService {
  /**
   * Get all pending correction requests for an application submission.
   */
  async getCorrectionsNeeded(submissionId) {
    if (!submissionId) throw new Error('submissionId is required');

    const all = await sDb.getTable('correction_requests');
    const corrections = all.filter(
      c => c.original_submission_id === submissionId && c.status === 'PENDING'
    );

    return {
      submission_id: submissionId,
      pending_corrections_count: corrections.length,
      action_required: corrections.length > 0,
      corrections: corrections.map(c => ({
        correction_id: c.id,
        flagged_field: c.flagged_field,
        flagged_document_id: c.flagged_document_id,
        reason: c.reason,
        status: c.status,
        created_at: c.created_at
      }))
    };
  }

  /**
   * Submit a document correction.
   * IMPORTANT: This does NOT change the application_id — that is S17's responsibility.
   * It only replaces the flagged document within the existing submission.
   */
  async resubmitDocument(correctionId, newDocumentId, fileUrl) {
    if (!correctionId || !newDocumentId) {
      throw new Error('correctionId and newDocumentId are required');
    }

    const correction = await sDb.findOne('correction_requests', c => c.id === correctionId);
    if (!correction) throw new Error(`Correction request ${correctionId} not found`);
    if (correction.status === 'RESOLVED') {
      throw new Error(`Correction ${correctionId} is already resolved`);
    }
    if (correction.status === 'REJECTED') {
      throw new Error(`Correction ${correctionId} was rejected. File a new appeal via S8.`);
    }

    // Create resubmission record — original_submission_id is PRESERVED
    const resubmission = {
      id: 'resub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      correction_request_id: correctionId,
      original_submission_id: correction.original_submission_id, // NEVER changed
      new_document_id: newDocumentId,
      file_url: fileUrl || null,
      submitted_at: new Date().toISOString()
    };

    await sDb.insert('resubmissions', resubmission);

    // Mark correction as resolved
    await sDb.update('correction_requests', c => c.id === correctionId, { status: 'RESOLVED' });

    return {
      success: true,
      resubmission_id: resubmission.id,
      correction_request_id: correctionId,
      original_submission_id: correction.original_submission_id, // explicitly returned to confirm unchanged
      new_document_id: newDocumentId,
      note: 'original_submission_id is unchanged — this is a correction, not a new application (use S17 for reapplication)',
      submitted_at: resubmission.submitted_at
    };
  }

  /**
   * Flag a document for correction (used by officers/reviewers).
   */
  async flagForCorrection({ submissionId, flaggedField, flaggedDocumentId, reason }) {
    if (!submissionId || !flaggedField || !reason) {
      throw new Error('submissionId, flaggedField, and reason are required');
    }

    const request = {
      id: 'corr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      original_submission_id: submissionId,
      flagged_field: flaggedField,
      flagged_document_id: flaggedDocumentId || null,
      reason,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    await sDb.insert('correction_requests', request);
    return { success: true, correction_request: request };
  }

  /**
   * Get resubmission history for a correction request.
   */
  async getResubmissionHistory(correctionId) {
    const all = await sDb.getTable('resubmissions');
    return all.filter(r => r.correction_request_id === correctionId);
  }
}

module.exports = { DocumentResubmissionService };
