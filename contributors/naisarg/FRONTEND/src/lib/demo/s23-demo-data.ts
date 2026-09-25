/**
 * S23 — License Suspension / Cancellation Notice & Remediation Flow Demo Data (SIH 2026).
 * Provides structured, authoritative legal notice and remediation tracking for Apex Engineering.
 * Strictly presents facts from official BIS orders; no speculative or generic legal advice.
 */

import {
  CANONICAL_DEMO_APPLICATION_ID,
  CANONICAL_DEMO_CERTIFICATE_NUMBER,
  CANONICAL_DEMO_COMPANY,
  CANONICAL_DEMO_PRODUCT,
  CANONICAL_DEMO_STANDARD,
  DEMO_OFFICIAL_SOURCE,
} from "./demo-context";

export type NoticeType =
  | "SUSPENSION_NOTICE"
  | "SHOW_CAUSE_NOTICE"
  | "STOP_MARKING_ORDER"
  | "CANCELLATION_NOTICE"
  | "REINSTATEMENT_ORDER";

export type NoticeStatus =
  | "NOTICE_ISSUED"
  | "SUSPENDED"
  | "REMEDIATION_REQUIRED"
  | "REMEDIATION_SUBMITTED"
  | "UNDER_REVIEW"
  | "REINSTATED"
  | "CANCELLED"
  | "CLOSED";

export interface NoticeEvidenceRequirement {
  id: string;
  title: string;
  description: string;
  category: "RCA_CAPA" | "TEST_REPORT" | "CALIBRATION" | "PROCESS_CHANGE" | "AFFIDAVIT";
  isMandatory: boolean;
  uploadedDocumentId?: string;
  uploadedDocumentName?: string;
  cortexVerified?: boolean;
  cortexScore?: number;
  cortexSummary?: string;
  status: "PENDING" | "UPLOADED" | "VERIFIED";
}

export interface NoticeTimelineEntry {
  id: string;
  date: string;
  status: NoticeStatus;
  title: string;
  description: string;
  actor: "BIS_AUTHORITY" | "APPLICANT" | "ACCREDITED_LAB" | "SYSTEM";
  officialReference?: string;
}

export interface LicenseNotice {
  id: string;
  noticeNumber: string;
  noticeType: NoticeType;
  status: NoticeStatus;
  certificateNumber: string;
  applicationId?: string;
  productName: string;
  modelNumber: string;
  standardNumber: string;
  standardTitle: string;
  effectiveDate: string; // ISO string
  remediationDeadline: string; // ISO string
  officialOrderRef: string;
  issuingAuthority: string;
  issuingBranch: string;
  signatoryOfficer: string;
  reasonSummary: string;
  officialExplanation: string;
  affectedScopeSummary: string;
  immediateDirectives: string[];
  remediationRequirements: NoticeEvidenceRequirement[];
  timeline: NoticeTimelineEntry[];
  appealEligible: boolean;
  appealWindowDays?: number;
  appealRoute?: string;
  isDemo: boolean;
}

const now = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

export const S23_CANONICAL_LICENSE_NOTICES: LicenseNotice[] = [
  {
    id: "lic-notice-2026-01",
    noticeNumber: "NOTIF/RO-DEL/2026/8842109-S1",
    noticeType: "SUSPENSION_NOTICE",
    status: "REMEDIATION_REQUIRED",
    certificateNumber: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    applicationId: CANONICAL_DEMO_APPLICATION_ID,
    productName: CANONICAL_DEMO_PRODUCT.productName,
    modelNumber: CANONICAL_DEMO_PRODUCT.modelNumber,
    standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
    standardTitle: CANONICAL_DEMO_STANDARD.standardTitle,
    effectiveDate: formatDate(-3),
    remediationDeadline: formatDate(9),
    officialOrderRef: "BIS/RO-DEL/LIC/8842109/2026/04",
    issuingAuthority: "Bureau of Indian Standards — Northern Regional Office",
    issuingBranch: "Delhi Branch Office-II, Manak Bhavan",
    signatoryOfficer: "Shri S. K. Mahapatra, Scientist-F & Deputy Director General",
    reasonSummary:
      "Temporary suspension of Standard Mark (ISI) license due to surveillance sample failure under IS 14543:2018 Clause 8.3 (High Voltage Dielectric Breakdown) and pending calibration trace submissions.",
    officialExplanation:
      "Official order states: 'Whereas market surveillance sample of Submersible Water Pump Model SWP-500 bearing Licence LIC-8842109 failed dielectric withstand test at 1.45 kV, and whereas the licensee failed to furnish equipment recalibration logs within statutory notice period, the competent authority hereby directs the licensee to stop applying the Standard Mark with immediate effect pending satisfactory remediation.'",
    affectedScopeSummary:
      "All domestic and commercial dispatch of Model APEX-HYDRO SWP-500 bearing the ISI mark is suspended. Does not affect secondary registration APP-2026-9904.",
    immediateDirectives: [
      "Cease applying the BIS Standard Mark (ISI) to newly manufactured units of Model SWP-500 immediately.",
      "Identify, segregate, and quarantine all unsold inventory belonging to Batch #2026-B12 in secure bonded storage.",
      "Furnish a formal statement of stock currently held at plant and distributor hubs within 7 days of notice receipt.",
      "Submit comprehensive Corrective and Preventive Action (CAPA) with root cause determination within 21 days.",
      "Schedule accredited witness re-testing of 5 consecutively manufactured replacement units.",
    ],
    remediationRequirements: [
      {
        id: "rem-req-01",
        title: "Root Cause Analysis (RCA) & 8D CAPA Report",
        description:
          "Comprehensive engineering investigation identifying whether dielectric failure arose from winding enamel abrasion, stator potting void, or moisture ingress.",
        category: "RCA_CAPA",
        isMandatory: true,
        status: "PENDING",
      },
      {
        id: "rem-req-02",
        title: "NABL Calibration Certificate for Megohmmeter & HV Rig",
        description:
          "Traceable calibration record verifying accuracy of high-voltage dielectric withstand test equipment up to 3 kV.",
        category: "CALIBRATION",
        isMandatory: true,
        status: "PENDING",
      },
      {
        id: "rem-req-03",
        title: "Batch Quarantine & Inventory Segregation Declaration",
        description:
          "Signed affidavit by Authorized Signatory confirming physical segregation of Batch #2026-B12 with warehouse inspection seal.",
        category: "AFFIDAVIT",
        isMandatory: true,
        uploadedDocumentId: "doc-quarantine-affidavit",
        uploadedDocumentName: "Batch_Quarantine_Affidavit_Signed.pdf",
        cortexVerified: true,
        cortexScore: 96,
        cortexSummary: "Affidavit complies with Form IV statutory segregation declaration format.",
        status: "UPLOADED",
      },
      {
        id: "rem-req-04",
        title: "Revised Quality Control & Testing Procedure Manual",
        description:
          "Updated Standard Operating Procedure (SOP) incorporating continuous inline dielectric breakdown voltage checks.",
        category: "PROCESS_CHANGE",
        isMandatory: false,
        status: "PENDING",
      },
      {
        id: "rem-req-05",
        title: "NABL Re-Test Report for Replacement Production Batch",
        description:
          "Independent laboratory test report confirming zero breakdown at 2.0 kV for 60 seconds on 5 new production samples.",
        category: "TEST_REPORT",
        isMandatory: true,
        status: "PENDING",
      },
    ],
    timeline: [
      {
        id: "time-01",
        date: formatDate(-5),
        status: "NOTICE_ISSUED",
        title: "Surveillance Non-Conformance Issued",
        description: "Official test failure report communicated by Central Marks Department.",
        actor: "BIS_AUTHORITY",
        officialReference: "BIS/CMD-II/SURV/2026/891",
      },
      {
        id: "time-02",
        date: formatDate(-3),
        status: "SUSPENDED",
        title: "Temporary Stop-Marking Notice Effective",
        description:
          "Formal order issued under Section 14 of BIS Act 2016 placing LIC-8842109 in suspended status.",
        actor: "BIS_AUTHORITY",
        officialReference: "BIS/RO-DEL/LIC/8842109/2026/04",
      },
      {
        id: "time-03",
        date: formatDate(-1),
        status: "REMEDIATION_REQUIRED",
        title: "Quarantine Declaration Uploaded",
        description:
          "Signed warehouse quarantine affidavit submitted by Rahul Sharma (Managing Director).",
        actor: "APPLICANT",
      },
    ],
    appealEligible: true,
    appealWindowDays: 30,
    appealRoute: "/appeals",
    isDemo: true,
  },
  {
    id: "lic-notice-2024-02",
    noticeNumber: "NOTIF/RO-DEL/2024/7731204-SC",
    noticeType: "SHOW_CAUSE_NOTICE",
    status: "REINSTATED",
    certificateNumber: "LIC-7731204",
    productName: "APEX Domestic Centrifugal Water Pump",
    modelNumber: "CP-200",
    standardNumber: "IS 9283:2013",
    standardTitle: "Motors for Submersible Pump Sets",
    effectiveDate: "2024-08-10T00:00:00.000Z",
    remediationDeadline: "2024-09-10T00:00:00.000Z",
    officialOrderRef: "BIS/RO-DEL/REINST/2024/99",
    issuingAuthority: "Bureau of Indian Standards — Northern Regional Office",
    issuingBranch: "Delhi Branch Office-I",
    signatoryOfficer: "Dr. Sunita Rao, Scientist-E",
    reasonSummary:
      "Historical show-cause notice regarding label print legibility and embossing depth. Fully resolved following corrective stamping die replacement.",
    officialExplanation:
      "Official record confirms: Licensee successfully replaced worn marking die and demonstrated compliant embossing depth of 0.4mm under surveillance re-inspection.",
    affectedScopeSummary: "Historical record — license is in full normal standing.",
    immediateDirectives: [],
    remediationRequirements: [],
    timeline: [
      {
        id: "time-hist-01",
        date: "2024-08-10T00:00:00.000Z",
        status: "NOTICE_ISSUED",
        title: "Show Cause Notice Issued",
        description: "Observation on marking die wear during routine market sample audit.",
        actor: "BIS_AUTHORITY",
      },
      {
        id: "time-hist-02",
        date: "2024-09-02T00:00:00.000Z",
        status: "REMEDIATION_SUBMITTED",
        title: "Corrective Tooling Proof Submitted",
        description: "Replacement laser-etched marking punch samples furnished to branch office.",
        actor: "APPLICANT",
      },
      {
        id: "time-hist-03",
        date: "2024-09-18T00:00:00.000Z",
        status: "REINSTATED",
        title: "Full Reinstatement Order Executed",
        description: "Official clearance letter issued closing surveillance action.",
        actor: "BIS_AUTHORITY",
        officialReference: "BIS/RO-DEL/REINST/2024/99",
      },
    ],
    appealEligible: false,
    isDemo: true,
  },
];
