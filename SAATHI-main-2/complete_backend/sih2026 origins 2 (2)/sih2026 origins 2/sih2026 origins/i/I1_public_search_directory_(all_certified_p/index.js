/**
 * I1: Public Search Directory (All Certified Products)
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * MERN Stack Service - US FCC / TÜV style searchable database of all active BIS certified products.
 * Tables: certified_products (i/database.js)
 */

const { iDb, SEED_DATA } = require('../database');

class PublicSearchDirectoryService {
  /**
   * Searches certified products registry by term across company, brand, product, standard, CML.
   */
  static async search(query = "") {
    const q = query.toLowerCase().trim();
    const all = await iDb.getTable('certified_products');
    if (!q) return all;

    return all.filter(item =>
      (item.company_name && item.company_name.toLowerCase().includes(q)) ||
      (item.brand && item.brand.toLowerCase().includes(q)) ||
      (item.product && item.product.toLowerCase().includes(q)) ||
      (item.cml_no && item.cml_no.toLowerCase().includes(q)) ||
      (item.standard && item.standard.toLowerCase().includes(q))
    );
  }

  // Instance method for backward compatibility
  async search(query = "") {
    return PublicSearchDirectoryService.search(query);
  }
}

module.exports = {
  PublicSearchDirectoryService,
  PUBLIC_DIRECTORY_DATABASE: SEED_DATA.certified_products
};
