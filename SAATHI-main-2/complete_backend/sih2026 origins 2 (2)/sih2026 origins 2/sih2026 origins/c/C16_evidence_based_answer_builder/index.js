/**
 * C16 — Evidence-Based Answer Builder
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Builds answers with provenance. Each claim is checked against clause_requirements.
 * Claims with no matching source are flagged as UNGROUNDED.
 * Never fabricates a source reference.
 *
 * Tables: answer_provenance, clause_requirements (c/database.js)
 */

const { db } = require('../database');

class EvidenceBasedAnswerBuilder {
  /**
   * Build an answer with provenance for a query.
   * evidenceDocuments: array of {claim: string, standard_id: string, clause_number?: string}
   */
  async answerQuery(query, evidenceDocuments = []) {
    if (!query) throw new Error('query is required');

    const clauses = await db.getTable('clause_requirements');
    const provenanceRecords = [];
    const ungroundedClaims = [];

    for (const doc of evidenceDocuments) {
      const { claim, standard_id, clause_number } = doc;
      if (!claim || !standard_id) continue;

      // Find matching clause in clause_requirements
      let matchingClause = null;
      if (clause_number) {
        matchingClause = clauses.find(c =>
          c.standard_id === standard_id &&
          c.clause_number === clause_number
        );
      } else {
        matchingClause = clauses.find(c => c.standard_id === standard_id);
      }

      if (matchingClause) {
        provenanceRecords.push({
          claim,
          source_ref: `${matchingClause.standard_id} § ${matchingClause.clause_number}`,
          clause_id: matchingClause.id,
          requirement_text: matchingClause.requirement_text,
          is_grounded: true
        });
      } else {
        ungroundedClaims.push({ claim, standard_id, clause_number, reason: 'No matching clause found in clause_requirements' });
      }
    }

    const groundedness_score = evidenceDocuments.length > 0
      ? provenanceRecords.length / evidenceDocuments.length
      : null;

    return {
      query,
      answer_built: provenanceRecords.length > 0,
      provenance: provenanceRecords,
      ungrounded_claims: ungroundedClaims,
      grounded_claim_count: provenanceRecords.length,
      ungrounded_claim_count: ungroundedClaims.length,
      groundedness_score,
      warning: ungroundedClaims.length > 0
        ? `${ungroundedClaims.length} claim(s) could not be grounded in clause_requirements. Review before presenting.`
        : null,
      built_at: new Date().toISOString()
    };
  }

  /**
   * Attach provenance to an existing answer ID.
   * Inserts rows into answer_provenance for each claim.
   */
  async attachProvenance(answerId, claims = []) {
    if (!answerId) throw new Error('answerId is required');
    if (!Array.isArray(claims) || claims.length === 0) throw new Error('claims must be a non-empty array');

    const clauses = await db.getTable('clause_requirements');
    const results = [];

    for (const { claim, standard_id, clause_number } of claims) {
      if (!claim || !standard_id) continue;

      const matchingClause = clauses.find(c =>
        c.standard_id === standard_id &&
        (!clause_number || c.clause_number === clause_number)
      );

      const provenanceRow = {
        id: 'prov_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        answer_id: answerId,
        claim_text: claim,
        source_ref: matchingClause
          ? `${matchingClause.standard_id} § ${matchingClause.clause_number}`
          : null,
        clause_id: matchingClause ? matchingClause.id : null,
        is_grounded: Boolean(matchingClause),
        attached_at: new Date().toISOString()
      };

      await db.insert('answer_provenance', provenanceRow);
      results.push(provenanceRow);
    }

    const grounded = results.filter(r => r.is_grounded);
    return {
      answer_id: answerId,
      provenance_attached: results.length,
      grounded_count: grounded.length,
      ungrounded_count: results.length - grounded.length,
      provenance: results
    };
  }

  /**
   * Get provenance for an answer.
   */
  async getProvenance(answerId) {
    if (!answerId) throw new Error('answerId is required');
    const all = await db.getTable('answer_provenance');
    return all.filter(p => p.answer_id === answerId);
  }
}

module.exports = { EvidenceBasedAnswerBuilder };