/**
 * Centralized Demo Context & Canonical Scenario Foundation for SAATHI (SIH 2026).
 *
 * This module provides:
 * 1. A single, global switch for Demo Mode (`isDemoMode()`, `DEMO_MODE`).
 * 2. Canonical demonstration metadata (Apex Engineering, Rahul Sharma, IS 14543:2018, etc.).
 * 3. Consistent labels and disclaimers to prevent any demonstration data from being mistaken for live BIS records.
 *
 * IMPORTANT:
 * - Contains ONLY shared configuration, canonical entity constants, and light helpers.
 * - Individual feature datasets (S1–S10) live in their dedicated `sX-demo-data.ts` modules.
 */

import type { BISCertificate } from "../certificates-api";
// 1. Demo Mode Configuration Switch
// ---------------------------------------------------------------------------

/**
 * Global Demo Mode switch.
 * Can be explicitly overridden via the `VITE_SAATHI_DEMO_MODE` environment variable.
 * Defaults to `true` in local/preview environments to ensure reliable offline presentation.
 */
export function isDemoMode(): boolean {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const envFlag = (import.meta.env as Record<string, string | undefined>)["VITE_SAATHI_DEMO_MODE"];
    if (envFlag === "false" || envFlag === "0") return false;
    if (envFlag === "true" || envFlag === "1") return true;
  }
  return true;
}

export const DEMO_MODE: boolean = isDemoMode();

// ---------------------------------------------------------------------------
// 2. Demo Identification Labels & Disclaimers
// ---------------------------------------------------------------------------

export const DEMO_DISCLAIMER_LABEL = "DEMO / SAMPLE DATA";
export const DEMO_WATERMARK_TEXT = "FOR SIH 2026 EVALUATION ONLY — DEMONSTRATION ARTIFACT";
export const DEMO_OFFICIAL_SOURCE = "SAATHI Demonstration Sandbox (BIS SIH 2026)";

export const DEMO_NOTICE = {
  short: "Demonstration record — Not an official BIS registry record.",
  full: "This information is generated for the Smart India Hackathon 2026 demonstration scenario. It does not represent a legally binding BIS certification, inspection, or decision.",
  payment: "Simulated sandbox gateway — No real currency or banking transaction processed.",
  inspection: "Simulated pre-licence audit appointment for evaluation purposes.",
  certificate: "SAMPLE / DEMONSTRATION CERTIFICATE — Valid only within the SAATHI prototype environment.",
} as const;

// ---------------------------------------------------------------------------
// 3. Canonical Demonstration Entities (Apex Engineering Scenario)
// ---------------------------------------------------------------------------

export interface CanonicalDemoCompany {
  id: string;
  name: string;
  legalName: string;
  entityType: "pvt_ltd" | "public_ltd" | "llp" | "proprietorship" | "foreign";
  gstin: string;
  cin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  plantLocation: string;
}

export interface CanonicalDemoUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  role: "OWNER" | "COMPLIANCE_MANAGER" | "DOCUMENTATION_LEAD" | "TESTING_ENGINEER" | "FINANCIAL_OFFICER" | "AUDITOR_VIEWER";
  avatarTone: "navy" | "sage" | "clay";
  isPrimarySignatory?: boolean;
}

export interface CanonicalDemoProduct {
  id: string;
  productName: string;
  brandName: string;
  modelNumber: string;
  powerRating: string;
  category: string;
  categoryTitle: string;
  description: string;
}

export interface CanonicalDemoStandard {
  standardNumber: string;
  standardCode: string;
  standardTitle: string;
  edition: string;
  scheme: string;
  schemeCode: string;
  isMandatoryQco: boolean;
}

export const CANONICAL_DEMO_COMPANY: CanonicalDemoCompany = {
  id: "biz_apex_01",
  name: "Apex Engineering Pvt Ltd",
  legalName: "Apex Engineering Private Limited",
  entityType: "pvt_ltd",
  // Visibly non-standard, not a real-format GSTIN/CIN — see mock-renewals.ts's
  // comment on the same issue for why this matters even though the values
  // fail real checksum validation.
  gstin: "GSTIN-000001",
  cin: "CIN-000001",
  address: "Plot 42, Sector 5, IMT Manesar",
  city: "Gurugram",
  state: "Haryana",
  pincode: "122050",
  country: "India",
  plantLocation: "Plot 42, Sector 5, IMT Manesar, Gurugram, Haryana - 122050",
};

export const CANONICAL_DEMO_USERS = {
  owner: {
    id: "usr_industry_01",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@apexeng.in",
    phone: "+91 98765 43210",
    designation: "Managing Director & Authorized Signatory",
    role: "OWNER",
    avatarTone: "navy",
    isPrimarySignatory: true,
  } as CanonicalDemoUser,
  documentationLead: {
    id: "usr_industry_02",
    fullName: "Priya Verma",
    email: "priya.verma@apexeng.in",
    phone: "+91 98765 43211",
    designation: "Documentation Lead",
    role: "DOCUMENTATION_LEAD",
    avatarTone: "sage",
    isPrimarySignatory: false,
  } as CanonicalDemoUser,
  testingEngineer: {
    id: "usr_industry_03",
    fullName: "Vikram Singh",
    email: "vikram.singh@apexeng.in",
    phone: "+91 98765 43212",
    designation: "Senior Quality & Testing Engineer",
    role: "TESTING_ENGINEER",
    avatarTone: "clay",
    isPrimarySignatory: false,
  } as CanonicalDemoUser,
};

export const CANONICAL_DEMO_PRODUCT: CanonicalDemoProduct = {
  id: "prod_apex_swp500",
  productName: "APEX-HYDRO Submersible Water Pump",
  brandName: "APEX-HYDRO",
  modelNumber: "SWP-500",
  powerRating: "1 HP (0.75 kW)",
  category: "water",
  categoryTitle: "Pumps & Water Supply Equipment",
  description: "High-efficiency 1HP submersible pump for domestic, agricultural, and industrial water supply.",
};

export const CANONICAL_DEMO_STANDARD: CanonicalDemoStandard = {
  standardNumber: "IS 14543:2018",
  standardCode: "IS 14543",
  standardTitle: "Packaged Drinking Water & Pumping Equipment Conformity",
  edition: "Third Revision",
  scheme: "Scheme I (ISI Mark)",
  schemeCode: "SCHEME-I-ISI",
  isMandatoryQco: true,
};

// Canonical identifiers shared across S1–S10
export const CANONICAL_DEMO_APPLICATION_ID = "APP-2026-8841";
// Illustrative, non-official format — deliberately not BIS's real "CM/L-#######"
// licence-number notation (see mock-renewals.ts's "LIC-" convention for the
// same reasoning applied elsewhere in this repo).
export const CANONICAL_DEMO_CERTIFICATE_NUMBER = "LIC-8842109";
export const CANONICAL_DEMO_SECONDARY_APPLICATION_ID = "APP-2026-9904";
export const CANONICAL_DEMO_SECONDARY_CERTIFICATE_NUMBER = "LIC-7731204";

// ---------------------------------------------------------------------------
// 4. Shared Metadata Accessors & Helpers
// ---------------------------------------------------------------------------

export const demoCompany = CANONICAL_DEMO_COMPANY;
export const demoUser = CANONICAL_DEMO_USERS.owner;
export const demoCollaborators = [
  CANONICAL_DEMO_USERS.documentationLead,
  CANONICAL_DEMO_USERS.testingEngineer,
];
export const demoProduct = CANONICAL_DEMO_PRODUCT;
export const demoApplicationId = CANONICAL_DEMO_APPLICATION_ID;
export const demoStandardNumber = CANONICAL_DEMO_STANDARD.standardNumber;
export const demoCertificateNumber = CANONICAL_DEMO_CERTIFICATE_NUMBER;
export const demoLocation = CANONICAL_DEMO_COMPANY.plantLocation;
export const demoLabel = DEMO_DISCLAIMER_LABEL;

/**
 * Check if a given application, certificate, or reference ID belongs to the canonical demo dataset.
 */
export function isDemoIdentifier(identifier?: string | null): boolean {
  if (!identifier) return false;
  const normalized = identifier.trim().toUpperCase();
  return (
    normalized === CANONICAL_DEMO_APPLICATION_ID ||
    normalized === CANONICAL_DEMO_CERTIFICATE_NUMBER ||
    normalized === CANONICAL_DEMO_SECONDARY_APPLICATION_ID ||
    normalized === CANONICAL_DEMO_SECONDARY_CERTIFICATE_NUMBER ||
    normalized.startsWith("DEMO-") ||
    normalized.startsWith("APP-2026-")
  );
}

/**
 * Returns a standard demo badge or disclaimer text for UI display.
 */
export function getDemoDisclaimer(type: keyof typeof DEMO_NOTICE = "short"): string {
  return DEMO_NOTICE[type] || DEMO_NOTICE.short;
}

/**
 * Authoritative Canonical S10 BIS Certificates.
 * Shared across S10, S11 (Renewals), S20 (Calendar), S23 (License Notices), S24 (Invoices), and S26 (Locations).
 * Strictly avoids parallel certificate datasets.
 */
export const CANONICAL_S10_CERTIFICATES: BISCertificate[] = [
  {
    id: "cert-apex-8842109",
    certificateNumber: CANONICAL_DEMO_CERTIFICATE_NUMBER, // "LIC-8842109"
    applicationId: CANONICAL_DEMO_APPLICATION_ID,
    applicationNumber: CANONICAL_DEMO_APPLICATION_ID,
    status: "ACTIVE",
    productName: CANONICAL_DEMO_PRODUCT.productName,
    brandName: CANONICAL_DEMO_PRODUCT.brandName,
    modelNumber: CANONICAL_DEMO_PRODUCT.modelNumber,
    standardNumber: CANONICAL_DEMO_STANDARD.standardNumber,
    standardTitle: CANONICAL_DEMO_STANDARD.standardTitle,
    certificateHolder: CANONICAL_DEMO_COMPANY.name,
    factoryAddress: CANONICAL_DEMO_COMPANY.plantLocation,
    certificationScheme: CANONICAL_DEMO_STANDARD.scheme,
    issueDate: "2024-12-15T00:00:00.000Z",
    validUntil: "2026-12-15T00:00:00.000Z",
    renewalDueDate: "2026-11-15T00:00:00.000Z",
    grantingBranch: "Delhi Branch Office-II (DEL-II)",
    isPubliclyVerifiable: true,
  },
  {
    id: "cert-apex-7731204",
    certificateNumber: CANONICAL_DEMO_SECONDARY_CERTIFICATE_NUMBER, // "LIC-7731204"
    applicationId: CANONICAL_DEMO_SECONDARY_APPLICATION_ID,
    applicationNumber: CANONICAL_DEMO_SECONDARY_APPLICATION_ID,
    status: "ACTIVE",
    productName: "Three-Phase Induction Motor (Apex-Drive IE3)",
    brandName: "APEX-DRIVE",
    modelNumber: "IND-100",
    standardNumber: "IS 12615:2018",
    standardTitle: "Energy Efficient Induction Motors (Three Phase Squirrel Cage)",
    certificateHolder: CANONICAL_DEMO_COMPANY.name,
    factoryAddress: "Plot 18, Phase II, Peenya Industrial Area, Bengaluru, Karnataka - 560058",
    certificationScheme: "Scheme I (ISI Mark)",
    issueDate: "2025-02-10T00:00:00.000Z",
    validUntil: "2026-10-25T00:00:00.000Z",
    renewalDueDate: "2026-09-25T00:00:00.000Z",
    grantingBranch: "Bengaluru Branch Office-I (BLR-I)",
    isPubliclyVerifiable: true,
  },
];
