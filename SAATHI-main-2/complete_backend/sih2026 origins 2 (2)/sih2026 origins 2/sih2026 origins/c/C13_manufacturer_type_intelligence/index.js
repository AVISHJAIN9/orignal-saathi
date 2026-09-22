/**
 * C13 — Manufacturer Type Intelligence
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Classifies manufacturer type via decision tree based on manufacturer_types
 * and type_rule_mappings tables. Asks a clarifying question when ambiguous.
 *
 * Tables: manufacturer_types, type_rule_mappings (c/database.js)
 */

const { db } = require('../database');

class ManufacturerTypeIntelligence {
  async analyze(turnoverCr, investmentCr, isForeign) {
    const turnover = typeof turnoverCr === 'number' ? turnoverCr : parseFloat(turnoverCr);
    const investment = typeof investmentCr === 'number' ? investmentCr : parseFloat(investmentCr);
    const foreign = isForeign === true || isForeign === 'true';

    const types = await db.getTable('manufacturer_types');
    const rules = await db.getTable('type_rule_mappings');

    let classified = null;

    // Foreign check first
    if (foreign) {
      classified = types.find(t => t.type_code === 'FOREIGN') || { type_code: 'FOREIGN', type_name: 'Foreign Manufacturer', scheme: 'ISI_SCHEME_I', requires_ia: true };
    }

    // Apply rule-based classification from type_rule_mappings
    if (!classified && rules.length > 0) {
      for (const rule of rules) {
        let matches = true;
        if (rule.max_turnover_cr !== null && !isNaN(turnover) && turnover > Number(rule.max_turnover_cr)) matches = false;
        if (rule.min_turnover_cr !== null && !isNaN(turnover) && turnover < Number(rule.min_turnover_cr)) matches = false;
        if (rule.max_investment_cr !== null && !isNaN(investment) && investment > Number(rule.max_investment_cr)) matches = false;
        if (matches) {
          classified = types.find(t => t.id === rule.manufacturer_type_id);
          if (classified) break;
        }
      }
    }

    // Fallback: GoI MSME criteria (Udyam 2020)
    if (!classified) {
      classified = this._fallbackClassify(turnover, investment, foreign, types);
    }

    const needsClarification = !classified || (isNaN(turnover) && isNaN(investment));

    if (needsClarification) {
      return {
        classified: false,
        clarifying_question: 'To classify your enterprise, please provide your annual turnover (INR crores) and plant & machinery investment (INR crores). These determine MSME eligibility per Udyam Registration 2020.',
        classification: null
      };
    }

    return {
      classified: true,
      type_code: classified.type_code,
      type_name: classified.type_name,
      scheme_implications: {
        applicable_scheme: classified.scheme || 'ISI_SCHEME_I',
        msme_fee_discount: classified.type_code === 'MICRO' || classified.type_code === 'SMALL' || classified.type_code === 'STARTUP',
        requires_indian_agent: Boolean(classified.requires_ia),
        fast_track_eligible: classified.type_code === 'STARTUP'
      },
      inputs: { turnover_cr: isNaN(turnover) ? null : turnover, investment_cr: isNaN(investment) ? null : investment, is_foreign: foreign },
      basis: classified.type_code === 'FOREIGN' ? 'Foreign entity override' : 'GoI MSME Criteria + type_rule_mappings',
      classified_at: new Date().toISOString()
    };
  }

  _fallbackClassify(turnover, investment, foreign, types) {
    if (foreign) return { type_code: 'FOREIGN', type_name: 'Foreign Manufacturer', scheme: 'ISI_SCHEME_I', requires_ia: true };
    // GoI MSME 2020 classification
    if (!isNaN(turnover)) {
      if (turnover <= 5) return { type_code: 'MICRO', type_name: 'Micro Enterprise (GoI MSME)', scheme: 'ISI_SCHEME_I' };
      if (turnover <= 50) return { type_code: 'SMALL', type_name: 'Small Enterprise (GoI MSME)', scheme: 'ISI_SCHEME_I' };
      if (turnover <= 250) return { type_code: 'MEDIUM', type_name: 'Medium Enterprise (GoI MSME)', scheme: 'ISI_SCHEME_I' };
      return { type_code: 'LARGE', type_name: 'Large Enterprise', scheme: 'ISI_SCHEME_I' };
    }
    return null;
  }
}

module.exports = { ManufacturerTypeIntelligence };