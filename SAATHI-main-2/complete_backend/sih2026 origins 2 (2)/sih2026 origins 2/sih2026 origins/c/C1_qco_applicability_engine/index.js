/**
 * C1 — QCO Applicability Engine
 * Tables: qcos, qco_notifications, qco_product_mappings
 * Logic: Relational mapping of Product -> QCO -> Notification Date -> Enforcement Date -> Scheme
 * Evaluates whether compliance is mandatory, voluntary, or upcoming based on statutory tables.
 */

const { db } = require('../database');

class QCOApplicabilityEngine {
  async check(productArg, hsnArg) {
    let productName = '';
    let hsnCode = '';

    if (typeof productArg === 'object' && productArg !== null) {
      productName = productArg.product || productArg.productName || productArg.product_name || '';
      hsnCode = productArg.hsnCode || productArg.hsn_code || '';
    } else {
      productName = productArg || '';
      hsnCode = hsnArg || '';
    }

    const queryTerm = productName.toLowerCase().trim();
    const hsnTerm = (hsnCode || '').trim();

    // Query qco_product_mappings
    const mappings = await db.getTable('qco_product_mappings');
    const qcos = await db.getTable('qcos');
    const notifs = await db.getTable('qco_notifications');

    let matchedMapping = null;

    if (hsnTerm) {
      matchedMapping = mappings.find(m => m.hsn_code === hsnTerm || hsnTerm.startsWith(m.hsn_code.slice(0, 4)));
    }

    if (!matchedMapping && queryTerm) {
      matchedMapping = mappings.find(m => {
        const pName = m.product_name.toLowerCase();
        return pName.includes(queryTerm) || queryTerm.includes(pName) ||
          queryTerm.split(/\s+/).some(word => word.length > 3 && pName.includes(word));
      });
    }

    // Phase 5.2 Model 2 Interface Hook: Fallback to unified product-to-standard classifier
    if (!matchedMapping && queryTerm) {
      const { matchProductToStandard } = require('../../shared/product-classifier');
      const modelMatch = await matchProductToStandard(queryTerm);
      if (modelMatch && modelMatch.classified && modelMatch.standard_id) {
        return {
          product_name: productName || queryTerm,
          hsn_code: hsnCode || 'N/A',
          is_qco_mandatory: modelMatch.is_mandatory_qco || false,
          status: modelMatch.is_mandatory_qco ? 'MANDATORY_QCO' : 'VOLUNTARY_SCHEME',
          verdict: modelMatch.is_mandatory_qco ? 'Mandatory BIS Certification Required under statutory QCO' : 'Voluntary Standard',
          mandatory_standard: modelMatch.standard_id,
          scheme: modelMatch.scheme || 'ISI_SCHEME_1',
          gazette_order: 'Gazette of India Statutory Order',
          ministry: 'Ministry of Commerce and Industry / BIS',
          notification_date: '2022-01-01',
          enforcement_date: '2023-01-01',
          exemption_eligible: false,
          days_until_enforcement: 0,
          model_mode: modelMatch.mode,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Default voluntary record if no mapping found
    if (!matchedMapping) {
      return {
        product_name: productName || 'Unclassified Commodity',
        hsn_code: hsnCode || 'N/A',
        is_qco_mandatory: false,
        status: 'VOLUNTARY_SCHEME',
        verdict: 'Voluntary Standard (No Gazette QCO enforced for this product)',
        mandatory_standard: 'N/A',
        scheme: 'Voluntary Scheme-I (Optional ISI Certification)',
        gazette_order: 'N/A',
        ministry: 'N/A',
        notification_date: null,
        enforcement_date: null,
        exemption_eligible: true,
        days_until_enforcement: null,
        timestamp: new Date().toISOString()
      };
    }

    // Join with qcos and notifications
    const matchedQco = qcos.find(q => q.id === matchedMapping.qco_id);
    const matchedNotif = notifs.find(n => n.qco_id === matchedMapping.qco_id);

    const now = new Date();
    const enforcementDate = matchedQco ? new Date(matchedQco.enforcement_date) : null;
    const isEnforced = enforcementDate ? enforcementDate <= now : false;
    const isUpcoming = enforcementDate ? enforcementDate > now : false;

    let status = 'VOLUNTARY_SCHEME';
    let verdict = 'Voluntary Standard';
    let daysUntil = null;

    if (matchedMapping.is_mandatory && matchedQco && matchedQco.is_mandatory) {
      if (isEnforced) {
        status = 'MANDATORY_ENFORCED';
        verdict = `Mandatory Compliance Enforced under ${matchedQco.qco_title}. Sale or import without BIS certification is prohibited.`;
      } else if (isUpcoming) {
        status = 'UPCOMING_MANDATORY';
        daysUntil = Math.ceil((enforcementDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        verdict = `Upcoming Mandatory QCO effective on ${matchedQco.enforcement_date} (${daysUntil} days remaining).`;
      }
    }

    return {
      product_name: matchedMapping.product_name,
      hsn_code: matchedMapping.hsn_code,
      is_qco_mandatory: matchedMapping.is_mandatory && (status === 'MANDATORY_ENFORCED' || status === 'UPCOMING_MANDATORY'),
      status,
      verdict,
      mandatory_standard: matchedMapping.indian_standard,
      scheme: matchedMapping.scheme,
      gazette_order: matchedQco ? `${matchedQco.qco_title} (${matchedQco.gazette_number})` : 'N/A',
      ministry: matchedQco ? matchedQco.ministry : 'N/A',
      notification_date: matchedQco ? matchedQco.notification_date : null,
      enforcement_date: matchedQco ? matchedQco.enforcement_date : null,
      order_number: matchedNotif ? matchedNotif.order_number : null,
      notification_url: matchedNotif ? matchedNotif.notification_url : null,
      exemption_eligible: matchedMapping.exemption_eligible,
      days_until_enforcement: daysUntil,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { QCOApplicabilityEngine };