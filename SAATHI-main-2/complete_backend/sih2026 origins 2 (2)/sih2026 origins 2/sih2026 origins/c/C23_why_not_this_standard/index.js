/**
 * C23 — Why Not This Standard? Engine
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Explains why a specific standard does NOT apply by matching against
 * exclusion_reasons in standard_exclusion_rules. Checks 4 criteria:
 * (a) product category mismatch, (b) process/material exclusion,
 * (c) supersession, (d) jurisdiction. Returns "APPLIES" if none match.
 *
 * Tables: standard_exclusion_rules (c/database.js)
 */

const { db } = require('../database');

class WhyNotThisStandard {
  async explain(standardId, productAttributes) {
    if (!standardId) throw new Error('standardId is required');
    const attrs = productAttributes || {};

    const rules = await db.getTable('standard_exclusion_rules');
    const relevant = rules.filter(r => r.standard_id === standardId);

    const triggered = [];
    const satisfied = [];

    for (const rule of relevant) {
      const match = this._evaluateRule(rule, attrs);
      if (match.triggered) triggered.push({ rule_id: rule.id, criterion: rule.criterion, exclusion_reason: rule.exclusion_reason, matched_attribute: match.matched_attribute });
      else satisfied.push({ rule_id: rule.id, criterion: rule.criterion });
    }

    if (relevant.length === 0) {
      // No exclusion rules found — standard may apply but we cannot confirm
      return {
        standard_id: standardId,
        verdict: 'INSUFFICIENT_DATA',
        reason: `No exclusion rules configured for ${standardId} in standard_exclusion_rules. Cannot determine applicability without rules data.`,
        triggered_exclusions: [],
        satisfied_criteria: []
      };
    }

    const verdict = triggered.length > 0 ? 'DOES_NOT_APPLY' : 'APPLIES';

    return {
      standard_id: standardId,
      verdict,
      primary_reason: triggered.length > 0 ? triggered[0].exclusion_reason : 'All inclusion criteria satisfied',
      triggered_exclusions: triggered,
      satisfied_criteria: satisfied,
      product_attributes_checked: attrs,
      evaluated_at: new Date().toISOString()
    };
  }

  _evaluateRule(rule, attrs) {
    const criterion = rule.criterion || '';
    let triggered = false;
    let matched_attribute = null;

    if (criterion === 'product_category_mismatch') {
      if (attrs.product_category && rule.excluded_values && !rule.excluded_values.includes(attrs.product_category)) {
        triggered = true; matched_attribute = attrs.product_category;
      }
    } else if (criterion === 'process_exclusion') {
      if (attrs.process && rule.excluded_values && rule.excluded_values.includes(attrs.process)) {
        triggered = true; matched_attribute = attrs.process;
      }
    } else if (criterion === 'superseded_by') {
      if (rule.superseded_by) { triggered = true; matched_attribute = rule.superseded_by; }
    } else if (criterion === 'jurisdiction') {
      if (attrs.jurisdiction && rule.excluded_values && !rule.excluded_values.includes(attrs.jurisdiction)) {
        triggered = true; matched_attribute = attrs.jurisdiction;
      }
    }

    return { triggered, matched_attribute };
  }
}

module.exports = { WhyNotThisStandard, WhyNotThisStandardEngine: WhyNotThisStandard };