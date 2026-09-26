import { API_BASE_URL } from "./developer-data";

export type CapabilityStatus = "verified" | "unverified" | "not_supported" | "unknown";
export type VerificationStatus = "verified" | "unverified" | "unknown";
export type LocationFit = "excellent" | "good" | "moderate" | "far" | "unknown";

export interface LaboratoryCapability {
  testName: string;
  status: CapabilityStatus;
  sourceUrl?: string;
  notes?: string;
}

export interface MatchScoreBreakdown {
  testCoverageScore?: number;
  standardMatchScore?: number;
  accreditationStatus?: VerificationStatus;
  locationFit?: LocationFit;
}

export interface LaboratorySource {
  title: string;
  url: string;
  type?: string;
  verifiedAt?: string;
}

export interface LaboratoryMatch {
  laboratoryId: string;
  laboratoryName: string;
  location: string;
  city?: string;
  state?: string;
  distanceKm?: number;
  matchScore: number;
  scoreBreakdown?: MatchScoreBreakdown;
  testsCoveredCount: number;
  totalRequiredTestsCount: number;
  capabilities: LaboratoryCapability[];
  relevantStandards: string[];
  accreditationStatus: VerificationStatus;
  accreditationDetails?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  verificationStatus: VerificationStatus;
  verificationSource?: LaboratorySource;
  explanation?: string;
  isBestMatch?: boolean;
}

export interface LaboratoryMatchRequest {
  productName?: string;
  standardNumber?: string;
  schemeName?: string;
  schemeCode?: string;
  requiredTests?: string[];
  userLocation?: string;
  maxDistanceKm?: number;
  accreditationFilter?: string;
  laboratoryType?: string;
}

export interface LaboratoryMatchResult {
  product?: string;
  standardNumber?: string;
  schemeName?: string;
  requiredTests: string[];
  bestMatch: LaboratoryMatch | null;
  alternativeMatches: LaboratoryMatch[];
  totalMatchesCount: number;
  matchingExplanation?: string;
  noMatchReason?: string;
  updatedAt?: string;
}

export class LaboratoryApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rawPayload?: unknown
  ) {
    super(message);
    this.name = "LaboratoryApiError";
  }
}

/**
 * Authoritative API client for C7 — Intelligent Laboratory Matcher.
 * Communicates with `${API_BASE_URL}/laboratory/match`.
 * Adheres strictly to backend source of truth:
 * - Does NOT fabricate laboratory records or mock data fallback.
 * - Propagates honest backend errors and empty states to the frontend.
 */
export const laboratoryApi = {
  async matchLaboratories(
    request: LaboratoryMatchRequest
  ): Promise<LaboratoryMatchResult> {
    const targetUrl = `${API_BASE_URL}/laboratory/match`;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        let errorMessage = `Laboratory matching request failed (HTTP ${response.status})`;
        let payload: unknown = undefined;
        try {
          payload = await response.json();
          if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string") {
            errorMessage = (payload as { message: string }).message;
          }
        } catch {
          // Response body was not JSON
        }
        throw new LaboratoryApiError(errorMessage, response.status, payload);
      }

      const data = (await response.json()) as LaboratoryMatchResult;
      return data;
    } catch (err) {
      if (err instanceof LaboratoryApiError) {
        throw err;
      }
      throw new LaboratoryApiError(
        err instanceof Error ? err.message : "Network failure connecting to Laboratory Matcher API"
      );
    }
  },
};
