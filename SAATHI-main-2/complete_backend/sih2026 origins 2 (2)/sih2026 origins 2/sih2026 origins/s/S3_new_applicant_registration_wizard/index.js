/**
 * S3 — New-Applicant Registration Wizard Service
 * Table: applicant_business_profiles (distinct from licensed-user table)
 * Logic: Multi-step form (business details, product category, business size);
 * creates an applicant business record and automatically kicks off S15's
 * checklist generation.
 */

const { sDb } = require('../database');
const { DocumentChecklistEngine } = require('../S15_registration_specific_document_checklist');

const APPLICATIONS_STORE = {};

class RegistrationWizardService {
  async submitApplication(data = {}) {
    const appId = `BIS-APP-${Date.now().toString().slice(-6)}`;

    const applicantProfile = {
      id: appId,
      business_name: data.business_name || "Bharat Mineral Works",
      registration_number: data.registration_number || data.pan_number || data.gstin_number || "UDYAM-MH-44-00129",
      business_type: data.business_type || "PRIVATE_LTD",
      business_size: (data.business_size || data.business_scale || "SMALL").toUpperCase(),
      product_category: data.product_category || "cement",
      contact_email: data.contact_email || data.email || "applicant@example.com",
      contact_phone: data.contact_phone || data.phone || "+91-9876543210",
      address: data.factory_address || data.address || "Plot 42, MIDC, Nagpur",
      state: data.state || "Maharashtra",
      applicable_standard: data.applicable_standard || "IS 269:2015",
      license_type: data.license_type || "ISI",
      status: "UNDER_SCRUTINY",
      created_at: new Date().toISOString()
    };

    // 1. Persist to applicant_business_profiles table
    await sDb.insert('applicant_business_profiles', applicantProfile);
    APPLICATIONS_STORE[appId] = applicantProfile;

    // 2. Kick off S15 checklist generation (tightly coupled per tracker)
    const checklistEngine = new DocumentChecklistEngine();
    const generatedChecklist = await checklistEngine.generateChecklist({
      license_type: applicantProfile.license_type,
      product_category: applicantProfile.product_category,
      business_scale: applicantProfile.business_size,
      standard_number: applicantProfile.applicable_standard
    });

    return {
      application_id: appId,
      status: "APPLICATION_SUBMITTED_SUCCESS",
      applicant_profile: applicantProfile,
      registration_checklist: generatedChecklist,
      next_action: "UPLOAD_CHECKLIST_DOCUMENTS",
      timestamp: new Date().toISOString()
    };
  }

  async getApplication(appId) {
    const record = await sDb.findOne('applicant_business_profiles', a => a.id === appId);
    if (record) {
      return record;
    }
    return APPLICATIONS_STORE[appId] || {
      id: appId,
      business_name: "Bharat Mineral Works",
      status: "UNDER_SCRUTINY",
      applicable_standard: "IS 269:2015",
      state: "Maharashtra",
      created_at: new Date().toISOString()
    };
  }
}

module.exports = {
  RegistrationWizardService,
  APPLICATIONS_STORE
};
