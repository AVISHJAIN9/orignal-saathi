/**
 * C5 — Intelligent Scheme Selector
 * Tables: scheme_rules, scheme_eligibility_criteria
 * Logic: Decision/rules engine matching product characteristics, scale,
 * and origin to the right BIS scheme (ISI Scheme-I, CRS, FMCS, Hallmarking).
 */

const { db } = require('../database');

class SchemeSelectorService {
  async selectScheme(categoryArg, originArg, modelArg) {
    let productCategory = 'general';
    let originCountry = 'INDIA';
    let businessModel = 'DOMESTIC_MANUFACTURER';

    if (typeof categoryArg === 'object' && categoryArg !== null) {
      productCategory = categoryArg.productCategory || categoryArg.category || productCategory;
      originCountry = categoryArg.targetMarket || categoryArg.originCountry || categoryArg.origin || originCountry;
      businessModel = categoryArg.businessModel || categoryArg.model || businessModel;
    } else {
      productCategory = categoryArg || productCategory;
      originCountry = originArg || originCountry;
      businessModel = modelArg || businessModel;
    }

    const catTerm = productCategory.toLowerCase();
    const isForeign = originCountry.toUpperCase().includes('FOREIGN') || originCountry.toUpperCase().includes('OVERSEAS') || businessModel.toUpperCase().includes('IMPORT');

    // Query rules from scheme_rules table
    const rules = await db.getTable('scheme_rules');
    const criteria = await db.getTable('scheme_eligibility_criteria');

    let matchedRule = null;

    if (isForeign) {
      matchedRule = rules.find(r => r.scheme_code === 'FMCS');
    } else if (catTerm.includes('gold') || catTerm.includes('silver') || catTerm.includes('jewel')) {
      matchedRule = rules.find(r => r.scheme_code === 'HALLMARKING');
    } else if (catTerm.includes('electronic') || catTerm.includes('it_') || catTerm.includes('laptop') || catTerm.includes('battery') || catTerm.includes('solar') || catTerm.includes('phone')) {
      matchedRule = rules.find(r => r.scheme_code === 'CRS');
    } else {
      matchedRule = rules.find(r => r.scheme_code === 'ISI_SCHEME_I');
    }

    if (!matchedRule) {
      matchedRule = rules[0];
    }

    const matchedCrit = criteria.find(c => c.scheme_code === matchedRule.scheme_code);

    return {
      product_category: productCategory,
      origin: isForeign ? 'FOREIGN' : 'INDIA',
      business_model: businessModel,
      recommended_scheme: matchedRule.outcome_scheme,
      scheme_code: matchedRule.scheme_code,
      legal_route_description: matchedRule.outcome_description,
      statutory_requirements: {
        requires_factory_inspection: matchedCrit ? matchedCrit.requires_factory_inspection : true,
        requires_surveillance: matchedCrit ? matchedCrit.requires_surveillance : true,
        foreign_bank_guarantee_required: matchedRule.scheme_code === 'FMCS',
        portal_route: matchedRule.scheme_code === 'CRS' ? 'crsbis.in' : 'manakonline.in'
      },
      next_steps: [
        matchedRule.scheme_code === 'CRS' ? 'Register on crsbis.in portal' : 'Submit Form-V on manakonline.in',
        'Generate registration document checklist using Module S15',
        'Upload accredited lab test report meeting required Indian Standard'
      ],
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { SchemeSelectorService };