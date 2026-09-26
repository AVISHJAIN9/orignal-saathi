/**
 * I6: Two-Tier Risk Classification Shown Upfront
 * MERN Stack Service - Upfront Tier 1 vs Tier 2 regulatory categorization.
 */

class UpfrontRiskClassifier {
  classify(subject = "") {
    const s = subject.toLowerCase().trim();
    const isTier1 = s.includes('cement') || s.includes('steel') || s.includes('water') || s.includes('food');

    return {
      queried_subject: subject,
      risk_tier: isTier1 ? "TIER_1_CRITICAL_PUBLIC_HEALTH_SAFETY" : "TIER_2_GENERAL_CONSUMER_ELECTRONICS",
      regulatory_regime: isTier1 ? "Mandatory BIS ISI Scheme-I (Factory Audit + Lab Test)" : "BIS CRS Scheme-II / Self-Declaration",
      qco_enforcement_active: true,
      inspection_rigor: isTier1 ? "Pre-licensing Factory Audit + Random Market Surveillance" : "Type Testing at Recognized Lab",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  UpfrontRiskClassifier
};
