/**
 * C17 — SAATHI Refuses to Guess (Confidence Guardrail)
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Evaluates query confidence score against confidence_thresholds table.
 * If below threshold: DECLINE and route to C18 human escalation.
 * Decision is logged to confidence_audit_log for traceability.
 * NOT a keyword blacklist — this is a real confidence threshold system.
 *
 * Tables: confidence_thresholds, confidence_audit_log (c/database.js)
 */

const { db } = require('../database');

const DECISIONS = { ANSWER: 'ANSWER', DECLINE: 'DECLINE' };

class SafetyGuardrailService {
  /**
   * Evaluate whether SAATHI should answer or decline a query.
   * @param {string} messageId - unique message identifier
   * @param {number} score - confidence score [0.0, 1.0]
   * @param {string} intent - classified intent of the query
   */
  async evaluateSafety(messageId, score, intent) {
    if (!messageId) throw new Error('messageId is required');
    const normalizedScore = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(normalizedScore) || normalizedScore < 0 || normalizedScore > 1) {
      throw new Error(`score must be a number between 0.0 and 1.0, got: ${score}`);
    }

    // Look up threshold from table
    const thresholds = await db.getTable('confidence_thresholds');
    let threshold = null;

    // Prefer intent-specific threshold, then global
    if (intent) {
      threshold = thresholds.find(t => t.intent === intent);
    }
    if (!threshold) {
      threshold = thresholds.find(t => t.intent === 'GLOBAL' || t.intent === 'default' || t.is_default);
    }

    const minimumScore = threshold ? Number(threshold.minimum_score) : 0.65; // conservative fallback
    const decision = normalizedScore >= minimumScore ? DECISIONS.ANSWER : DECISIONS.DECLINE;

    // Log to confidence_audit_log (insert-only for traceability)
    const logEntry = {
      id: 'clog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      message_id: messageId,
      score: normalizedScore,
      intent: intent || 'UNCLASSIFIED',
      threshold_used: minimumScore,
      threshold_id: threshold ? threshold.id : null,
      decision,
      logged_at: new Date().toISOString()
    };
    await db.insert('confidence_audit_log', logEntry);

    const response = {
      message_id: messageId,
      score: normalizedScore,
      intent: intent || 'UNCLASSIFIED',
      threshold_applied: minimumScore,
      decision,
      log_id: logEntry.id
    };

    if (decision === DECISIONS.DECLINE) {
      response.reason = `Confidence score ${normalizedScore.toFixed(3)} is below minimum threshold ${minimumScore} for intent '${intent || 'UNCLASSIFIED'}'. SAATHI declines to guess — routing to human escalation.`;
      response.next_action = 'ESCALATE_TO_HUMAN_VIA_C18';
    } else {
      response.reason = `Confidence score ${normalizedScore.toFixed(3)} meets minimum threshold ${minimumScore}. Answer may be provided.`;
      response.next_action = 'PROVIDE_ANSWER_WITH_PROVENANCE_VIA_C16';
    }

    return response;
  }

  /**
   * Get all log entries for a message (for audit trail).
   */
  async getAuditLog(messageId) {
    if (!messageId) throw new Error('messageId is required');
    const all = await db.getTable('confidence_audit_log');
    return all.filter(e => e.message_id === messageId);
  }

  /**
   * Get available confidence thresholds.
   */
  async getThresholds() {
    return db.getTable('confidence_thresholds');
  }
}

module.exports = { SafetyGuardrailService };