import {
  CANONICAL_DEMO_COMPANY,
  DEMO_DISCLAIMER_LABEL,
  DEMO_OFFICIAL_SOURCE,
  DEMO_WATERMARK_TEXT,
} from "./demo-context";

export interface ManufacturingPlant {
  id: string; // e.g. "plant-manesar-01"
  code: string; // e.g. "PLANT-DEL-01"
  name: string;
  isPrimary: boolean;
  address: {
    line1: string;
    industrialArea: string;
    city: string;
    state: string;
    pincode: string;
    stateCode: string;
  };
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  jurisdictionBranch: string;
  
  // Licenses & Products
  licenses: {
    certificateNumber: string;
    standardNumber: string;
    standardTitle: string;
    productName: string;
    modelNumbers: string[];
    status: "ACTIVE" | "RENEWAL_DUE" | "SURVEILLANCE_PENDING" | "SUSPENDED";
    validUntil: string;
    daysToExpiry: number;
  }[];

  // Plant-specific compliance metrics
  complianceScore: number; // 0-100 percentage
  readinessRating: "OPTIMAL" | "ATTENTION_REQUIRED" | "HIGH_RISK";
  activeApplicationsCount: number;
  pendingGapsCount: number;
  openCorrectionsCount: number;
  
  // Factory Audits
  audits: {
    auditNumber: string;
    auditType: "PRE_LICENCE" | "PERIODIC_SURVEILLANCE" | "SPECIAL_INVESTIGATION";
    status: "SCHEDULED" | "COMPLETED" | "PENDING_REPORT";
    scheduledDate: string;
    leadAuditor: string;
  }[];

  isDemo: boolean;
  demoWatermark: string;
}

export const S26_DEMO_PLANTS: ManufacturingPlant[] = [
  {
    id: "plant-manesar-01",
    code: "PLANT-DEL-01",
    name: "Manesar Heavy Engineering Plant",
    isPrimary: true,
    address: {
      line1: "Plot 42, Sector 5",
      industrialArea: "IMT Manesar",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122050",
      stateCode: "06 (Haryana)",
    },
    contactPerson: {
      name: "Vikram Mehra",
      designation: "VP Manufacturing & Quality",
      email: "vikram.mehra@apex-eng.in",
      phone: "+91 98110 44219",
    },
    jurisdictionBranch: "Delhi Branch Office-II (DEL-II)",
    licenses: [
      {
        certificateNumber: "LIC-8842109",
        standardNumber: "IS 14543:2018",
        standardTitle: "Packaged Drinking Water & Pumping Equipment Conformity",
        productName: "APEX-HYDRO Submersible Water Pump",
        modelNumbers: ["SWP-500", "SWP-750", "SWP-1000"],
        status: "ACTIVE",
        validUntil: "2026-12-15T00:00:00.000Z",
        daysToExpiry: 91,
      },
    ],
    complianceScore: 87,
    readinessRating: "OPTIMAL",
    activeApplicationsCount: 1,
    pendingGapsCount: 1,
    openCorrectionsCount: 1,
    audits: [
      {
        auditNumber: "AUD/DEL-II/2026/0418",
        auditType: "PERIODIC_SURVEILLANCE",
        status: "SCHEDULED",
        scheduledDate: "2026-09-18T10:00:00.000Z",
        leadAuditor: "Er. Rajesh Kumar (Joint Director)",
      },
    ],
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
  },
  {
    id: "plant-bengaluru-02",
    code: "PLANT-BNG-02",
    name: "Bengaluru Motors & Drive Systems Plant",
    isPrimary: false,
    address: {
      line1: "Plot 18, 4th Phase",
      industrialArea: "Peenya Industrial Area",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560058",
      stateCode: "29 (Karnataka)",
    },
    contactPerson: {
      name: "Ananya Rao",
      designation: "Chief Electrical Testing Engineer",
      email: "ananya.rao@apex-eng.in",
      phone: "+91 98450 12891",
    },
    jurisdictionBranch: "Bengaluru Branch Office-I (BNG-I)",
    licenses: [
      {
        certificateNumber: "LIC-7329104",
        standardNumber: "IS 12615:2018",
        standardTitle: "Energy Efficient Induction Motors — Specifications",
        productName: "Three-Phase Energy Efficient Induction Motor (IE3 Series)",
        modelNumbers: ["IND-IE3-45KW", "IND-IE3-75KW"],
        status: "RENEWAL_DUE",
        validUntil: "2026-10-20T00:00:00.000Z",
        daysToExpiry: 35,
      },
    ],
    complianceScore: 72,
    readinessRating: "ATTENTION_REQUIRED",
    activeApplicationsCount: 1,
    pendingGapsCount: 2,
    openCorrectionsCount: 2,
    audits: [
      {
        auditNumber: "AUD/BNG-I/2026/0112",
        auditType: "PERIODIC_SURVEILLANCE",
        status: "COMPLETED",
        scheduledDate: "2026-07-15T09:30:00.000Z",
        leadAuditor: "Dr. K. Srinivas (Senior Technical Auditor)",
      },
    ],
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
  },
  {
    id: "plant-pune-03",
    code: "PLANT-PUN-03",
    name: "Pune Precision Pump Stators & Castings Facility",
    isPrimary: false,
    address: {
      line1: "Plot C-14, Phase II",
      industrialArea: "Chakan Industrial Phase II",
      city: "Pune",
      state: "Maharashtra",
      pincode: "410501",
      stateCode: "27 (Maharashtra)",
    },
    contactPerson: {
      name: "Sachin Kulkarni",
      designation: "Quality Assurance General Manager",
      email: "sachin.kulkarni@apex-eng.in",
      phone: "+91 98220 87310",
    },
    jurisdictionBranch: "Pune Branch Office (PUN-I)",
    licenses: [
      {
        certificateNumber: "LIC-9104822",
        standardNumber: "IS 9283:2013",
        standardTitle: "Motors for Submersible Pumps — Specification",
        productName: "High-Torque Submersible Electric Drive Motor",
        modelNumbers: ["SUB-MTR-10HP", "SUB-MTR-15HP"],
        status: "ACTIVE",
        validUntil: "2027-04-30T00:00:00.000Z",
        daysToExpiry: 227,
      },
    ],
    complianceScore: 94,
    readinessRating: "OPTIMAL",
    activeApplicationsCount: 0,
    pendingGapsCount: 0,
    openCorrectionsCount: 0,
    audits: [
      {
        auditNumber: "AUD/PUN-I/2026/0994",
        auditType: "PERIODIC_SURVEILLANCE",
        status: "COMPLETED",
        scheduledDate: "2026-05-10T10:00:00.000Z",
        leadAuditor: "Er. Ramesh Patil (Director & Head QA)",
      },
    ],
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
  },
];
