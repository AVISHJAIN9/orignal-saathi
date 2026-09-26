/**
 * S20 — In-App Calendar & Compliance Reminder Demo Data (SIH 2026).
 * Demonstrates a consolidated compliance calendar aggregating deadlines,
 * officer visits, audits, payment due dates, and certificate renewals for Apex Engineering.
 */

import {
  CANONICAL_DEMO_APPLICATION_ID,
  CANONICAL_DEMO_CERTIFICATE_NUMBER,
  CANONICAL_DEMO_COMPANY,
  CANONICAL_DEMO_PRODUCT,
  CANONICAL_DEMO_STANDARD,
  DEMO_DISCLAIMER_LABEL,
  DEMO_OFFICIAL_SOURCE,
} from "./demo-context";

export type CalendarEventType =
  | "APPLICATION_DEADLINE"
  | "DOCUMENT_DEADLINE"
  | "PAYMENT_DUE"
  | "FACTORY_AUDIT"
  | "OFFICER_VISIT"
  | "APPEAL_DEADLINE"
  | "CERTIFICATE_EXPIRY"
  | "REGULATORY_CHANGE"
  | "REMINDER";

export type EventPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type EventStatus =
  | "UPCOMING"
  | "ACTION_REQUIRED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUE";

export interface CalendarReminderConfig {
  enabled: boolean;
  notifyDaysBefore: number[]; // e.g. [1, 3, 7]
  channel: "IN_APP" | "EMAIL" | "BOTH";
  lastNotifiedAt?: string;
}

export interface ComplianceCalendarEvent {
  id: string;
  title: string;
  description: string;
  eventType: CalendarEventType;
  startDate: string; // ISO string or YYYY-MM-DD
  endDate?: string;
  allDay: boolean;
  status: EventStatus;
  priority: EventPriority;
  relatedApplication?: string;
  relatedStandard?: string;
  relatedCertificate?: string;
  source: string;
  deepLink?: string;
  deepLinkText?: string;
  reminder: CalendarReminderConfig;
  isDemo: boolean;
  metadata?: {
    location?: string;
    assignedOfficer?: string;
    amountDue?: string;
    statutoryClause?: string;
  };
}

// Generate dates dynamically relative to current date for evergreen SIH demo evaluation
const now = new Date();
const formatDate = (daysOffset: number, hours = 10, minutes = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const S20_CANONICAL_CALENDAR_EVENTS: ComplianceCalendarEvent[] = [
  {
    id: "evt-cal-001",
    title: "Pre-Certification Technical Factory Audit",
    description:
      "On-site factory scrutiny by BIS Delhi Branch Office-II team covering manufacturing lines, in-house lab, and sample selection.",
    eventType: "FACTORY_AUDIT",
    startDate: formatDate(3, 10, 0),
    endDate: formatDate(3, 17, 0),
    allDay: false,
    status: "ACTION_REQUIRED",
    priority: "CRITICAL",
    relatedApplication: CANONICAL_DEMO_APPLICATION_ID,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    relatedCertificate: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/factory-audits",
    deepLinkText: "Open Audit Coordination Portal",
    reminder: {
      enabled: true,
      notifyDaysBefore: [1, 3],
      channel: "BOTH",
    },
    isDemo: true,
    metadata: {
      location: CANONICAL_DEMO_COMPANY.plantLocation,
      assignedOfficer: "Er. Rajesh Kumar, Joint Director (BIS Delhi BO-II)",
      statutoryClause: "BIS Act 2016 Section 13(2)",
    },
  },
  {
    id: "evt-cal-002",
    title: "Surveillance Sample Test Fee Due",
    description:
      "Statutory annual surveillance testing charge payable through manakonline portal for submersible water pump batch.",
    eventType: "PAYMENT_DUE",
    startDate: formatDate(7, 23, 59),
    allDay: true,
    status: "UPCOMING",
    priority: "HIGH",
    relatedApplication: CANONICAL_DEMO_APPLICATION_ID,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/business-account",
    deepLinkText: "View Account & Payment Status",
    reminder: {
      enabled: true,
      notifyDaysBefore: [3, 7],
      channel: "IN_APP",
    },
    isDemo: true,
    metadata: {
      amountDue: "₹ 14,750 (incl. 18% GST)",
      statutoryClause: "BIS (Conformity Assessment) Reg. 2018",
    },
  },
  {
    id: "evt-cal-003",
    title: "Raw Material Test Certificate Resubmission Deadline",
    description:
      "Mandatory upload of NABL test report for stainless steel impeller rotor under Document Scrutiny deficiency notice.",
    eventType: "DOCUMENT_DEADLINE",
    startDate: formatDate(5, 18, 0),
    allDay: false,
    status: "ACTION_REQUIRED",
    priority: "CRITICAL",
    relatedApplication: CANONICAL_DEMO_APPLICATION_ID,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/document-corrections",
    deepLinkText: "Upload Corrected Document",
    reminder: {
      enabled: true,
      notifyDaysBefore: [1, 2],
      channel: "BOTH",
    },
    isDemo: true,
    metadata: {
      statutoryClause: "Regulation 6(3) Deficiency Notice",
    },
  },
  {
    id: "evt-cal-004",
    title: "BIS Officer Visit: Initial Plant Scrutiny",
    description:
      "Verification of cleanroom water packaging lines and plant environmental control facilities.",
    eventType: "OFFICER_VISIT",
    startDate: formatDate(12, 11, 0),
    endDate: formatDate(12, 15, 30),
    allDay: false,
    status: "UPCOMING",
    priority: "HIGH",
    relatedApplication: CANONICAL_DEMO_APPLICATION_ID,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/officer-visits",
    deepLinkText: "View Officer Visit Logs",
    reminder: {
      enabled: true,
      notifyDaysBefore: [3, 7],
      channel: "IN_APP",
    },
    isDemo: true,
    metadata: {
      location: CANONICAL_DEMO_COMPANY.plantLocation,
      assignedOfficer: "Dr. Sunita Rao, Scrutinizing Officer",
    },
  },
  {
    id: "evt-cal-005",
    title: "Scrutiny Clarification Appeal Hearing / Response Window",
    description:
      "Final window to submit appellate grounds against provisional observation on Scheme I testing duration.",
    eventType: "APPEAL_DEADLINE",
    startDate: formatDate(16, 17, 0),
    allDay: false,
    status: "UPCOMING",
    priority: "MEDIUM",
    relatedApplication: CANONICAL_DEMO_APPLICATION_ID,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/appeals",
    deepLinkText: "View Appeals & Disputes",
    reminder: {
      enabled: false,
      notifyDaysBefore: [1],
      channel: "IN_APP",
    },
    isDemo: true,
    metadata: {
      statutoryClause: "BIS Act Section 15 Appellate Review",
    },
  },
  {
    id: "evt-cal-006",
    title: "BIS Certification Renewal Due (LIC-8842109)",
    description:
      "License LIC-8842109 validity extension application and renewal fee submission deadline.",
    eventType: "CERTIFICATE_EXPIRY",
    startDate: formatDate(35, 23, 59),
    allDay: true,
    status: "UPCOMING",
    priority: "HIGH",
    relatedCertificate: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/certificates",
    deepLinkText: "View Certificate & Renew",
    reminder: {
      enabled: true,
      notifyDaysBefore: [7, 14, 30],
      channel: "BOTH",
    },
    isDemo: true,
    metadata: {
      statutoryClause: "Regulation 8 License Renewal",
    },
  },
  {
    id: "evt-cal-007",
    title: "Mandatory Effective Date: Revised Water Pump QCO 2026",
    description:
      "Quality Control Order enforcing revised energy efficiency thresholds and locked-rotor thermal cut-off compliance.",
    eventType: "REGULATORY_CHANGE",
    startDate: formatDate(21, 0, 0),
    allDay: true,
    status: "UPCOMING",
    priority: "CRITICAL",
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/regulatory-alerts",
    deepLinkText: "Review Regulatory Alert",
    reminder: {
      enabled: true,
      notifyDaysBefore: [3, 7],
      channel: "BOTH",
    },
    isDemo: true,
    metadata: {
      statutoryClause: "Ministry of Consumer Affairs Gazette Notification S.O. 1142(E)",
    },
  },
  {
    id: "evt-cal-008",
    title: "Corrective Action Plan (CAPA) Submission Deadline",
    description:
      "Formal submission of Root Cause Analysis and dielectric test remediation in response to suspension notice.",
    eventType: "APPLICATION_DEADLINE",
    startDate: formatDate(9, 18, 0),
    allDay: false,
    status: "ACTION_REQUIRED",
    priority: "CRITICAL",
    relatedCertificate: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: DEMO_OFFICIAL_SOURCE,
    deepLink: "/license-actions",
    deepLinkText: "Open Remediation Flow",
    reminder: {
      enabled: true,
      notifyDaysBefore: [1, 3],
      channel: "BOTH",
    },
    isDemo: true,
    metadata: {
      statutoryClause: "Enforcement Order Ref #BIS/RO-DEL/LIC/8842109/2026/04",
    },
  },
  {
    id: "evt-cal-009",
    title: "Quarterly Internal Calibration Check",
    description:
      "Internal reminder set by QA lead Vikram Singh: Verify hydrostatic pressure gauges and megohmmeter calibration.",
    eventType: "REMINDER",
    startDate: formatDate(1, 9, 30),
    allDay: false,
    status: "UPCOMING",
    priority: "LOW",
    relatedStandard: CANONICAL_DEMO_STANDARD.standardNumber,
    source: "User Internal Workspace Reminder",
    deepLink: "/conformity",
    deepLinkText: "Check Conformity Workbench",
    reminder: {
      enabled: true,
      notifyDaysBefore: [1],
      channel: "IN_APP",
    },
    isDemo: true,
  },
];
