// MOCK: illustrative demo events, not live ones. title/description/timestamp
// resolve against the notifications i18n namespace (items.<key>.*) the same
// way mock-standards.ts resolves titles against the standards namespace, so
// this stays translated rather than hardcoded to one language — EXCEPT the
// "requirement_update" type's payload (see RequirementUpdateNotification
// below), whose domain content is derived as-is from mock-revisions.ts and
// therefore follows that module's own "never pre-translate regulatory
// content" rule instead.

import { getAllPaymentSummaries, type FeeLineItem } from "@/lib/mock-payments";
import {
  MOCK_REVISION_RECORDS,
  type RevisionChange,
  type RevisionRecord,
} from "@/lib/mock-revisions";
import { getStandardKeyByNumber } from "@/lib/mock-standards";

export type NotificationType =
  | "regulatory"
  | "analysis"
  | "deadline"
  | "system"
  | "conformity"
  // S4 — additive, not a replacement for any of the five above.
  | "requirement_update"
  // S5 — additive, same as requirement_update above.
  | "payment";

export type RequirementUpdateSeverity = "high" | "medium" | "low";

// Reuses C2's own RevisionChange shape (Pick, not a re-typed copy) rather
// than inventing a parallel "what changed" interface — see the S4 task's
// explicit instruction. `severity` is the one genuinely new field S4
// adds, and it is authored data (see SEVERITY_BY_CHANGE_KEY below), never
// computed from `change` at render time.
export interface RequirementUpdateNotification {
  fromRevision: string;
  toRevision: string;
  severity: RequirementUpdateSeverity;
  change: Pick<
    RevisionChange,
    | "clause"
    | "clauseTitle"
    | "parameter"
    | "previousValue"
    | "currentValue"
    | "whyItMatters"
  >;
}

export interface NotificationDatum {
  key: string;
  type: NotificationType;
  read: boolean;
  // Optional: which standard (a MOCK_STANDARDS `key`) this item concerns,
  // when its title/description names one — e.g. n1 and n3 both name IS
  // 4151. Added for the S2 dashboard's Action Required / Regulatory Alert
  // cards (src/components/dashboard/), which reuse this exact type rather
  // than inventing a parallel one, and use `standardKey` to deep-link into
  // that standard's Compliance Gaps / Revision tab instead of only ever
  // falling back to a generic page. Left undefined on items that don't
  // name a specific standard (n2, n4, n5, n8) — never guessed.
  //
  // S4's "requirement_update" items also use this same field (rather than
  // duplicating the standard reference inside `requirementUpdate` below),
  // so both features deep-link the same way and never disagree about
  // which field carries "which standard".
  standardKey?: string;
  // Only present when `type === "requirement_update"`.
  requirementUpdate?: RequirementUpdateNotification;
  // S5 — which application (a mock-dashboard.ts illustrative application
  // id) a "payment" notification concerns, so it can deep-link to
  // /payments/:applicationId the same way `standardKey` deep-links a
  // "regulatory"/"deadline" item into a standard. Undefined on every other
  // type.
  applicationId?: string;
}

// Roughly newest-first, with a mix of read/unread so both filter tabs have
// something to show, spanning every notification type this page supports.
// Shared demo content, not scoped to the signed-in user (no per-user id
// field exists here to scope it by) — a real backend's equivalent
// endpoint would filter by the authenticated user's id (see
// AuthProvider's `currentUser.id`) rather than returning this same static
// list to everyone.
const BASE_NOTIFICATIONS: NotificationDatum[] = [
  { key: "n1", type: "deadline", read: false, standardKey: "is4151" },
  { key: "n2", type: "analysis", read: false },
  { key: "n3", type: "regulatory", read: false, standardKey: "is4151" },
  { key: "n4", type: "conformity", read: true },
  { key: "n5", type: "system", read: true },
  { key: "n6", type: "regulatory", read: true, standardKey: "is302" },
  { key: "n7", type: "deadline", read: true, standardKey: "is2347" },
  { key: "n8", type: "analysis", read: true },
];

// --- S4: requirement-update notifications, derived from C2's revision data --
//
// This is the ONLY place S4 decides anything — everything below reads
// mock-revisions.ts's own data and its own `highImpact` flag; nothing here
// re-detects a change or re-judges its impact independently (see Step 0 of
// the S4 task: no second regulatory-crawling/detection logic).

/**
 * S4's core filter: a requirement-update notification is only ever
 * created for a `highImpact` RevisionChange — never for an editorial
 * "clarified" wording change, and never for a change C2 itself didn't
 * flag as high-impact (e.g. this dataset's non-mandatory Annex C removal
 * or the optional conductivity test-method addition). `highImpact` is
 * authored in mock-revisions.ts, the same flag revision-compare.tsx's
 * "High Impact" tab already filters on — this function just makes
 * explicit which existing flag S4 keys off, so it's easy to check against
 * the spec later.
 */
export function isNotifiableChange(change: RevisionChange): boolean {
  return change.highImpact;
}

// Authored classification standing in for a backend's own severity
// grading of each notifiable change — never derived from `highImpact` or
// any other field at render time (see RequirementUpdateNotification's
// `severity`, and NotificationItem/RequirementUpdateCard, which only ever
// display this value). A limit tightening is graded "high" (products
// certified under the old limit may now fail outright); a brand-new
// mandatory clause is also "high" (products with no prior batch marking
// at all are non-conforming); a modified-but-still-mandatory labelling
// requirement is "medium" (an existing label needs an addition, not a
// wholesale rework). Any future `highImpact` change without an entry here
// conservatively defaults to "medium" in `severityFor` below, rather than
// guessing "high" or "low".
const SEVERITY_BY_CHANGE_KEY: Record<string, RequirementUpdateSeverity> = {
  "is14543-tds-limit": "high",
  "is14543-batch-traceability": "high",
  "is14543-labelling-qr": "medium",
};

function severityFor(change: RevisionChange): RequirementUpdateSeverity {
  return SEVERITY_BY_CHANGE_KEY[change.key] ?? "medium";
}

function requirementUpdateKey(
  standardKey: string,
  fromRevision: string,
  toRevision: string,
  clause: string,
): string {
  return `requpd:${standardKey}:${fromRevision}-${toRevision}:${clause}`;
}

/**
 * Folds a C2 RevisionRecord's notifiable changes into `existing`,
 * de-duplicated by standard+clause+revision-pair (the notification's own
 * `key`, built by `requirementUpdateKey`): re-running this against a
 * record that already produced a notification updates that same entry in
 * place — preserving whatever `read` state it already has — rather than
 * pushing a second, duplicate one. A change that isn't in `existing` yet
 * is added as a new, unread notification.
 */
export function deriveRequirementUpdateNotifications(
  existing: NotificationDatum[],
  standardKey: string,
  record: RevisionRecord,
): NotificationDatum[] {
  const next = [...existing];
  for (const change of record.changes) {
    if (!isNotifiableChange(change)) continue;

    const key = requirementUpdateKey(
      standardKey,
      record.fromRevision,
      record.toRevision,
      change.clause,
    );
    const existingIndex = next.findIndex((n) => n.key === key);
    const notification: NotificationDatum = {
      key,
      type: "requirement_update",
      read: existingIndex >= 0 ? next[existingIndex].read : false,
      standardKey,
      requirementUpdate: {
        fromRevision: record.fromRevision,
        toRevision: record.toRevision,
        severity: severityFor(change),
        change: {
          clause: change.clause,
          clauseTitle: change.clauseTitle,
          parameter: change.parameter,
          previousValue: change.previousValue,
          currentValue: change.currentValue,
          whyItMatters: change.whyItMatters,
        },
      },
    };

    if (existingIndex >= 0) next[existingIndex] = notification;
    else next.push(notification);
  }
  return next;
}

const REQUIREMENT_UPDATE_NOTIFICATIONS = MOCK_REVISION_RECORDS.reduce(
  (acc, record) => {
    const standardKey = getStandardKeyByNumber(record.standardNumber);
    // No catalogue entry for this standard number — nothing to deep-link
    // to, so honestly skip rather than notifying with a dead link.
    if (!standardKey) return acc;
    return deriveRequirementUpdateNotifications(acc, standardKey, record);
  },
  [] as NotificationDatum[],
);

// --- S5: payment-reminder notifications, derived from mock-payments.ts's --
// own seed data ------------------------------------------------------------
//
// Same discipline as the requirement-update section above: this is the
// ONLY place S5 decides anything, and even that decision is just "which of
// mock-payments.ts's own statuses count as needing a reminder" — the
// amount, due date, and application it concerns all come from
// mock-payments.ts as-is. No second fee dataset, no re-judging what's
// outstanding.

const REMINDER_STATUSES: FeeLineItem["status"][] = ["due", "pending", "failed"];

// Hyphen-joined, not colon-joined like requirement_update's key below —
// this key (unlike that one) is looked up via NotificationItem's plain
// `t(\`items.${notification.key}.title\`)` path, and i18next's default
// nsSeparator is ":", which would otherwise split this key apart and miss
// the translation entirely.
function paymentNotificationKey(applicationId: string, feeKey: string): string {
  return `payment-${applicationId}-${feeKey}`;
}

const PAYMENT_NOTIFICATIONS: NotificationDatum[] =
  getAllPaymentSummaries().flatMap((summary) =>
    summary.feeBreakdown
      .filter((item) => REMINDER_STATUSES.includes(item.status))
      .map((item) => ({
        key: paymentNotificationKey(summary.applicationId, item.key),
        type: "payment" as const,
        read: false,
        applicationId: summary.applicationId,
      })),
  );

// Requirement-update and payment-reminder notifications lead the list — a
// freshly surfaced regulatory change or an outstanding fee is the most
// actionable thing here — followed by the existing hand-authored demo
// items in their original order.
export const MOCK_NOTIFICATIONS: NotificationDatum[] = [
  ...REQUIREMENT_UPDATE_NOTIFICATIONS,
  ...PAYMENT_NOTIFICATIONS,
  ...BASE_NOTIFICATIONS,
];
