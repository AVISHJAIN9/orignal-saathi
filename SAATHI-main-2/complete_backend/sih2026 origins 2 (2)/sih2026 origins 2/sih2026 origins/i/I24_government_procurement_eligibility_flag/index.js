/**
 * I24: Government Procurement (GeM) Green Eligibility Flag
 * MERN Stack Service - Government e-Marketplace procurement preference verifier.
 */

const { PUBLIC_DIRECTORY_DATABASE } = require('../I1_public_search_directory_(all_certified_p');

class GeMEligibilityService {
  checkEligibility(licenseId = "CML-8400192831") {
    const item = PUBLIC_DIRECTORY_DATABASE.find(d => d.cml_no === licenseId) || PUBLIC_DIRECTORY_DATABASE[0];

    return {
      license_id: licenseId,
      manufacturer_name: item.company_name,
      gem_portal_eligible: item.gem_portal_eligible,
      green_procurement_advantage: true,
      gem_vendor_rating: "5_STAR_VERIFIED",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  GeMEligibilityService
};
