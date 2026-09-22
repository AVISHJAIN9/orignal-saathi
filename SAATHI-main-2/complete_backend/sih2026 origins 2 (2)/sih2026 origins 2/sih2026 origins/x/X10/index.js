/**
 * X10 — Custom Tags & Compliance Workspace Organization
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Tag management CRUD against user_tags table.
 * Tags are user-scoped. Tagging an item inserts into tagged_items.
 *
 * Tables: user_tags, tagged_items (c/database.js)
 */

const { db } = require('../../c/database');

class ComplianceTaggingService {
  static async createTag(userId, { name, color, description }) {
    if (!userId || !name) throw new Error('userId and name are required');
    const validColors = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'GREY'];
    const tagColor = color || 'BLUE';
    if (!validColors.includes(tagColor)) throw new Error(`color must be one of: ${validColors.join(', ')}`);

    const all = await db.getTable('user_tags');
    const duplicate = all.find(t => t.user_id === userId && t.name === name);
    if (duplicate) throw new Error(`Tag '${name}' already exists for user ${userId}`);

    const tag = {
      id: 'tag_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId, name, color: tagColor,
      description: description || null,
      created_at: new Date().toISOString()
    };
    await db.insert('user_tags', tag);
    return { success: true, tag };
  }

  static async getUserTags(userId) {
    if (!userId) throw new Error('userId is required');
    const all = await db.getTable('user_tags');
    return all.filter(t => t.user_id === userId);
  }

  static async tagItem(userId, tagId, itemId, itemType) {
    if (!userId || !tagId || !itemId) throw new Error('userId, tagId, and itemId are required');
    const tag = await db.findOne('user_tags', t => t.id === tagId && t.user_id === userId);
    if (!tag) throw new Error(`Tag ${tagId} not found for user ${userId}`);

    const existing = await db.findOne('tagged_items', ti => ti.tag_id === tagId && ti.item_id === itemId);
    if (existing) return { already_tagged: true, tagged_item: existing };

    const ti = {
      id: 'ti_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      tag_id: tagId, item_id: itemId, item_type: itemType || 'STANDARD',
      tagged_by: userId, tagged_at: new Date().toISOString()
    };
    await db.insert('tagged_items', ti);
    return { success: true, tagged_item: ti };
  }

  static async getItemsByTag(userId, tagId) {
    const tag = await db.findOne('user_tags', t => t.id === tagId && t.user_id === userId);
    if (!tag) throw new Error(`Tag ${tagId} not found for user ${userId}`);
    const all = await db.getTable('tagged_items');
    return all.filter(ti => ti.tag_id === tagId);
  }
}

module.exports = { ComplianceTaggingService };
