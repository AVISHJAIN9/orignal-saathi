/**
 * C14 — Renewal & Expiry Intelligence
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Real date math on license_validity / licensing_records. Computes actual
 * days_until_expiry from current timestamp. Returns genuine renewal window status.
 *
 * Tables: licensing_records, license_validity, renewal_preparation_guidance (c/database.js)
 * Cross-series: linked to S19 for renewal initiation
 */

const { db } = require('../database');

// Renewal window thresholds
const CRITICAL_DAYS = 30;
const HIGH_DAYS = 90;
const MEDIUM_DAYS = 180;

class RenewalIntelligenceService {
  /**
   * Forecast expiry status for a single license. Real date computation.
   */
  async forecastExpiry(licenseId) {
    if (!licenseId) throw new Error('licenseId is required');

    const cleanId = String(licenseId).replace(/^CML-/, 'CM/L-');

    // Check license_validity first (richer record), fall back to licensing_records
    const validityRows = await db.getTable('license_validity');
    let validityRow = validityRows.find(v =>
      v.license_id === cleanId || v.license_id === licenseId
    );

    // Fallback to licensing_records
    if (!validityRow) {
      const licRecords = await db.getTable('licensing_records');
      const lic = licRecords.find(l =>
        l.license_id === cleanId || l.license_id === licenseId
      );
      if (lic) {
        validityRow = {
          license_id: lic.license_id,
          expiry_date: lic.valid_till,
          scheme: lic.scheme || 'ISI_SCHEME_I',
          renewal_guidance_id: null
        };
      }
    }

    if (!validityRow) throw new Error(`License '${licenseId}' not found`);

    const now = new Date();
    const expiryDate = new Date(validityRow.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    let renewalWindowStatus;
    if (daysUntilExpiry < 0) renewalWindowStatus = 'EXPIRED';
    else if (daysUntilExpiry <= CRITICAL_DAYS) renewalWindowStatus = 'CRITICAL_RENEWAL_WINDOW';
    else if (daysUntilExpiry <= HIGH_DAYS) renewalWindowStatus = 'HIGH_PRIORITY_RENEWAL';
    else if (daysUntilExpiry <= MEDIUM_DAYS) renewalWindowStatus = 'UPCOMING_RENEWAL';
    else renewalWindowStatus = 'RENEWAL_NOT_IMMINENT';

    const renewalDueDate = new Date(expiryDate);
    renewalDueDate.setDate(renewalDueDate.getDate() - 90); // 90 days before expiry

    // Fetch preparation guidance
    let guidance = null;
    if (validityRow.renewal_guidance_id) {
      const guidanceRows = await db.getTable('renewal_preparation_guidance');
      guidance = guidanceRows.find(g => g.id === validityRow.renewal_guidance_id) || null;
    }

    return {
      license_id: validityRow.license_id,
      scheme: validityRow.scheme || 'ISI_SCHEME_I',
      expiry_date: validityRow.expiry_date,
      days_until_expiry: daysUntilExpiry,
      renewal_window_status: renewalWindowStatus,
      renewal_due_date: renewalDueDate.toISOString().slice(0, 10),
      action_required: daysUntilExpiry <= HIGH_DAYS,
      is_expired: daysUntilExpiry < 0,
      preparation_steps: guidance ? guidance.steps : this._defaultSteps(validityRow.scheme),
      computed_at: now.toISOString()
    };
  }

  /**
   * Get all licenses with upcoming expiry within N days.
   */
  async getUpcomingRenewals(withinDays = 90) {
    const validityRows = await db.getTable('license_validity');
    const licRecords = await db.getTable('licensing_records');
    const now = new Date();

    const results = [];

    // From license_validity
    for (const row of validityRows) {
      const expiry = new Date(row.expiry_date);
      const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      if (days >= 0 && days <= withinDays) {
        results.push({ license_id: row.license_id, expiry_date: row.expiry_date, days_until_expiry: days, scheme: row.scheme });
      }
    }

    // From licensing_records (for any not covered by license_validity)
    const coveredIds = new Set(validityRows.map(v => v.license_id));
    for (const lic of licRecords) {
      if (coveredIds.has(lic.license_id)) continue;
      const expiry = new Date(lic.valid_till);
      const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      if (days >= 0 && days <= withinDays) {
        results.push({ license_id: lic.license_id, expiry_date: lic.valid_till, days_until_expiry: days, company_name: lic.company_name });
      }
    }

    results.sort((a, b) => a.days_until_expiry - b.days_until_expiry);
    return { within_days: withinDays, count: results.length, upcoming: results };
  }

  _defaultSteps(scheme) {
    return [
      { step: 1, action: 'Submit Form-XI (Renewal Application) with full fee' },
      { step: 2, action: 'Attach latest factory survey test reports (last 12 months)' },
      { step: 3, action: 'Confirm in-house equipment calibration certificates are current' },
      { step: 4, action: 'Submit updated CTP (Competent Technical Person) appointment letter if changed' }
    ];
  }
}

module.exports = { RenewalIntelligenceService };