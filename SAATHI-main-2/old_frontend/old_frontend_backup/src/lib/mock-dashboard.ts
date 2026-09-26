// MOCK: there is no dashboard/status/deadline backend in this repo (see
// Step 0 of the S2 task this file implements: no api/ directory, no
// OpenAPI spec, no env-configured API base URL, and AuthProvider's
// `AuthUser` — see src/lib/auth.ts — carries only id/name/email/status,
// nothing dashboard-shaped). Every function below is an async stand-in
// for a future
//   GET /api/v1/dashboard/applications
//   GET /api/v1/dashboard/deadlines
//   GET /api/v1/dashboard/action-required
//   GET /api/v1/dashboard/regulatory-alerts
//   GET /api/v1/dashboard/activity
//   GET /api/v1/dashboard/payment-alerts (S5)
// with the same async, response-shaped-out signature those endpoints
// would have, so swapping this module for a real API client is the only
// change useDashboard() (src/hooks/use-dashboard.ts) would need.
//
// This module does NOT compute a fabricated compliance score or a
// "risk" verdict: application readiness is pulled as-is from C4's
// `runReadinessCheck` (mock-readiness.ts), which itself only re-derives a
// verdict from C3's `runGapAnalysis` (mock-compliance-gaps.ts) — nothing
// here re-decides whether a requirement passes. Where no per-application
// score view is meaningful (the portfolio-wide summary), real status
// counts are shown instead (see `getStatusSummary`).
//
// Reuses S3's exact `Application` type (mock-registration.ts) for the two
// illustrative seed applications below, per the S2 task's explicit
// instruction — there is no second, parallel "application" shape here.
// Action Required / Regulatory Alert content reuses `NotificationDatum`
// (mock-notifications.ts) the same way, filtered by its existing "deadline"
// and "regulatory" types rather than a third parallel shape.
//
// Every section below is gated on the signed-in RoleProvider role (see
// isApplicantRole): a "public" account is a citizen, not a BIS applicant,
// and genuinely has no applications, deadlines, action items, or alerts —
// this is what makes the dashboard's "empty" state (useDashboard.ts)
// honestly reachable, rather than something only ever exercised in theory.

import type { AuthUser } from "@/lib/auth";
import { runReadinessCheck, type ReadinessReport } from "@/lib/mock-readiness";
import {
  MOCK_NOTIFICATIONS,
  type NotificationDatum,
} from "@/lib/mock-notifications";
import type { Application, RequirementDocument } from "@/lib/mock-registration";
import { getStandardByKey } from "@/lib/mock-standards";
import type { Role } from "@/lib/role";

const LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

function isApplicantRole(role: Role | null): boolean {
  return role === "industry" || role === "admin";
}

// --- Status summary ---------------------------------------------------
//
// Real counts, never a fabricated aggregate percentage: this prototype's
// `Application.status` only ever distinguishes "draft" (still being
// worked on) from "submitted" (out of the applicant's hands, awaiting a
// real BIS decision — genuinely "pending" from their point of view).
// "completed" has no real source yet — no feature in this repo ever marks
// an application approved/certified — so it is honestly always 0 here
// rather than reusing "submitted" to fake a completed count.
export interface StatusSummary {
  completed: number;
  inProgress: number;
  pending: number;
}

export function getStatusSummary(
  applications: DashboardApplication[],
): StatusSummary {
  return {
    completed: 0,
    inProgress: applications.filter((a) => a.application.status === "draft")
      .length,
    pending: applications.filter((a) => a.application.status === "submitted")
      .length,
  };
}

// --- Applications -------------------------------------------------------

export interface DashboardApplication {
  application: Application;
  // Pulled as-is from C4 — never recomputed here. See mock-readiness.ts.
  readiness: ReadinessReport;
}

const ILLUSTRATIVE_APPLICATION_IDS = {
  helmet: "APP-DEMO-HELMET",
  water: "APP-DEMO-WATER",
} as const;

function illustrativeDocument(
  key: string,
  label: string,
  status: RequirementDocument["status"],
  fileName?: string,
): RequirementDocument {
  return { key, label, status, fileName };
}

function buildIllustrativeApplications(user: AuthUser): Application[] {
  const now = new Date().toISOString();
  const helmet: Application = {
    id: ILLUSTRATIVE_APPLICATION_IDS.helmet,
    applicant: {
      fullName: user.name,
      email: user.email,
      phone: "",
      applicantType: "manufacturer",
    },
    business: {
      organizationName: "Illustrative Manufacturing Co.",
      businessType: "private_limited",
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      pincode: "",
    },
    product: {
      productName: "Two-Wheeler Helmet",
      productDescription: "Full-face protective helmet for two-wheeler riders.",
      categoryKey: "helmets",
      suggestedStandardKey: "is4151",
    },
    documents: [
      illustrativeDocument(
        "test_report",
        "Impact & Chin-Strap Test Report",
        "accepted",
        "Helmet_TestReport_v3.pdf",
      ),
      illustrativeDocument(
        "factory_licence",
        "Factory / Manufacturing Licence",
        "required",
      ),
      illustrativeDocument(
        "authorization_letter",
        "Authorized Signatory Letter",
        "accepted",
        "Authorization_Letter_Signed.pdf",
      ),
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
    review: { confirmed: false },
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  const water: Application = {
    id: ILLUSTRATIVE_APPLICATION_IDS.water,
    applicant: {
      fullName: user.name,
      email: user.email,
      phone: "",
      applicantType: "manufacturer",
    },
    business: {
      organizationName: "Illustrative Manufacturing Co.",
      businessType: "private_limited",
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      pincode: "",
    },
    product: {
      productName: "Packaged Natural Mineral Water",
      productDescription: "500ml packaged natural mineral water.",
      categoryKey: "water",
      suggestedStandardKey: "is14543",
    },
    documents: [
      illustrativeDocument(
        "test_report",
        "Laboratory Water Quality Test Report",
        "accepted",
        "Water_Lab_TestReport.pdf",
      ),
      illustrativeDocument(
        "licence",
        "BIS Licence Copy",
        "accepted",
        "BIS_Licence_Copy.pdf",
      ),
      illustrativeDocument("label_artwork", "Label Artwork", "required"),
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
    review: { confirmed: true },
    status: "submitted",
    createdAt: now,
    updatedAt: now,
    // A fixed past timestamp, not `now` — matches this application's own
    // "Application submitted for review" activity entry below. S18's
    // sample tracker times real testing-stage progression off this field,
    // which only works if it's a real elapsed-time-ago moment rather than
    // being silently reset to the current instant on every page load.
    submittedAt: "2026-09-11T16:40:00.000Z",
  };

  return [helmet, water];
}

/** GET /api/v1/dashboard/applications stand-in. */
export async function getApplications(
  user: AuthUser,
  role: Role | null,
): Promise<DashboardApplication[]> {
  if (!isApplicantRole(role)) return delay([]);

  const applications = buildIllustrativeApplications(user);
  const withReadiness = await Promise.all(
    applications.map(async (application) => {
      const documentNames = application.documents
        .filter((doc) => doc.status === "accepted" && doc.fileName)
        .map((doc) => doc.fileName as string);
      // runReadinessCheck (like runGapAnalysis) keys its templates by the
      // standard's real number ("IS 4151"), not by mock-standards.ts's
      // catalogue `key` ("is4151") that `suggestedStandardKey` stores —
      // same resolution compliance-gap-analyzer.tsx already does via
      // `standard.standardNumber` before calling it.
      const standardNumber =
        getStandardByKey(application.product.suggestedStandardKey ?? "")
          ?.standardNumber ?? "";
      const readiness = await runReadinessCheck(standardNumber, documentNames);
      return { application, readiness };
    }),
  );
  return delay(withReadiness);
}

// --- Deadlines ------------------------------------------------------------

export interface DashboardDeadline {
  key: string;
  applicationId: string;
  standardKey: string;
  label: string;
  // Real ISO date — urgency tier/label is derived from this at render time
  // (see src/lib/dashboard-urgency.ts), never stored pre-computed.
  dueDate: string;
}

function illustrativeDeadlines(): DashboardDeadline[] {
  return [
    {
      key: "d1",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.helmet,
      standardKey: "is4151",
      label: "Submit missing BIS Licence document",
      dueDate: "2026-09-13",
    },
    {
      key: "d2",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.water,
      standardKey: "is14543",
      label: "Respond to compliance gap notice (TDS)",
      dueDate: "2026-09-16",
    },
    {
      key: "d3",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.helmet,
      standardKey: "is4151",
      label: "BIS certification renewal",
      dueDate: "2026-09-25",
    },
    {
      key: "d4",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.water,
      standardKey: "is14543",
      label: "Annual licence renewal filing",
      dueDate: "2026-11-01",
    },
  ];
}

/** GET /api/v1/dashboard/deadlines stand-in. */
export async function getDeadlines(
  role: Role | null,
): Promise<DashboardDeadline[]> {
  return delay(isApplicantRole(role) ? illustrativeDeadlines() : []);
}

// --- Action required + regulatory alerts ---------------------------------
//
// Reuses MOCK_NOTIFICATIONS as-is, filtered by its existing "deadline" and
// "regulatory" types — not a parallel type (see the S2 task's explicit
// instruction). Only unread items surface here: a read notification has
// already been seen, so it no longer needs a dashboard card of its own.

/** GET /api/v1/dashboard/action-required stand-in. */
export async function getActionRequiredItems(
  role: Role | null,
): Promise<NotificationDatum[]> {
  if (!isApplicantRole(role)) return delay([]);
  return delay(
    MOCK_NOTIFICATIONS.filter((n) => n.type === "deadline" && !n.read),
  );
}

/** GET /api/v1/dashboard/regulatory-alerts stand-in. */
export async function getRegulatoryAlerts(
  role: Role | null,
): Promise<NotificationDatum[]> {
  if (!isApplicantRole(role)) return delay([]);
  return delay(
    MOCK_NOTIFICATIONS.filter((n) => n.type === "regulatory" && !n.read),
  );
}

// S5 — same reuse pattern as getActionRequiredItems/getRegulatoryAlerts
// above: filters MOCK_NOTIFICATIONS by its existing "payment" type (itself
// derived from mock-payments.ts's own seed data — see mock-notifications.ts)
// rather than a third, parallel "what's due" shape.
/** GET /api/v1/dashboard/payment-alerts stand-in. */
export async function getPaymentAlerts(
  role: Role | null,
): Promise<NotificationDatum[]> {
  if (!isApplicantRole(role)) return delay([]);
  return delay(
    MOCK_NOTIFICATIONS.filter((n) => n.type === "payment" && !n.read),
  );
}

// --- Recent activity ------------------------------------------------------

export interface ActivityDatum {
  key: string;
  applicationId: string;
  standardKey: string;
  // Literal English, same rule as mock-compliance-gaps.ts's requirement
  // text: this describes a real document/status fact about the seeded
  // applications above, not a translated UI label.
  message: string;
  timestamp: string;
}

function illustrativeActivity(): ActivityDatum[] {
  return [
    {
      key: "a1",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.water,
      standardKey: "is14543",
      message:
        "Water_Lab_TestReport.pdf uploaded and analyzed — TDS result exceeds the permissible limit.",
      timestamp: "2026-09-12T10:15:00.000Z",
    },
    {
      key: "a2",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.water,
      standardKey: "is14543",
      message: "Application submitted for review.",
      timestamp: "2026-09-11T16:40:00.000Z",
    },
    {
      key: "a3",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.helmet,
      standardKey: "is4151",
      message: "Authorization_Letter_Signed.pdf accepted.",
      timestamp: "2026-09-10T09:05:00.000Z",
    },
    {
      key: "a4",
      applicationId: ILLUSTRATIVE_APPLICATION_IDS.helmet,
      standardKey: "is4151",
      message: "Helmet_TestReport_v3.pdf accepted.",
      timestamp: "2026-09-08T14:20:00.000Z",
    },
  ];
}

/** GET /api/v1/dashboard/activity stand-in. */
export async function getRecentActivity(
  role: Role | null,
): Promise<ActivityDatum[]> {
  return delay(isApplicantRole(role) ? illustrativeActivity() : []);
}
