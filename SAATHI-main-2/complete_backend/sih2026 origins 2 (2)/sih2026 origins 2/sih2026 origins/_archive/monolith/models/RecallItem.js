/**
 * Thin Relational Query Wrapper for RecallItem Model
 * Backed by Architecture A standard (recalls table)
 */

const { sDb } = require('../../s/database');

class RecallItem {
  static async find(filter = {}) {
    const all = await sDb.getTable('recalls');
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
    return sDb.insert('recalls', {
      id: 'recall_' + Date.now(),
      ...data,
      created_at: new Date().toISOString()
    });
  }
}

module.exports = RecallItem;
