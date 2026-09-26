/**
 * C34 — Compliance Chatbot Memory
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Session-scoped conversation memory. Stores turns in chat_sessions table.
 * Includes topic extraction (what BIS concepts were discussed) for context continuity.
 *
 * Tables: chat_sessions, chat_turns (c/database.js)
 */

const { db } = require('../database');

class ComplianceChatbotMemory {
  async startSession(userId, initial_context) {
    if (!userId) throw new Error('userId is required');
    const session = {
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId,
      initial_context: initial_context || null,
      discussed_topics: [],
      turn_count: 0,
      started_at: new Date().toISOString()
    };
    await db.insert('chat_sessions', session);
    return { session_id: session.id, user_id: userId };
  }

  async addTurn(session_id, role, content) {
    if (!session_id || !role || !content) throw new Error('session_id, role, and content are required');
    if (!['user', 'assistant'].includes(role)) throw new Error("role must be 'user' or 'assistant'");

    const session = await db.findOne('chat_sessions', s => s.id === session_id);
    if (!session) throw new Error(`Session ${session_id} not found`);

    const turn = {
      id: 'turn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      session_id,
      role,
      content,
      topics_detected: this._extractTopics(content),
      turn_index: session.turn_count,
      created_at: new Date().toISOString()
    };
    await db.insert('chat_turns', turn);

    // Update session's discussed_topics (union)
    const newTopics = [...new Set([...(session.discussed_topics || []), ...turn.topics_detected])];
    await db.update('chat_sessions', s => s.id === session_id, {
      discussed_topics: newTopics, turn_count: session.turn_count + 1
    });

    return turn;
  }

  async getHistory(session_id, lastN) {
    if (!session_id) throw new Error('session_id is required');
    const all = await db.getTable('chat_turns');
    const turns = all.filter(t => t.session_id === session_id).sort((a, b) => a.turn_index - b.turn_index);
    return lastN ? turns.slice(-lastN) : turns;
  }

  async getSessionContext(session_id) {
    const session = await db.findOne('chat_sessions', s => s.id === session_id);
    if (!session) throw new Error(`Session ${session_id} not found`);
    const history = await this.getHistory(session_id, 10);
    return {
      session_id,
      user_id: session.user_id,
      turn_count: session.turn_count,
      discussed_topics: session.discussed_topics || [],
      recent_history: history
    };
  }

  _extractTopics(text) {
    const BIS_KEYWORDS = ['ISI mark', 'IS ', 'CRS', 'QCO', 'BIS', 'license', 'renewal', 'recall', 'audit', 'testing', 'NABL', 'certificate', 'fee', 'appeal', 'suspension', 'clause'];
    const lower = text.toLowerCase();
    return BIS_KEYWORDS.filter(kw => lower.includes(kw.toLowerCase())).slice(0, 5);
  }
}

module.exports = { ComplianceChatbotMemory };
