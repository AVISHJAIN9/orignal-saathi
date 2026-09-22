/**
 * X2 — Compliance Feedback & Rating System
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Stores feedback in answer_feedback (c/database.js via C46).
 * getMetrics computes real averages from the table, not hardcoded 4.8/5.
 *
 * Tables: answer_feedback (c/database.js)
 */

const { db } = require('../../c/database');

const VALID_RATINGS = [1, 2, 3, 4, 5];

class ComplianceFeedbackService {
  static async submitFeedback({ answer_id, rating, user_id, feedback_text, feature_area }) {
    if (!answer_id || rating === undefined) throw new Error('answer_id and rating are required');
    const numRating = Number(rating);
    if (!VALID_RATINGS.includes(numRating)) throw new Error(`rating must be 1–5, got: ${rating}`);

    const entry = {
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      answer_id,
      rating: numRating,
      user_id: user_id || 'ANONYMOUS',
      feedback_text: feedback_text || null,
      feature_area: feature_area || 'GENERAL',
      // Normalise to C46 schema
      rating_label: numRating >= 4 ? 'HELPFUL' : numRating === 3 ? 'PARTIALLY_HELPFUL' : 'NOT_HELPFUL',
      submitted_at: new Date().toISOString()
    };

    await db.insert('answer_feedback', entry);
    return { success: true, feedback_id: entry.id, rating: numRating };
  }

  static async getMetrics(feature_area) {
    const all = await db.getTable('answer_feedback');
    let relevant = feature_area ? all.filter(f => f.feature_area === feature_area) : all;

    if (relevant.length === 0) {
      return { feature_area: feature_area || 'ALL', count: 0, average_rating: null, message: 'No feedback submitted yet.' };
    }

    const sum = relevant.reduce((acc, f) => acc + Number(f.rating || 0), 0);
    const avg = sum / relevant.length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const f of relevant) { distribution[Number(f.rating || 0)]++; }

    return {
      feature_area: feature_area || 'ALL',
      count: relevant.length,
      average_rating: parseFloat(avg.toFixed(2)),
      distribution,
      computed_at: new Date().toISOString()
    };
  }
}

module.exports = { ComplianceFeedbackService };
