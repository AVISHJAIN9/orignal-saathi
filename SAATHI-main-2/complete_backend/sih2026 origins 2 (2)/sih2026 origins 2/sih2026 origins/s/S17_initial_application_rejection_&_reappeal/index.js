/**
 * S17 — Initial Application Rejection & Reappeal Flow
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * IMPORTANT DISTINCTION FROM S7:
 * - S7 (correction): resubmits a document within the SAME application_id
 * - S17 (reapplication): creates a BRAND NEW application_id, linked to rejected one via reapplication_of FK
 *
 * Tables: applications (s/database.js)
 */

const { sDb } = require('../database');

const VALID_APP_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'REJECTED', 'APPROVED', 'REAPPLIED'];

class ApplicationReappealService {
  /**
   * Submit a new application (for registration wizard S3 integration).
   */
  async submitApplication({ applicant_id, product_name, standard_number }) {
    if (!applicant_id || !product_name || !standard_number) {
      throw new Error('applicant_id, product_name, and standard_number are required');
    }

    const app = {
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      applicant_id,
      product_name,
      standard_number,
      status: 'SUBMITTED',
      rejection_reason: null,
      reapplication_of: null,
      created_at: new Date().toISOString()
    };

    await sDb.insert('applications', app);
    return { success: true, application: app };
  }

  /**
   * Reject an application with a reason.
   */
  async rejectApplication(applicationId, rejection_reason) {
    if (!applicationId || !rejection_reason) {
      throw new Error('applicationId and rejection_reason are required');
    }

    const app = await sDb.findOne('applications', a => a.id === applicationId);
    if (!app) throw new Error(`Application ${applicationId} not found`);
    if (app.status === 'APPROVED') throw new Error('Cannot reject an already approved application');
    if (app.status === 'REJECTED') throw new Error('Application is already rejected');

    return sDb.update('applications', a => a.id === applicationId, {
      status: 'REJECTED',
      rejection_reason
    });
  }

  /**
   * Create a NEW application as a reapplication of a rejected one.
   *
   * THIS IS S17 — NOT S7.
   * This method creates a new application_id.
   * S7 correction keeps the same application_id.
   */
  async reapply(rejectedApplicationId, { applicant_id, product_name, standard_number, additional_notes } = {}) {
    if (!rejectedApplicationId) throw new Error('rejectedApplicationId is required');

    const original = await sDb.findOne('applications', a => a.id === rejectedApplicationId);
    if (!original) throw new Error(`Application ${rejectedApplicationId} not found`);
    if (original.status !== 'REJECTED') {
      throw new Error(
        `Application ${rejectedApplicationId} has status '${original.status}'. ` +
        `Only REJECTED applications can be reapplied.`
      );
    }

    // Create a NEW application — new id, reapplication_of points to the rejected one
    const newApp = {
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      applicant_id: applicant_id || original.applicant_id,
      product_name: product_name || original.product_name,
      standard_number: standard_number || original.standard_number,
      status: 'SUBMITTED',
      rejection_reason: null,
      reapplication_of: rejectedApplicationId, // Self-FK to rejected application
      additional_notes: additional_notes || null,
      created_at: new Date().toISOString()
    };

    // Verify the new id is genuinely different (sanity check)
    if (newApp.id === rejectedApplicationId) {
      throw new Error('ID collision — this should never happen');
    }

    await sDb.insert('applications', newApp);

    // Mark the original as reapplied so it shows in history
    await sDb.update('applications', a => a.id === rejectedApplicationId, {
      status: 'REAPPLIED'
    });

    return {
      success: true,
      new_application_id: newApp.id,
      original_application_id: rejectedApplicationId,
      note: 'A new application_id has been created. This differs from S7 correction which keeps the same application_id.',
      application: newApp
    };
  }

  /**
   * Get application details.
   */
  async getApplication(applicationId) {
    if (!applicationId) throw new Error('applicationId is required');
    const app = await sDb.findOne('applications', a => a.id === applicationId);
    if (!app) throw new Error(`Application ${applicationId} not found`);
    return app;
  }

  /**
   * Get application history for an applicant (shows reapplication chain).
   */
  async getApplicationHistory(applicantId) {
    if (!applicantId) throw new Error('applicantId is required');
    const all = await sDb.getTable('applications');
    return all.filter(a => a.applicant_id === applicantId)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }
}

module.exports = { ApplicationReappealService };
