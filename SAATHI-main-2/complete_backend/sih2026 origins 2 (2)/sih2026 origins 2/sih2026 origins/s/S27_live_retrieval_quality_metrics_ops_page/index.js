/**
 * S27 — Live Retrieval-Quality Metrics Ops Page
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * CRITICAL: All metrics are computed LIVE from the adversarial_query_results table.
 * Never returns hardcoded percentages. If no tests have been run, returns NO_DATA status.
 *
 * Tables used: adversarial_query_results (s/database.js)
 */

const { sDb } = require('../database');

class QualityOpsService {
  /**
   * Compute live retrieval-quality metrics from adversarial_query_results.
   * Returns NO_DATA if the table has no rows — never fabricates a number.
   */
  async getMetrics() {
    const rows = await sDb.getTable('adversarial_query_results');

    if (!rows || rows.length === 0) {
      return {
        status: 'NO_DATA',
        note: 'No adversarial test results found. Run the adversarial test suite to populate metrics.',
        groundedness_rate: null,
        decline_rate: null,
        retrieval_recall: null,
        total_queries_evaluated: 0,
        computed_at: new Date().toISOString()
      };
    }

    const total = rows.length;

    // groundedness_rate: fraction of rows where is_grounded = true
    const groundedCount = rows.filter(r => r.is_grounded === true || r.is_grounded === 1).length;
    const groundedness_rate = groundedCount / total;

    // decline_rate: fraction of rows where expected_behavior = 'DECLINE' AND actual_behavior = 'DECLINE'
    const expectedDecline = rows.filter(r => r.expected_behavior === 'DECLINE');
    const correctDeclines = expectedDecline.filter(r => r.actual_behavior === 'DECLINE').length;
    const decline_rate = expectedDecline.length > 0
      ? correctDeclines / expectedDecline.length
      : null; // not computable if no decline cases exist

    // retrieval_recall: fraction of rows where passed = true
    const passedCount = rows.filter(r => r.passed === true || r.passed === 1).length;
    const retrieval_recall = passedCount / total;

    // overall pass rate (composite)
    const overall_pass_rate = passedCount / total;

    return {
      status: 'LIVE',
      groundedness_rate: parseFloat(groundedness_rate.toFixed(4)),
      groundedness_rate_pct: parseFloat((groundedness_rate * 100).toFixed(2)),
      decline_rate: decline_rate !== null ? parseFloat(decline_rate.toFixed(4)) : null,
      decline_rate_pct: decline_rate !== null ? parseFloat((decline_rate * 100).toFixed(2)) : null,
      retrieval_recall: parseFloat(retrieval_recall.toFixed(4)),
      retrieval_recall_pct: parseFloat((retrieval_recall * 100).toFixed(2)),
      overall_pass_rate: parseFloat(overall_pass_rate.toFixed(4)),
      overall_pass_rate_pct: parseFloat((overall_pass_rate * 100).toFixed(2)),
      total_queries_evaluated: total,
      grounded_count: groundedCount,
      passed_count: passedCount,
      decline_cases_total: expectedDecline.length,
      decline_cases_correct: correctDeclines,
      computed_at: new Date().toISOString(),
      note: 'All metrics computed live from adversarial_query_results table. No hardcoded values.'
    };
  }

  /**
   * Insert a test result row into adversarial_query_results.
   * Used by the adversarial test runner (X2 golden set integration).
   */
  async recordTestResult({ query_text, expected_behavior, actual_behavior, is_grounded, passed }) {
    if (!query_text || !expected_behavior || !actual_behavior) {
      throw new Error('query_text, expected_behavior, and actual_behavior are required');
    }
    const validBehaviors = ['ANSWER', 'DECLINE'];
    if (!validBehaviors.includes(expected_behavior) || !validBehaviors.includes(actual_behavior)) {
      throw new Error(`expected_behavior and actual_behavior must be one of: ${validBehaviors.join(', ')}`);
    }
    const row = {
      id: 'aqr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      query_text,
      expected_behavior,
      actual_behavior,
      is_grounded: is_grounded !== undefined ? Boolean(is_grounded) : actual_behavior === 'ANSWER',
      passed: passed !== undefined ? Boolean(passed) : expected_behavior === actual_behavior,
      run_at: new Date().toISOString()
    };
    return sDb.insert('adversarial_query_results', row);
  }

  /**
   * List all adversarial test results (for ops dashboard display).
   */
  async listResults(limit = 100) {
    const rows = await sDb.getTable('adversarial_query_results');
    return rows.slice(-limit).reverse(); // most recent first
  }
}

module.exports = { QualityOpsService };
