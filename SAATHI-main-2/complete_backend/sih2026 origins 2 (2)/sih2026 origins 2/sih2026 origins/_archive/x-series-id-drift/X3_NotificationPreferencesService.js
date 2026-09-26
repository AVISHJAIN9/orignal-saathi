/**
 * X3 — Notification Preferences & Delivery Config
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Reads/writes notification_preferences table (c/database.js).
 * Validates channel names. Upserts on save.
 */

const { db } = require('../../c/database');

const VALID_CHANNELS = ['EMAIL', 'SMS', 'PUSH', 'IN_APP'];

class NotificationPreferencesService {
  static async getPreferences(userId) {
    if (!userId) throw new Error('userId is required');
    const all = await db.getTable('notification_preferences');
    const pref = all.find(p => p.user_id === userId);
    return pref || { user_id: userId, channels: ['EMAIL', 'IN_APP'], frequency: 'IMMEDIATE', is_default: true };
  }

  static async savePreferences(userId, { channels, frequency }) {
    if (!userId) throw new Error('userId is required');
    if (channels) {
      const invalid = channels.filter(c => !VALID_CHANNELS.includes(c));
      if (invalid.length > 0) throw new Error(`Invalid channels: ${invalid.join(', ')}. Valid: ${VALID_CHANNELS.join(', ')}`);
    }
    const validFreqs = ['IMMEDIATE', 'DAILY_DIGEST', 'WEEKLY_DIGEST'];
    if (frequency && !validFreqs.includes(frequency)) throw new Error(`frequency must be one of: ${validFreqs.join(', ')}`);

    const all = await db.getTable('notification_preferences');
    const existing = all.find(p => p.user_id === userId);

    if (existing) {
      return db.update('notification_preferences', p => p.user_id === userId, {
        channels: channels || existing.channels,
        frequency: frequency || existing.frequency,
        updated_at: new Date().toISOString()
      });
    }

    const newPref = {
      id: 'np_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId,
      channels: channels || ['EMAIL', 'IN_APP'],
      frequency: frequency || 'IMMEDIATE',
      created_at: new Date().toISOString()
    };
    await db.insert('notification_preferences', newPref);
    return newPref;
  }
}

module.exports = { NotificationPreferencesService };
