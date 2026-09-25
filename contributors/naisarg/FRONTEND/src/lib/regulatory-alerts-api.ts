import { API_BASE_URL } from "./developer-data";

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFORMATIONAL";

export type AlertChangeType =
  | "STANDARD_REVISED"
  | "QCO_AMENDED"
  | "SCHEME_UPDATED"
  | "TESTING_REQUIREMENT_CHANGED"
  | "DEADLINE_APPROACHING"
  | "GENERAL_REGULATORY_NOTICE";

export interface AlertSource {
  title: string;
  url: string;
  type?: string;
  publishedAt?: string;
}

export interface MonitoredItem {
  id: string;
  title: string;
  type: "standard" | "qco" | "scheme" | "product";
  code: string;
  status?: "active" | "review_required" | "updated";
}

export interface RegulatoryAlert {
  id: string;
  severity: AlertSeverity;
  changeType: AlertChangeType;
  title: string;
  whatChanged: string;
  whyItMatters: string;
  potentialImpact: string;
  recommendedAction: string;
  relatedStandardNumber?: string;
  relatedQcoNumber?: string;
  relatedSchemeName?: string;
  userProductContext?: string;
  detectedAt: string;
  effectiveAt?: string;
  read: boolean;
  source?: AlertSource;
  c2DeepLink?: string;
  c3DeepLink?: string;
  c4DeepLink?: string;
  c6DeepLink?: string;
}

export interface RegulatoryAlertsSummary {
  totalCount: number;
  unreadCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  informationalCount: number;
}

export interface RegulatoryAlertsResult {
  alerts: RegulatoryAlert[];
  monitoredItems?: MonitoredItem[];
  summary: RegulatoryAlertsSummary;
  lastCheckedAt?: string;
}

export class RegulatoryAlertsApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rawPayload?: unknown
  ) {
    super(message);
    this.name = "RegulatoryAlertsApiError";
  }
}

/**
 * Authoritative API client for C8 — Regulatory Change Alerts.
 * Communicates directly with `${API_BASE_URL}/alerts/regulatory`.
 * Adheres strictly to backend source of truth:
 * - Does NOT generate fake alerts or mock fallback data.
 * - Propagates honest backend errors and empty states to the frontend.
 */
export const regulatoryAlertsApi = {
  async getAlerts(params?: {
    severity?: AlertSeverity;
    unreadOnly?: boolean;
    productId?: string;
    standardNumber?: string;
  }): Promise<RegulatoryAlertsResult> {
    const query = new URLSearchParams();
    if (params?.severity) query.set("severity", params.severity);
    if (params?.unreadOnly) query.set("unreadOnly", "true");
    if (params?.productId) query.set("productId", params.productId);
    if (params?.standardNumber) query.set("standardNumber", params.standardNumber);

    const queryString = query.toString();
    const targetUrl = `${API_BASE_URL}/alerts/regulatory${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch regulatory alerts (HTTP ${response.status})`;
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
          // Response body was not JSON
        }
        throw new RegulatoryAlertsApiError(errorMessage, response.status, payload);
      }

      const data = (await response.json()) as RegulatoryAlertsResult;
      return data;
    } catch (err) {
      if (err instanceof RegulatoryAlertsApiError) {
        throw err;
      }
      throw new RegulatoryAlertsApiError(
        err instanceof Error ? err.message : "Network failure connecting to Regulatory Alerts API"
      );
    }
  },

  async markAsRead(alertId: string): Promise<boolean> {
    const targetUrl = `${API_BASE_URL}/alerts/regulatory/${encodeURIComponent(alertId)}/read`;

    try {
      const response = await fetch(targetUrl, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  },

  async refreshAlerts(): Promise<RegulatoryAlertsResult> {
    const targetUrl = `${API_BASE_URL}/alerts/regulatory/refresh`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new RegulatoryAlertsApiError(
        `Failed to refresh regulatory alerts (HTTP ${response.status})`,
        response.status
      );
    }

    return (await response.json()) as RegulatoryAlertsResult;
  },
};
