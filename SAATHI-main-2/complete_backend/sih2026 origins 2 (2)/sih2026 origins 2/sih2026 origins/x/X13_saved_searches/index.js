/**
 * X13 — Saved Searches
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Persists named saved searches to saved_searches table.
 * Validates query is non-empty. Returns actual DB rows.
 *
 * Tables: saved_searches (c/database.js)
 */

const { db } = require('../../c/database');

class SavedSearchesService {
  static async saveSearch(userId, { title, query, filters }) {
    if (!userId || !query) throw new Error('userId and query are required');
    if (!title) throw new Error('title is required — give the search a descriptive name');

    const entry = {
      id: 'ss_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId, title, query, filters: filters || null,
      saved_at: new Date().toISOString()
    };
    await db.insert('saved_searches', entry);
    return { success: true, saved_search: entry };
  }

  static async getSavedSearches(userId) {
    if (!userId) throw new Error('userId is required');
    const all = await db.getTable('saved_searches');
    return all.filter(s => s.user_id === userId && !s.deleted_at)
              .sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
  }

  static async deleteSearch(userId, searchId) {
    const s = await db.findOne('saved_searches', ss => ss.id === searchId);
    if (!s) throw new Error(`Saved search ${searchId} not found`);
    if (s.user_id !== userId) throw new Error('Cannot delete another user\'s saved search');
    return db.update('saved_searches', ss => ss.id === searchId, { deleted_at: new Date().toISOString() });
  }
}

module.exports = { SavedSearchesService };
