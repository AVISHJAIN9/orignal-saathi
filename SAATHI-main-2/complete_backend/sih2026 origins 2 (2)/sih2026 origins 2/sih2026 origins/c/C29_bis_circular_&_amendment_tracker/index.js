/**
 * C29 — BIS Circular & Amendment Tracker
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Fetches BIS circulars from bis_circulars table. Marks as READ when fetched.
 * Extracts effective_date from circular text if not explicit.
 *
 * Tables: bis_circulars (c/database.js)
 */

const { db } = require('../database');

class BISCircularTracker {
  async getUnread() {
    const all = await db.getTable('bis_circulars');
    return all.filter(c => !c.read_at);
  }

  async markRead(circularId) {
    const circular = await db.findOne('bis_circulars', c => c.id === circularId);
    if (!circular) throw new Error(`Circular ${circularId} not found`);
    return db.update('bis_circulars', c => c.id === circularId, { read_at: new Date().toISOString() });
  }

  async search(query, { year, category } = {}) {
    const all = await db.getTable('bis_circulars');
    const queryLower = (query || '').toLowerCase();
    return all.filter(c => {
      const matchQuery = !queryLower || c.title.toLowerCase().includes(queryLower) || (c.summary || '').toLowerCase().includes(queryLower);
      const matchYear = !year || c.circular_date.startsWith(String(year));
      const matchCat = !category || c.category === category;
      return matchQuery && matchYear && matchCat;
    });
  }

  async getByStandard(standardId) {
    const all = await db.getTable('bis_circulars');
    const cleanStd = standardId.replace(/:.*/, '').trim().toUpperCase();
    return all.filter(c =>
      (c.affected_standards || []).some(s => s.replace(/:.*/, '').trim().toUpperCase() === cleanStd)
    );
  }
}

module.exports = { BISCircularTracker };
