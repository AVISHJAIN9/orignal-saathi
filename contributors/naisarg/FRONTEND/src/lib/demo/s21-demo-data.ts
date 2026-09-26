/**
 * S21 — Factory Audit Scheduling & Coordination Portal Demo Data (SIH 2026).
 * Provides comprehensive audit scheduling, preparation checklists, officer coordination,
 * and preparation workflows for Apex Engineering Pvt Ltd.
 */

import {
  CANONICAL_DEMO_APPLICATION_ID,
  CANONICAL_DEMO_CERTIFICATE_NUMBER,
  CANONICAL_DEMO_COMPANY,
  CANONICAL_DEMO_PRODUCT,
  CANONICAL_DEMO_STANDARD,
  CANONICAL_DEMO_USERS,
  DEMO_OFFICIAL_SOURCE,
} from "./demo-context";

export type AuditStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "RESCHEDULE_REQUESTED"
  | "RESCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "ACTION_REQUIRED";

export type AuditType =
  | "PRE_CERTIFICATION"
  | "SURVEILLANCE"
  | "SPECIAL_INVESTIGATION"
  | "VERIFICATION"
  | "RENEWAL";

export interface AuditOfficer {
  name: string;
  designation: string;
  department: string;
  branchOffice: string;
  email: string;
  phone: string;
  officialId: string;
}

export interface AuditPreparationItem {
  id: string;
  category: "EQUIPMENT" | "DOCUMENTS" | "FACILITY" | "PERSONNEL" | "SAMPLES";
  title: string;
  description: string;
  isReady: boolean;
  requiredForAudit: boolean;
  linkedDocumentId?: string;
  linkedDocumentName?: string;
  notes?: string;
  verifiedBy?: string;
}

export interface AuditRequiredDocument {
  id: string;
  title: string;
  category: string;
  status: "AVAILABLE" | "PENDING_UPDATE" | "DEFICIENT";
  vaultDocumentId?: string;
  vaultDocumentName?: string;
  lastUpdated?: string;
  cortexVerified?: boolean;
}

export interface AuditHistoryRecord {
  id: string;
  date: string;
  type: string;
  leadAuditor: string;
  outcome: "SATISFACTORY" | "MINOR_NON_CONFORMANCE" | "MAJOR_NON_CONFORMANCE";
  findingsCount: number;
  summary: string;
  reportUrl?: string;
}

export interface FactoryAudit {
  id: string;
  auditNumber: string;
  applicationId: string;
  certificateNumber?: string;
  productName: string;
  modelNumber: string;
  standardNumber: string;
  standardTitle: string;
  auditType: AuditType;
  status: AuditStatus;
  statusReason?: string;
  scheduledDate: string; // ISO string
  scheduledTime: string;
  estimatedDurationHours: number;
  plantAddress: string;
  plantCity: string;
  plantState: string;
  plantPincode: string;
  leadOfficer: AuditOfficer;
  coAuditors?: AuditOfficer[];
  scopeSummary: string;
  officialInstructions: string[];
  preparationItems: AuditPreparationItem[];
  requiredDocuments: AuditRequiredDocument[];
  priorAuditHistory: AuditHistoryRecord[];
  applicantNotes?: string;
  rescheduleRequest?: {
    requestedAt: string;
    reason: string;
    preferredDate1: string;
    preferredDate2?: string;
    officerNotes?: string;
  };
  attendanceConfirmedAt?: string;
  attendanceConfirmedBy?: string;
  officialOrderRef: string;
  isDemo: boolean;
}

const now = new Date();
const formatAuditDate = (daysOffset: number, hours = 10, minutes = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const S21_CANONICAL_FACTORY_AUDITS: FactoryAudit[] = [
  {
    id: "fa-2026-001",
    auditNumber: "AUD/DEL-II/2026/0418",
    applicationId: CANONICAL_DEMO_APPLICATION_ID,
    certificateNumber: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    productName: CANONICAL_DEMO_PRODUCT.productName,
    modelNumber: CANONICAL_DEMO_PRODUCT.modelNumber,
    standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
    standardTitle: CANONICAL_DEMO_STANDARD.standardTitle,
    auditType: "PRE_CERTIFICATION",
    status: "ACTION_REQUIRED",
    statusReason:
      "Pending attendance confirmation and completion of mandatory testing laboratory calibration verification.",
    scheduledDate: formatAuditDate(3, 10, 0),
    scheduledTime: "10:00 AM – 05:00 PM IST",
    estimatedDurationHours: 7,
    plantAddress: CANONICAL_DEMO_COMPANY.address,
    plantCity: CANONICAL_DEMO_COMPANY.city,
    plantState: CANONICAL_DEMO_COMPANY.state,
    plantPincode: CANONICAL_DEMO_COMPANY.pincode,
    leadOfficer: {
      name: "Er. Rajesh Kumar",
      designation: "Joint Director & Lead Technical Auditor",
      department: "Certification & Conformity Assessment Wing",
      branchOffice: "Delhi Branch Office-II, Bureau of Indian Standards",
      email: "rajesh.kumar@bis.gov.in",
      phone: "+91 11 2323 0131",
      officialId: "BIS-OFF-DEL-7429",
    },
    coAuditors: [
      {
        name: "Ms. Shalini Gupta",
        designation: "Assistant Director (Mechanical Testing)",
        department: "Central Marks Department-II",
        branchOffice: "Delhi BO-II",
        email: "shalini.g@bis.gov.in",
        phone: "+91 11 2323 0132",
        officialId: "BIS-OFF-DEL-8910",
      },
    ],
    scopeSummary:
      "Physical factory verification of manufacturing infrastructure, quality control test facility, calibrated instruments, and witnessing of complete prototype performance tests in accordance with IS 14543:2018.",
    officialInstructions: [
      "Ensure Technical Management and Testing In-Charge are present with authorized signatory credentials.",
      "The in-house testing laboratory must be operational with calibrated measuring devices and valid NABL calibration traces.",
      "Five random finished production units of APEX-HYDRO SWP-500 must be staged for drawing official surveillance/grant samples.",
      "Complete Batch Manufacturing Records (BMR) for the last 3 production batches must be produced during opening meeting.",
      "Safe protective equipment (PPE) must be provided for the visiting inspection team.",
    ],
    preparationItems: [
      {
        id: "prep-01",
        category: "EQUIPMENT",
        title: "Hydrostatic Pressure Test Rig Calibration",
        description:
          "Calibration master gauge certificate must be valid within past 12 months with traceable NABL seal.",
        isReady: true,
        requiredForAudit: true,
        linkedDocumentId: "doc-cal-rig-01",
        linkedDocumentName: "Hydrostatic_Test_Bench_Calibration_Certificate.pdf",
        verifiedBy: CANONICAL_DEMO_USERS.testingEngineer.fullName,
      },
      {
        id: "prep-02",
        category: "EQUIPMENT",
        title: "Digital Megohmmeter & Dielectric Test Set",
        description:
          "High voltage insulation breakdown tester verification up to 2.5 kV with trip-current calibration record.",
        isReady: false,
        requiredForAudit: true,
        notes: "Recalibration report pending upload from NABL vendor lab.",
      },
      {
        id: "prep-03",
        category: "DOCUMENTS",
        title: "Raw Material Stainless Steel Impeller Test Reports",
        description:
          "Mill test certificates and spectroscopic chemical analysis reports for SS-304 impellers.",
        isReady: false,
        requiredForAudit: true,
        linkedDocumentId: "doc-ss304-report",
        linkedDocumentName: "SS304_Impeller_Raw_Material_Test_Report.pdf",
        notes: "Linked to a pending request in Document Corrections.",
      },
      {
        id: "prep-04",
        category: "FACILITY",
        title: "Cleanroom Packaging & Environmental Dust Control",
        description:
          "HEPA filtration logbook and temperature/humidity sensor validation for final packaging bay.",
        isReady: true,
        requiredForAudit: false,
        verifiedBy: CANONICAL_DEMO_USERS.documentationLead.fullName,
      },
      {
        id: "prep-05",
        category: "SAMPLES",
        title: "5 Staged Finished Units of Model SWP-500",
        description:
          "Units packaged in commercial cartons with draft ISI marking labels ready for official sealing.",
        isReady: true,
        requiredForAudit: true,
        verifiedBy: CANONICAL_DEMO_USERS.testingEngineer.fullName,
      },
      {
        id: "prep-06",
        category: "PERSONNEL",
        title: "Qualified Quality Control In-Charge Presence",
        description:
          "Competency certificate, diploma, and appointment order of designated QC supervisor.",
        isReady: true,
        requiredForAudit: true,
        verifiedBy: CANONICAL_DEMO_USERS.owner.fullName,
      },
    ],
    requiredDocuments: [
      {
        id: "req-doc-01",
        title: "Scheme I Quality Manual & Control Plan",
        category: "Quality Assurance",
        status: "AVAILABLE",
        vaultDocumentId: "v-doc-qm-01",
        vaultDocumentName: "Apex_Scheme_I_Quality_Control_Manual_v2.pdf",
        lastUpdated: "2026-08-10",
        cortexVerified: true,
      },
      {
        id: "req-doc-02",
        title: "Plant Layout & Machinery Diagram",
        category: "Manufacturing",
        status: "AVAILABLE",
        vaultDocumentId: "v-doc-layout-01",
        vaultDocumentName: "Manesar_Plant_Machinery_Layout_Approved.pdf",
        lastUpdated: "2026-07-15",
        cortexVerified: true,
      },
      {
        id: "req-doc-03",
        title: "In-House Testing Facility Equipment List & Log",
        category: "Testing",
        status: "PENDING_UPDATE",
        vaultDocumentId: "v-doc-testlog-01",
        vaultDocumentName: "In_House_Test_Equipment_Log_2026.pdf",
        lastUpdated: "2026-08-28",
        cortexVerified: false,
      },
      {
        id: "req-doc-04",
        title: "Raw Material Stainless Steel Impeller MTC",
        category: "Procurement",
        status: "DEFICIENT",
        vaultDocumentId: "v-doc-mtc-01",
        vaultDocumentName: "Mill_Test_Certificate_SS304.pdf",
        lastUpdated: "2026-06-20",
        cortexVerified: false,
      },
    ],
    priorAuditHistory: [
      {
        id: "hist-01",
        date: "2025-11-14",
        type: "Preliminary Facility Scrutiny",
        leadAuditor: "Dr. Sunita Rao (AD, Delhi BO-II)",
        outcome: "SATISFACTORY",
        findingsCount: 1,
        summary:
          "Factory layout found compliant. Advised upgrading grounding connections in hydraulic testing test-bay before formal grant audit.",
        reportUrl: "/documents/audit-report-2025-11.pdf",
      },
    ],
    applicantNotes:
      "All preparation leads notified. Vikram Singh coordinating test-rig dry run on prior afternoon.",
    officialOrderRef: "BIS/RO-DEL/AUDIT-ORD/2026/8941",
    isDemo: true,
  },
  {
    id: "fa-2026-002",
    auditNumber: "AUD/DEL-II/2026/0612",
    applicationId: CANONICAL_DEMO_APPLICATION_ID,
    certificateNumber: CANONICAL_DEMO_CERTIFICATE_NUMBER,
    productName: "APEX-HYDRO High-Head Pump 2HP",
    modelNumber: "SWP-750-PRO",
    standardNumber: "IS 14543:2018",
    standardTitle: "Pumps & Water Supply Equipment Conformity",
    auditType: "SURVEILLANCE",
    status: "SCHEDULED",
    statusReason: "Routine annual market surveillance and factory check.",
    scheduledDate: formatAuditDate(24, 11, 0),
    scheduledTime: "11:00 AM – 04:00 PM IST",
    estimatedDurationHours: 5,
    plantAddress: CANONICAL_DEMO_COMPANY.address,
    plantCity: CANONICAL_DEMO_COMPANY.city,
    plantState: CANONICAL_DEMO_COMPANY.state,
    plantPincode: CANONICAL_DEMO_COMPANY.pincode,
    leadOfficer: {
      name: "Shri Alok Verma",
      designation: "Senior Inspection Officer",
      department: "Market Surveillance Division",
      branchOffice: "Delhi Branch Office-I",
      email: "alok.verma@bis.gov.in",
      phone: "+91 11 2323 0140",
      officialId: "BIS-OFF-DEL-5512",
    },
    scopeSummary:
      "Surveillance audit to verify continuous adherence to Scheme I marking guidelines, maintenance of daily test logs, and drawing of counter samples.",
    officialInstructions: [
      "Keep standard register of ISI marking serial numbers updated up to current date.",
      "Provide records of customer complaints and remedial actions taken during preceding 12 months.",
    ],
    preparationItems: [
      {
        id: "prep-surv-01",
        category: "DOCUMENTS",
        title: "Annual Production & Marking Register",
        description: "Monthly dispatch quantity statement bearing ISI mark.",
        isReady: true,
        requiredForAudit: true,
      },
      {
        id: "prep-surv-02",
        category: "EQUIPMENT",
        title: "Energy Efficiency Test Rig Verification",
        description: "Power meter calibration traceable to National Physical Laboratory (NPL).",
        isReady: true,
        requiredForAudit: true,
      },
    ],
    requiredDocuments: [
      {
        id: "req-doc-surv-01",
        title: "Annual Surveillance Marking Register",
        category: "Compliance",
        status: "AVAILABLE",
        vaultDocumentId: "v-doc-surv-01",
        vaultDocumentName: "Marking_Register_2025_2026.pdf",
        lastUpdated: "2026-08-01",
        cortexVerified: true,
      },
    ],
    priorAuditHistory: [],
    officialOrderRef: "BIS/SURV/DEL-I/2026/1209",
    isDemo: true,
  },
];
