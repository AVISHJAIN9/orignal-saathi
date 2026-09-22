/**
 * I10: Genuine vs Fake Claim Checker for Consumers
 * MERN Stack Service - UK Kitemark style public authenticity verification.
 */

const { PUBLIC_DIRECTORY_DATABASE } = require('../I1_public_search_directory_(all_certified_p');

class GenuineClaimCheckerService {
  verify({ claimed_cml = "CML-8400192831", claimed_brand = "BHARAT-SHAKTI" } = {}) {
    const matched = PUBLIC_DIRECTORY_DATABASE.find(
      item => item.cml_no.toLowerCase() === claimed_cml.toLowerCase()
    );

    if (!matched) {
      return {
        claimed_cml,
        claimed_brand,
        is_authentic: false,
        verdict: "INVALID_OR_COUNTERFEIT_CML",
        risk_level: "HIGH_ALERT",
        recommendation: "Report this unauthorized mark to BIS Consumer Affairs Cell.",
        timestamp: new Date().toISOString()
      };
    }

    const brandMatch = matched.brand.toLowerCase() === claimed_brand.toLowerCase();

    return {
      claimed_cml,
      claimed_brand,
      is_authentic: brandMatch,
      verdict: brandMatch ? "VERIFIED_GENUINE_BIS_MARK" : "BRAND_MISMATCH_SUSPICION",
      registered_company: matched.company_name,
      registered_brand: matched.brand,
      applicable_standard: matched.standard,
      status: matched.status,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  GenuineClaimCheckerService
};
