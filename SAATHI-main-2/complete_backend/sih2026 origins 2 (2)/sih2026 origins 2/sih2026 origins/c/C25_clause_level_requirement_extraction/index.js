/**
 * C25 — Clause-Level Requirement Extraction
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Extracts clause requirements from clause_requirements table by standard_id.
 * Never fabricates clause numbers — returns only what is in the database.
 * Results ordered by clause number.
 *
 * Tables: clause_requirements (c/database.js)
 */

const { db } = require('../database');

class ClauseRequirementExtractor {
  /**
   * Extract all clauses for a standard.
   * @param {string} standardId - e.g. 'IS 269:2015'
   * @param {string} componentFilter - optional: filter by evidence_type_expected
   */
  async extract(standardId, componentFilter) {
    if (!standardId) throw new Error('standardId is required');

    const allClauses = await db.getTable('clause_requirements');

    // Match by standard_id (exact or prefix match on IS number)
    const cleanStd = standardId.replace(/:.*/, '').trim().toUpperCase();
    let matching = allClauses.filter(c => {
      const clauseStd = c.standard_id.replace(/:.*/, '').trim().toUpperCase();
      return clauseStd === cleanStd || c.standard_id === standardId;
    });

    if (matching.length === 0) {
      return {
        standard_id: standardId,
        total_clauses: 0,
        statutory_clauses: 0,
        clauses: [],
        message: `No clause requirements found in database for standard '${standardId}'. Only clauses explicitly stored in clause_requirements are returned — never fabricated.`
      };
    }

    // Apply component filter if provided
    if (componentFilter) {
      const filterUpper = componentFilter.toUpperCase();
      matching = matching.filter(c =>
        (c.evidence_type_expected || '').toUpperCase().includes(filterUpper)
      );
    }

    // Sort by clause number (extract numeric portion for sorting)
    matching.sort((a, b) => {
      const numA = parseFloat((a.clause_number || '0').replace(/[^0-9.]/g, '') || '0');
      const numB = parseFloat((b.clause_number || '0').replace(/[^0-9.]/g, '') || '0');
      return numA - numB;
    });

    const statutory = matching.filter(c => c.is_statutory === true || c.is_statutory === 1);

    return {
      standard_id: standardId,
      total_clauses: matching.length,
      statutory_clauses: statutory.length,
      non_statutory_clauses: matching.length - statutory.length,
      component_filter_applied: componentFilter || null,
      clauses: matching.map(c => ({
        clause_id: c.id,
        standard_id: c.standard_id,
        clause_number: c.clause_number,
        requirement_text: c.requirement_text,
        evidence_type_expected: c.evidence_type_expected,
        is_statutory: Boolean(c.is_statutory)
      })),
      extracted_at: new Date().toISOString()
    };
  }

  /**
   * Get a single clause by ID.
   */
  async getClause(clauseId) {
    if (!clauseId) throw new Error('clauseId is required');
    const clause = await db.findOne('clause_requirements', c => c.id === clauseId);
    if (!clause) throw new Error(`Clause ${clauseId} not found`);
    return clause;
  }

  /**
   * Get all clauses requiring a specific evidence type.
   */
  async getByEvidenceType(evidenceType) {
    if (!evidenceType) throw new Error('evidenceType is required');
    const all = await db.getTable('clause_requirements');
    return all.filter(c =>
      (c.evidence_type_expected || '').toUpperCase() === evidenceType.toUpperCase()
    );
  }
}

module.exports = { ClauseRequirementExtractor };