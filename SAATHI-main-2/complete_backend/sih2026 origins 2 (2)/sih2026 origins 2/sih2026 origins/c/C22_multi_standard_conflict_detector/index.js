/**
 * C22 — Multi-Standard Conflict Detector
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Pairwise comparison of standard_overlaps table. Returns AMBIGUOUS_NEEDS_REVIEW
 * when no ruling exists for a pair — never fabricates a resolution.
 *
 * Tables: standard_overlaps (c/database.js)
 */

const { db } = require('../database');

class MultiStandardConflictEngine {
  async detectConflicts(appliedStandards) {
    if (!Array.isArray(appliedStandards) || appliedStandards.length < 2) {
      throw new Error('appliedStandards must be an array with at least 2 standards');
    }

    const overlaps = await db.getTable('standard_overlaps');
    const conflicts = [];
    const compatible = [];
    const ambiguous = [];

    // Pairwise check all combinations
    for (let i = 0; i < appliedStandards.length; i++) {
      for (let j = i + 1; j < appliedStandards.length; j++) {
        const a = appliedStandards[i];
        const b = appliedStandards[j];

        const overlap = overlaps.find(o =>
          (o.standard_id_a === a && o.standard_id_b === b) ||
          (o.standard_id_a === b && o.standard_id_b === a)
        );

        const pair = { standard_a: a, standard_b: b };
        if (!overlap) {
          ambiguous.push({ ...pair, resolution: 'AMBIGUOUS_NEEDS_REVIEW', reason: 'No ruling exists in standard_overlaps for this combination. Seek BIS technical committee clarification.' });
        } else if (overlap.conflict_type === 'CONFLICT') {
          conflicts.push({ ...pair, conflict_type: overlap.conflict_type, resolution: overlap.resolution, notes: overlap.notes });
        } else {
          compatible.push({ ...pair, relationship: overlap.conflict_type, notes: overlap.notes });
        }
      }
    }

    return {
      applied_standards: appliedStandards,
      pairs_evaluated: (appliedStandards.length * (appliedStandards.length - 1)) / 2,
      conflicts: { count: conflicts.length, items: conflicts },
      compatible: { count: compatible.length, items: compatible },
      ambiguous: { count: ambiguous.length, items: ambiguous },
      overall_status: conflicts.length > 0 ? 'CONFLICTS_DETECTED' : ambiguous.length > 0 ? 'PARTIAL_AMBIGUITY' : 'FULLY_COMPATIBLE',
      evaluated_at: new Date().toISOString()
    };
  }
}

module.exports = { MultiStandardConflictEngine };