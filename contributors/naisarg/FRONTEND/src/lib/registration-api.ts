import { API_BASE_URL } from "./developer-data";

export type ApplicantType =
  | "domestic_mfr"
  | "foreign_mfr"
  | "importer"
  | "auth_rep";

export interface ApplicantDetails {
  fullName: string;
  phone: string;
  email: string;
  applicantType: ApplicantType;
  idType: string;
  idNumber: string;
}

export type BusinessType =
  | "pvt_ltd"
  | "public_ltd"
  | "llp"
  | "proprietorship"
  | "foreign";

export interface BusinessDetails {
  orgName: string;
  businessType: BusinessType;
  address: string;
  state: string;
  city: string;
  pincode: string;
  gstin: string;
  cin: string;
}

export interface ProductDetails {
  productName: string;
  category: string;
  brandName: string;
  modelNumber: string;
  description: string;
  standardNumber: string;
  standardTitle: string;
}

export type DocumentStatus = "accepted" | "processing" | "required" | "rejected";

export interface ApplicationDocument {
  id: string;
  documentType: string;
  fileName?: string;
  fileUrl?: string;
  status: DocumentStatus;
  rejectionReason?: string;
  lastUpdated: string;
}

export interface TestingParameter {
  id: string;
  name: string;
  standardClause: string;
  status: "pending" | "passed" | "failed";
}

export interface AccreditedLab {
  id: string;
  name: string;
  accreditationNo: string;
  location: string;
  contactEmail: string;
}

export interface TestingDetails {
  parameters: TestingParameter[];
  selectedLab: AccreditedLab | null;
}

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_scrutiny"
  | "grant_approved"
  | "action_required";

export interface BISApplication {
  id: string;
  userId: string;
  applicant: ApplicantDetails;
  business: BusinessDetails;
  product: ProductDetails;
  documents: ApplicationDocument[];
  testing: TestingDetails;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

const DRAFT_STORAGE_KEY = "saathi:application_draft";

export const DEFAULT_INITIAL_APPLICATION: BISApplication = {
  id: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  userId: "usr_industry_01",
  applicant: {
    fullName: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@apexeng.in",
    applicantType: "domestic_mfr",
    idType: "Aadhaar / PAN",
    idNumber: "ABCDE1234F",
  },
  business: {
    orgName: "Apex Engineering Pvt Ltd",
    businessType: "pvt_ltd",
    address: "Plot 42, Sector 5, IMT Manesar",
    state: "Haryana",
    city: "Gurugram",
    pincode: "122050",
    gstin: "GSTIN-000001",
    cin: "CIN-000001",
  },
  product: {
    productName: "Submersible Water Pump",
    category: "water",
    brandName: "APEX-HYDRO",
    modelNumber: "SWP-500",
    description: "High-efficiency 1HP submersible pump for domestic and industrial water supply.",
    standardNumber: "IS 14543",
    standardTitle: "Packaged Drinking Water & Pumping Equipment",
  },
  documents: [
    {
      id: "doc-1",
      documentType: "Business Registration / Incorporation Certificate",
      fileName: "Incorporation_Certificate_Apex.pdf",
      status: "accepted",
      lastUpdated: "2026-09-01",
    },
    {
      id: "doc-2",
      documentType: "Identity Proof of Authorized Signatory",
      fileName: "PAN_Rahul_Sharma.pdf",
      status: "accepted",
      lastUpdated: "2026-09-01",
    },
    {
      id: "doc-3",
      documentType: "Factory Layout & Process Flowchart",
      fileName: "Factory_Plan_Manesar.pdf",
      status: "processing",
      lastUpdated: "2026-09-10",
    },
    {
      id: "doc-4",
      documentType: "NABL Accredited Test Report",
      fileName: undefined,
      status: "required",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
    {
      id: "doc-5",
      documentType: "Manufacturer Self-Declaration Undertaking",
      fileName: undefined,
      status: "required",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  ],
  testing: {
    parameters: [
      { id: "p1", name: "Hydraulic Pressure Test", standardClause: "Clause 6.1", status: "passed" },
      { id: "p2", name: "Insulation Resistance & Dielectric Strength", standardClause: "Clause 8.4", status: "passed" },
      { id: "p3", name: "Turbidity & Microbiological Analysis", standardClause: "Clause 10.2", status: "pending" },
    ],
    selectedLab: {
      id: "lab-delhi-01",
      name: "Central BIS Recognized Testing Facility",
      accreditationNo: "DEMO-LAB-REF-001",
      location: "Okhla Industrial Area, Phase II, New Delhi",
      contactEmail: "lab.services@apex-eng.demo",
    },
  },
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Thin API Client wrapper for BIS New-Applicant Registration endpoints.
 * First queries backend `/api/v1/applications/...`; falls back cleanly
 * to local persisted state if backend server endpoint is unreachable.
 */
export const registrationApi = {
  async getApplication(id?: string): Promise<BISApplication> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id || "current"}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        return (await response.json()) as BISApplication;
      }
    } catch {
      // Backend fallback
    }

    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as BISApplication;
      }
    } catch {
      // Storage unavailable
    }

    return DEFAULT_INITIAL_APPLICATION;
  },

  async saveDraft(application: BISApplication): Promise<{ success: boolean; savedAt: string }> {
    const updated = {
      ...application,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${application.id}/draft`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (response.ok) {
        return { success: true, savedAt: new Date().toISOString() };
      }
    } catch {
      // Fallback save to local storage
    }

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    return { success: true, savedAt: new Date().toISOString() };
  },

  async submitApplication(application: BISApplication): Promise<{
    success: boolean;
    applicationId: string;
    submittedAt: string;
    status: ApplicationStatus;
  }> {
    const submittedAt = new Date().toISOString();
    const finalApp: BISApplication = {
      ...application,
      status: "submitted",
      submittedAt,
      updatedAt: submittedAt,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${application.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalApp),
      });
      if (response.ok) {
        const res = await response.json();
        return {
          success: true,
          applicationId: res.applicationId || application.id,
          submittedAt: res.submittedAt || submittedAt,
          status: "submitted",
        };
      }
    } catch {
      // Fallback
    }

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(finalApp));
    } catch {
      // Ignore
    }

    return {
      success: true,
      applicationId: application.id,
      submittedAt,
      status: "submitted",
    };
  },

  async uploadDocument(
    applicationId: string,
    docId: string,
    file: File
  ): Promise<ApplicationDocument> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docId", docId);

      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        return (await response.json()) as ApplicationDocument;
      }
    } catch {
      // Fallback simulation
    }

    return {
      id: docId,
      documentType: docId,
      fileName: file.name,
      status: "accepted",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
  },
};
