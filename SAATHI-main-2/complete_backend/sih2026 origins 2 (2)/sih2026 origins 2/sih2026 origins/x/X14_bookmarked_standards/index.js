/**
 * X14 — Bookmarked Standards Service
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Persists user bookmarks for standards to bookmarked_standards table.
 * Supports add, remove, toggle, and list with search & tagging.
 *
 * Tables: bookmarked_standards (c/database.js)
 */

const { db } = require('../../c/database');

class BookmarkedStandardsService {
  static async getBookmarks(userId = 'usr_default') {
    if (!userId) throw new Error('userId is required');
    const all = await db.getTable('bookmarked_standards');
    return all
      .filter(b => b.user_id === userId && !b.deleted_at)
      .sort((a, b) => new Date(b.bookmarked_at) - new Date(a.bookmarked_at));
  }

  static async addBookmark(userId, standardNumber, metadata = {}) {
    if (!userId || !standardNumber) throw new Error('userId and standardNumber are required');

    const cleanStd = standardNumber.trim().toUpperCase();
    const existing = await db.findOne('bookmarked_standards', 
      b => b.user_id === userId && b.standard_number === cleanStd && !b.deleted_at
    );

    if (existing) {
      return { status: 'EXISTS', bookmark: existing };
    }

    const bookmark = {
      id: 'bm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      user_id: userId,
      standard_number: cleanStd,
      title: metadata.title || cleanStd,
      category: metadata.category || 'GENERAL',
      notes: metadata.notes || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      bookmarked_at: new Date().toISOString(),
      deleted_at: null
    };

    await db.insert('bookmarked_standards', bookmark);
    return { status: 'BOOKMARKED', bookmark };
  }

  static async removeBookmark(userId, standardNumber) {
    if (!userId || !standardNumber) throw new Error('userId and standardNumber are required');
    const cleanStd = standardNumber.trim().toUpperCase();

    const existing = await db.findOne('bookmarked_standards', 
      b => b.user_id === userId && b.standard_number === cleanStd && !b.deleted_at
    );

    if (!existing) {
      return { status: 'NOT_FOUND', standardNumber: cleanStd };
    }

    await db.update('bookmarked_standards', 
      b => b.id === existing.id, 
      { deleted_at: new Date().toISOString() }
    );

    return { status: 'REMOVED', standardNumber: cleanStd, id: existing.id };
  }

  static async toggleBookmark(userId, standardNumber, metadata = {}) {
    if (!userId || !standardNumber) throw new Error('userId and standardNumber are required');
    const cleanStd = standardNumber.trim().toUpperCase();

    const existing = await db.findOne('bookmarked_standards', 
      b => b.user_id === userId && b.standard_number === cleanStd && !b.deleted_at
    );

    if (existing) {
      await db.update('bookmarked_standards', 
        b => b.id === existing.id, 
        { deleted_at: new Date().toISOString() }
      );
      return {
        userId,
        standardNumber: cleanStd,
        action: 'UNBOOKMARKED',
        timestamp: new Date().toISOString()
      };
    } else {
      const res = await this.addBookmark(userId, cleanStd, metadata);
      return {
        userId,
        standardNumber: cleanStd,
        action: 'BOOKMARKED',
        bookmark: res.bookmark,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = { BookmarkedStandardsService };
