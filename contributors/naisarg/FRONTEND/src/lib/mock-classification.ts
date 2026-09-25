// MOCK: there is no real D9 product-classification backend in this repo
// (see Step 0 of the task this file implements — no api/ directory, no
// OpenAPI spec, no env-configured API base URL). This module stands in
// for a future
//   POST /api/v1/classification/sessions              createSession
//   POST /api/v1/classification/sessions/:id/answers   submitAnswer
// with the same async, session/step/answer-in — step-or-result-out shape
// those endpoints would have, so swapping this module for a real API
// client is the only change the wizard would need — same pattern as
// mock-registration.ts.
//
// The question flow and every result this module can produce are sourced
// from this repo's real MOCK_STANDARDS catalogue (6 seeded standards) —
// never a fabricated standard number or gazette reference. Each of the 6
// product categories resolves to its own distinct real standard; nothing
// here invents new IS numbers the way an earlier reference draft's
// mock did.
//
// Step questions/options are semantic keys, not literal English — the
// wizard component resolves labels via i18n, reusing the SAME existing
// keys the rest of the app already translates (admin:topics.* for
// category, registration:applicant.types.* for applicant type) rather
// than a second, parallel label set.

import { MOCK_STANDARDS } from "@/lib/mock-standards";

const LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

const STEP_ORDER = [
  "category",
  "applicantType",
  "description",
  "safetyCritical",
] as const;
export type ClassificationStepId = (typeof STEP_ORDER)[number];

export type ClassificationInputType = "options" | "text";

export interface ClassificationStep {
  id: ClassificationStepId;
  inputType: ClassificationInputType;
  // Semantic option keys only — resolved to labels by the component via
  // i18n. Category reuses MOCK_STANDARDS' own categoryKey values, so a
  // new seeded standard automatically gets a wizard option for free.
  optionKeys?: string[];
}

const CATEGORY_KEYS = MOCK_STANDARDS.map((s) => s.categoryKey);
const APPLICANT_TYPE_KEYS = [
  "manufacturer",
  "importer",
  "dealer",
  "individual",
];
const YES_NO_KEYS = ["yes", "no"];

function buildStep(id: ClassificationStepId): ClassificationStep {
  if (id === "category")
    return { id, inputType: "options", optionKeys: CATEGORY_KEYS };
  if (id === "applicantType")
    return { id, inputType: "options", optionKeys: APPLICANT_TYPE_KEYS };
  if (id === "description") return { id, inputType: "text" };
  return { id, inputType: "options", optionKeys: YES_NO_KEYS };
}

export type ClassificationRiskTier = "standard" | "safety_critical";

export interface ClassificationResult {
  standardKey: string;
  standardNumber: string;
  categoryKey: string;
  applicantType: string;
  productDescription: string;
  // Pure presentation tier derived from the user's own safety-critical
  // answer — never a fabricated 3rd tier the collected answers can't
  // actually support, and never used to invent a new standard.
  riskTier: ClassificationRiskTier;
}

export interface ClassificationSessionState {
  sessionId: string;
  isComplete: boolean;
  step: ClassificationStep | null;
  result: ClassificationResult | null;
}

interface SessionRecord {
  answers: Partial<Record<ClassificationStepId, string>>;
}

const sessions = new Map<string, SessionRecord>();

function mintSessionId(): string {
  return `CLS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
}

function buildResult(
  answers: SessionRecord["answers"],
): ClassificationResult | null {
  const categoryKey = answers.category;
  const applicantType = answers.applicantType;
  const productDescription = answers.description;
  const safetyCritical = answers.safetyCritical;
  if (!categoryKey || !applicantType || !productDescription || !safetyCritical)
    return null;

  const standard = MOCK_STANDARDS.find((s) => s.categoryKey === categoryKey);
  if (!standard) return null;

  return {
    standardKey: standard.key,
    standardNumber: standard.standardNumber,
    categoryKey,
    applicantType,
    productDescription,
    riskTier: safetyCritical === "yes" ? "safety_critical" : "standard",
  };
}

/** POST /api/v1/classification/sessions stand-in. */
export async function createClassificationSession(): Promise<ClassificationSessionState> {
  const sessionId = mintSessionId();
  sessions.set(sessionId, { answers: {} });
  return delay({
    sessionId,
    isComplete: false,
    step: buildStep(STEP_ORDER[0]),
    result: null,
  });
}

/** POST /api/v1/classification/sessions/:id/answers stand-in. */
export async function submitClassificationAnswer(
  sessionId: string,
  stepId: ClassificationStepId,
  value: string,
): Promise<ClassificationSessionState> {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Classification session not found");
  }

  session.answers[stepId] = value;

  const currentIndex = STEP_ORDER.indexOf(stepId);
  const nextStepId = STEP_ORDER[currentIndex + 1];

  if (!nextStepId) {
    const result = buildResult(session.answers);
    return delay({ sessionId, isComplete: true, step: null, result });
  }

  return delay({
    sessionId,
    isComplete: false,
    step: buildStep(nextStepId),
    result: null,
  });
}
