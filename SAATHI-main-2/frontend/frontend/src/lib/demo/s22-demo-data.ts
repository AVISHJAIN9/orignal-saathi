/**
 * S22 — Product Recall / Non-Conformance Alert System Demo Data (SIH 2026).
 * High-trust authoritative alerts derived from official BIS surveillance and regulatory actions.
 * Explicitly source-backed; no speculative AI claims.
 */

import {
  CANONICAL_DEMO_APPLICATION_ID,
  CANONICAL_DEMO_CERTIFICATE_NUMBER,
  CANONICAL_DEMO_PRODUCT,
  CANONICAL_DEMO_STANDARD,
  DEMO_OFFICIAL_SOURCE,
} from "./demo-context";

export type RecallAlertType =
  | "PRODUCT_RECALL"
  | "NON_CONFORMANCE"
  | "SAFETY_ALERT"
  | "STANDARD_WITHDRAWAL"
  | "CERTIFICATION_ACTION"
  | "REGULATORY_ACTION";

export type RecallSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type RecallStatus =
  | "ACTIVE"
  | "ACTION_REQUIRED"
  | "UNDER_REMEDIATION"
  | "RESOLVED"
  | "CLOSED";

export interface OfficialAlertSource {
  authorityName: string;
  orderReferenceNumber: string;
  gazetteNotification?: string;
  publishedDate: string;
  sourceDocumentUrl?: string;
  officialOrderTitle: string;
}

export interface AffectedScopeDetails {
  productName: string;
  brandName: string;
  modelNumber: string;
  affectedBatches?: string[];
  manufacturingDateRange?: string;
  serialNumberRange?: string;
  standardNumber: string;
  standardClause?: string;
  certificateNumber?: string;
  estimatedUnitsAffected?: number;
}

export interface RecallAlert {
  id: string;
  alertNumber: string;
  alertType: RecallAlertType;
  severity: RecallSeverity;
  status: RecallStatus;
  title: string;
  whatHappened: string;
  whyItMatters: string;
  potentialImpact: string;
  affectedScope: AffectedScopeDetails;
  requiredAction: string;
  remediationDeadline: string; // ISO string
  detectedDate: string;
  effectiveDate: string;
  officialSource: OfficialAlertSource;
  remediationWorkflowId?: string; // Links to S23 license action notice
  complianceGapClause?: string; // Links to C3 conformity check
  isDemo: boolean;
}

const now = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

export const S22_CANONICAL_RECALL_ALERTS: RecallAlert[] = [
  {
    id: "rec-2026-001",
    alertNumber: "NC-DEL/2026/0891",
    alertType: "NON_CONFORMANCE",
    severity: "CRITICAL",
    status: "ACTION_REQUIRED",
    title: "Critical Dielectric Insulation Withstand Non-Conformance in Surveillance Batch #2026-B12",
    whatHappened:
      "Official BIS surveillance testing conducted on market sample of APEX-HYDRO SWP-500 (Batch #2026-B12) revealed dielectric breakdown at 1.45 kV, failing the statutory 2.0 kV minimum threshold stipulated under IS 14543:2018 Clause 8.3.",
    whyItMatters:
      "Insufficient electrical breakdown withstand presents an electric shock hazard when operating in submerged domestic borewells. BIS Central Marks Department has placed marking rights on temporary hold.",
    potentialImpact:
      "Batch #2026-B12 must be segregated immediately. Unsold units held at distributor warehouses cannot be commercialized until verified re-testing passes.",
    affectedScope: {
      productName: CANONICAL_DEMO_PRODUCT.productName,
      brandName: CANONICAL_DEMO_PRODUCT.brandName,
      modelNumber: CANONICAL_DEMO_PRODUCT.modelNumber,
      affectedBatches: ["BATCH-2026-B12"],
      manufacturingDateRange: "2026-06-01 to 2026-06-25",
      standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
      standardClause: "IS 14543:2018 Clause 8.3 (High Voltage Dielectric Strength)",
      certificateNumber: CANONICAL_DEMO_CERTIFICATE_NUMBER,
      estimatedUnitsAffected: 450,
    },
    requiredAction:
      "1. Immediate physical quarantine of Batch #2026-B12 in finished goods stores. 2. Submit formal Root Cause Analysis (RCA) and CAPA within 21 days. 3. Arrange accredited witness re-testing of 5 replacement units.",
    remediationDeadline: formatDate(9),
    detectedDate: formatDate(-5),
    effectiveDate: formatDate(-3),
    officialSource: {
      authorityName: "Bureau of Indian Standards — Central Marks Department-II",
      orderReferenceNumber: "BIS/CMD-II/SURV/2026/891",
      gazetteNotification: "BIS Act 2016 (Section 16 Orders)",
      publishedDate: formatDate(-3).split("T")[0],
      sourceDocumentUrl: "/orders/BIS_CMD_SURV_2026_891.pdf",
      officialOrderTitle: "Surveillance Non-Conformance Directive on Submersible Pumping Equipment",
    },
    remediationWorkflowId: "lic-notice-2026-01",
    complianceGapClause: "IS 14543:2018 Cl. 8.3",
    isDemo: true,
  },
  {
    id: "rec-2026-002",
    alertNumber: "SA-ADV/2026/044",
    alertType: "SAFETY_ALERT",
    severity: "HIGH",
    status: "ACTIVE",
    title: "Advisory on Thermal Overload Protection & Locked-Rotor Cut-Off Reliability",
    whatHappened:
      "BIS Technical Advisory Committee issued Safety Bulletin #44 instructing all Scheme I licensees for single-phase pumps to verify thermal cut-off relay response times under locked-rotor conditions (ambient 45°C).",
    whyItMatters:
      "Field failures observed in agricultural installations where defective bimetallic trip sensors caused winding burnouts and line surges during low voltage brownout conditions.",
    potentialImpact:
      "All licensees must review current thermal cut-off sensor supplier qualification and submit calibration certificates during next surveillance audit.",
    affectedScope: {
      productName: CANONICAL_DEMO_PRODUCT.productName,
      brandName: CANONICAL_DEMO_PRODUCT.brandName,
      modelNumber: CANONICAL_DEMO_PRODUCT.modelNumber,
      standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
      standardClause: "IS 14543:2018 Clause 11.2 (Thermal Overload & Stalling Protection)",
      certificateNumber: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    },
    requiredAction:
      "Conduct in-house locked-rotor temperature rise test on 2 production samples and retain test record for inspection.",
    remediationDeadline: formatDate(18),
    detectedDate: formatDate(-10),
    effectiveDate: formatDate(-8),
    officialSource: {
      authorityName: "Bureau of Indian Standards — Standardization Directorate (Electrotechnical)",
      orderReferenceNumber: "CIRC-2026-ETD-44",
      gazetteNotification: "Industry Technical Advisory Circular",
      publishedDate: formatDate(-8).split("T")[0],
      sourceDocumentUrl: "/circulars/CIRC_2026_ETD_44.pdf",
      officialOrderTitle: "Mandatory Quality Advisory on Submersible Motor Thermal Overload Relays",
    },
    complianceGapClause: "IS 14543:2018 Cl. 11.2",
    isDemo: true,
  },
  {
    id: "rec-2026-003",
    alertNumber: "SW-NOTIF/2026/112",
    alertType: "STANDARD_WITHDRAWAL",
    severity: "MEDIUM",
    status: "ACTIVE",
    title: "Phase-Out of Superseded Hydraulic Efficiency Test Rig Formula (Clause 6.2)",
    whatHappened:
      "Effective from the end of current quarter, the simplified empirical flow formula in Clause 6.2 is withdrawn. Electromagnetic flowmeter testing according to ISO 9906:2012 Grade 2B becomes solely recognized.",
    whyItMatters:
      "Laboratories continuing to calculate hydraulic pump efficiency using manual orifice plates will have their test data rejected during certification scrutiny.",
    potentialImpact:
      "Factory in-house test bench must update digital flowmeter telemetry firmware before next renewal audit.",
    affectedScope: {
      productName: CANONICAL_DEMO_PRODUCT.productName,
      brandName: CANONICAL_DEMO_PRODUCT.brandName,
      modelNumber: CANONICAL_DEMO_PRODUCT.modelNumber,
      standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
      standardClause: "IS 14543:2018 Clause 6.2 (Hydraulic Performance Measurement)",
    },
    requiredAction:
      "Verify calibration certificate of in-line electromagnetic flow sensor and ensure test bench software prints ISO 9906 compliant logs.",
    remediationDeadline: formatDate(25),
    detectedDate: formatDate(-15),
    effectiveDate: formatDate(-14),
    officialSource: {
      authorityName: "BIS Sectional Committee MED 20 (Pumps & Sump Units)",
      orderReferenceNumber: "BIS/MED-20/AMEND-02",
      publishedDate: formatDate(-14).split("T")[0],
      officialOrderTitle: "Technical Amendment to Flow Measurement Standards for Water Pumps",
    },
    isDemo: true,
  },
  {
    id: "rec-2026-004",
    alertNumber: "REC-2025/HIST-02",
    alertType: "PRODUCT_RECALL",
    severity: "HIGH",
    status: "RESOLVED",
    title: "Precautionary Batch Recall — Defective Impeller Keyway Tolerance (Resolved 2025)",
    whatHappened:
      "Internal quality audit in November 2025 identified defective machining in keyway tolerances for Batch #2025-A08 leading to potential shaft slippage.",
    whyItMatters:
      "Company proactively initiated quarantine and replacement of 120 distributed units in coordination with BIS Delhi Branch Office.",
    potentialImpact: "Successfully resolved with CAPA approved by BIS Branch Office in January 2026.",
    affectedScope: {
      productName: CANONICAL_DEMO_PRODUCT.productName,
      brandName: CANONICAL_DEMO_PRODUCT.brandName,
      modelNumber: "SWP-500",
      affectedBatches: ["BATCH-2025-A08"],
      standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
      estimatedUnitsAffected: 120,
    },
    requiredAction: "Recall successfully executed; closed in official BIS portal.",
    remediationDeadline: "2026-01-15T00:00:00.000Z",
    detectedDate: "2025-11-20T00:00:00.000Z",
    effectiveDate: "2025-11-22T00:00:00.000Z",
    officialSource: {
      authorityName: "Apex Engineering Quality Assurance & BIS Delhi BO-II",
      orderReferenceNumber: "BIS/RO-DEL/VOL-REC/2025/14",
      publishedDate: "2025-11-22",
      officialOrderTitle: "Voluntary Batch Rectification Compliance Completion Certificate",
    },
    isDemo: true,
  },
];
