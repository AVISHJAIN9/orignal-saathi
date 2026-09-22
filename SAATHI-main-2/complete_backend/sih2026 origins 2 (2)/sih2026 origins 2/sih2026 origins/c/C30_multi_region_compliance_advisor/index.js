/**
 * C30 — Multi-Region Compliance Advisor
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Returns region-specific requirements from regional_requirements table.
 * Overlays BIS national requirements with state-level addenda.
 *
 * Tables: regional_requirements (c/database.js)
 */

const { db } = require('../database');

class MultiRegionAdvisor {
  async getRequirements(standardId, regions) {
    if (!standardId) throw new Error('standardId is required');
    const regionList = Array.isArray(regions) ? regions : regions ? [regions] : ['ALL'];

    const all = await db.getTable('regional_requirements');
    const national = all.filter(r => (r.region === 'ALL' || r.region === 'NATIONAL') && r.standard_id === standardId);
    const regional = all.filter(r => regionList.includes(r.region) && r.standard_id === standardId);

    return {
      standard_id: standardId,
      regions_queried: regionList,
      national_requirements: national,
      regional_addenda: regional,
      total_requirements: national.length + regional.length,
      note: 'Regional addenda are in addition to national BIS requirements, not replacements.',
      fetched_at: new Date().toISOString()
    };
  }
}

module.exports = { MultiRegionAdvisor };
