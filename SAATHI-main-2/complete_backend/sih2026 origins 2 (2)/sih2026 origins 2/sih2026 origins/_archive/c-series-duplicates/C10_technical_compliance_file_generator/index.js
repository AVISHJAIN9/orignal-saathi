/**
 * C10 — Technical Compliance File (TCF) Generator
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Assembles a TCF from technical_file_templates + manufacturer/product data.
 * Explicitly flags required sections that are missing (not silently omitted).
 *
 * Tables: technical_file_templates, manufacturers, product_catalog (c/database.js)
 */

const { db } = require('../database');

class TechnicalFileGenerator {
  async generateTCF(manufacturerInfo, productInfo, testReports) {
    if (!manufacturerInfo || !productInfo) throw new Error('manufacturerInfo and productInfo are required');

    // Normalise inputs (controller may pass nested objects or flat body)
    const mfr = typeof manufacturerInfo === 'object' ? manufacturerInfo : { manufacturer_id: manufacturerInfo };
    const prod = typeof productInfo === 'object' ? productInfo : { product_name: productInfo };

    const templates = await db.getTable('technical_file_templates');
    const targetScheme = prod.scheme || mfr.scheme || 'ISI_SCHEME_I';

    // Find the right template
    const template = templates.find(t => t.scheme === targetScheme) || templates[0];

    const REQUIRED_SECTIONS = [
      'manufacturer_identification', 'product_description', 'applicable_standard',
      'test_reports', 'quality_control_plan', 'factory_details', 'declaration_of_conformity'
    ];

    const sections = {};
    const missingRequired = [];

    for (const section of REQUIRED_SECTIONS) {
      const value = this._resolveSection(section, mfr, prod, testReports, template);
      if (value !== null) {
        sections[section] = value;
      } else {
        missingRequired.push({ section, action_required: `Provide ${section.replace(/_/g, ' ')} to complete TCF` });
      }
    }

    const isComplete = missingRequired.length === 0;

    return {
      tcf_status: isComplete ? 'COMPLETE' : 'INCOMPLETE',
      completeness_pct: Math.round(((REQUIRED_SECTIONS.length - missingRequired.length) / REQUIRED_SECTIONS.length) * 100),
      sections,
      missing_sections: missingRequired,
      scheme: targetScheme,
      template_id: template ? template.id : null,
      generated_at: new Date().toISOString()
    };
  }

  _resolveSection(section, mfr, prod, testReports, template) {
    switch (section) {
      case 'manufacturer_identification':
        return mfr.manufacturer_id || mfr.company_name ? { ...mfr } : null;
      case 'product_description':
        return prod.product_name ? { ...prod } : null;
      case 'applicable_standard':
        return (prod.standard_number || prod.standard_id) ? { standard: prod.standard_number || prod.standard_id } : null;
      case 'test_reports':
        return Array.isArray(testReports) && testReports.length > 0 ? testReports : null;
      case 'quality_control_plan':
        return prod.qc_plan_ref || (template && template.qc_plan_template) ? { ref: prod.qc_plan_ref || 'QC_PLAN_FROM_TEMPLATE', template: template && template.qc_plan_template } : null;
      case 'factory_details':
        return mfr.factory_address ? { address: mfr.factory_address } : null;
      case 'declaration_of_conformity':
        return mfr.authorized_signatory ? { signatory: mfr.authorized_signatory, date: new Date().toISOString().slice(0, 10) } : null;
      default:
        return null;
    }
  }
}

module.exports = { TechnicalFileGenerator };
