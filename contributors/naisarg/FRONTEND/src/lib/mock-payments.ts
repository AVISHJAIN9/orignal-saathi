// MOCK: there is no real payment/fee backend in this repo (no `api/`
// directory, no payment gateway integration, no fetch/axios usage outside
// src/server.ts — see Step 0 of the S5 task this file implements). Every
// function below is an async stand-in for a future real endpoint, with the
// same request-shaped-in / response-shaped-out signature that endpoint
// would have, so swapping this module for a real API client is the only
// change payment-status-page.tsx would need:
//   GET /api/v1/payments/:applicationId  getPaymentStatus
//
// HIGHER HONESTY BAR THAN OTHER MOCKS IN THIS REPO: unlike C1-C4/S3, which
// can check illustrative output against real MOCK_STANDARDS entries (a
// real standard number, a real clause), there is no real BIS fee schedule
// anywhere in this codebase to ground amounts, due dates, or transaction
// references against. Every FeeLineItem amount, dueDate, paidDate, and
// referenceId below is therefore illustrative in the strongest sense —
// invented purely to demonstrate the UI shape, not derived from or
// approximating any real BIS fee. payment-status-page.tsx renders a
// disclaimer banner more prominent than this app's usual muted `demoNotice`
// treatment for exactly this reason: a wrong standard citation is
// embarrassing, a wrong fee amount mistaken for real risks actual money.
//
// Seeded against the exact two illustrative applications S2's dashboard
// already built (mock-dashboard.ts's `ILLUSTRATIVE_APPLICATION_IDS`) —
// not a third, parallel set of illustrative applications. This module
// deliberately does NOT import that constant (mock-dashboard.ts already
// imports mock-notifications.ts, which imports this module to derive
// payment-reminder notifications — importing mock-dashboard.ts back here
// would create a cycle). The two id strings below must stay equal to
// mock-dashboard.ts's `ILLUSTRATIVE_APPLICATION_IDS.helmet` / `.water`.

const LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

export type PaymentStatus =
  "paid" | "pending" | "due" | "failed" | "refunded" | "not_due";

export interface FeeLineItem {
  key: string;
  label: string;
  // Illustrative rupee amount — see the module header. Never a real BIS
  // fee. Formatted at render time via Intl.NumberFormat, never pre-stored
  // as a formatted string.
  amount: number;
  status: PaymentStatus;
  dueDate?: string;
  paidDate?: string;
  // Only ever set when this mock "backend" actually returns one — see the
  // helmet seed below, where the oldest paid item deliberately has none,
  // exercising the "partial information" state honestly rather than
  // fabricating a reference number for every row.
  referenceId?: string;
}

export type OverallPaymentStatus = "up_to_date" | "payment_required";

export interface PaymentSummary {
  applicationId: string;
  totalDue: number;
  totalPaid: number;
  outstanding: number;
  overallStatus: OverallPaymentStatus;
  feeBreakdown: FeeLineItem[];
  history: FeeLineItem[];
}

// Must stay equal to mock-dashboard.ts's ILLUSTRATIVE_APPLICATION_IDS
// values — see the module header for why this file can't import that
// constant directly.
const APPLICATION_IDS = {
  helmet: "APP-DEMO-HELMET",
  water: "APP-DEMO-WATER",
} as const;

// The "Annual Renewal Flow" link on an unpaid/not-due annual_licence row
// (see FeeRow in payment-status.tsx) must not just follow whichever
// application's payment page happens to be open — the renewal wizard only
// accepts a "submitted" application (see mock-renewals.ts), and helmet is
// a draft that never reaches that status. Water is the one seed this repo
// actually proves the renewal flow resolves for, so the link always
// targets it rather than the ambient applicationId.
export const RENEWAL_ELIGIBLE_APPLICATION_ID = APPLICATION_IDS.water;

// --- APP-DEMO-HELMET: draft application, fees outstanding ------------------
// Carries all four "in progress" statuses at once (paid, due, not_due,
// failed) rather than spreading them across more illustrative applications
// — see the S5 plan's seed-coverage decision. Tells one coherent story: an
// early processing fee was paid (no reference number on file for it — an
// older record, exercising "partial information" honestly), a later
// payment attempt for the testing fee failed, and that fee is still due;
// the annual licence fee isn't due yet at all.
const HELMET_FEE_BREAKDOWN: FeeLineItem[] = [
  {
    key: "processing",
    label: "Application Processing Fee",
    amount: 1000,
    status: "paid",
    paidDate: "2026-08-20",
    // Deliberately no referenceId — see comment above.
  },
  {
    key: "testing",
    label: "Testing & Certification Fee",
    amount: 5000,
    status: "due",
    dueDate: "2026-09-20",
  },
  {
    key: "annual_licence",
    label: "Annual Licence Fee",
    amount: 2000,
    status: "not_due",
  },
];

const HELMET_HISTORY: FeeLineItem[] = [
  {
    key: "testing-attempt-1",
    label: "Testing & Certification Fee — payment attempt",
    amount: 5000,
    status: "failed",
    dueDate: "2026-09-20",
    referenceId: "TXN-ILLUS-8841",
  },
  {
    key: "processing-paid",
    label: "Application Processing Fee",
    amount: 1000,
    status: "paid",
    paidDate: "2026-08-20",
  },
];

// --- APP-DEMO-WATER: submitted application, fully paid ---------------------

const WATER_FEE_BREAKDOWN: FeeLineItem[] = [
  {
    key: "processing",
    label: "Application Processing Fee",
    amount: 1000,
    status: "paid",
    paidDate: "2026-08-05",
    referenceId: "TXN-ILLUS-7723",
  },
  {
    key: "testing",
    label: "Testing & Certification Fee",
    amount: 3500,
    status: "paid",
    paidDate: "2026-08-22",
    referenceId: "TXN-ILLUS-7910",
  },
  {
    key: "annual_licence",
    label: "Annual Licence Fee",
    amount: 2000,
    status: "paid",
    paidDate: "2026-09-01",
    referenceId: "TXN-ILLUS-8102",
  },
];

const WATER_HISTORY: FeeLineItem[] = [
  {
    key: "annual_licence-paid",
    label: "Annual Licence Fee",
    amount: 2000,
    status: "paid",
    paidDate: "2026-09-01",
    referenceId: "TXN-ILLUS-8102",
  },
  {
    key: "testing-paid",
    label: "Testing & Certification Fee",
    amount: 3500,
    status: "paid",
    paidDate: "2026-08-22",
    referenceId: "TXN-ILLUS-7910",
  },
  {
    key: "processing-paid",
    label: "Application Processing Fee",
    amount: 1000,
    status: "paid",
    paidDate: "2026-08-05",
    referenceId: "TXN-ILLUS-7723",
  },
];

function sumByStatus(items: FeeLineItem[], statuses: PaymentStatus[]): number {
  return items
    .filter((item) => statuses.includes(item.status))
    .reduce((total, item) => total + item.amount, 0);
}

function buildSummary(
  applicationId: string,
  feeBreakdown: FeeLineItem[],
  history: FeeLineItem[],
): PaymentSummary {
  const totalPaid = sumByStatus(feeBreakdown, ["paid"]);
  const outstanding = sumByStatus(feeBreakdown, ["due", "pending", "failed"]);
  const totalDue = totalPaid + outstanding;
  return {
    applicationId,
    totalDue,
    totalPaid,
    outstanding,
    overallStatus: outstanding > 0 ? "payment_required" : "up_to_date",
    feeBreakdown,
    history,
  };
}

const PAYMENT_SUMMARIES: Record<string, PaymentSummary> = {
  [APPLICATION_IDS.helmet]: buildSummary(
    APPLICATION_IDS.helmet,
    HELMET_FEE_BREAKDOWN,
    HELMET_HISTORY,
  ),
  [APPLICATION_IDS.water]: buildSummary(
    APPLICATION_IDS.water,
    WATER_FEE_BREAKDOWN,
    WATER_HISTORY,
  ),
};

/**
 * GET /api/v1/payments/:applicationId stand-in. Returns `null` — never a
 * fabricated empty summary — for any application id this mock doesn't have
 * fee records for, which is the honest "no payment records" state
 * payment-status-page.tsx renders for it.
 */
export async function getPaymentStatus(
  applicationId: string,
): Promise<PaymentSummary | null> {
  return delay(PAYMENT_SUMMARIES[applicationId] ?? null);
}

// Exposed so mock-notifications.ts can derive payment-reminder
// notifications from the same seed data this module already has, rather
// than a second copy of it — see that module's derivePaymentNotifications.
export function getAllPaymentSummaries(): PaymentSummary[] {
  return Object.values(PAYMENT_SUMMARIES);
}
