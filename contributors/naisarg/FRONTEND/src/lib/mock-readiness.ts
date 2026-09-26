// MOCK: illustrative application-readiness aggregation for the C4
// feature. This is explicitly an aggregation/presentation layer over C3's
// mock-compliance-gaps.ts, not a second compliance/conformity engine —
// `runReadinessCheck` calls the existing `runGapAnalysis` and only
// re-derives a readiness verdict from ITS output; it never independently
// decides whether any individual requirement passes, fails, or is
// missing evidence. If C3's data or matching logic changes, this module
// changes with it for free rather than needing a second, possibly
// inconsistent copy of the same judgment.
//
// Same i18n rule as the other mock-*.ts modules: `nextActions` here is
// just the underlying RequirementGap.recommendedAction strings passed
// through, already literal English from mock-compliance-gaps.ts — nothing
// new is authored here that would need translation. Only the UI chrome
// around it (see `standards:detail.readiness`) is translated.

import {
  runGapAnalysis,
  type ComplianceGapReport,
  type RequirementGap,
} from "@/lib/mock-compliance-gaps";

export type ReadinessStatus =
  "ready" | "ready_with_non_blocking" | "not_ready" | "insufficient_evidence";

export interface ReadinessReport {
  standardNumber: string;
  product: string;
  status: ReadinessStatus;
  readinessScore: number;
  totalRequirements: number;
  completed: number;
  warnings: number;
  failed: number;
  missingEvidence: number;
  // The full underlying requirement list, reused as-is from C3 — the UI's
  // category breakdown (Mandatory / Documents / Testing / Certification)
  // is derived from these requirements' existing `source.type` and
  // `mandatory` fields, not from any new categorization data invented
  // here.
  requirements: RequirementGap[];
  // Only the requirements that are actually blocking readiness (mandatory
  // + fail or missing_evidence) — a strict subset of `requirements`.
  blockers: RequirementGap[];
  nextActions: string[];
}

/**
 * Derives a readiness verdict from a resolved C3 report. Deliberately
 * written so a mandatory blocker can never be out-voted by a good score:
 *
 * Worked example this function must get right — IS 14543 with every
 * requirement's evidence supplied: 5 of 7 requirements resolve to "pass"
 * (a 71% score), 1 resolves to a mandatory "warning" (licence expiring
 * soon), and 1 resolves to a mandatory "fail" (TDS 720 mg/L against a
 * ≤500 mg/L limit — see mock-compliance-gaps.ts). Because the mandatory
 * FAIL check below runs first and returns immediately, this scores 71%
 * and is still "not_ready" — nothing later in this function, and no
 * later edit to the score/summary logic, can flip that back to "ready"
 * without deleting this early return outright.
 */
export function deriveStatus(report: ComplianceGapReport): ReadinessStatus {
  const hasMandatoryBlocker = report.requirements.some(
    (r) =>
      r.mandatory && (r.status === "fail" || r.status === "missing_evidence"),
  );
  if (hasMandatoryBlocker) return "not_ready";

  const hasUnsatisfiedRequirement = report.requirements.some(
    (r) => r.status !== "pass",
  );
  return hasUnsatisfiedRequirement ? "ready_with_non_blocking" : "ready";
}

// Same priority order as compliance-gap-analyzer.tsx's Recommended
// Actions list: mandatory failures first, then missing mandatory
// evidence, then warnings, then any other outstanding (non-mandatory)
// item. Passing requirements never appear here.
function actionPriority(requirement: RequirementGap): number {
  if (requirement.status === "fail" && requirement.mandatory) return 0;
  if (requirement.status === "missing_evidence" && requirement.mandatory)
    return 1;
  if (requirement.status === "warning") return 2;
  return 3;
}

function buildNextActions(requirements: RequirementGap[]): string[] {
  return requirements
    .filter((r) => r.status !== "pass")
    .sort((a, b) => actionPriority(a) - actionPriority(b))
    .map((r) => r.recommendedAction);
}

function emptyReadinessReport(
  standardNumber: string,
  product: string,
): ReadinessReport {
  return {
    standardNumber,
    product,
    status: "insufficient_evidence",
    readinessScore: 0,
    totalRequirements: 0,
    completed: 0,
    warnings: 0,
    failed: 0,
    missingEvidence: 0,
    requirements: [],
    blockers: [],
    nextActions: [],
  };
}

function buildReadinessReport(report: ComplianceGapReport): ReadinessReport {
  const { requirements } = report;
  const completed = requirements.filter((r) => r.status === "pass").length;
  const warnings = requirements.filter((r) => r.status === "warning").length;
  const failed = requirements.filter((r) => r.status === "fail").length;
  const missingEvidence = requirements.filter(
    (r) => r.status === "missing_evidence",
  ).length;

  return {
    standardNumber: report.standardNumber,
    product: report.product,
    status: deriveStatus(report),
    readinessScore: Math.round((completed / requirements.length) * 100),
    totalRequirements: requirements.length,
    completed,
    warnings,
    failed,
    missingEvidence,
    requirements,
    blockers: requirements.filter(
      (r) =>
        r.mandatory && (r.status === "fail" || r.status === "missing_evidence"),
    ),
    nextActions: buildNextActions(requirements),
  };
}

/**
 * Stands in for a future `POST /api/v1/compliance/readiness` endpoint.
 * Always resolves to a `ReadinessReport` — `status` carries
 * "insufficient_evidence" as one of its four values rather than this
 * function throwing or returning a separate shape, so the caller always
 * gets one consistent report type back.
 *
 * "insufficient_evidence" fires only when the underlying C3 check itself
 * was unresolvable for this standard (no seeded gap-analysis data, or a
 * QCO applicability result the readiness verdict depends on is unknown)
 * — never as a stand-in for "not_ready". Downgrading an unresolved check
 * to either "not_ready" or "ready" would misrepresent "we don't know yet"
 * as a real determination, which is exactly the honesty rule C1-C3
 * already follow.
 */
export async function runReadinessCheck(
  standardNumber: string,
  documentNames: string[],
): Promise<ReadinessReport> {
  const outcome = await runGapAnalysis(standardNumber, documentNames);

  if (outcome.status === "no_requirements_data") {
    return emptyReadinessReport(standardNumber, "");
  }

  const { report } = outcome;
  if (report.qcoStatus === "unknown") {
    return emptyReadinessReport(report.standardNumber, report.product);
  }

  return buildReadinessReport(report);
}
