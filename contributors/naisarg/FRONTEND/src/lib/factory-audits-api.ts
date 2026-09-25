import { API_BASE_URL } from "./developer-data";
import {
  S21_CANONICAL_FACTORY_AUDITS,
  type FactoryAudit,
  type AuditStatus,
  type AuditType,
  type AuditOfficer,
  type AuditPreparationItem,
  type AuditRequiredDocument,
  type AuditHistoryRecord,
} from "./demo/s21-demo-data";
import { isDemoMode } from "./demo/demo-context";

export type {
  FactoryAudit,
  AuditStatus,
  AuditType,
  AuditOfficer,
  AuditPreparationItem,
  AuditRequiredDocument,
  AuditHistoryRecord,
};

export interface RescheduleRequestPayload {
  reason: string;
  preferredDate1: string;
  preferredDate2?: string;
  notes?: string;
}

export interface FactoryAuditsSummary {
  totalAudits: number;
  upcomingCount: number;
  actionRequiredCount: number;
  completedCount: number;
  overallReadinessPercent: number;
}

const LOCAL_AUDIT_STATE_KEY = "saathi_s21_audit_state_v1";

interface LocalAuditOverrides {
  status?: AuditStatus;
  attendanceConfirmedAt?: string;
  attendanceConfirmedBy?: string;
  applicantNotes?: string;
  rescheduleRequest?: {
    requestedAt: string;
    reason: string;
    preferredDate1: string;
    preferredDate2?: string;
  };
  preparationItemOverrides?: Record<string, boolean>; // itemId -> isReady
}

export const factoryAuditsApi = {
  /**
   * Retrieve factory audits with transparent fallback to demo dataset.
   */
  async getAudits(params?: {
    status?: AuditStatus | "ALL";
    type?: AuditType | "ALL";
    search?: string;
  }): Promise<{
    audits: FactoryAudit[];
    summary: FactoryAuditsSummary;
    isDemoFallback: boolean;
  }> {
    let baseAudits: FactoryAudit[] = [];
    let isDemoFallback = false;

    if (!isDemoMode()) {
      try {
        const query = new URLSearchParams();
        if (params?.status && params.status !== "ALL") query.set("status", params.status);
        if (params?.type && params.type !== "ALL") query.set("type", params.type);

        const url = `${API_BASE_URL}/factory-audits${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          baseAudits = Array.isArray(data) ? data : data?.audits || [];
        } else {
          isDemoFallback = true;
          baseAudits = [...S21_CANONICAL_FACTORY_AUDITS];
        }
      } catch {
        isDemoFallback = true;
        baseAudits = [...S21_CANONICAL_FACTORY_AUDITS];
      }
    } else {
      isDemoFallback = true;
      baseAudits = [...S21_CANONICAL_FACTORY_AUDITS];
    }

    // Apply client-side local overrides (confirmations, reschedule requests, checklist toggles)
    const localOverrides = this.getLocalOverrides();

    const merged = baseAudits.map((audit) => {
      const overrides = localOverrides[audit.id];
      if (!overrides) return audit;

      const updatedPrepItems = audit.preparationItems.map((item) => {
        if (
          overrides.preparationItemOverrides &&
          typeof overrides.preparationItemOverrides[item.id] === "boolean"
        ) {
          return { ...item, isReady: overrides.preparationItemOverrides[item.id] };
        }
        return item;
      });

      return {
        ...audit,
        status: overrides.status || audit.status,
        attendanceConfirmedAt: overrides.attendanceConfirmedAt || audit.attendanceConfirmedAt,
        attendanceConfirmedBy: overrides.attendanceConfirmedBy || audit.attendanceConfirmedBy,
        applicantNotes: overrides.applicantNotes !== undefined ? overrides.applicantNotes : audit.applicantNotes,
        rescheduleRequest: overrides.rescheduleRequest || audit.rescheduleRequest,
        preparationItems: updatedPrepItems,
      };
    });

    // Apply filtering
    let filtered = merged;
    if (params?.status && params.status !== "ALL") {
      filtered = filtered.filter((a) => a.status === params.status);
    }
    if (params?.type && params.type !== "ALL") {
      filtered = filtered.filter((a) => a.auditType === params.type);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.auditNumber.toLowerCase().includes(q) ||
          a.productName.toLowerCase().includes(q) ||
          a.standardNumber.toLowerCase().includes(q) ||
          a.leadOfficer.name.toLowerCase().includes(q)
      );
    }

    // Calculate metrics
    let totalPrepItems = 0;
    let readyPrepItems = 0;
    merged.forEach((a) => {
      a.preparationItems.forEach((item) => {
        totalPrepItems++;
        if (item.isReady) readyPrepItems++;
      });
    });

    const summary: FactoryAuditsSummary = {
      totalAudits: merged.length,
      upcomingCount: merged.filter(
        (a) => a.status === "SCHEDULED" || a.status === "CONFIRMED" || a.status === "ACTION_REQUIRED"
      ).length,
      actionRequiredCount: merged.filter((a) => a.status === "ACTION_REQUIRED").length,
      completedCount: merged.filter((a) => a.status === "COMPLETED").length,
      overallReadinessPercent:
        totalPrepItems > 0 ? Math.round((readyPrepItems / totalPrepItems) * 100) : 100,
    };

    return { audits: filtered, summary, isDemoFallback };
  },

  async getAuditById(auditId: string): Promise<FactoryAudit | null> {
    const { audits } = await this.getAudits();
    return audits.find((a) => a.id === auditId) || null;
  },

  /**
   * Confirm applicant attendance for the scheduled factory inspection.
   */
  async confirmAttendance(auditId: string, signatoryName: string): Promise<void> {
    const overrides = this.getLocalOverrides();
    overrides[auditId] = {
      ...overrides[auditId],
      status: "CONFIRMED",
      attendanceConfirmedAt: new Date().toISOString(),
      attendanceConfirmedBy: signatoryName,
    };
    this.saveLocalOverrides(overrides);
  },

  /**
   * Submit formal request to reschedule audit inspection.
   */
  async requestReschedule(
    auditId: string,
    payload: RescheduleRequestPayload
  ): Promise<void> {
    const overrides = this.getLocalOverrides();
    overrides[auditId] = {
      ...overrides[auditId],
      status: "RESCHEDULE_REQUESTED",
      rescheduleRequest: {
        requestedAt: new Date().toISOString(),
        reason: payload.reason,
        preferredDate1: payload.preferredDate1,
        preferredDate2: payload.preferredDate2,
      },
      applicantNotes: payload.notes
        ? `${overrides[auditId]?.applicantNotes ? `${overrides[auditId].applicantNotes}\n` : ""}[Reschedule Note]: ${payload.notes}`
        : overrides[auditId]?.applicantNotes,
    };
    this.saveLocalOverrides(overrides);
  },

  /**
   * Toggle checklist preparation item readiness state.
   */
  async togglePreparationItem(
    auditId: string,
    itemId: string,
    isReady: boolean
  ): Promise<void> {
    const overrides = this.getLocalOverrides();
    const currentAudit = overrides[auditId] || {};
    const itemMap = currentAudit.preparationItemOverrides || {};
    itemMap[itemId] = isReady;

    overrides[auditId] = {
      ...currentAudit,
      preparationItemOverrides: itemMap,
    };
    this.saveLocalOverrides(overrides);
  },

  /**
   * Add internal applicant coordination note.
   */
  async updateInternalNotes(auditId: string, noteText: string): Promise<void> {
    const overrides = this.getLocalOverrides();
    overrides[auditId] = {
      ...overrides[auditId],
      applicantNotes: noteText,
    };
    this.saveLocalOverrides(overrides);
  },

  getLocalOverrides(): Record<string, LocalAuditOverrides> {
    try {
      if (typeof window === "undefined") return {};
      const val = localStorage.getItem(LOCAL_AUDIT_STATE_KEY);
      return val ? JSON.parse(val) : {};
    } catch {
      return {};
    }
  },

  saveLocalOverrides(overrides: Record<string, LocalAuditOverrides>): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_AUDIT_STATE_KEY, JSON.stringify(overrides));
      }
    } catch {
      // Storage unavailable
    }
  },
};
