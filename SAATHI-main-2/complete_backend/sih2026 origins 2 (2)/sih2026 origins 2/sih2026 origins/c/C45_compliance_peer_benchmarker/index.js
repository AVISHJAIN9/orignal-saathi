/**
 * C45 — Compliance Peer Benchmarker
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Compares a manufacturer's C33 health score against anonymized peer data
 * from compliance_health_snapshots. Real percentile computation.
 * Per-Rule-7: never fabricates competitor identities.
 *
 * Tables: compliance_health_snapshots (c/database.js)
 */

const { db } = require('../database');

class CompliancePeerBenchmarker {
  async benchmark(manufacturer_id) {
    if (!manufacturer_id) throw new Error('manufacturer_id is required');

    const allSnaps = await db.getTable('compliance_health_snapshots');

    // Latest snapshot per manufacturer (anonymized)
    const latestByMfr = {};
    for (const s of allSnaps) {
      if (!latestByMfr[s.manufacturer_id] || new Date(s.snapshot_date) > new Date(latestByMfr[s.manufacturer_id].snapshot_date)) {
        latestByMfr[s.manufacturer_id] = s;
      }
    }

    const allScores = Object.values(latestByMfr).map(s => Number(s.score)).filter(s => !isNaN(s)).sort((a, b) => a - b);
    const myLatest = latestByMfr[manufacturer_id];

    if (!myLatest) {
      return { manufacturer_id, message: 'No health snapshot found. Run C33 and C37.takeSnapshot first.', peers_in_dataset: allScores.length };
    }

    const myScore = Number(myLatest.score);
    const belowCount = allScores.filter(s => s < myScore).length;
    const percentile = allScores.length > 1 ? Math.round((belowCount / (allScores.length - 1)) * 100) : 100;
    const avg = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    const median = allScores.length > 0 ? allScores[Math.floor(allScores.length / 2)] : 0;

    return {
      manufacturer_id,
      your_score: myScore,
      your_grade: myLatest.grade,
      percentile,
      peers_in_dataset: allScores.length - 1, // exclude self
      peer_avg_score: parseFloat(avg.toFixed(2)),
      peer_median_score: median,
      peer_top_10pct_score: allScores[Math.floor(allScores.length * 0.9)] || myScore,
      gap_to_top_10pct: parseFloat(Math.max(0, (allScores[Math.floor(allScores.length * 0.9)] || myScore) - myScore).toFixed(2)),
      summary: percentile >= 75 ? 'TOP_QUARTILE' : percentile >= 50 ? 'ABOVE_MEDIAN' : percentile >= 25 ? 'BELOW_MEDIAN' : 'BOTTOM_QUARTILE',
      note: 'Peer scores are anonymized. No competitor identities are revealed.',
      benchmarked_at: new Date().toISOString()
    };
  }
}

module.exports = { CompliancePeerBenchmarker };
