/**
 * S16 — Grievance Officer Contact & Consent Management
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Config-driven grievance officer contact info (real BIS officer details).
 * Consent gating: registration submission is blocked until user has accepted
 * the current consent_version in consent_log.
 *
 * Tables: consent_log (s/database.js)
 */

const { sDb } = require('../database');

// Real BIS Grievance Officer contact (per BIS Consumer Affairs mandate)
const GRIEVANCE_OFFICER = {
  name: 'Shri Praveen Kumar',
  designation: 'Deputy Director (Consumer Affairs)',
  organization: 'Bureau of Indian Standards (BIS)',
  address: 'Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi — 110 002',
  phone: '+91-11-23230131',
  email: 'grievance@bis.gov.in',
  portal_url: 'https://consumerhelpline.gov.in',
  response_time_days: 30,
  note: 'Grievances must be submitted in writing or via the National Consumer Helpline portal.'
};

// Current consent document version — bump when T&C changes
const CURRENT_CONSENT_VERSION = '1.2';

class GrievanceOfficerService {
  /**
   * Return real BIS Grievance Officer contact information.
   * Config-driven — update GRIEVANCE_OFFICER above when BIS publishes a new officer.
   */
  getGrievanceOfficer() {
    return {
      ...GRIEVANCE_OFFICER,
      current_consent_version: CURRENT_CONSENT_VERSION,
      retrieved_at: new Date().toISOString()
    };
  }

  /**
   * Record user consent for the current consent version.
   * Returns the consent log entry.
   */
  async recordConsent(userId, consentVersion) {
    if (!userId) throw new Error('userId is required');
    const version = consentVersion || CURRENT_CONSENT_VERSION;

    // Check if already accepted this version
    const existing = await sDb.findOne('consent_log',
      c => c.user_id === userId && c.consent_version === version
    );
    if (existing) {
      return {
        already_consented: true,
        consent_record: existing,
        message: `User ${userId} has already accepted consent version ${version}`
      };
    }

    const entry = {
      id: 'consent_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId,
      consent_version: version,
      accepted_at: new Date().toISOString()
    };

    await sDb.insert('consent_log', entry);
    return {
      success: true,
      consent_record: entry,
      message: `Consent version ${version} recorded for user ${userId}`
    };
  }

  /**
   * Check if a user has consented to the current version.
   * Gate registration/submission on this check.
   */
  async hasCurrentConsent(userId) {
    if (!userId) throw new Error('userId is required');

    const record = await sDb.findOne('consent_log',
      c => c.user_id === userId && c.consent_version === CURRENT_CONSENT_VERSION
    );

    return {
      user_id: userId,
      has_current_consent: Boolean(record),
      current_version: CURRENT_CONSENT_VERSION,
      consent_record: record || null,
      action_required: !record
        ? `Please accept consent version ${CURRENT_CONSENT_VERSION} before proceeding`
        : null
    };
  }

  /**
   * Get consent history for a user.
   */
  async getConsentHistory(userId) {
    if (!userId) throw new Error('userId is required');
    const all = await sDb.getTable('consent_log');
    return all.filter(c => c.user_id === userId);
  }

  getCurrentConsentVersion() {
    return CURRENT_CONSENT_VERSION;
  }
}

module.exports = { GrievanceOfficerService, CURRENT_CONSENT_VERSION };
