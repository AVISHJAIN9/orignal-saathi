/**
 * C18 — Human Escalation Packet
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Creates and retrieves escalation packets for queries that C17 declined to answer.
 * Each packet stores the question, context chunks, confidence score, and reason.
 * Routed to subject-matter experts or senior BIS officers.
 *
 * Tables: escalation_packets (c/database.js)
 */

const { db } = require('../database');

const PACKET_STATUSES = ['OPEN', 'ASSIGNED', 'RESOLVED', 'CLOSED'];

class HumanEscalationService {
  /**
   * Create a new escalation packet.
   */
  async createPacket({ escalation_id, question, context_chunks, confidence_score, reason, priority }) {
    if (!question || !reason) throw new Error('question and reason are required');

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const prio = priority || 'MEDIUM';
    if (!validPriorities.includes(prio)) throw new Error(`priority must be one of: ${validPriorities.join(', ')}`);

    const packet = {
      id: 'esc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      escalation_id: escalation_id || null,
      question,
      context_chunks: Array.isArray(context_chunks) ? context_chunks : [],
      confidence_score: typeof confidence_score === 'number' ? confidence_score : null,
      reason,
      priority: prio,
      status: 'OPEN',
      assigned_expert_id: null,
      resolution_notes: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    await db.insert('escalation_packets', packet);
    return { success: true, packet_id: packet.id, packet };
  }

  /**
   * Get an escalation packet by ID.
   */
  async getPacket(packetId) {
    if (!packetId) throw new Error('packetId is required');
    const packet = await db.findOne('escalation_packets', p => p.id === packetId);
    if (!packet) throw new Error(`Escalation packet ${packetId} not found`);
    return packet;
  }

  /**
   * Get packet by escalation_id (from C17 log entry).
   */
  async getPacketByEscalationId(escalationId) {
    if (!escalationId) throw new Error('escalationId is required');
    return db.findOne('escalation_packets', p => p.escalation_id === escalationId);
  }

  /**
   * Assign a packet to an expert.
   */
  async assignToExpert(packetId, expertId) {
    const packet = await db.findOne('escalation_packets', p => p.id === packetId);
    if (!packet) throw new Error(`Packet ${packetId} not found`);
    if (packet.status === 'RESOLVED' || packet.status === 'CLOSED') {
      throw new Error(`Cannot assign packet in status '${packet.status}'`);
    }

    return db.update('escalation_packets', p => p.id === packetId, {
      assigned_expert_id: expertId,
      status: 'ASSIGNED'
    });
  }

  /**
   * Resolve a packet with expert notes.
   */
  async resolvePacket(packetId, resolution_notes, expert_id) {
    if (!resolution_notes) throw new Error('resolution_notes are required to close a packet');

    const packet = await db.findOne('escalation_packets', p => p.id === packetId);
    if (!packet) throw new Error(`Packet ${packetId} not found`);
    if (packet.status === 'CLOSED') throw new Error('Packet is already closed');

    return db.update('escalation_packets', p => p.id === packetId, {
      status: 'RESOLVED',
      resolution_notes,
      resolved_by: expert_id || packet.assigned_expert_id,
      resolved_at: new Date().toISOString()
    });
  }

  /**
   * List all open packets (for expert review queue).
   */
  async listOpenPackets({ priority } = {}) {
    let all = await db.getTable('escalation_packets');
    all = all.filter(p => p.status === 'OPEN' || p.status === 'ASSIGNED');
    if (priority) all = all.filter(p => p.priority === priority);
    return all.sort((a, b) => {
      const priOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (priOrder[a.priority] || 2) - (priOrder[b.priority] || 2);
    });
  }
}

module.exports = { HumanEscalationService };