/**
 * I2: Public Per-Manufacturer Certification Profile Page
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * MERN Stack Service - TÜV Certipedia style transparency dossier.
 * Tables: certified_products (i/database.js)
 */

const { iDb } = require('../database');

class ManufacturerProfileService {
  static async getProfile(companyName) {
    const term = decodeURIComponent(companyName || '').toLowerCase().trim();
    const all = await iDb.getTable('certified_products');
    const matched = all.filter(m => m.company_name && m.company_name.toLowerCase().includes(term));

    if (matched.length === 0) {
      return {
        company_name: companyName,
        status: "UNREGISTERED_OR_SEARCH_QUERY",
        licenses_held: [],
        trust_tier: "UNVERIFIED",
        timestamp: new Date().toISOString()
      };
    }

    const primary = matched[0];
    const licenses = matched.map(m => ({
      cml_no: m.cml_no,
      brand: m.brand,
      standard: m.standard,
      status: m.status,
      valid_until: m.valid_until
    }));

    return {
      company_name: primary.company_name,
      primary_license: primary.cml_no,
      licenses_held: licenses,
      brand_portfolio: [...new Set(matched.map(m => m.brand))],
      standard_certified: primary.standard,
      status: primary.status,
      factory_location: `${primary.factory_city}, ${primary.factory_state}`,
      valid_until: primary.valid_until,
      gem_eligible: primary.gem_portal_eligible,
      eco_mark: primary.eco_mark_certified,
      trust_tier: primary.status === 'OPERATIVE_VALID' ? 'BIS_CERTIFIED_OPERATIVE' : 'ACTION_REQUIRED',
      timestamp: new Date().toISOString()
    };
  }

  async getProfile(companyName) {
    return ManufacturerProfileService.getProfile(companyName);
  }
}

module.exports = {
  ManufacturerProfileService
};
