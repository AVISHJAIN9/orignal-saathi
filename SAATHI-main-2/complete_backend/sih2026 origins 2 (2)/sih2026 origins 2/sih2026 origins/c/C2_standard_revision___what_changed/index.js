/**
 * C2 — Standard Revision / What Changed
 * Tables: standard_versions, clause_diffs, snapshot_sources
 * Logic: Versioned standard change-detection engine; diffs old vs new
 * standard requirements and extracts impacted clauses with severity.
 */

const { db } = require('../database');

class StandardRevisionDiffEngine {
  async compareRevisions(standardArg) {
    let standardNumber = '';
    if (typeof standardArg === 'object' && standardArg !== null) {
      standardNumber = standardArg.standardNumber || standardArg.standard_number || standardArg.standard || '';
    } else {
      standardNumber = standardArg || 'IS 269';
    }

    const cleanStd = standardNumber.replace(/:.*/, '').trim().toUpperCase();

    // Query standard_versions
    const versions = await db.getTable('standard_versions');
    const stdVersions = versions.filter(v => v.standard_number.toUpperCase() === cleanStd)
      .sort((a, b) => b.publication_year - a.publication_year);

    if (stdVersions.length === 0) {
      return {
        standard_number: standardNumber,
        status: 'NOT_FOUND',
        message: `No revision history indexed for standard ${standardNumber}`,
        revisions_available: [],
        impacted_clauses: [],
        timestamp: new Date().toISOString()
      };
    }

    const activeVersion = stdVersions.find(v => v.status === 'ACTIVE') || stdVersions[0];
    const prevVersion = stdVersions.find(v => v.id !== activeVersion.id) || stdVersions[1] || null;

    // Query clause diffs
    const allDiffs = await db.getTable('clause_diffs');
    const diffs = allDiffs.filter(d => d.standard_number.toUpperCase() === cleanStd);

    // Query snapshot sources
    const snapshots = await db.getTable('snapshot_sources');
    const activeSnapshot = snapshots.find(s => s.standard_number.toUpperCase() === cleanStd && s.version_tag === activeVersion.version_tag);

    const criticalCount = diffs.filter(d => d.impact_severity === 'CRITICAL').length;
    const highCount = diffs.filter(d => d.impact_severity === 'HIGH').length;

    return {
      standard_number: activeVersion.standard_number,
      title: activeVersion.title,
      current_version: activeVersion.version_tag,
      previous_version: prevVersion ? prevVersion.version_tag : 'N/A',
      effective_date: activeVersion.effective_date,
      revision_status: activeVersion.status,
      gazette_reference: activeSnapshot ? activeSnapshot.gazette_ref : 'Gazette of India, Extraordinary',
      source_url: activeSnapshot ? activeSnapshot.source_url : null,
      summary: `Revision ${prevVersion ? prevVersion.version_tag : 'prior'} → ${activeVersion.version_tag}: ${diffs.length} impacted clause(s) detected.`,
      severity_summary: {
        critical: criticalCount,
        high: highCount,
        medium: diffs.filter(d => d.impact_severity === 'MEDIUM').length,
        low: diffs.filter(d => d.impact_severity === 'LOW').length
      },
      impacted_clauses: diffs.map(d => ({
        clause: d.clause_number,
        title: d.clause_title,
        diff_type: d.diff_type,
        severity: d.impact_severity,
        change: d.summary_of_change,
        old_requirement: d.old_text,
        new_requirement: d.new_text
      })),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { StandardRevisionDiffEngine };