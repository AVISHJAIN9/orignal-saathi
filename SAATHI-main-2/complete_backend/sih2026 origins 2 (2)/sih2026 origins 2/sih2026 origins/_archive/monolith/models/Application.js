/**
 * Thin Relational Query Wrapper for Application Model
 * Backed by Architecture A standard (applicant_business_profiles table)
 */

const { sDb } = require('../../s/database');

class Application {
  static async find(filter = {}) {
    const all = await sDb.getTable('applicant_business_profiles');
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
    return this.findOne({ id });
  }

  static async create(data) {
    return sDb.insert('applicant_business_profiles', data);
  }
}

module.exports = Application;
