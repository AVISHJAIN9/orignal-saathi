/**
 * S15 — Registration-Specific Document Checklist Generator
 * Table: checklist_templates (keyed by license_type)
 * Logic: Deterministic structured transform generating a tailored document checklist
 * from license-type, product-category, and enterprise-scale inputs (NOT an ML task).
 */

const { sDb } = require('../database');

class DocumentChecklistEngine {
  async generateChecklist({
    license_type = 'ISI',
    product_category = 'general',
    business_scale = 'SMALL',
    standard_number = 'IS 269:2015'
  } = {}) {
    const normLicense = license_type.toUpperCase().includes('CRS') ? 'CRS' :
      (license_type.toUpperCase().includes('FMCS') ? 'FMCS' :
      (license_type.toUpperCase().includes('HALLMARK') ? 'HALLMARKING' : 'ISI'));

    // Query checklist_templates
    const templates = await sDb.getTable('checklist_templates');
    let matchedTemplate = templates.find(t => t.license_type === normLicense);
    if (!matchedTemplate) {
      matchedTemplate = templates.find(t => t.license_type === 'ISI') || templates[0];
    }

    // Deterministic structured assembly
    const documents = [...(matchedTemplate.mandatory_documents || [])];

    // Add scale-specific concession document
    const scale = (business_scale || '').toUpperCase();
    if (scale === 'MICRO' || scale === 'SMALL') {
      documents.push({
        code: 'DOC_UDYAM_CONCESSION',
        name: 'Udyam Registration Certificate',
        description: 'Mandatory proof of MSME registration to claim 50% statutory marking fee concession under BIS regulations',
        is_required: true
      });
    }

    // Add Foreign AIR document if FMCS
    if (normLicense === 'FMCS') {
      documents.push({
        code: 'DOC_AIR_AGREEMENT',
        name: 'Authorized Indian Representative (AIR) Agreement',
        description: 'Bipartite agreement appointing resident Indian representative with legal indemnity',
        is_required: true
      });
    }

    return {
      license_type: normLicense,
      product_category,
      standard_number,
      business_scale: scale,
      total_required_documents: documents.length,
      statutory_forms: matchedTemplate.statutory_forms || [],
      technical_requirements: matchedTemplate.technical_requirements || [],
      required_checklists: documents.map(d => ({
        doc_type: d.code,
        title: d.name,
        description: d.description,
        is_required: d.is_required
      })),
      submission_guidance: `Complete all ${documents.length} documentary prerequisites prior to filing Form ${matchedTemplate.statutory_forms ? matchedTemplate.statutory_forms[0]?.form_number : 'V'} on the Manakonline portal.`,
      generated_at: new Date().toISOString()
    };
  }

  // Backward-compatible alias for existing callers
  async getCustomChecklist(params = {}) {
    return this.generateChecklist(params);
  }
}

module.exports = {
  DocumentChecklistEngine
};
