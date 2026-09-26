/**
 * I12: Unified Recall Feed Across All Indian Regulators
 * MERN Stack Service - Multi-agency recall aggregation (BIS, FSSAI, ARAI).
 */

const RECALL_FEED = [
  {
    recall_id: "REC-2024-0891",
    regulator: "BIS",
    brand: "PowerSafe Plug",
    model_or_batch: "PS-16A-BATCH-04",
    standard_number: "IS 1293:2019",
    cml_no: "CML-9100281920",
    hazard_description: "Terminal pin temperature rise exceeded 45 K limit under test, posing electrical fire risk.",
    action_ordered: "Immediate market recall and stop sale.",
    recall_date: "2024-07-12",
    status: "ACTIVE_RECALL"
  },
  {
    recall_id: "REC-2024-0412",
    regulator: "FSSAI",
    brand: "NutriPure Mineral Water",
    model_or_batch: "LOT-JUNE-24",
    standard_number: "IS 14543:2016",
    cml_no: "CML-3300192811",
    hazard_description: "Total dissolved solids (TDS) and bromate levels found above permissible limit.",
    action_ordered: "Batch withdrawal from retail shelves.",
    recall_date: "2024-06-20",
    status: "COMPLETED_WITHDRAWAL"
  }
];

class UnifiedRecallFeedService {
  getRecalls() {
    return {
      total_recalls: RECALL_FEED.length,
      recalls: RECALL_FEED,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  UnifiedRecallFeedService,
  RECALL_FEED
};
