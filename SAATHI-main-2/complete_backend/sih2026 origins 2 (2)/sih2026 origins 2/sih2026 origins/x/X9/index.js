/**
 * X9 — Search History & Quick Recents
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Persists search queries to search_history table. Returns real recent searches
 * sorted by recency. Deduplicates identical consecutive queries.
 *
 * Tables: search_history (c/database.js)
 */

const { db } = require('../../c/database');

class SearchHistoryService {
  static async addSearch(userId, query, filters) {
    if (!userId || !query) throw new Error('userId and query are required');

    const all = await db.getTable('search_history');
    // Dedup: if identical query was the last search for this user, skip
    const userHistory = all.filter(h => h.user_id === userId).sort((a, b) => new Date(b.searched_at) - new Date(a.searched_at));
    if (userHistory[0] && userHistory[0].query === query) return { deduplicated: true, existing: userHistory[0] };

    const entry = {
      id: 'sh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId, query, filters: filters || null,
      searched_at: new Date().toISOString()
    };
    await db.insert('search_history', entry);
    return { success: true, entry };
  }

  static async getRecent(userId, limit) {
    if (!userId) throw new Error('userId is required');
    const all = await db.getTable('search_history');
    return all.filter(h => h.user_id === userId)
              .sort((a, b) => new Date(b.searched_at) - new Date(a.searched_at))
              .slice(0, limit || 10);
  }

  static async clearHistory(userId) {
    if (!userId) throw new Error('userId is required');
    const all = await db.getTable('search_history');
    let cleared = 0;
    for (const h of all.filter(h => h.user_id === userId)) {
      await db.update('search_history', s => s.id === h.id, { cleared_at: new Date().toISOString() });
      cleared++;
    }
    return { cleared, user_id: userId };
  }
}

module.exports = { SearchHistoryService };
