import { API_BASE_URL } from "./developer-data";
import {
  S22_CANONICAL_RECALL_ALERTS,
  type RecallAlert,
  type RecallAlertType,
  type RecallSeverity,
  type RecallStatus,
  type OfficialAlertSource,
  type AffectedScopeDetails,
} from "./demo/s22-demo-data";
import { isDemoMode } from "./demo/demo-context";

export type {
  RecallAlert,
  RecallAlertType,
  RecallSeverity,
  RecallStatus,
  OfficialAlertSource,
  AffectedScopeDetails,
};

export interface RecallsSummary {
  totalCount: number;
  criticalCount: number;
  highCount: number;
  activeCount: number;
  actionRequiredCount: number;
  resolvedCount: number;
}

const LOCAL_RECALL_ACK_KEY = "saathi_s22_acknowledged_alerts_v1";

export const recallsApi = {
  /**
   * Fetch recall and non-conformance alerts with transparent demo fallback.
   */
  async getAlerts(params?: {
    severity?: RecallSeverity | "ALL";
    type?: RecallAlertType | "ALL";
    status?: RecallStatus | "ALL";
    search?: string;
  }): Promise<{
    alerts: RecallAlert[];
    summary: RecallsSummary;
    isDemoFallback: boolean;
  }> {
    let baseAlerts: RecallAlert[] = [];
    let isDemoFallback = false;

    if (!isDemoMode()) {
      try {
        const query = new URLSearchParams();
        if (params?.severity && params.severity !== "ALL") query.set("severity", params.severity);
        if (params?.type && params.type !== "ALL") query.set("type", params.type);
        if (params?.status && params.status !== "ALL") query.set("status", params.status);

        const url = `${API_BASE_URL}/alerts/recalls${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          baseAlerts = Array.isArray(data) ? data : data?.alerts || [];
        } else {
          isDemoFallback = true;
          baseAlerts = [...S22_CANONICAL_RECALL_ALERTS];
        }
      } catch {
        isDemoFallback = true;
        baseAlerts = [...S22_CANONICAL_RECALL_ALERTS];
      }
    } else {
      isDemoFallback = true;
      baseAlerts = [...S22_CANONICAL_RECALL_ALERTS];
    }

    // Apply filtering
    let filtered = baseAlerts;
    if (params?.severity && params.severity !== "ALL") {
      filtered = filtered.filter((a) => a.severity === params.severity);
    }
    if (params?.type && params.type !== "ALL") {
      filtered = filtered.filter((a) => a.alertType === params.type);
    }
    if (params?.status && params.status !== "ALL") {
      filtered = filtered.filter((a) => a.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.alertNumber.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.whatHappened.toLowerCase().includes(q) ||
          a.affectedScope.productName.toLowerCase().includes(q) ||
          a.affectedScope.standardNumber.toLowerCase().includes(q)
      );
    }

    const summary: RecallsSummary = {
      totalCount: baseAlerts.length,
      criticalCount: baseAlerts.filter((a) => a.severity === "CRITICAL").length,
      highCount: baseAlerts.filter((a) => a.severity === "HIGH").length,
      activeCount: baseAlerts.filter((a) => a.status === "ACTIVE" || a.status === "ACTION_REQUIRED")
        .length,
      actionRequiredCount: baseAlerts.filter((a) => a.status === "ACTION_REQUIRED").length,
      resolvedCount: baseAlerts.filter((a) => a.status === "RESOLVED" || a.status === "CLOSED")
        .length,
    };

    return { alerts: filtered, summary, isDemoFallback };
  },

  async getAlertById(alertId: string): Promise<RecallAlert | null> {
    const { alerts } = await this.getAlerts();
    return alerts.find((a) => a.id === alertId) || null;
  },

  isAlertAcknowledged(alertId: string): boolean {
    try {
      if (typeof window === "undefined") return false;
      const list = localStorage.getItem(LOCAL_RECALL_ACK_KEY);
      const arr = list ? JSON.parse(list) : [];
      return arr.includes(alertId);
    } catch {
      return false;
    }
  },

  acknowledgeAlert(alertId: string): void {
    try {
      if (typeof window === "undefined") return;
      const list = localStorage.getItem(LOCAL_RECALL_ACK_KEY);
      const arr: string[] = list ? JSON.parse(list) : [];
      if (!arr.includes(alertId)) {
        arr.push(alertId);
        localStorage.setItem(LOCAL_RECALL_ACK_KEY, JSON.stringify(arr));
      }
    } catch {
      // Storage unavailable
    }
  },
};
