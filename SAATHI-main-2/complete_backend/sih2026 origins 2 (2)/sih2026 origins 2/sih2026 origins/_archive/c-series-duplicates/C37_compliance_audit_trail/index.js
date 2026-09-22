/**
 * C37: Compliance Audit Trail & Provenance Ledger (MERN Stack)
 */
const crypto = require('crypto');
const TRAIL = [];

class ComplianceAuditTrailService {
  recordEvent(data = {}) {
    const prevHash = TRAIL.length > 0 ? TRAIL[TRAIL.length - 1].hash : "0".repeat(64);
    const block = {
      index: TRAIL.length + 1,
      user_id: data.user_id || "usr-100",
      action: data.action_summary || "Audit action recorded",
      previous_hash: prevHash,
      timestamp: new Date().toISOString()
    };
    block.hash = crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
    TRAIL.push(block);
    return block;
  }
  getTrail() {
    return { total_events: TRAIL.length, trail: TRAIL, timestamp: new Date().toISOString() };
  }
}
module.exports = { ComplianceAuditTrailService };