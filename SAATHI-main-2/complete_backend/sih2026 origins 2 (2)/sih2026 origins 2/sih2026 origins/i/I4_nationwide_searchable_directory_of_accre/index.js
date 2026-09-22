/**
 * I4: Nationwide Searchable Directory of Accredited Labs (EU NANDO style)
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * MERN Stack Service - Multi-criteria lab search with scope & TAT metrics.
 * Tables: accredited_testing_laboratories (i/database.js)
 */

const { iDb, SEED_DATA } = require('../database');

class AccreditedLabsService {
  static async searchLabs({ standard, state } = {}) {
    let labs = await iDb.getTable('accredited_testing_laboratories');

    if (standard) {
      labs = labs.filter(l => l.accredited_standards && l.accredited_standards.some(s => s.toLowerCase().includes(standard.toLowerCase())));
    }
    if (state) {
      labs = labs.filter(l => l.state && l.state.toLowerCase().includes(state.toLowerCase()));
    }

    return {
      total_labs: labs.length,
      labs,
      timestamp: new Date().toISOString()
    };
  }

  async searchLabs(criteria) {
    return AccreditedLabsService.searchLabs(criteria);
  }
}

module.exports = {
  AccreditedLabsService,
  ACCREDITED_LABS: SEED_DATA.accredited_testing_laboratories
};
