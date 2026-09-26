import { API_BASE_URL } from "./developer-data";

export type OfficerVisitStatus =
  | "PENDING"
  | "SCHEDULED"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "ACTION_REQUIRED";

export interface OfficerInfo {
  name?: string;
  designation?: string;
  branchOffice?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
}

export interface VisitLocation {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  unitName?: string;
  formatted?: string;
}

export interface PreparationChecklistItem {
  id: string;
  title: string;
  description?: string;
  category?: "documents" | "testing" | "samples" | "facility" | "general" | string;
  isReady: boolean;
  documentId?: string;
  vaultLink?: string;
  requiredForVisit?: boolean;
}

export interface PreparationSummary {
  readyCount: number;
  totalCount: number;
  percentage?: number;
}

export interface VisitFollowUp {
  notes?: string;
  actionRequired?: string;
  nextStepDeadline?: string;
  reportUrl?: string;
}

export interface OfficerVisit {
  id: string;
  applicationId: string;
  applicationNumber?: string;
  applicationTitle?: string;
  standardNumber?: string;
  visitType: string;
  purpose: string;
  scheduledDate: string;
  scheduledTime?: string;
  estimatedDuration?: string;
  location?: VisitLocation | string;
  officer?: OfficerInfo | null;
  status: OfficerVisitStatus;
  statusReason?: string;
  instructions?: string[];
  preparationChecklist?: PreparationChecklistItem[];
  preparationSummary?: PreparationSummary;
  followUp?: VisitFollowUp;
  officialOrderUrl?: string;
  cancellationReason?: string;
  reschedulingReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OfficerVisitsSummary {
  totalVisits: number;
  upcomingCount: number;
  completedCount: number;
  rescheduledCount: number;
  cancelledCount: number;
  actionRequiredCount: number;
}

export interface ApplicationVisitContext {
  id: string;
  applicationNumber: string;
  productTitle: string;
  standardNumber?: string;
}

export interface OfficerVisitsResult {
  upcomingVisit: OfficerVisit | null;
  history: OfficerVisit[];
  allVisits?: OfficerVisit[];
  summary?: OfficerVisitsSummary;
  applicationContexts?: ApplicationVisitContext[];
  lastRefreshedAt?: string;
}

export class OfficerVisitsApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rawPayload?: unknown
  ) {
    super(message);
    this.name = "OfficerVisitsApiError";
  }
}

/**
 * Authoritative API client for S6 — Government-Officer Visit Schedule.
 * Communicates directly with `${API_BASE_URL}/officer-visits`.
 * Adheres strictly to backend source of truth:
 * - Does NOT manufacture fake visits or mock fallback data.
 * - Honest error handling & clean typing.
 */
export const officerVisitsApi = {
  async getVisits(params?: {
    applicationId?: string;
    status?: OfficerVisitStatus;
  }): Promise<OfficerVisitsResult> {
    const query = new URLSearchParams();
    if (params?.applicationId) query.set("applicationId", params.applicationId);
    if (params?.status) query.set("status", params.status);

    const queryString = query.toString();
    const targetUrl = `${API_BASE_URL}/officer-visits${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch officer visits (HTTP ${response.status})`;
        let payload: unknown = undefined;
        try {
          payload = await response.json();
          if (
            payload &&
            typeof payload === "object" &&
            "message" in payload &&
            typeof (payload as { message: unknown }).message === "string"
          ) {
            errorMessage = (payload as { message: string }).message;
          }
        } catch {
          // Non-JSON response
        }
        throw new OfficerVisitsApiError(errorMessage, response.status, payload);
      }

      const rawData = await response.json();
      
      // Normalize raw backend payload into structured OfficerVisitsResult
      if (Array.isArray(rawData)) {
        const sorted = [...rawData].sort(
          (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        );
        const upcoming = sorted.find((v) => v.status === "SCHEDULED" || v.status === "CONFIRMED" || v.status === "PENDING") || null;
        const past = sorted.filter((v) => v.id !== upcoming?.id);
        return {
          upcomingVisit: upcoming,
          history: past,
          allVisits: sorted,
          summary: {
            totalVisits: sorted.length,
            upcomingCount: upcoming ? 1 : 0,
            completedCount: sorted.filter((v) => v.status === "COMPLETED").length,
            rescheduledCount: sorted.filter((v) => v.status === "RESCHEDULED").length,
            cancelledCount: sorted.filter((v) => v.status === "CANCELLED").length,
            actionRequiredCount: sorted.filter((v) => v.status === "ACTION_REQUIRED").length,
          },
        };
      }

      return rawData as OfficerVisitsResult;
    } catch (err) {
      if (err instanceof OfficerVisitsApiError) {
        throw err;
      }
      throw new OfficerVisitsApiError(
        err instanceof Error ? err.message : "Network failure connecting to Officer Visits API"
      );
    }
  },

  async getVisitById(visitId: string): Promise<OfficerVisit> {
    const targetUrl = `${API_BASE_URL}/officer-visits/${encodeURIComponent(visitId)}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new OfficerVisitsApiError(
          `Failed to load visit details for ${visitId} (HTTP ${response.status})`,
          response.status
        );
      }

      return (await response.json()) as OfficerVisit;
    } catch (err) {
      if (err instanceof OfficerVisitsApiError) {
        throw err;
      }
      throw new OfficerVisitsApiError(
        err instanceof Error ? err.message : `Failed to load officer visit ${visitId}`
      );
    }
  },
};
