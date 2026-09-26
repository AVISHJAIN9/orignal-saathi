/**
 * G12_firewall___ddos_protection (MERN Stack)
 */
class WafProtectionService {
  static inspectRequest(payload = {}) {
    return Object.assign({ status: "ok", timestamp: new Date().toISOString() }, {"threatDetected":false,"clientIpScore":0.01}, payload);
  }
}

const inspectRequest = (p) => WafProtectionService.inspectRequest(p);

module.exports = { WafProtectionService, inspectRequest };
