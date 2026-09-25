// MOCK: there is no real registration backend in this repo (no `api/`
// directory, no application/draft types anywhere before this file, no
// fetch/axios usage outside src/server.ts — see Step 0 of the S3 task
// this file implements). Every function below is an async stand-in for a
// future real endpoint, with the same request-shaped-in / response-shaped-
// out signature that endpoint would have, so swapping this module for a
// real API client is the only change the wizard would need:
//   POST   /api/v1/registration/applications            createApplication
//   GET    /api/v1/registration/applications/:id         getApplication
//   PATCH  /api/v1/registration/applications/:id         updateApplication
//   POST   /api/v1/registration/applications/:id/draft   saveDraft
//   POST   /api/v1/registration/applications/:id/documents/:key  uploadDocument
//   GET    /api/v1/registration/requirements/:standardKey getRequirements
//   POST   /api/v1/registration/applications/:id/submit  submitApplication
//   GET    /api/v1/registration/applications/:id/status  getApplicationStatus
//
// This is explicitly a prototype flow, never a real BIS submission — the
// Submitted screen's copy says so too, and nothing here should ever imply
// a real government filing occurred.
//
// src/components/product-classification-wizard.tsx is NOT extended by
// this module — it's a small stateless quiz with no backend and no
// multi-step form state, useful only as a reference for step-transition
// animation style (see registration-wizard.tsx).

import {
  getStandardByKey,
  MOCK_STANDARDS,
  type StandardDatum,
} from "@/lib/mock-standards";

const LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

export type ApplicantType =
  "manufacturer" | "importer" | "dealer" | "individual" | "";

export interface ApplicantDetails {
  fullName: string;
  email: string;
  phone: string;
  applicantType: ApplicantType;
}

export type BusinessType =
  | "sole_proprietorship"
  | "partnership"
  | "private_limited"
  | "public_limited"
  | "other"
  | "";

export interface BusinessDetails {
  organizationName: string;
  businessType: BusinessType;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pincode: string;
}

export interface ProductDetails {
  productName: string;
  productDescription: string;
  categoryKey: string;
  // Only ever set from `suggestStandard`'s response — never guessed
  // client-side (see the "distinguish suggestion from what you typed"
  // requirement in product-details-step.tsx).
  suggestedStandardKey: string | null;
}

export type DocumentStatus =
  "accepted" | "processing" | "required" | "rejected";

export interface RequirementDocument {
  key: string;
  label: string;
  status: DocumentStatus;
  fileName?: string;
  // Only ever populated when uploadDocument's mock response actually
  // returns one (see the ADVERSARIAL/HONESTY note there) — never invented
  // client-side for a rejected document.
  rejectionReason?: string;
}

export interface TestingRequirement {
  key: string;
  label: string;
}

export interface RecommendedLab {
  name: string;
  location: string;
  accreditation: string;
}

export interface TestingState {
  tests: TestingRequirement[];
  // False everywhere in this prototype — C7 (Laboratory Matcher) doesn't
  // exist in this repo yet (see Step 0). The Testing step renders an
  // honest "not yet available" fallback when this is false rather than a
  // fabricated `recommendedLab`.
  labMatchingAvailable: boolean;
  recommendedLab: RecommendedLab | null;
}

export interface ReviewState {
  confirmed: boolean;
}

export type ApplicationStatus = "draft" | "submitted" | "rejected";

export interface Application {
  id: string;
  applicant: ApplicantDetails;
  business: BusinessDetails;
  product: ProductDetails;
  documents: RequirementDocument[];
  testing: TestingState;
  review: ReviewState;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  // Only ever set by submitApplication() when its own deterministic
  // resolution rule (see resolveSubmissionOutcome) actually rejects the
  // submission — never invented client-side.
  rejectionReason?: string;
  // S17 — set only by createReapplication(), pointing at the rejected
  // application a "Start New Application" reapplication was created from.
  // Lets the Review step (and a future case-history view) show the two are
  // linked, without a rejected application's own record ever being mutated
  // or deleted.
  reappliedFromId?: string;
}

// S29 — drafts are keyed by application id (not one fixed slot), so more
// than one in-progress application can be stored at once and the wizard
// can offer a picker between them. The previous single-slot key
// ("saathi:registrationDraft") is migrated into this store exactly once —
// see migrateLegacyDraft() below.
const DRAFTS_STORAGE_KEY = "saathi:registrationDrafts";
const LEGACY_DRAFT_STORAGE_KEY = "saathi:registrationDraft";

type DraftStore = Record<string, Application>;

function isApplication(value: unknown): value is Application {
  if (!value || typeof value !== "object") return false;
  const app = value as Partial<Application>;
  return typeof app.id === "string" && typeof app.status === "string";
}

function isDraftStore(value: unknown): value is DraftStore {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return Object.values(value as Record<string, unknown>).every(isApplication);
}

// Migrates a pre-S29 single-slot draft into the new id-keyed store. Called
// synchronously from readStore() below, only while DRAFTS_STORAGE_KEY has
// never been written — since localStorage access in a browser tab is
// synchronous and single-threaded, there is no window in which two calls
// can both observe "not yet migrated" and race, and no async gap in which
// a legacy write could be lost. The legacy key is only removed once the
// new key has actually been persisted, so a storage-write failure leaves
// the legacy draft in place for a future successful attempt rather than
// silently losing it.
function migrateLegacyDraft(): DraftStore {
  let store: DraftStore = {};
  try {
    const legacyRaw = localStorage.getItem(LEGACY_DRAFT_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (isApplication(legacy)) store = { [legacy.id]: legacy };
    }
  } catch {
    // Corrupted legacy JSON — proceed with an empty store rather than
    // throwing away a store the wizard could otherwise still use.
  }
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(store));
    localStorage.removeItem(LEGACY_DRAFT_STORAGE_KEY);
  } catch {
    // Write failed — leave the legacy key in place; the in-memory `store`
    // below still lets this session work correctly either way.
  }
  return store;
}

function readStore(): DraftStore {
  const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
  if (raw === null) return migrateLegacyDraft();
  try {
    const parsed = JSON.parse(raw);
    if (isDraftStore(parsed)) return parsed;
  } catch {
    // Corrupted JSON — fall through to an empty store below.
  }
  return {};
}

function writeStore(store: DraftStore) {
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore — the in-memory wizard state still works for this session.
  }
}

function readDraft(id: string): Application | null {
  return readStore()[id] ?? null;
}

function writeDraft(application: Application) {
  const store = readStore();
  store[application.id] = application;
  writeStore(store);
}

/** Minutes since an ISO timestamp — shared by the wizard's own "Saved N
 * minutes ago" status label and the draft picker's "last saved" caption,
 * so both use one formatting rule. */
export function minutesAgo(iso: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 60000),
  );
}

function emptyApplication(id: string): Application {
  const now = new Date().toISOString();
  return {
    id,
    applicant: { fullName: "", email: "", phone: "", applicantType: "" },
    business: {
      organizationName: "",
      businessType: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      pincode: "",
    },
    product: {
      productName: "",
      productDescription: "",
      categoryKey: "",
      suggestedStandardKey: null,
    },
    documents: [],
    testing: { tests: [], labMatchingAvailable: false, recommendedLab: null },
    review: { confirmed: false },
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

// Minted by this mock "backend" layer only — the same role a real
// endpoint's response would play. Never generated or guessed in the UI;
// components only ever read `application.id` from what this module
// returns.
function mintApplicationId(): string {
  return `APP-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * POST /api/v1/registration/applications stand-in. Resumes the single
 * existing draft if there is exactly one, same as before S29. When there
 * are none, creates a new one. This should only ever be called with zero
 * or one draft in progress — the wizard calls listDrafts() first and
 * branches to the draft picker instead of calling this when there's more
 * than one, so a real caller never needs the tie-break below; it exists
 * only as a defensive fallback (most-recently-updated wins) rather than
 * an unhandled case.
 */
export async function createApplication(): Promise<Application> {
  const drafts = Object.values(readStore()).filter(
    (a) => a.status === "draft",
  );
  if (drafts.length === 1) return delay(drafts[0]);
  if (drafts.length === 0) {
    const application = emptyApplication(mintApplicationId());
    writeDraft(application);
    return delay(application);
  }
  const mostRecent = drafts
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return delay(mostRecent);
}

/**
 * GET /api/v1/registration/applications stand-in — this applicant's
 * in-progress drafts (status "draft"), most recently saved first. The
 * wizard calls this before createApplication() so it can show a picker
 * when there's more than one, rather than one being silently chosen.
 */
export async function listDrafts(): Promise<Application[]> {
  const drafts = Object.values(readStore()).filter(
    (a) => a.status === "draft",
  );
  drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return delay(drafts);
}

/**
 * Always creates a brand-new blank draft, even if others already exist —
 * used by the draft picker's "Start a new application" action, which is
 * an explicit choice to not resume anything already in progress.
 */
export async function startNewApplication(): Promise<Application> {
  const application = emptyApplication(mintApplicationId());
  writeDraft(application);
  return delay(application);
}

/** GET /api/v1/registration/applications/:id stand-in. */
export async function getApplication(id: string): Promise<Application | null> {
  return delay(readDraft(id));
}

/** PATCH /api/v1/registration/applications/:id stand-in. */
export async function updateApplication(
  id: string,
  patch: Partial<Omit<Application, "id" | "status" | "createdAt">>,
): Promise<Application> {
  const application = readDraft(id);
  if (!application) {
    throw new Error("Application not found");
  }
  const next: Application = {
    ...application,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeDraft(next);
  return delay(next);
}

/** POST /api/v1/registration/applications/:id/draft stand-in — "Save & Exit" / autosave. */
export async function saveDraft(
  id: string,
  snapshot: Partial<Omit<Application, "id" | "status" | "createdAt">>,
): Promise<{ savedAt: string }> {
  const next = await updateApplication(id, snapshot);
  return { savedAt: next.updatedAt };
}

// ADVERSARIAL/HONESTY NOTE, same rule mock-compliance-gaps.ts documents:
// only the filename keywords below decide the outcome, never a claim the
// filename makes about itself — "final_APPROVED_doc.pdf" is not treated
// any differently than "final_doc.pdf". A rejection reason is only ever
// attached here, in the one place that can plausibly "know" it — never
// invented in the wizard component.
function pickUploadOutcome(fileName: string): {
  status: DocumentStatus;
  rejectionReason?: string;
} {
  const lower = fileName.toLowerCase();
  if (lower.includes("reject")) {
    return {
      status: "rejected",
      rejectionReason:
        "This document doesn't match the expected type for this requirement — check the file and upload again.",
    };
  }
  if (lower.includes("pending") || lower.includes("scan")) {
    return { status: "processing" };
  }
  return { status: "accepted" };
}

/** POST /api/v1/registration/applications/:id/documents/:key stand-in. */
export async function uploadDocument(
  id: string,
  documentKey: string,
  fileName: string,
): Promise<{
  status: DocumentStatus;
  fileName: string;
  rejectionReason?: string;
}> {
  const application = readDraft(id);
  if (!application) {
    throw new Error("Application not found");
  }
  const outcome = pickUploadOutcome(fileName);
  const documents = application.documents.map((doc) =>
    doc.key === documentKey ? { ...doc, ...outcome, fileName } : doc,
  );
  writeDraft({
    ...application,
    documents,
    updatedAt: new Date().toISOString(),
  });
  return delay({ ...outcome, fileName });
}

interface RequirementsBundle {
  documents: Omit<
    RequirementDocument,
    "status" | "fileName" | "rejectionReason"
  >[];
  testing: TestingState;
}

// Seeded for the same two standards C1-C4 already use, so the whole demo
// composes together. This lives entirely in the mock API layer, not as
// React conditionals in a step component — see the "don't duplicate BIS
// business rules as React conditionals" rule in the S3 task.
// Exported so mock-document-checklist.ts (S15) can reuse these exact
// per-standard document entries as its "required" tier rather than
// authoring a second, parallel document list.
export const REQUIREMENTS_BY_STANDARD: Record<string, RequirementsBundle> = {
  is4151: {
    documents: [
      { key: "test_report", label: "Impact & Chin-Strap Test Report" },
      { key: "factory_licence", label: "Factory / Manufacturing Licence" },
      { key: "authorization_letter", label: "Authorized Signatory Letter" },
    ],
    testing: {
      tests: [
        { key: "impact", label: "Impact Absorption Test" },
        { key: "chinstrap", label: "Chin Strap Retention Test" },
        { key: "peripheral", label: "Peripheral Vision Test" },
      ],
      labMatchingAvailable: false,
      recommendedLab: null,
    },
  },
  is14543: {
    documents: [
      { key: "test_report", label: "Laboratory Water Quality Test Report" },
      { key: "licence", label: "BIS Licence Copy" },
      { key: "label_artwork", label: "Label Artwork" },
    ],
    testing: {
      tests: [
        { key: "tds", label: "Total Dissolved Solids (TDS) Test" },
        { key: "ph", label: "pH Test" },
        { key: "arsenic", label: "Arsenic Content Test" },
      ],
      labMatchingAvailable: false,
      recommendedLab: null,
    },
  },
};

const DEFAULT_REQUIREMENTS: RequirementsBundle = {
  documents: [
    { key: "test_report", label: "Laboratory Test Report" },
    { key: "business_licence", label: "Business Registration / Licence" },
  ],
  testing: { tests: [], labMatchingAvailable: false, recommendedLab: null },
};

/** GET /api/v1/registration/requirements/:standardKey stand-in. */
export async function getRequirements(standardKey: string | null): Promise<{
  documents: RequirementDocument[];
  testing: TestingState;
}> {
  const bundle =
    (standardKey && REQUIREMENTS_BY_STANDARD[standardKey]) ||
    DEFAULT_REQUIREMENTS;
  const documents: RequirementDocument[] = bundle.documents.map((doc) => ({
    ...doc,
    status: "required",
  }));
  return delay({
    documents,
    testing: { ...bundle.testing, tests: [...bundle.testing.tests] },
  });
}

/**
 * Stands in for a real product-classification suggestion endpoint.
 * `MOCK_STANDARDS` (mock-standards.ts) is reused as the suggestion pool,
 * per the S3 task's explicit instruction — this is not a second standards
 * catalogue.
 */
export async function suggestStandard(
  categoryKey: string,
): Promise<StandardDatum | null> {
  const match = MOCK_STANDARDS.find(
    (standard) => standard.categoryKey === categoryKey,
  );
  return delay(match ?? null);
}

export function getStandardLabel(
  standardKey: string | null,
): StandardDatum | undefined {
  return standardKey ? getStandardByKey(standardKey) : undefined;
}

// S17 — ADVERSARIAL/HONESTY NOTE, same rule pickUploadOutcome documents
// above: only the product-name keyword below decides the outcome, never a
// claim the name makes about itself — a product genuinely named
// "Rejection-proof Helmet" is treated identically to any other name that
// happens to contain "reject". This exists purely so the rejection path
// is reachable on demand for a demo (type "reject" into the product name
// in the Product step) rather than being unreachable or randomly firing.
const REJECTION_REASONS: Record<string, string> = {
  is4151:
    "The submitted Impact & Chin-Strap Test Report does not meet Clause 5.1's peak headform acceleration limit for IS 4151.",
  is14543:
    "The submitted laboratory report records a Total Dissolved Solids (TDS) value exceeding the 500 mg/L limit specified in Clause 6.2 of IS 14543.",
};
const DEFAULT_REJECTION_REASON =
  "The submitted application did not meet the requirements for the selected standard.";

function resolveSubmissionOutcome(
  application: Application,
): { rejected: false } | { rejected: true; reason: string } {
  if (!application.product.productName.toLowerCase().includes("reject")) {
    return { rejected: false };
  }
  const reason =
    (application.product.suggestedStandardKey &&
      REJECTION_REASONS[application.product.suggestedStandardKey]) ||
    DEFAULT_REJECTION_REASON;
  return { rejected: true, reason };
}

export interface SubmitResult {
  status: "submitted" | "rejected" | "error";
  applicationId?: string;
  submittedAt?: string;
  // Only ever set when status is "rejected" — see resolveSubmissionOutcome.
  rejectionReason?: string;
  // Rendered as-is if present — never invented by the wizard. This mock
  // never actually populates it (field-level errors are a separate,
  // not-yet-modeled case from the whole-application rejection above), but
  // the shape exists so a real backend's field errors have exactly one
  // place to land.
  fieldErrors?: Record<string, string>;
  // Safe-to-display only, same rule as AuthProvider's authError — never a
  // raw stack trace or status code.
  errorMessage?: string;
}

/** POST /api/v1/registration/applications/:id/submit stand-in. */
export async function submitApplication(id: string): Promise<SubmitResult> {
  const application = readDraft(id);
  if (!application) {
    return delay({
      status: "error",
      errorMessage: "We couldn't find this application. Please start again.",
    });
  }
  const submittedAt = new Date().toISOString();
  const outcome = resolveSubmissionOutcome(application);
  if (outcome.rejected) {
    writeDraft({
      ...application,
      status: "rejected",
      rejectionReason: outcome.reason,
      submittedAt,
      updatedAt: submittedAt,
    });
    return delay({
      status: "rejected",
      applicationId: application.id,
      submittedAt,
      rejectionReason: outcome.reason,
    });
  }
  writeDraft({
    ...application,
    status: "submitted",
    submittedAt,
    updatedAt: submittedAt,
  });
  return delay({
    status: "submitted",
    applicationId: application.id,
    submittedAt,
  });
}

/**
 * S17 — creates a fresh draft from a rejected application's applicant,
 * business, and product details, linked back via `reappliedFromId`.
 * Documents and testing are re-fetched via getRequirements() rather than
 * copied — a rejected application's prior documents can't be assumed
 * still valid, so the new draft honestly starts them at "required" again
 * rather than carrying over stale "accepted" statuses. Returns null if the
 * source application can't be found, the same not-found shape
 * getApplication() already uses.
 */
export async function createReapplication(
  rejectedId: string,
): Promise<Application | null> {
  const source = readDraft(rejectedId);
  if (!source) return null;
  const requirements = await getRequirements(
    source.product.suggestedStandardKey,
  );
  const now = new Date().toISOString();
  const application: Application = {
    id: mintApplicationId(),
    applicant: { ...source.applicant },
    business: { ...source.business },
    product: { ...source.product },
    documents: requirements.documents,
    testing: requirements.testing,
    review: { confirmed: false },
    status: "draft",
    createdAt: now,
    updatedAt: now,
    reappliedFromId: source.id,
  };
  writeDraft(application);
  return delay(application);
}

/**
 * GET /api/v1/registration/applications?status=submitted stand-in — this
 * applicant's own real submitted applications (not the two illustrative
 * ones mock-dashboard.ts seeds). S18's sample tracker uses this so a real
 * application someone actually submitted through this wizard shows up
 * there too, not just the illustrative pair.
 */
export async function listSubmittedApplications(): Promise<Application[]> {
  const submitted = Object.values(readStore()).filter(
    (a) => a.status === "submitted",
  );
  submitted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return delay(submitted);
}

/** GET /api/v1/registration/applications/:id/status stand-in. */
export async function getApplicationStatus(
  id: string,
): Promise<ApplicationStatus | null> {
  const application = readDraft(id);
  return delay(application ? application.status : null);
}
