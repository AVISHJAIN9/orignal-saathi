import { API_BASE_URL } from "./developer-data";
import {
  S27_DEMO_TELEMETRY,
  type S27TelemetryBundle,
  type RetrievalQualityKpi,
  type GroundednessTimePoint,
  type RetrievalFailureCategory,
  type CoverageGapStandard,
} from "./demo/s27-demo-data";

export interface RetrievalQualityResponse {
  telemetry: S27TelemetryBundle;
  isLiveBackend: boolean;
  statusLabel: string; // "DEMO TELEMETRY" or "LIVE PRODUCTION TELEMETRY"
}

export const retrievalQualityApi = {
  /**
   * Retrieves live or demo retrieval quality metrics for internal operations.
   * Never reports confidence as accuracy.
   */
  async getMetrics(timeRange: "24h" | "7d" | "30d" = "7d"): Promise<RetrievalQualityResponse> {
    const targetUrl = `${API_BASE_URL}/admin/retrieval-quality?range=${encodeURIComponent(timeRange)}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = (await response.json()) as S27TelemetryBundle;
        return {
          telemetry: data,
          isLiveBackend: true,
          statusLabel: "LIVE PRODUCTION TELEMETRY",
        };
      }
    } catch {
      // Graceful fallback to demo telemetry
    }

    return {
      telemetry: S27_DEMO_TELEMETRY,
      isLiveBackend: false,
      statusLabel: "DEMO TELEMETRY",
    };
  },
};
