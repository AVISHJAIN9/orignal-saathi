// MOCK: two canned demo outcomes for the Conformity Check workbench. There is
// no real spec-parsing backend — see PRODUCT.md, the retrieval/LLM pipeline
// is a separate workstream. Rather than pretend to analyze whatever file the
// person actually drops (which would misrepresent what this prototype does,
// at odds with SAATHI's whole "cited or honest, never guessed" premise), the
// UI is explicit that this is an illustrative demo analysis, the same way
// the landing page labels its example Q&A.
//
// Which outcome shows is picked deterministically from the uploaded file's
// name (see pickConformityResult) so the same filename always produces the
// same demo result — not random, so a person testing it twice sees
// consistent behaviour.

export type GapSeverity = "critical" | "minor";

export interface ComplianceGap {
  key: string;
  severity: GapSeverity;
  standardNumber: string;
  titleKey: string;
  descriptionKey: string;
}

export interface ConformityResult {
  key: string;
  standardNumber: string;
  standardTitleKey: string;
  passed: boolean;
  gaps: ComplianceGap[];
  passedChecksCount: number;
}

export const CONFORMITY_RESULTS: ConformityResult[] = [
  {
    key: "helmetGaps",
    standardNumber: "IS 4151",
    standardTitleKey: "is4151",
    passed: false,
    passedChecksCount: 5,
    gaps: [
      {
        key: "chinStrap",
        severity: "critical",
        standardNumber: "IS 4151",
        titleKey: "gaps.chinStrapTitle",
        descriptionKey: "gaps.chinStrapBody",
      },
      {
        key: "peripheralVision",
        severity: "minor",
        standardNumber: "IS 4151",
        titleKey: "gaps.peripheralVisionTitle",
        descriptionKey: "gaps.peripheralVisionBody",
      },
    ],
  },
  {
    key: "cookerCompliant",
    standardNumber: "IS 2347",
    standardTitleKey: "is2347",
    passed: true,
    passedChecksCount: 7,
    gaps: [],
  },
];

/**
 * Deterministic pick so the same filename always shows the same demo
 * outcome. Checks for an obvious keyword hint first (a filename mentioning
 * "helmet" or "4151" reliably shows the helmet gaps scenario, "cooker" or
 * "2347" the clean pass) so a demo reads as intuitive rather than
 * coincidental — falls back to a hash of the filename for anything else, so
 * behaviour is still fully deterministic either way.
 */
export function pickConformityResult(fileName: string): ConformityResult {
  const lower = fileName.toLowerCase();
  if (lower.includes("helmet") || lower.includes("4151")) {
    return CONFORMITY_RESULTS.find((r) => r.key === "helmetGaps")!;
  }
  if (lower.includes("cooker") || lower.includes("2347")) {
    return CONFORMITY_RESULTS.find((r) => r.key === "cookerCompliant")!;
  }
  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    hash = (hash * 31 + fileName.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % CONFORMITY_RESULTS.length;
  return CONFORMITY_RESULTS[index];
}
