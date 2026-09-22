/**
 * I18: Real-Time Central Certificate Registry
 * MERN Stack Service - Query active/cancelled/suspended BIS certificates in real-time.
 */

const { PUBLIC_DIRECTORY_DATABASE } = require('../I1_public_search_directory_(all_certified_p');

class CentralCertificateRegistryService {
  searchRegistry(query = "") {
    const q = query.toLowerCase().trim();
    const results = PUBLIC_DIRECTORY_DATABASE.filter(d =>
      d.company_name.toLowerCase().includes(q) ||
      d.cml_no.toLowerCase().includes(q) ||
      d.brand.toLowerCase().includes(q)
    );

    return {
      registry_query: query,
      total_found: results.length,
      results,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  CentralCertificateRegistryService
};
