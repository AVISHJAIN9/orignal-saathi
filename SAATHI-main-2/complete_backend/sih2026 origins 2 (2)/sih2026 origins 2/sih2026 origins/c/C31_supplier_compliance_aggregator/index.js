/**
 * C31 — Supplier Compliance Aggregator
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Aggregates compliance status across all suppliers of a manufacturer.
 * Flags any supplier whose license is expired or whose evidence is missing.
 *
 * Tables: supplier_profiles, licensing_records, evidence_documents (c/database.js)
 */

const { db } = require('../database');

class SupplierComplianceAggregator {
  async aggregate(manufacturer_id) {
    if (!manufacturer_id) throw new Error('manufacturer_id is required');

    const suppliers = await db.getTable('supplier_profiles');
    const mfrSuppliers = suppliers.filter(s => s.manufacturer_id === manufacturer_id);

    if (mfrSuppliers.length === 0) return { manufacturer_id, total_suppliers: 0, supplier_statuses: [], message: 'No suppliers registered for this manufacturer.' };

    const licRecords = await db.getTable('licensing_records');
    const evidenceDocs = await db.getTable('evidence_documents');
    const now = new Date();

    const statuses = mfrSuppliers.map(sup => {
      const lic = licRecords.find(l => l.license_id === sup.supplier_license_id);
      const evidence = evidenceDocs.filter(e => e.manufacturer_id === sup.supplier_id);

      let status = 'UNKNOWN';
      const issues = [];

      if (!lic) { issues.push('No BIS license record found'); status = 'MISSING_LICENSE'; }
      else if (lic.status !== 'ACTIVE') { issues.push(`License status: ${lic.status}`); status = 'INACTIVE_LICENSE'; }
      else {
        const daysLeft = Math.ceil((new Date(lic.valid_till) - now) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) { issues.push('License EXPIRED'); status = 'EXPIRED'; }
        else if (daysLeft < 30) { issues.push(`License expiring in ${daysLeft} days`); status = 'EXPIRING_SOON'; }
        else status = 'COMPLIANT';
      }

      if (evidence.length === 0) issues.push('No compliance evidence on file');

      return {
        supplier_id: sup.supplier_id,
        supplier_name: sup.supplier_name,
        supplier_license_id: sup.supplier_license_id,
        status: issues.length > 0 && status === 'COMPLIANT' ? 'AT_RISK' : status,
        issues,
        evidence_document_count: evidence.length,
        license_valid_till: lic ? lic.valid_till : null
      };
    });

    const compliant = statuses.filter(s => s.status === 'COMPLIANT').length;
    return {
      manufacturer_id,
      total_suppliers: mfrSuppliers.length,
      compliant,
      non_compliant: mfrSuppliers.length - compliant,
      compliance_rate_pct: Math.round((compliant / mfrSuppliers.length) * 100),
      supplier_statuses: statuses,
      aggregated_at: new Date().toISOString()
    };
  }
}

module.exports = { SupplierComplianceAggregator };
