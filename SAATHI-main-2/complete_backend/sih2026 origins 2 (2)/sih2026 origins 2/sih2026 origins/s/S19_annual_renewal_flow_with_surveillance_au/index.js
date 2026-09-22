/**
 * S19 — Annual Renewal Flow with Surveillance-Audit Trigger
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Determines surveillance_audit_required using real logic:
 * - Checks C40's risk_scores for the manufacturer's risk tier
 * - Also applies periodic schedule (every 3rd year requires audit regardless)
 * - Auto-creates a visit_appointment record if surveillance is required
 *
 * Tables: renewals, visit_appointments, licensing_records (s/database.js)
 * Cross-series: reads risk_scores from c/database.js
 */

const { sDb } = require('../database');

// Load C-series database for risk score access
let cDb = null;
try {
  const cDatabase = require('../../c/database');
  cDb = cDatabase.db;
} catch (e) {
  cDb = null;
}

// Surveillance audit thresholds
const HIGH_RISK_SCORE_THRESHOLD = 25; // score > 25 → always surveillance
const PERIODIC_AUDIT_EVERY_N_YEARS = 3; // every 3rd renewal year regardless of risk

class RenewalInitiatorService {
  /**
   * Initiate a renewal. Determines surveillance_audit_required from risk tier
   * and periodic schedule. Auto-creates visit_appointment if surveillance required.
   */
  async initiateRenewal(licenseId, renewalYear) {
    if (!licenseId) throw new Error('licenseId is required');

    const year = renewalYear || new Date().getFullYear();

    // Check license exists
    const license = await sDb.findOne('licensing_records', l => l.license_id === licenseId);
    if (!license) throw new Error(`License ${licenseId} not found`);

    // Check for duplicate renewal for this year
    const existing = await sDb.findOne('renewals',
      r => r.license_id === licenseId && r.renewal_year === year
    );
    if (existing) throw new Error(`Renewal for ${licenseId} in ${year} already exists (id: ${existing.id})`);

    // Determine surveillance requirement
    const { surveillance_audit_required, determination_reason } = await this._determineSurveillance(licenseId, year);

    const renewal = {
      id: 'renewal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      license_id: licenseId,
      renewal_year: year,
      surveillance_audit_required,
      determination_reason,
      linked_visit_id: null,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    // If surveillance required, auto-create a visit appointment
    if (surveillance_audit_required) {
      // Default to 30 days from now for the proposed surveillance audit
      const proposed = new Date();
      proposed.setDate(proposed.getDate() + 30);
      const visitId = 'visit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

      const visit = {
        id: visitId,
        applicant_id: licenseId,
        officer_id: 'OFFICER_TBD', // to be assigned by regional office
        proposed_date: proposed.toISOString().slice(0, 10),
        slot_time: '10:00-12:00',
        status: 'PROPOSED',
        audit_report_status: 'PENDING',
        notes: `Auto-created surveillance audit for renewal year ${year}. Reason: ${determination_reason}`,
        created_at: new Date().toISOString()
      };

      await sDb.insert('visit_appointments', visit);
      renewal.linked_visit_id = visitId;
    }

    await sDb.insert('renewals', renewal);

    return {
      success: true,
      renewal,
      surveillance_required: surveillance_audit_required,
      determination_reason,
      auto_created_visit: surveillance_audit_required ? renewal.linked_visit_id : null
    };
  }

  /**
   * Determine if surveillance audit is required.
   * Uses C40 risk score (real cross-series dependency) + periodic schedule.
   */
  async _determineSurveillance(licenseId, year) {
    // Periodic schedule: every 3rd renewal year always requires audit
    if (year % PERIODIC_AUDIT_EVERY_N_YEARS === 0) {
      return {
        surveillance_audit_required: true,
        determination_reason: `Periodic audit year (every ${PERIODIC_AUDIT_EVERY_N_YEARS}rd year, year ${year})`
      };
    }

    // Check C40 risk score
    if (cDb) {
      try {
        const riskScores = await cDb.getTable('risk_scores');
        const latestScore = riskScores
          .filter(rs => rs.manufacturer_id === licenseId || rs.product_id === licenseId)
          .sort((a, b) => new Date(b.computed_at) - new Date(a.computed_at))[0];

        if (latestScore && Number(latestScore.score) >= HIGH_RISK_SCORE_THRESHOLD) {
          return {
            surveillance_audit_required: true,
            determination_reason: `High risk score: ${latestScore.score} (threshold: ${HIGH_RISK_SCORE_THRESHOLD})`
          };
        }
        if (latestScore) {
          return {
            surveillance_audit_required: false,
            determination_reason: `Risk score ${latestScore.score} is below threshold ${HIGH_RISK_SCORE_THRESHOLD}`
          };
        }
      } catch (e) {
        // C-series db unavailable — default to requiring surveillance conservatively
      }
    }

    // Default: require surveillance if no risk data available (conservative)
    return {
      surveillance_audit_required: true,
      determination_reason: 'No risk score data available — defaulting to surveillance required (conservative)'
    };
  }

  /**
   * Get renewal history for a license.
   */
  async getRenewalHistory(licenseId) {
    const all = await sDb.getTable('renewals');
    return all.filter(r => r.license_id === licenseId);
  }

  /**
   * Update renewal status.
   */
  async updateRenewalStatus(renewalId, status) {
    const valid = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
    if (!valid.includes(status)) throw new Error(`Invalid status. Must be: ${valid.join(', ')}`);
    const renewal = await sDb.findOne('renewals', r => r.id === renewalId);
    if (!renewal) throw new Error(`Renewal ${renewalId} not found`);
    return sDb.update('renewals', r => r.id === renewalId, { status });
  }
}

module.exports = { RenewalInitiatorService };
