/**
 * S1 — ID-Linked Account Binding Service
 * Tables: licensing_records, users (license_id foreign key)
 * Logic: Looks up BIS registration/license ID against licensing_records table;
 * binds the user identity/session to that official license record.
 */

const { sDb } = require('../database');

class AccountBindingService {
  async bindAccount({ user_id = "usr-100", bis_license_id = "CM/L-8400192831", license_id } = {}) {
    const rawId = (license_id || bis_license_id || '').trim();
    // Normalize dashes/slashes (e.g. CML-8400192831 -> CM/L-8400192831)
    const normalizedId = rawId.replace(/^CML-/, 'CM/L-').toUpperCase();

    const licenseRecord = await sDb.findOne('licensing_records', r =>
      r.license_id.toUpperCase() === normalizedId ||
      r.license_id.replace(/[^A-Z0-9]/g, '') === normalizedId.replace(/[^A-Z0-9]/g, '')
    );

    if (!licenseRecord) {
      return {
        status: "BINDING_FAILED",
        error: `Invalid or unverified BIS License ID '${rawId}'. Record not found in statutory licensing_records repository.`,
        user_id,
        bis_license_id: rawId,
        is_bound: false,
        timestamp: new Date().toISOString()
      };
    }

    if (licenseRecord.status !== 'ACTIVE') {
      return {
        status: "BINDING_REJECTED",
        error: `BIS License ${licenseRecord.license_id} is currently ${licenseRecord.status}. Only active licenses can be bound.`,
        user_id,
        bis_license_id: licenseRecord.license_id,
        license_status: licenseRecord.status,
        is_bound: false,
        timestamp: new Date().toISOString()
      };
    }

    return {
      status: "ACCOUNT_BOUND_SUCCESS",
      is_bound: true,
      user_id,
      bis_license_id: licenseRecord.license_id,
      linked_company: licenseRecord.company_name,
      standard_number: licenseRecord.standard_number,
      product_name: licenseRecord.product_name,
      valid_till: licenseRecord.valid_till,
      factory_address: licenseRecord.factory_address,
      authorized_role: "PRIMARY_APPLICANT",
      binding_timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  AccountBindingService
};
