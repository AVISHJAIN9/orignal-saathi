/**
 * I13: Consumer-Facing Recall Lookup Tool
 * MERN Stack Service - Barcode, brand, or CML query against safety recalls.
 */

const { RECALL_FEED } = require('../I12_unified_recall_feed_across_all_indian_re');

class ConsumerRecallLookupService {
  lookup(queryTerm = "") {
    const term = queryTerm.toLowerCase().trim();
    const matched = RECALL_FEED.filter(r =>
      r.brand.toLowerCase().includes(term) ||
      r.model_or_batch.toLowerCase().includes(term) ||
      r.cml_no.toLowerCase().includes(term) ||
      r.standard_number.toLowerCase().includes(term)
    );
    const isSafe = matched.length === 0;

    return {
      search_query: queryTerm,
      has_active_recall: !isSafe,
      safety_verdict: isSafe ? "CLEAR_NO_RECALL_FOUND" : "RECALL_ALERT_FOUND",
      total_records_matched: matched.length,
      matched_recalls: matched,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  ConsumerRecallLookupService
};
