/**
 * S8 — Appeals / Dispute-Resolution Flow
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Routes appeals to the correct department via appeal_routing_rules table.
 * Department is never hardcoded — always derived from the reason_category rule table.
 *
 * Tables: appeals, appeal_routing_rules (s/database.js)
 */

const { sDb } = require('../database');

const VALID_STATUSES = ['UNDER_REVIEW', 'ESCALATED', 'RESOLVED', 'DISMISSED'];
const VALID_STATUS_TRANSITIONS = {
  UNDER_REVIEW: ['ESCALATED', 'RESOLVED', 'DISMISSED'],
  ESCALATED: ['RESOLVED', 'DISMISSED'],
  RESOLVED: [],
  DISMISSED: []
};

class AppealsDisputeService {
  /**
   * File a new appeal. Department is determined from appeal_routing_rules by reason_category.
   */
  async fileAppeal({ application_or_message_id, reason, reason_category }) {
    if (!application_or_message_id || !reason || !reason_category) {
      throw new Error('application_or_message_id, reason, and reason_category are required');
    }

    // Look up department from rule table — never hardcode
    const rules = await sDb.getTable('appeal_routing_rules');
    const rule = rules.find(r =>
      r.reason_category.toLowerCase() === reason_category.toLowerCase()
    );

    if (!rule) {
      throw new Error(
        `No routing rule found for reason_category '${reason_category}'. ` +
        `Valid categories: ${rules.map(r => r.reason_category).join(', ')}`
      );
    }

    const appeal = {
      id: 'appeal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      application_or_message_id,
      reason,
      reason_category,
      department: rule.department,
      status: 'UNDER_REVIEW',
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    await sDb.insert('appeals', appeal);
    return {
      success: true,
      appeal_id: appeal.id,
      routed_to_department: rule.department,
      status: appeal.status,
      appeal
    };
  }

  /**
   * Get a specific appeal by ID.
   */
  async getAppeal(appealId) {
    if (!appealId) throw new Error('appealId is required');
    const appeal = await sDb.findOne('appeals', a => a.id === appealId);
    if (!appeal) throw new Error(`Appeal ${appealId} not found`);
    return appeal;
  }

  /**
   * Update the status of an appeal. Validates FSM transitions.
   */
  async updateStatus(appealId, newStatus, resolution_notes) {
    if (!appealId || !newStatus) throw new Error('appealId and newStatus are required');
    if (!VALID_STATUSES.includes(newStatus)) {
      throw new Error(`Invalid status '${newStatus}'. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const appeal = await sDb.findOne('appeals', a => a.id === appealId);
    if (!appeal) throw new Error(`Appeal ${appealId} not found`);

    const allowedNext = VALID_STATUS_TRANSITIONS[appeal.status] || [];
    if (!allowedNext.includes(newStatus)) {
      throw new Error(
        `Cannot transition appeal from '${appeal.status}' to '${newStatus}'. ` +
        `Allowed transitions: ${allowedNext.join(', ') || 'none (terminal state)'}`
      );
    }

    const patch = {
      status: newStatus,
      ...(resolution_notes ? { resolution_notes } : {}),
      ...(newStatus === 'RESOLVED' || newStatus === 'DISMISSED'
        ? { resolved_at: new Date().toISOString() }
        : {})
    };

    return sDb.update('appeals', a => a.id === appealId, patch);
  }

  /**
   * List all appeals (optionally filtered by status or department).
   */
  async listAppeals({ status, department } = {}) {
    let all = await sDb.getTable('appeals');
    if (status) all = all.filter(a => a.status === status);
    if (department) all = all.filter(a => a.department === department);
    return all;
  }

  /**
   * Get available routing rules (for UI display).
   */
  async getRoutingRules() {
    return sDb.getTable('appeal_routing_rules');
  }
}

module.exports = { AppealsDisputeService };
