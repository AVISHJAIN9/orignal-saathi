/**
 * C32 — Export Compliance Advisor
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Checks product against export_compliance_rules for target country.
 * Returns required certifications and trade barriers. No fabricated requirements.
 *
 * Tables: export_compliance_rules (c/database.js)
 */

const { db } = require('../database');

class ExportComplianceAdvisor {
  async check(productStandardId, targetCountries) {
    if (!productStandardId) throw new Error('productStandardId is required');
    const countries = Array.isArray(targetCountries) ? targetCountries : targetCountries ? [targetCountries] : [];

    const rules = await db.getTable('export_compliance_rules');

    const results = countries.map(country => {
      const countryRules = rules.filter(r =>
        (r.target_country === country || r.target_country === 'ALL') &&
        (!r.product_standard_id || r.product_standard_id === productStandardId)
      );

      if (countryRules.length === 0) {
        return {
          country,
          status: 'NO_RULES_FOUND',
          message: `No export compliance rules found in database for ${country} + ${productStandardId}. Consult DGFT and importing country's SPS/TBT portal directly.`,
          required_certifications: [],
          trade_barriers: []
        };
      }

      return {
        country,
        status: 'RULES_FOUND',
        required_certifications: countryRules.flatMap(r => r.required_certifications || []),
        trade_barriers: countryRules.flatMap(r => r.trade_barriers || []),
        mutual_recognition: countryRules.some(r => r.mutual_recognition),
        rules_count: countryRules.length
      };
    });

    return {
      product_standard_id: productStandardId,
      countries_checked: countries,
      results,
      fetched_at: new Date().toISOString()
    };
  }
}

module.exports = { ExportComplianceAdvisor };
