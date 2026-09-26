/**
 * Thin Relational Query Wrapper for AuditLog Model
 * Backed by Architecture A standard (audit_events / requirement_audits table)
 */

const { db } = require('../../c/database');

class AuditLog {
  static async find(filter = {}) {
    const all = await db.getTable('requirement_audits');
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
    return db.insert('requirement_audits', {
      id: 'audit_' + Date.now(),
      ...data,
      audited_at: new Date().toISOString()
    });
  }
}

module.exports = AuditLog;
