import {
  CANONICAL_S10_CERTIFICATES,
  DEMO_DISCLAIMER_LABEL,
  DEMO_OFFICIAL_SOURCE,
  DEMO_WATERMARK_TEXT,
} from "./demo-context";
import type { BISCertificate } from "../certificates-api";

export type MilestoneKey =
  | "ISSUED"
  | "REMINDER_90D"
  | "REMINDER_30D"
  | "REMINDER_7D"
  | "EXPIRY"
  | "RENEWED";

export interface RenewalMilestone {
  id: string;
  milestoneKey: MilestoneKey;
  title: string;
  targetDate: string; // ISO date
  daysBeforeExpiry: number;
  status: "COMPLETED" | "CURRENT" | "UPCOMING" | "OVERDUE";
  description: string;
  recommendedAction: string;
  completedAt?: string;
  deliveryChannel: "EMAIL_AND_IN_APP" | "IN_APP_ONLY" | "SMS_AND_IN_APP";
  notificationKey?: string; // G6 notification reference
}

export interface LicenseRenewalItem {
  id: string;
  certificateNumber: string;
  certificateId: string;
  applicationId: string;
  productName: string;
  modelNumber: string;
  standardNumber: string;
  standardTitle: string;
  grantingBranch: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  currentMilestone: MilestoneKey;
  renewalStatus: "ON_TRACK" | "ACTION_REQUIRED" | "CRITICAL_WINDOW" | "UNDER_RENEWAL" | "EXPIRED";
  recommendedNextAction: string;
  feeStatus: "PAID" | "PENDING" | "NOT_DUE";
  surveillanceAuditStatus: "COMPLETED" | "SCHEDULED" | "PENDING_REPORT";
  milestones: RenewalMilestone[];
  isDemo: boolean;
  demoWatermark: string;
}

/**
 * Derives statutory 90/30/7-day renewal timeline milestones directly from an S10 BISCertificate.
 * Adheres strictly to the official BIS renewal window (90, 30, and 7 days before expiry).
 * Ensures S11 reuses S10 records with zero duplicate or parallel datasets.
 */
export function deriveRenewalFromCertificate(cert: BISCertificate): LicenseRenewalItem {
  const expiry = new Date(cert.validUntil);
  const now = new Date();
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let currentMilestone: MilestoneKey = "ISSUED";
  let renewalStatus: LicenseRenewalItem["renewalStatus"] = "ON_TRACK";
  let recommendedNextAction = "Maintain routine internal quality assurance logs.";

  if (diffDays <= 0) {
    currentMilestone = "EXPIRY";
    renewalStatus = "EXPIRED";
    recommendedNextAction = "License validity expired. File urgent petition or renewal restoration in Appeals & Disputes.";
  } else if (diffDays <= 7) {
    currentMilestone = "REMINDER_7D";
    renewalStatus = "CRITICAL_WINDOW";
    recommendedNextAction = "Statutory 7-day grace window. Complete dispatch and bank verification immediately.";
  } else if (diffDays <= 30) {
    currentMilestone = "REMINDER_30D";
    renewalStatus = "ACTION_REQUIRED";
    recommendedNextAction = "Submit minimum marking fee deposit in Fee Invoices and finalize surveillance audit in Factory Audits.";
  } else if (diffDays <= 90) {
    currentMilestone = "REMINDER_90D";
    renewalStatus = "ACTION_REQUIRED";
    recommendedNextAction = "Initiate Form-IX renewal paperwork in your BIS application and review audit readiness in Factory Audits.";
  }

  const ms90Date = new Date(expiry.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const ms30Date = new Date(expiry.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const ms7Date = new Date(expiry.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const milestones: RenewalMilestone[] = [
    {
      id: `ms-${cert.id}-issued`,
      milestoneKey: "ISSUED",
      title: "Initial License Granted",
      targetDate: cert.issueDate,
      daysBeforeExpiry: 730,
      status: "COMPLETED",
      description: `Standard Mark license ${cert.certificateNumber} granted under ${cert.certificationScheme}.`,
      recommendedAction: "Maintain factory calibration logs and quality management records.",
      completedAt: cert.issueDate,
      deliveryChannel: "EMAIL_AND_IN_APP",
    },
    {
      id: `ms-${cert.id}-90d`,
      milestoneKey: "REMINDER_90D",
      title: "90-Day Renewal Window Opens",
      targetDate: ms90Date,
      daysBeforeExpiry: 90,
      status: diffDays <= 90 ? "COMPLETED" : "UPCOMING",
      description: "Statutory 90-day advisory window opens for documentation verification and audit review.",
      recommendedAction: "Initiate Form-IX renewal paperwork in your BIS application and check audit readiness in Factory Audits.",
      deliveryChannel: "EMAIL_AND_IN_APP",
      notificationKey: "n1",
    },
    {
      id: `ms-${cert.id}-30d`,
      milestoneKey: "REMINDER_30D",
      title: "30-Day Critical Notice",
      targetDate: ms30Date,
      daysBeforeExpiry: 30,
      status: diffDays <= 30 ? (diffDays <= 7 ? "COMPLETED" : "CURRENT") : "UPCOMING",
      description: "Final 30-day statutory notice. Settle annual marking fees and production records.",
      recommendedAction: "Generate fee invoice in Fee Invoices and verify surveillance audit checklist in Factory Audits.",
      deliveryChannel: "EMAIL_AND_IN_APP",
      notificationKey: "n7",
    },
    {
      id: `ms-${cert.id}-7d`,
      milestoneKey: "REMINDER_7D",
      title: "7-Day Urgent Expiry Notice",
      targetDate: ms7Date,
      daysBeforeExpiry: 7,
      status: diffDays <= 7 ? (diffDays <= 0 ? "COMPLETED" : "CURRENT") : "UPCOMING",
      description: "Immediate action mandatory to avoid cancellation of Standard Mark permission.",
      recommendedAction: "Verify dispatch of endorsement letter with regional branch office.",
      deliveryChannel: "SMS_AND_IN_APP",
    },
    {
      id: `ms-${cert.id}-expiry`,
      milestoneKey: "EXPIRY",
      title: "Statutory License Expiry",
      targetDate: cert.validUntil,
      daysBeforeExpiry: 0,
      status: diffDays <= 0 ? "OVERDUE" : "UPCOMING",
      description: "Certificate validity terminates at 23:59 IST.",
      recommendedAction: "Ensure renewed license certificate is verified and downloaded from Certificates.",
      deliveryChannel: "EMAIL_AND_IN_APP",
    },
    {
      id: `ms-${cert.id}-renewed`,
      milestoneKey: "RENEWED",
      title: "License Re-Endorsement",
      targetDate: new Date(expiry.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      daysBeforeExpiry: -1,
      status: cert.status === "ACTIVE" && diffDays > 90 ? "COMPLETED" : "UPCOMING",
      description: "Formal validity extension issued by Bureau of Indian Standards.",
      recommendedAction: "Update public packaging marking codes and download digital certificate from Certificates.",
      deliveryChannel: "EMAIL_AND_IN_APP",
    },
  ];

  return {
    id: `ren-${cert.id}`,
    certificateNumber: cert.certificateNumber,
    certificateId: cert.id,
    applicationId: cert.applicationNumber || cert.applicationId || "APP-2026-8841",
    productName: cert.productName,
    modelNumber: cert.modelNumber || "SWP-500",
    standardNumber: cert.standardNumber,
    standardTitle: cert.standardTitle,
    grantingBranch: cert.grantingBranch || "Delhi Branch Office-II",
    issueDate: cert.issueDate,
    expiryDate: cert.validUntil,
    daysRemaining: Math.max(0, diffDays),
    currentMilestone,
    renewalStatus,
    recommendedNextAction,
    feeStatus: diffDays <= 30 ? "PENDING" : "PAID",
    surveillanceAuditStatus: diffDays <= 30 ? "COMPLETED" : "SCHEDULED",
    milestones,
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
  };
}

/**
 * Authoritative Canonical S11 Renewal Schedule.
 * Derived 100% from CANONICAL_S10_CERTIFICATES to guarantee ZERO data divergence.
 */
export const S11_DEMO_RENEWALS: LicenseRenewalItem[] = CANONICAL_S10_CERTIFICATES.map(
  deriveRenewalFromCertificate
);
