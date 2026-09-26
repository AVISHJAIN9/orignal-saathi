/**
 * C46 — Adaptive Learning Engine
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Tracks user feedback on answers to improve future routing.
 * Inserts into answer_feedback table. Computes per-topic accuracy
 * from feedback (thumbs-up/down ratio). Does NOT modify RAG chunks.
 *
 * Tables: answer_feedback, answer_provenance (c/database.js)
 */

const { db } = require('../database');

class AdaptiveLearningEngine {
  async recordFeedback(answer_id, rating, user_id, feedback_text) {
    if (!answer_id || !rating) throw new Error('answer_id and rating are required');
    const validRatings = ['HELPFUL', 'NOT_HELPFUL', 'PARTIALLY_HELPFUL'];
    if (!validRatings.includes(rating)) throw new Error(`rating must be one of: ${validRatings.join(', ')}`);

    const feedback = {
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      answer_id,
      rating,
      user_id: user_id || 'ANONYMOUS',
      feedback_text: feedback_text || null,
      recorded_at: new Date().toISOString()
    };

    await db.insert('answer_feedback', feedback);
    return { success: true, feedback_id: feedback.id, answer_id, rating };
  }

  async getTopicAccuracy(topic, last_n) {
    const allFeedback = await db.getTable('answer_feedback');
    const recent = last_n ? allFeedback.slice(-last_n) : allFeedback;

    let topicFeedback = recent;
    if (topic) {
      const provenance = await db.getTable('answer_provenance');
      const topicAnswerIds = new Set(
        provenance.filter(p => (p.source_ref || '').toLowerCase().includes(topic.toLowerCase())).map(p => p.answer_id)
      );
      topicFeedback = recent.filter(f => topicAnswerIds.has(f.answer_id));
    }

    if (topicFeedback.length === 0) return { topic: topic || 'ALL', total_feedback: 0, accuracy: null, message: 'No feedback data for this topic.' };

    const helpful = topicFeedback.filter(f => f.rating === 'HELPFUL').length;
    const partial = topicFeedback.filter(f => f.rating === 'PARTIALLY_HELPFUL').length;
    const notHelpful = topicFeedback.filter(f => f.rating === 'NOT_HELPFUL').length;
    const accuracy = (helpful + partial * 0.5) / topicFeedback.length;

    return {
      topic: topic || 'ALL',
      total_feedback: topicFeedback.length,
      helpful, partial, not_helpful: notHelpful,
      accuracy_score: parseFloat(accuracy.toFixed(3)),
      accuracy_pct: Math.round(accuracy * 100),
      computed_at: new Date().toISOString()
    };
  }

  async getLowAccuracyTopics(threshold) {
    const minAccuracy = threshold || 0.50;
    const allFeedback = await db.getTable('answer_feedback');
    const provenance = await db.getTable('answer_provenance');

    // Group by standard (extracted from source_ref)
    const topicGroups = {};
    for (const fb of allFeedback) {
      const prov = provenance.filter(p => p.answer_id === fb.answer_id);
      for (const p of prov) {
        const std = (p.source_ref || '').split('§')[0].trim() || 'UNKNOWN';
        if (!topicGroups[std]) topicGroups[std] = [];
        topicGroups[std].push(fb.rating);
      }
    }

    const results = [];
    for (const [std, ratings] of Object.entries(topicGroups)) {
      const helpful = ratings.filter(r => r === 'HELPFUL').length;
      const partial = ratings.filter(r => r === 'PARTIALLY_HELPFUL').length;
      const acc = (helpful + partial * 0.5) / ratings.length;
      if (acc < minAccuracy) results.push({ topic: std, accuracy: parseFloat(acc.toFixed(3)), sample_size: ratings.length });
    }

    return results.sort((a, b) => a.accuracy - b.accuracy);
  }
}

module.exports = { AdaptiveLearningEngine };
