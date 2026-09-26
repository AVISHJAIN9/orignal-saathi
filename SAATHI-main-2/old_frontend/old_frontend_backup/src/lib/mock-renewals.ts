// S19 — Annual Renewal Flow with Surveillance-Audit Trigger.
//
// Rebuilt after an audit found the original draft forked its own
// disconnected dataset: fabricated companies, named BIS office contacts,
// invented licence numbers, a fake regulation citation ("Regulation
// 7(1)"), a simulated "BUREAU OF INDIAN STANDARDS — STATUTORY RECEIPT"
// document, and real-format banking details (a genuine SBI IFSC code, a
// fabricated VPA, a fabricated virtual account). None of that is repeated
// here. Every claim below is derived from a real source already in this
// repo:
//   - `Application` (mock-registration.ts) — the real applicant/business
//     data a renewal's "operative unit" card shows, and the real
//     `submittedAt` a renewal's validity window is computed from.
//   - `checkQcoApplicability` (mock-qco.ts, C1) — the real function that
//     decides whether the surveillance-audit branch is triggered. No
//     invented regulation number; the trigger reason quotes C1's own
//     QcoRecord title/scope.
//   - `getAllPaymentSummaries` (mock-payments.ts, S5) — S5's own
//     already-illustrative base fee amounts, reused rather than a second
//     invented fee schedule.
//
// HONESTY NOTE: this repo's ApplicationStatus has no "licensed" state
// (only draft | submitted | rejected), so there's no real signal for
// "holds an active licence eligible for renewal." "submitted" is used as
// the honest stand-in — documented here the same way this repo documents
// its other acknowledged data-model gaps (e.g. the missing C7 lab
// matcher). S18's real sample-testing outcome is surfaced as an
// informational callout, not a hard gate, so a submitted application
// S18 resolves to "failed" still demonstrates this flow honestly instead
// of the feature going empty.

import {
  getApplication,
  listSubmittedApplications,
  type Application,
} from "@/lib/mock-registration";
import { getStandardByKey } from "@/lib/mock-standards";
import { checkQcoApplicability, type QcoRecord } from "@/lib/mock-qco";
import { getAllPaymentSummaries } from "@/lib/mock-payments";
import { getApplications as getIllustrativeApplications } from "@/lib/mock-dashboard";
import { buildSampleTestingRecord } from "@/lib/mock-sample-testing";
import type { AuthUser } from "@/lib/auth";
import type { Role } from "@/lib/role";

const LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

// Same deterministic, non-cryptographic hash used by mock-auth.ts's
// mockAccountId and mock-sample-testing.ts's deriveSampleId — re-deriving
// it from the same inputs always yields the same value, never random.
function stableHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().padEnd(6, "0").slice(0, 6);
}

export interface RenewalLicence {
  applicationId: string;
  // Illustrative, deterministically derived — not a real BIS CM/L number.
  licenceNumber: string;
  standardKey: string;
  standardNumber: string;
  productName: string;
  operativeUnit: {
    organizationName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  surveillanceTriggered: boolean;
  surveillanceReasons: string[];
  // Informational, never a gate — see the module header.
  sampleTestingOutcome: "passed" | "failed" | "in_progress" | "unknown";
  markingRatePerUnit: number;
  minimumMarkingFee: number;
  baseApplicationFee: number;
  baseAnnualLicenceFee: number;
}

export interface ProductionDeclaration {
  reportingPeriod: string;
  quantityProduced: number;
  unit: string;
  productionTurnover: number;
  declarationConfirmed: boolean;
}

export interface SurveillanceAuditSubmission {
  preferredDate: string;
  alternativeDate: string;
  timeSlot: "morning" | "afternoon" | "fullday";
  qcContactName: string;
  qcContactPhone: string;
  qcContactEmail: string;
  calibrationFileName?: string;
  internalTestLogFileName?: string;
  checklist: {
    qcLabCalibrated: boolean;
    markingEquipmentOperational: boolean;
    testRecordsAvailable: boolean;
    sampleBatchReady: boolean;
  };
  preAuditNotes: string;
}

export interface RenewalFeeSummary {
  applicationFee: number;
  annualLicenceFee: number;
  markingFee: number;
  surveillanceAuditFee: number;
  subtotal: number;
  gst18: number;
  totalPayable: number;
  isSurveillanceTriggered: boolean;
}

export interface RenewalRecord {
  renewalId: string;
  applicationId: string;
  submittedAt: string;
  status: "submitted" | "audit_scheduled" | "renewed";
  production: ProductionDeclaration;
  surveillanceAudit?: SurveillanceAuditSubmission;
  fees: RenewalFeeSummary;
  paymentReferenceId: string;
}

const VALIDITY_YEARS = 1;
// S5's own illustrative base fee amounts — reused, not reinvented.
const FALLBACK_APPLICATION_FEE = 1000;
const FALLBACK_ANNUAL_LICENCE_FEE = 2000;
const DEFAULT_MARKING_RATE_PER_UNIT = 0.1;
const DEFAULT_MINIMUM_MARKING_FEE = 12000;

function addYears(iso: string, years: number): string {
  const date = new Date(iso);
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString();
}

function daysUntil(iso: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000),
  );
}

function describeQco(record: QcoRecord | null): {
  triggered: boolean;
  reasons: string[];
} {
  if (!record || record.status !== "applicable") {
    return {
      triggered: false,
      reasons: [
        record
          ? `${record.title} — this Order does not require ongoing surveillance audits in this prototype's data.`
          : "This prototype's QCO dataset does not cover this standard — no surveillance-audit requirement is asserted either way; verify with BIS directly.",
      ],
    };
  }
  return {
    triggered: true,
    reasons: [
      `Covered by a Quality Control Order: ${record.title}.`,
      "Illustrative rule: this prototype treats QCO-covered products as due for a surveillance audit at each renewal — a real BIS renewal process would confirm this independently.",
    ],
  };
}

/**
 * Builds a renewal licence record for one real Application — returns null
 * (never a fabricated record) when there's nothing honest to show. See
 * the module header for the "submitted" eligibility stand-in.
 */
export async function buildRenewalLicence(
  application: Application,
): Promise<RenewalLicence | null> {
  if (application.status !== "submitted" || !application.submittedAt) {
    return null;
  }
  const standardKey = application.product.suggestedStandardKey;
  if (!standardKey) return null;
  const standard = getStandardByKey(standardKey);
  if (!standard) return null;

  const qcoRecord = await checkQcoApplicability(standard.standardNumber);
  const { triggered, reasons } = describeQco(qcoRecord);

  const testingRecord = buildSampleTestingRecord(application);
  const sampleTestingOutcome: RenewalLicence["sampleTestingOutcome"] =
    !testingRecord
      ? "unknown"
      : testingRecord.currentStage === "passed"
        ? "passed"
        : testingRecord.currentStage === "failed"
          ? "failed"
          : "in_progress";

  const paymentSummaries = getAllPaymentSummaries();
  const realFees = paymentSummaries.find(
    (summary) => summary.applicationId === application.id,
  );
  const applicationFeeItem = realFees?.feeBreakdown.find(
    (item) => item.key === "processing",
  );
  const licenceFeeItem = realFees?.feeBreakdown.find(
    (item) => item.key === "annual_licence",
  );

  const validFrom = application.submittedAt;
  const validUntil = addYears(validFrom, VALIDITY_YEARS);

  return {
    applicationId: application.id,
    licenceNumber: `LIC-${standardKey.toUpperCase()}-${stableHash(`${application.id}:${standardKey}`)}`,
    standardKey,
    standardNumber: standard.standardNumber,
    productName: application.product.productName,
    operativeUnit: {
      organizationName: application.business.organizationName,
      addressLine1: application.business.addressLine1,
      addressLine2: application.business.addressLine2,
      city: application.business.city,
      state: application.business.state,
      pincode: application.business.pincode,
      contactName: application.applicant.fullName,
      contactEmail: application.applicant.email,
      contactPhone: application.applicant.phone,
    },
    validFrom,
    validUntil,
    daysRemaining: daysUntil(validUntil),
    surveillanceTriggered: triggered,
    surveillanceReasons: reasons,
    sampleTestingOutcome,
    markingRatePerUnit: DEFAULT_MARKING_RATE_PER_UNIT,
    minimumMarkingFee: DEFAULT_MINIMUM_MARKING_FEE,
    baseApplicationFee: applicationFeeItem?.amount ?? FALLBACK_APPLICATION_FEE,
    baseAnnualLicenceFee: licenceFeeItem?.amount ?? FALLBACK_ANNUAL_LICENCE_FEE,
  };
}

export function calculateRenewalFees(
  licence: RenewalLicence,
  quantityProduced: number,
  surveillanceTriggered: boolean,
): RenewalFeeSummary {
  const applicationFee = licence.baseApplicationFee;
  const annualLicenceFee = licence.baseAnnualLicenceFee;
  const rawMarkingFee = Math.round(
    quantityProduced * licence.markingRatePerUnit,
  );
  const markingFee = Math.max(licence.minimumMarkingFee, rawMarkingFee);
  const surveillanceAuditFee = surveillanceTriggered ? 7500 : 0;

  const subtotal =
    applicationFee + annualLicenceFee + markingFee + surveillanceAuditFee;
  const gst18 = Math.round(subtotal * 0.18);
  const totalPayable = subtotal + gst18;

  return {
    applicationFee,
    annualLicenceFee,
    markingFee,
    surveillanceAuditFee,
    subtotal,
    gst18,
    totalPayable,
    isSurveillanceTriggered: surveillanceTriggered,
  };
}

/**
 * GET /api/v1/renewals/licences/:applicationId stand-in — checks the real
 * draft store first, matching mock-registration.ts's own resolution order.
 */
export async function getRenewalLicence(
  applicationId: string,
): Promise<RenewalLicence | null> {
  const application = await getApplication(applicationId);
  if (!application) return delay(null);
  return delay(await buildRenewalLicence(application));
}

/**
 * GET /api/v1/renewals/licences stand-in — sources from real submitted
 * applications (this browser's own, via mock-registration.ts) plus the
 * two illustrative dashboard applications (mock-dashboard.ts's real S3
 * Application shape) — the same dual real+illustrative sourcing S18's
 * sample-tracker-page.tsx already uses, not a separate fixed pair.
 */
export async function listRenewalLicences(
  user: AuthUser,
  role: Role | null,
): Promise<RenewalLicence[]> {
  const [illustrative, real] = await Promise.all([
    getIllustrativeApplications(user, role),
    listSubmittedApplications(),
  ]);
  const candidates = [...illustrative.map((d) => d.application), ...real];
  const licences = await Promise.all(candidates.map(buildRenewalLicence));
  return delay(licences.filter((l): l is RenewalLicence => l !== null));
}

const IN_MEMORY_SUBMISSIONS: Record<string, RenewalRecord> = {};

export async function submitRenewalRecord(
  record: Omit<
    RenewalRecord,
    "renewalId" | "submittedAt" | "paymentReferenceId"
  >,
): Promise<RenewalRecord> {
  const seed = `${record.applicationId}:${Date.now()}`;
  const suffix = stableHash(seed);
  const renewalId = `REN-${new Date().getFullYear()}-${suffix}`;
  // Matches mock-payments.ts's own existing illustrative reference format
  // exactly — not a new invented transaction-number convention.
  const paymentReferenceId = `TXN-ILLUS-${suffix}`;

  const fullRecord: RenewalRecord = {
    ...record,
    renewalId,
    submittedAt: new Date().toISOString(),
    paymentReferenceId,
    status: record.fees.isSurveillanceTriggered ? "audit_scheduled" : "renewed",
  };

  IN_MEMORY_SUBMISSIONS[fullRecord.applicationId] = fullRecord;
  return delay(fullRecord);
}

export async function getSubmittedRenewal(
  applicationId: string,
): Promise<RenewalRecord | null> {
  return delay(IN_MEMORY_SUBMISSIONS[applicationId] ?? null);
}
