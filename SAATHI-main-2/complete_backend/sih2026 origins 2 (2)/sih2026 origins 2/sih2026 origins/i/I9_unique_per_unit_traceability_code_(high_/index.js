/**
 * I9: Unique Per-Unit Traceability Code Generator
 * MERN Stack Service - High-security per-unit batch serialization.
 */

const crypto = require('crypto');

class UnitTraceabilityService {
  generateCodes({ license_id = "CML-8400192831", product_model = "OPC-43-BAG", manufacturing_batch_number = "B4-2024", quantity = 5 } = {}) {
    const codes = [];
    const count = Math.min(Number(quantity) || 5, 50);

    for (let i = 1; i <= count; i++) {
      const raw = `${license_id}|${product_model}|${manufacturing_batch_number}|UNIT-${i}`;
      const code = `IN-BIS-${crypto.createHash('md5').update(raw).digest('hex').substring(0, 10).toUpperCase()}`;
      codes.push({
        unit_index: i,
        unit_traceability_code: code,
        verification_url: `https://verify.saathi.gov.in/unit/${code}`
      });
    }

    return {
      license_id,
      batch_number: manufacturing_batch_number,
      total_generated: codes.length,
      unit_codes: codes,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  UnitTraceabilityService
};
