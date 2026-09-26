/**
 * C19 — Compliance Passport
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Joins C1/C6/C35/S1 tables to build a unified compliance profile per manufacturer.
 * Read-only aggregate — never a new source of truth.
 *
 * Tables: manufacturers, licensing_records, evidence_documents, product_catalog,
 *         qco_applicability_rules (c/database.js)
 */

const { db } = require('../database');
const { sDb } = require('../../s/database');

class CompliancePassportService {
  async getPassport(licenseId) {
    if (!licenseId) throw new Error('licenseId is required');

    const cleanId = String(licenseId).replace(/^CML-/, 'CM/L-');

    // License info from statutory S-series or C-series
    let licRecords = await sDb.getTable('licensing_records');
    if (!licRecords || licRecords.length === 0) {
      licRecords = await db.getTable('licensing_records');
    }
    const license = licRecords.find(l => l.license_id === cleanId || l.license_id === licenseId);
    if (!license) throw new Error(`License ${licenseId} not found`);

    // Product catalog (C6-equivalent)
    const productCatalog = await db.getTable('product_catalog');
    const products = productCatalog.filter(p => p.manufacturer_id === license.license_id);

    // Evidence (C35-equivalent)
    const evidenceDocs = await db.getTable('evidence_documents');
    const evidence = evidenceDocs.filter(e => e.manufacturer_id === license.license_id);

    // QCO applicability (C1-equivalent)
    const qcoRules = await db.getTable('qco_applicability_rules');
    const relevantQco = qcoRules.filter(q =>
      q.product_category && license.product_name &&
      license.product_name.toLowerCase().includes(q.product_category.toLowerCase().split('_')[0])
    );

    // Risk score (C40-equivalent)
    const riskScores = await db.getTable('risk_scores');
    const latestRisk = riskScores
      .filter(s => s.manufacturer_id === license.license_id)
      .sort((a, b) => new Date(b.computed_at || 0) - new Date(a.computed_at || 0))[0] || null;

    const now = new Date();
    const expiryDate = new Date(license.valid_till);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    return {
      passport_for: license.license_id,
      generated_at: now.toISOString(),
      license: {
        license_id: license.license_id,
        company_name: license.company_name,
        product_name: license.product_name,
        standard_number: license.standard_number,
        status: license.status,
        valid_till: license.valid_till,
        days_until_expiry: daysUntilExpiry,
        factory_address: license.factory_address
      },
      products: { count: products.length, items: products },
      evidence: { count: evidence.length, items: evidence },
      qco_applicability: { applicable_rules: relevantQco.length, rules: relevantQco },
      risk_profile: latestRisk ? { score: latestRisk.score, risk_tier: latestRisk.risk_tier, computed_at: latestRisk.computed_at } : { score: null, note: 'No risk score computed. Run C40.' },
      overall_health: this._computeHealth(license, evidence, daysUntilExpiry, latestRisk)
    };
  }

  _computeHealth(license, evidence, daysUntilExpiry, riskScore) {
    const issues = [];
    if (daysUntilExpiry < 0) issues.push('License EXPIRED');
    else if (daysUntilExpiry < 30) issues.push('License expiring in < 30 days — CRITICAL');
    if (license.status !== 'ACTIVE') issues.push(`License status is ${license.status}`);
    if (evidence.length === 0) issues.push('No compliance evidence on file');
    if (riskScore && riskScore.score > 40) issues.push(`High risk score: ${riskScore.score}`);

    return {
      health_status: issues.length === 0 ? 'HEALTHY' : issues.length <= 1 ? 'AT_RISK' : 'CRITICAL',
      issues
    };
  }
}

module.exports = { CompliancePassportService };