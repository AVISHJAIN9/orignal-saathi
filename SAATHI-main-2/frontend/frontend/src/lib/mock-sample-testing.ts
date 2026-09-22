// S18 — Lab / Sample Testing Status Tracker.
//
// This module deliberately does NOT invent a second, parallel dataset of
// samples/labs/parameters. It derives everything from two real sources
// already in this repo:
//   - `Application` (mock-registration.ts) — the real applicant/product/
//     testing record, including the real `submittedAt` timestamp a
//     sample's testing progression is timed against.
//   - `REPORT_TEMPLATES` (mock-compliance-gaps.ts) — C3's already-authored
//     resolved pass/warning/fail values, required/observed limits, clause
//     citations, and reasons for each named test (e.g. "impact",
//     "chinstrap", "tds"). This module only reveals those real values on a
//     schedule; it never invents a different observed value or verdict
//     for the same test than C3 already shows elsewhere in the app.
//
// HONESTY NOTE on what this module deliberately does NOT model: no lab
// name, no accreditation code, no lead-scientist name, no official report
// form. There is no verified BIS/NABL reference data in this repo to
// ground any of that, and simulating it would risk being read as a real
// institution or a real government document — see the "Illustrative"
// disclaimer the widget renders before any of this data, and before any
// download control.

import {
  getApplication,
  type Application,
  type TestingRequirement,
} from "@/lib/mock-registration";
import { REPORT_TEMPLATES } from "@/lib/mock-compliance-gaps";
import { getStandardByKey } from "@/lib/mock-standards";

const LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

export type TestingStage =
  "dispatched" | "received" | "in_testing" | "passed" | "failed";

export type ParameterStatus =
  "passed" | "warning" | "failed" | "in_progress" | "pending";

export interface ParameterTestResult {
  key: string;
  label: string;
  mandatory: boolean;
  clause?: string;
  requiredValue?: string;
  observedValue?: string;
  status: ParameterStatus;
  // C3's own reason text, revealed as-is once this parameter's stage
  // exposes a result — never authored here.
  reason?: string;
}

export interface SampleTestingRecord {
  // Illustrative, deterministically derived — see deriveSampleId(). Not a
  // real LIMS/requisition number; labeled as such wherever it's shown.
  sampleId: string;
  applicationId: string;
  standardKey: string;
  standardNumber: string;
  productName: string;
  submittedAt: string;
  // Derived (submittedAt + a fixed illustrative offset), never a separately
  // authored date — see estimateCompletion().
  estimatedCompletionDate: string;
  currentStage: TestingStage;
  parameters: ParameterTestResult[];
}

// --- Sample id (illustrative, not a fabricated LIMS reference) ------------
//
// Same stable-hash technique mock-auth.ts's mockAccountId uses: a
// deterministic, non-cryptographic hash of real inputs (this application's
// id + the standard it's being tested against), not a random or
// officially-styled requisition number. Re-deriving it from the same
// application always yields the same value.
function deriveSampleId(applicationId: string, standardKey: string): string {
  let hash = 0;
  const seed = `${applicationId}:${standardKey}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const suffix = Math.abs(hash)
    .toString(36)
    .toUpperCase()
    .padEnd(6, "0")
    .slice(0, 6);
  return `SMP-${standardKey.toUpperCase()}-${suffix}`;
}

const ESTIMATED_TESTING_DAYS = 14;

function estimateCompletion(submittedAt: string): string {
  const date = new Date(submittedAt);
  date.setDate(date.getDate() + ESTIMATED_TESTING_DAYS);
  return date.toISOString();
}

function elapsedDaysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

// --- Demo stage override ---------------------------------------------------
//
// Same "explicit demo trigger" pattern already approved for S29's
// draft-store overrides: a plain localStorage record, only ever set by an
// explicit user action in the UI (never by this module on its own), and
// clearly labeled in the widget as a demo control, not real lab behavior.
const STAGE_OVERRIDE_PREFIX = "saathi:sampleTestingStageOverride:";

export function getStageOverride(applicationId: string): TestingStage | null {
  try {
    const raw = localStorage.getItem(
      `${STAGE_OVERRIDE_PREFIX}${applicationId}`,
    );
    return raw as TestingStage | null;
  } catch {
    return null;
  }
}

export function setStageOverride(
  applicationId: string,
  stage: TestingStage | null,
) {
  try {
    const key = `${STAGE_OVERRIDE_PREFIX}${applicationId}`;
    if (stage) localStorage.setItem(key, stage);
    else localStorage.removeItem(key);
  } catch {
    // Ignore — the override just won't persist across a reload.
  }
}

function stageFromElapsedTime(
  submittedAt: string,
): "dispatched" | "received" | "in_testing" | "resolved" {
  const days = elapsedDaysSince(submittedAt);
  if (days < 1) return "dispatched";
  if (days < 2) return "received";
  if (days < 4) return "in_testing";
  return "resolved";
}

function mapResolvedStatus(
  status: "pass" | "warning" | "fail",
): ParameterStatus {
  if (status === "pass") return "passed";
  if (status === "fail") return "failed";
  return "warning";
}

// Resolves each of this application's real testing.tests against C3's real
// per-standard requirement templates — never invents an observed value or
// verdict a test doesn't already have in mock-compliance-gaps.ts. A test
// with no matching C3 requirement (shouldn't happen for the two standards
// this repo has real data for) stays honestly "pending" rather than
// fabricating a result.
function resolveRealParameters(
  tests: TestingRequirement[],
  standardNumber: string,
): ParameterTestResult[] {
  const template = REPORT_TEMPLATES.find(
    (t) => t.standardNumber === standardNumber,
  );
  return tests.map((test) => {
    const requirement = template?.requirements.find((r) =>
      r.key.endsWith(`-${test.key}`),
    );
    if (!requirement) {
      return {
        key: test.key,
        label: test.label,
        mandatory: true,
        status: "pending",
      };
    }
    return {
      key: test.key,
      label: test.label,
      mandatory: requirement.mandatory,
      clause: requirement.source.clause,
      requiredValue: requirement.resolved.requiredValue,
      observedValue: requirement.resolved.observedValue,
      status: mapResolvedStatus(requirement.resolved.status),
      reason: requirement.resolved.reason,
    };
  });
}

// Only ever changes how MUCH of the already-resolved real data is exposed
// yet, never what it says — a parameter not yet "revealed" for this stage
// shows as in_progress/pending with no observed value, not a placeholder
// invented value.
function projectForStage(
  parameters: ParameterTestResult[],
  stage: TestingStage,
): ParameterTestResult[] {
  if (stage === "dispatched" || stage === "received") {
    return parameters.map((p) => ({
      key: p.key,
      label: p.label,
      mandatory: p.mandatory,
      status: "pending",
    }));
  }
  if (stage === "in_testing") {
    return parameters.map((p, index) => {
      if (index < parameters.length - 1) return p;
      return {
        key: p.key,
        label: p.label,
        mandatory: p.mandatory,
        status: "in_progress",
      };
    });
  }
  return parameters;
}

/**
 * Builds a sample testing record for one real Application — returns null
 * (never a fabricated record) when there's nothing honest to show: the
 * application hasn't been submitted yet, has no testing requirements, has
 * no suggested standard, or (same honest fallback C3's runGapAnalysis
 * already uses) this repo has no real requirement template for its
 * standard.
 */
export function buildSampleTestingRecord(
  application: Application,
): SampleTestingRecord | null {
  // Only a genuinely "submitted" application ever reached lab testing — a
  // draft never got there, and S17's "rejected" happens at the
  // administrative review stage, before a sample would ever be dispatched.
  if (application.status !== "submitted" || !application.submittedAt) {
    return null;
  }
  const standardKey = application.product.suggestedStandardKey;
  if (!standardKey || application.testing.tests.length === 0) return null;
  const standard = getStandardByKey(standardKey);
  if (!standard) return null;

  const resolved = resolveRealParameters(
    application.testing.tests,
    standard.standardNumber,
  );
  const timeStage = stageFromElapsedTime(application.submittedAt);
  const hasMandatoryFail = resolved.some(
    (p) => p.mandatory && p.status === "failed",
  );
  const naturalStage: TestingStage =
    timeStage === "resolved"
      ? hasMandatoryFail
        ? "failed"
        : "passed"
      : timeStage;
  const currentStage = getStageOverride(application.id) ?? naturalStage;

  const isCurrentResolved =
    currentStage === "passed" || currentStage === "failed";
  const parameters = isCurrentResolved
    ? resolved
    : projectForStage(resolved, currentStage);

  return {
    sampleId: deriveSampleId(application.id, standardKey),
    applicationId: application.id,
    standardKey,
    standardNumber: standard.standardNumber,
    productName: application.product.productName,
    submittedAt: application.submittedAt,
    estimatedCompletionDate: estimateCompletion(application.submittedAt),
    currentStage,
    parameters,
  };
}

/** GET /api/v1/registration/applications/:id stand-in reuse — builds a
 * sample record for one application by id, checking the real draft store
 * first (see mock-registration.ts). */
export async function getSampleTestingRecordForApplication(
  applicationId: string,
): Promise<SampleTestingRecord | null> {
  const application = await getApplication(applicationId);
  return delay(application ? buildSampleTestingRecord(application) : null);
}
