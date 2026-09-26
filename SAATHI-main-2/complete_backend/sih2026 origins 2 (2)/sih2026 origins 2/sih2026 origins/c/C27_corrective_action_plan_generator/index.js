/**
 * C27 — Corrective Action Plan (CAP) Builder
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Builds a CAP from open compliance gaps (C26) + remediation templates.
 * Each CAP item has a deadline computed from today + gap priority lead time.
 *
 * Tables: compliance_gaps, cap_templates (c/database.js)
 */

const { db } = require('../database');

const PRIORITY_LEAD_DAYS = { CRITICAL: 7, HIGH: 14, MEDIUM: 30, LOW: 90 };

class CorrectiveActionPlanBuilder {
  async buildCAP(manufacturer_id) {
    if (!manufacturer_id) throw new Error('manufacturer_id is required');

    const allGaps = await db.getTable('compliance_gaps');
    const openGaps = allGaps.filter(g => g.manufacturer_id === manufacturer_id && g.status === 'OPEN');

    if (openGaps.length === 0) {
      return { manufacturer_id, cap_status: 'NO_OPEN_GAPS', items: [], generated_at: new Date().toISOString() };
    }

    const templates = await db.getTable('cap_templates');
    const now = new Date();

    const items = openGaps.map(gap => {
      const leadDays = PRIORITY_LEAD_DAYS[gap.priority] || PRIORITY_LEAD_DAYS.MEDIUM;
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + leadDays);

      const template = templates.find(t => t.requirement_id === gap.requirement_id) ||
                       templates.find(t => t.gap_keyword && gap.gap_description.toLowerCase().includes(t.gap_keyword.toLowerCase())) ||
                       null;

      return {
        gap_id: gap.id,
        gap_description: gap.gap_description,
        priority: gap.priority,
        deadline: deadline.toISOString().slice(0, 10),
        lead_days: leadDays,
        recommended_actions: template ? template.actions : ['Identify root cause', 'Implement corrective measure', 'Upload evidence via C35', 'Close gap in C26'],
        responsible_party: 'Quality Control Manager',
        verification_method: template ? template.verification_method : 'Evidence upload to SAATHI compliance vault (C35)'
      };
    });

    // Sort: CRITICAL first, then HIGH, MEDIUM, LOW
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    items.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

    return {
      manufacturer_id,
      cap_status: 'GENERATED',
      total_gaps: openGaps.length,
      items,
      generated_at: now.toISOString(),
      note: 'Close gaps via C26.closeGap() with a valid evidence_id from C35.'
    };
  }
}

module.exports = { CorrectiveActionPlanBuilder };
