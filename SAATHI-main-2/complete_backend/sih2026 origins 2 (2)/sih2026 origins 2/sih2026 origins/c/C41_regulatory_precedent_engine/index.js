/**
 * C41 — Regulatory Precedent Engine
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Retrieves past enforcement decisions from precedent_cases table.
 * Ranks by relevance to current query (standard match + keyword overlap).
 * Returns "NO_PRECEDENT_FOUND" rather than fabricating a case.
 *
 * Tables: precedent_cases (c/database.js)
 */

const { db } = require('../database');

class RegulatoryPrecedentEngine {
  async findPrecedents(standardId, issueKeywords, limit) {
    if (!standardId && !issueKeywords) throw new Error('At least one of standardId or issueKeywords is required');

    const cases = await db.getTable('precedent_cases');
    const cleanStd = standardId ? standardId.replace(/:.*/, '').trim().toUpperCase() : null;
    const keywords = Array.isArray(issueKeywords) ? issueKeywords.map(k => k.toLowerCase()) : issueKeywords ? [issueKeywords.toLowerCase()] : [];

    const scored = cases.map(c => {
      let score = 0;
      if (cleanStd && c.standard_id && c.standard_id.replace(/:.*/, '').trim().toUpperCase() === cleanStd) score += 10;
      for (const kw of keywords) {
        if ((c.issue_description || '').toLowerCase().includes(kw)) score += 2;
        if ((c.ruling_summary || '').toLowerCase().includes(kw)) score += 1;
      }
      return { ...c, relevance_score: score };
    });

    const relevant = scored.filter(c => c.relevance_score > 0).sort((a, b) => b.relevance_score - a.relevance_score);
    const cap = limit || 5;

    if (relevant.length === 0) {
      return {
        standard_id: standardId,
        issue_keywords: issueKeywords,
        precedents_found: 0,
        precedents: [],
        message: 'NO_PRECEDENT_FOUND — no matching enforcement cases in precedent_cases. This is not legal advice; consult BIS legal cell for guidance.'
      };
    }

    return {
      standard_id: standardId,
      issue_keywords: issueKeywords,
      precedents_found: relevant.length,
      showing: Math.min(cap, relevant.length),
      precedents: relevant.slice(0, cap).map(c => ({
        case_id: c.id, case_number: c.case_number, ruling_year: c.ruling_year,
        standard_id: c.standard_id, issue_description: c.issue_description,
        ruling_summary: c.ruling_summary, outcome: c.outcome,
        relevance_score: c.relevance_score
      })),
      disclaimer: 'These are historical enforcement records, not legal advice.',
      fetched_at: new Date().toISOString()
    };
  }
}

module.exports = { RegulatoryPrecedentEngine };
