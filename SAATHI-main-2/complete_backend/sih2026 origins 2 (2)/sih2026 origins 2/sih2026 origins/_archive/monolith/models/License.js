/**
 * Thin Relational Query Wrapper for License Model
 * Backed by Architecture A standard (PostgreSQL licensing_records table)
 */

const { sDb } = require('../../s/database');

class License {
  static async find(filter = {}) {
    const all = await sDb.getTable('licensing_records');
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

  static async findById(id) {
    return this.findOne({ license_id: id });
  }

  static async create(data) {
    return sDb.insert('licensing_records', data);
  }
}

module.exports = License;
