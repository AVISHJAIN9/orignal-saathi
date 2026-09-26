/**
 * S10 — Certificate Download & Public Verification Center
 * Table: certificates (license_id, issue_date, valid_till, status, file_reference, pdf_url, qr_code_hash)
 * Logic:
 *  1. Minimal public (no-login) verification endpoint that returns validity status only by license number
 *     (does NOT expose applicant private/operational data).
 *  2. Certificate PDF generation and download handler.
 */

const { sDb } = require('../database');

class CertificateVerificationService {
  /**
   * Minimal public trust-verification surface
   * Returns ONLY statutory validity status without disclosing applicant personal data.
   */
  async publicVerify(licenseId) {
    const rawId = (licenseId || '').trim();
    const cleanId = rawId.replace(/^CML-/, 'CM/L-').toUpperCase();

    const cert = await sDb.findOne('certificates', c =>
      c.license_id.toUpperCase() === cleanId ||
      c.license_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );

    if (!cert) {
      return {
        license_id: rawId,
        is_valid: false,
        status: 'UNREGISTERED_OR_INVALID',
        message: 'No active BIS certification found matching this license number.',
        verification_timestamp: new Date().toISOString()
      };
    }

    const now = new Date();
    const validTill = new Date(cert.valid_till);
    const isOperative = cert.status === 'VALID' && validTill >= now;

    return {
      license_id: cert.license_id,
      is_valid: isOperative,
      status: isOperative ? 'VALID' : cert.status,
      issue_date: cert.issue_date,
      valid_till: cert.valid_till,
      qr_code_hash: cert.qr_code_hash,
      message: isOperative
        ? 'Official BIS License is currently active and valid for public commercial distribution.'
        : `Official BIS License status is ${cert.status}. Public use of Standard Mark is unauthorized.`,
      verification_timestamp: new Date().toISOString()
    };
  }

  /**
   * Generates or fetches certificate PDF URL and file reference
   */
  async getCertificateDownload(licenseId) {
    const rawId = (licenseId || '').trim();
    const cleanId = rawId.replace(/^CML-/, 'CM/L-').toUpperCase();

    const cert = await sDb.findOne('certificates', c =>
      c.license_id.toUpperCase() === cleanId ||
      c.license_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );

    if (!cert) {
      return {
        license_id: rawId,
        download_available: false,
        error: 'Certificate record not found.'
      };
    }

    return {
      license_id: cert.license_id,
      download_available: true,
      pdf_url: cert.pdf_url,
      file_reference: cert.file_reference,
      issue_date: cert.issue_date,
      valid_till: cert.valid_till,
      status: cert.status,
      timestamp: new Date().toISOString()
    };
  }

  // Backward-compatible method
  async verifyCertificate(cmlNumber = "CML-8400192831") {
    const verification = await this.publicVerify(cmlNumber);
    const download = await this.getCertificateDownload(cmlNumber);

    return {
      cml_number: verification.license_id,
      status: verification.status,
      valid_until: verification.valid_till,
      is_authentic: verification.is_valid,
      download_pdf_url: download.pdf_url || `https://storage.saathi.gov.in/certificates/${cmlNumber}.pdf`,
      timestamp: verification.verification_timestamp
    };
  }
}

module.exports = {
  CertificateVerificationService
};
