import { API_BASE_URL } from "./developer-data";

export type CertificateStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "SUSPENDED"
  | "CANCELLED"
  | "REVOKED"
  | "UNDER_RENEWAL"
  | "SUPERSEDED";

export interface CertificateHistoryItem {
  id: string;
  version: number;
  certificateNumber: string;
  action: "INITIAL_GRANT" | "RENEWAL" | "AMENDMENT_SCOPE" | "SURVEILLANCE_AUDIT" | "SUPERSEDED";
  actionTitle: string;
  effectiveDate: string;
  validUntil?: string;
  status: CertificateStatus;
  remarks?: string;
  orderReference?: string;
  documentUrl?: string;
}

export interface BISCertificate {
  id: string;
  certificateNumber: string;
  applicationId?: string;
  applicationNumber?: string;
  status: CertificateStatus;
  productName: string;
  brandName?: string;
  modelNumber?: string;
  standardNumber: string;
  standardTitle: string;
  certificateHolder: string;
  factoryAddress?: string;
  certificationScheme: string;
  issueDate: string;
  validUntil: string;
  renewalDueDate?: string;
  grantingBranch?: string;
  documentUrl?: string;
  documentFileName?: string;
  documentFileSize?: number;
  publicVerificationUrl?: string;
  qrPayload?: string;
  scopeOfLicense?: string;
  officerName?: string;
  officerDesignation?: string;
  history?: CertificateHistoryItem[];
  isPubliclyVerifiable?: boolean;
}

export interface CertificateSummary {
  totalCount: number;
  activeCount: number;
  expiringCount: number;
  suspendedCount: number;
  underRenewalCount: number;
}

export interface PublicVerificationResult {
  verified: boolean;
  certificateNumber: string;
  status?: CertificateStatus;
  statusLabel?: string;
  productName?: string;
  standardNumber?: string;
  standardTitle?: string;
  certificateHolder?: string;
  factoryLocation?: string;
  certificationScheme?: string;
  issueDate?: string;
  validUntil?: string;
  officialSource: string;
  verifiedAt: string;
  documentDownloadUrl?: string;
  publicVerificationUrl?: string;
  qrData?: string;
  isFraudulent?: boolean;
  fraudulentNotes?: string;
  unverifiedReason?:
    | "NOT_FOUND"
    | "INVALID_FORMAT"
    | "EXPIRED_UNRENEWED"
    | "SUSPENDED_ENTRY"
    | "SERVICE_UNAVAILABLE"
    | "UNKNOWN";
  unverifiedMessage?: string;
}

/**
 * Authoritative Certificate & Public Verification API Client wrapper.
 * Consumes official backend endpoints at `/api/v1/certificates/...` and `/api/v1/certificates/verify`.
 * Strictly queries real backend endpoints and returns genuine responses or standard error states without fake mock fallbacks.
 */
export const certificatesApi = {
  /**
   * Fetch all certificates for the authenticated organization / user from the real backend.
   */
  async getCertificates(params?: {
    status?: string;
    search?: string;
    applicationId?: string;
  }): Promise<{ certificates: BISCertificate[]; summary: CertificateSummary }> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.applicationId && params.applicationId !== "all") query.set("application_id", params.applicationId);

    const url = `${API_BASE_URL}/certificates${query.toString() ? `?${query.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve certificates from backend server (HTTP ${response.status} ${response.statusText})`
      );
    }

    const data = await response.json();
    const certificates: BISCertificate[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.certificates)
        ? data.certificates
        : [];

    return {
      certificates,
      summary: data.summary || this.calculateSummary(certificates),
    };
  },

  /**
   * Fetch a single certificate by ID or Certificate Number from the real backend.
   */
  async getCertificateById(idOrNumber: string): Promise<BISCertificate> {
    const url = `${API_BASE_URL}/certificates/${encodeURIComponent(idOrNumber.trim())}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error(`Certificate '${idOrNumber}' was not found in the official BIS registry.`);
    }

    if (!response.ok) {
      throw new Error(`Failed to load certificate details (HTTP ${response.status} ${response.statusText})`);
    }

    return (await response.json()) as BISCertificate;
  },

  /**
   * Fetch certificate revision and lifecycle history from the real backend.
   */
  async getCertificateHistory(idOrNumber: string): Promise<CertificateHistoryItem[]> {
    const url = `${API_BASE_URL}/certificates/${encodeURIComponent(idOrNumber.trim())}/history`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load certificate history (HTTP ${response.status} ${response.statusText})`);
    }

    return (await response.json()) as CertificateHistoryItem[];
  },

  /**
   * Public Unauthenticated Verification Endpoint.
   * Directly queries the real backend `/certificates/verify?number=...`.
   * Strictly returns authoritative verification results without local mock fabrication.
   */
  async verifyCertificatePublic(certificateNumber: string): Promise<PublicVerificationResult> {
    const cleanNumber = certificateNumber.trim();

    if (!cleanNumber) {
      return {
        verified: false,
        certificateNumber: "",
        officialSource: "Bureau of Indian Standards National Central Registry",
        verifiedAt: new Date().toISOString(),
        unverifiedReason: "INVALID_FORMAT",
        unverifiedMessage: "Please enter a valid BIS Certificate / License Number.",
      };
    }

    const url = `${API_BASE_URL}/certificates/verify?number=${encodeURIComponent(cleanNumber)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        return (await response.json()) as PublicVerificationResult;
      }

      if (response.status === 404) {
        let errDetail = `Certificate number '${cleanNumber}' was not found in the official BIS National Registry.`;
        try {
          const body = await response.json();
          if (body?.detail || body?.message) errDetail = body.detail || body.message;
        } catch {
          // Ignore json parse error on 404
        }
        return {
          verified: false,
          certificateNumber: cleanNumber,
          officialSource: "Bureau of Indian Standards National Central Registry",
          verifiedAt: new Date().toISOString(),
          unverifiedReason: "NOT_FOUND",
          unverifiedMessage: errDetail,
        };
      }

      // 500 / 503 / 502 / other server error
      return {
        verified: false,
        certificateNumber: cleanNumber,
        officialSource: "Bureau of Indian Standards National Central Registry",
        verifiedAt: new Date().toISOString(),
        unverifiedReason: "SERVICE_UNAVAILABLE",
        unverifiedMessage: `Verification service returned HTTP ${response.status} ${response.statusText}. Please retry shortly.`,
      };
    } catch {
      // Network failure / Server down
      return {
        verified: false,
        certificateNumber: cleanNumber,
        officialSource: "Bureau of Indian Standards National Central Registry",
        verifiedAt: new Date().toISOString(),
        unverifiedReason: "SERVICE_UNAVAILABLE",
        unverifiedMessage: "Could not reach the BIS verification server. Please check your network or try again shortly.",
      };
    }
  },

  /**
   * Official Certificate Download handling.
   * Calls the real backend download endpoint.
   */
  async downloadCertificate(certificateId: string): Promise<{
    success: boolean;
    fileName: string;
    downloadUrl: string;
  }> {
    const url = `${API_BASE_URL}/certificates/${encodeURIComponent(certificateId.trim())}/download`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Official certificate document could not be retrieved from server (HTTP ${response.status}).`);
    }

    const data = await response.json();
    return {
      success: true,
      fileName: data.fileName || `BIS_Certificate_${certificateId}.pdf`,
      downloadUrl: data.downloadUrl || data.url,
    };
  },

  /**
   * Summary calculation helper.
   */
  calculateSummary(certificates: BISCertificate[]): CertificateSummary {
    return {
      totalCount: certificates.length,
      activeCount: certificates.filter((c) => c.status === "ACTIVE").length,
      expiringCount: certificates.filter((c) => {
        if (c.status !== "ACTIVE" || !c.validUntil) return false;
        const expiry = new Date(c.validUntil).getTime();
        const now = Date.now();
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 90;
      }).length,
      suspendedCount: certificates.filter((c) => c.status === "SUSPENDED" || c.status === "REVOKED").length,
      underRenewalCount: certificates.filter((c) => c.status === "UNDER_RENEWAL").length,
    };
  },
};
