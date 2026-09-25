// MOCK: canned demo analyses for Document Cortex — same honesty principle as
// mock-conformity.ts (see PRODUCT.md: there is no real document-parsing
// backend). Which scenario shows is picked deterministically from the
// uploaded file's name (see pickDocumentAnalysisResult), not randomly, so
// testing the same filename twice gives the same result. standardKeys
// reference the shared standards catalogue in mock-standards.ts rather than
// duplicating standard titles here.

export type IssueSeverity = "critical" | "minor";

export interface AnalysisIssue {
  key: string;
  severity: IssueSeverity;
}

export interface DocumentAnalysisResult {
  key: string;
  standardKeys: string[];
  issues: AnalysisIssue[];
  missingKeys: string[];
  recommendationKeys: string[];
}

export const DOCUMENT_ANALYSIS_RESULTS: DocumentAnalysisResult[] = [
  {
    key: "helmetSpec",
    standardKeys: ["is4151"],
    issues: [
      { key: "chinStrap", severity: "critical" },
      { key: "peripheralVision", severity: "minor" },
    ],
    missingKeys: ["impactReport", "licenceNumber"],
    recommendationKeys: ["attachChinStrapReport", "addLicenceNumber"],
  },
  {
    key: "cookerSpec",
    standardKeys: ["is2347"],
    issues: [{ key: "valveRating", severity: "minor" }],
    missingKeys: ["hydrostaticCert"],
    recommendationKeys: ["referenceValveTable", "attachHydrostaticCert"],
  },
  {
    key: "applianceSpec",
    standardKeys: ["is302"],
    issues: [
      { key: "earthContinuity", severity: "critical" },
      { key: "insulationLabel", severity: "minor" },
    ],
    missingKeys: ["earthContinuityReport"],
    recommendationKeys: ["retestEarthContinuity", "clarifyInsulationClass"],
  },
  {
    key: "toySpec",
    standardKeys: ["is9873"],
    issues: [{ key: "smallParts", severity: "critical" }],
    missingKeys: ["chokeHazardWarning"],
    recommendationKeys: ["addChokeWarning", "resubmitSmallPartsTest"],
  },
];

/**
 * Deterministic pick so the same filename always shows the same demo
 * scenario. Checks an obvious keyword/standard-number hint first so a demo
 * reads as intuitive rather than coincidental — falls back to a hash of the
 * filename for anything else, so behaviour stays fully deterministic.
 */
export function pickDocumentAnalysisResult(
  fileName: string,
): DocumentAnalysisResult {
  const lower = fileName.toLowerCase();
  if (lower.includes("helmet") || lower.includes("4151")) {
    return DOCUMENT_ANALYSIS_RESULTS.find((r) => r.key === "helmetSpec")!;
  }
  if (lower.includes("cooker") || lower.includes("2347")) {
    return DOCUMENT_ANALYSIS_RESULTS.find((r) => r.key === "cookerSpec")!;
  }
  if (lower.includes("appliance") || lower.includes("302")) {
    return DOCUMENT_ANALYSIS_RESULTS.find((r) => r.key === "applianceSpec")!;
  }
  if (lower.includes("toy") || lower.includes("9873")) {
    return DOCUMENT_ANALYSIS_RESULTS.find((r) => r.key === "toySpec")!;
  }
  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    hash = (hash * 31 + fileName.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % DOCUMENT_ANALYSIS_RESULTS.length;
  return DOCUMENT_ANALYSIS_RESULTS[index];
}

export interface RecentDocumentEntry {
  id: string;
  fileName: string;
  resultKey: string;
  analyzedAgoKey: string;
}

// Seed history so the page doesn't look empty on first visit — mirrors the
// seeded table in document-management-panel.tsx.
export const SEED_RECENT_DOCUMENTS: RecentDocumentEntry[] = [
  {
    id: "seed-1",
    fileName: "Helmet_TestReport_v3.pdf",
    resultKey: "helmetSpec",
    analyzedAgoKey: "threeDaysAgo",
  },
  {
    id: "seed-2",
    fileName: "PressureCooker_Spec.docx",
    resultKey: "cookerSpec",
    analyzedAgoKey: "oneWeekAgo",
  },
  {
    id: "seed-3",
    fileName: "Appliance_ComplianceDraft.pdf",
    resultKey: "applianceSpec",
    analyzedAgoKey: "twoWeeksAgo",
  },
];
