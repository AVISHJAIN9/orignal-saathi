/**
 * Thin Relational Query Wrapper for EvidenceRecord Model
 * Backed by Architecture A standard (evidence_documents / evidence_metadata table)
 */

const { db } = require('../../c/database');

class EvidenceRecord {
  static async find(filter = {}) {
    const all = await db.getTable('evidence_metadata');
    return all.filter(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (item[k] !== v) return false;
      }
      return true;
    });
  }

  static async findOne(filter = {}) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  static async create(data) {
    return db.insert('evidence_metadata', {
      id: 'ev_' + Date.now(),
      ...data,
      uploaded_at: new Date().toISOString()
    });
  }
}

module.exports = EvidenceRecord;
