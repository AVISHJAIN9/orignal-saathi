import { API_BASE_URL } from "./developer-data";
import { certificatesApi, type BISCertificate } from "./certificates-api";
import {
  S11_DEMO_RENEWALS,
  deriveRenewalFromCertificate,
  type LicenseRenewalItem,
  type RenewalMilestone,
  type MilestoneKey,
} from "./demo/s11-demo-data";

export type { LicenseRenewalItem, RenewalMilestone, MilestoneKey };
export { deriveRenewalFromCertificate };

export interface RenewalsResult {
  renewals: LicenseRenewalItem[];
  isDemoFallback: boolean;
  totalRenewals: number;
  criticalCount: number; // <= 30 days
  upcomingCount: number; // <= 90 days
}

export const renewalsApi = {
  /**
   * Fetches renewal timeline items.
   * Leverages real S10 certificate data or canonical S11 demo records.
   */
  async getRenewals(): Promise<RenewalsResult> {
    const targetUrl = `${API_BASE_URL}/renewals`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        const renewals: LicenseRenewalItem[] = Array.isArray(data) ? data : data.renewals || [];
        return {
          renewals,
          isDemoFallback: false,
          totalRenewals: renewals.length,
          criticalCount: renewals.filter((r) => r.daysRemaining <= 30).length,
          upcomingCount: renewals.filter((r) => r.daysRemaining <= 90).length,
        };
      }
    } catch {
      // Offline or missing endpoint: attempt to derive from live certificatesApi
      try {
        const certsData = await certificatesApi.getCertificates();
        if (certsData?.certificates && certsData.certificates.length > 0) {
          const derived = certsData.certificates.map(deriveRenewalFromCertificate);
          return {
            renewals: derived,
            isDemoFallback: false,
            totalRenewals: derived.length,
            criticalCount: derived.filter((r) => r.daysRemaining <= 30).length,
            upcomingCount: derived.filter((r) => r.daysRemaining <= 90).length,
          };
        }
      } catch {
        // Fallback to canonical S10 derived demo renewals
      }
    }

    const renewals = S11_DEMO_RENEWALS;
    return {
      renewals,
      isDemoFallback: true,
      totalRenewals: renewals.length,
      criticalCount: renewals.filter((r) => r.daysRemaining <= 30).length,
      upcomingCount: renewals.filter((r) => r.daysRemaining <= 90).length,
    };
  },

  /**
   * Retrieves single renewal timeline by certificate number.
   */
  async getRenewalByCertificate(certificateNumber: string): Promise<LicenseRenewalItem | null> {
    const res = await this.getRenewals();
    return res.renewals.find((r) => r.certificateNumber === certificateNumber) || null;
  },
};
