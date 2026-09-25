import { API_BASE_URL } from "./developer-data";

export type ChainStepState =
  | "COMPLETED"
  | "ACTION_REQUIRED"
  | "BLOCKED"
  | "NOT_STARTED"
  | "NOT_APPLICABLE"
  | "UNAVAILABLE";

export interface ChainStepSource {
  title: string;
  url?: string;
  type?: string;
}

export interface ChainDocumentSummary {
  availableCount?: number;
  requiredCount?: number;
  missingCount?: number;
  status?: string;
  cortexVerified?: boolean;
  cortexStatus?: string;
}

export interface ComplianceChainStep {
  id: string; // e.g. "classification", "standard", "qco", "scheme", "requirements", "testing", "laboratory", "documents", "compliance_gaps", "application_readiness", "certification", "regulatory_radar"
  title: string;
  subtitle?: string;
  state: ChainStepState;
  deepLink?: string;
  actionLabel?: string;
  details?: Record<string, unknown>;
  documents?: ChainDocumentSummary;
  source?: ChainStepSource;
}

export interface CurrentPositionInfo {
  completedSteps: string[];
  currentStep: string;
  nextRequiredAction: string;
}

export interface NextBestActionInfo {
  title: string;
  description: string;
  deepLink?: string;
  actionLabel?: string;
  primary?: boolean;
}

export interface RegulatoryOverview {
  standardNumber: string;
  standardSource?: ChainStepSource;
  qcoStatus: string;
  qcoSource?: ChainStepSource;
  schemeName: string;
  schemeSource?: ChainStepSource;
}

export interface ComplianceChainResult {
  productId: string;
  productName: string;
  standardNumber?: string;
  overallStatus: "COMPLETED" | "ACTION_REQUIRED" | "BLOCKED" | "NOT_STARTED" | "IN_PROGRESS";
  currentPosition?: CurrentPositionInfo;
  nextBestAction?: NextBestActionInfo;
  steps: ComplianceChainStep[];
  regulatoryOverview?: RegulatoryOverview;
  updatedAt?: string;
}

/**
 * API client wrapper for C6 — Compliance Chain backend endpoints.
 * Consumes authoritative results from `/api/v1/compliance/chain`.
 * Does NOT generate mock fallback data when the server returns an error,
 * preserving true backend source-of-truth status.
 */
export const complianceChainApi = {
  async getComplianceChain(productId?: string): Promise<ComplianceChainResult> {
    const targetUrl = productId
      ? `${API_BASE_URL}/compliance/chain/${encodeURIComponent(productId)}`
      : `${API_BASE_URL}/compliance/chain`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load compliance chain data (HTTP ${response.status} ${response.statusText})`
      );
    }

    const data = (await response.json()) as ComplianceChainResult;
    return data;
  },

  async queryComplianceChain(params: {
    productName?: string;
    standardNumber?: string;
  }): Promise<ComplianceChainResult> {
    const response = await fetch(`${API_BASE_URL}/compliance/chain`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to submit compliance chain request (HTTP ${response.status} ${response.statusText})`
      );
    }

    const data = (await response.json()) as ComplianceChainResult;
    return data;
  },
};
