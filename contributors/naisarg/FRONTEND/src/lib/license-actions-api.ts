import { API_BASE_URL } from "./developer-data";
import {
  S23_CANONICAL_LICENSE_NOTICES,
  type LicenseNotice,
  type NoticeType,
  type NoticeStatus,
  type NoticeEvidenceRequirement,
  type NoticeTimelineEntry,
} from "./demo/s23-demo-data";
import { isDemoMode } from "./demo/demo-context";

export type {
  LicenseNotice,
  NoticeType,
  NoticeStatus,
  NoticeEvidenceRequirement,
  NoticeTimelineEntry,
};

export interface RemediationSubmissionPayload {
  noticeId: string;
  signatoryName: string;
  designation: string;
  rootCauseAnalysisSummary: string;
  correctiveActionsImplemented: string;
  preventiveMeasuresDescription: string;
  attachedEvidence: {
    requirementId: string;
    documentTitle: string;
    documentSource: "upload" | "vault";
    vaultDocumentId?: string;
    fileName?: string;
  }[];
  applicantDeclarationAccepted: boolean;
}

export interface LicenseActionsSummary {
  totalNotices: number;
  activeSuspensions: number;
  remediationRequiredCount: number;
  underReviewCount: number;
  reinstatedCount: number;
}

const LOCAL_LICENSE_STATE_KEY = "saathi_s23_license_state_v1";

interface LocalNoticeOverride {
  status?: NoticeStatus;
  remediationSubmission?: RemediationSubmissionPayload & { submittedAt: string };
  timelineEntries?: NoticeTimelineEntry[];
  requirementOverrides?: Record<string, "PENDING" | "UPLOADED" | "VERIFIED">;
}

export const licenseActionsApi = {
  /**
   * Retrieve license notices and enforcement actions with transparent demo fallback.
   */
  async getNotices(params?: {
    status?: NoticeStatus | "ALL";
    type?: NoticeType | "ALL";
    search?: string;
  }): Promise<{
    notices: LicenseNotice[];
    summary: LicenseActionsSummary;
    isDemoFallback: boolean;
  }> {
    let baseNotices: LicenseNotice[] = [];
    let isDemoFallback = false;

    if (!isDemoMode()) {
      try {
        const query = new URLSearchParams();
        if (params?.status && params.status !== "ALL") query.set("status", params.status);
        if (params?.type && params.type !== "ALL") query.set("type", params.type);

        const url = `${API_BASE_URL}/license-actions${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          baseNotices = Array.isArray(data) ? data : data?.notices || [];
        } else {
          isDemoFallback = true;
          baseNotices = [...S23_CANONICAL_LICENSE_NOTICES];
        }
      } catch {
        isDemoFallback = true;
        baseNotices = [...S23_CANONICAL_LICENSE_NOTICES];
      }
    } else {
      isDemoFallback = true;
      baseNotices = [...S23_CANONICAL_LICENSE_NOTICES];
    }

    // Merge local state overrides
    const localOverrides = this.getLocalOverrides();

    const merged = baseNotices.map((notice) => {
      const override = localOverrides[notice.id];
      if (!override) return notice;

      const updatedRequirements = notice.remediationRequirements.map((req) => {
        if (override.requirementOverrides && override.requirementOverrides[req.id]) {
          return { ...req, status: override.requirementOverrides[req.id] };
        }
        return req;
      });

      const updatedTimeline = [
        ...notice.timeline,
        ...(override.timelineEntries || []),
      ];

      return {
        ...notice,
        status: override.status || notice.status,
        remediationRequirements: updatedRequirements,
        timeline: updatedTimeline,
      };
    });

    let filtered = merged;
    if (params?.status && params.status !== "ALL") {
      filtered = filtered.filter((n) => n.status === params.status);
    }
    if (params?.type && params.type !== "ALL") {
      filtered = filtered.filter((n) => n.noticeType === params.type);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.noticeNumber.toLowerCase().includes(q) ||
          n.certificateNumber.toLowerCase().includes(q) ||
          n.reasonSummary.toLowerCase().includes(q) ||
          n.productName.toLowerCase().includes(q)
      );
    }

    const summary: LicenseActionsSummary = {
      totalNotices: merged.length,
      activeSuspensions: merged.filter((n) => n.status === "SUSPENDED" || n.status === "REMEDIATION_REQUIRED").length,
      remediationRequiredCount: merged.filter((n) => n.status === "REMEDIATION_REQUIRED").length,
      underReviewCount: merged.filter((n) => n.status === "REMEDIATION_SUBMITTED" || n.status === "UNDER_REVIEW").length,
      reinstatedCount: merged.filter((n) => n.status === "REINSTATED" || n.status === "CLOSED").length,
    };

    return { notices: filtered, summary, isDemoFallback };
  },

  async getNoticeById(noticeId: string): Promise<LicenseNotice | null> {
    const { notices } = await this.getNotices();
    return notices.find((n) => n.id === noticeId) || null;
  },

  /**
   * Submit complete Corrective Action / Remediation Package for an enforcement notice.
   */
  async submitRemediationPackage(
    noticeId: string,
    payload: RemediationSubmissionPayload
  ): Promise<{ success: boolean; submissionReference: string }> {
    const overrides = this.getLocalOverrides();
    const current = overrides[noticeId] || {};

    const submissionRef = `REM-${noticeId.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now().toString().slice(-4)}`;
    const submissionTime = new Date().toISOString();

    // Map evidence items to uploaded status
    const reqStatusMap: Record<string, "PENDING" | "UPLOADED" | "VERIFIED"> = {
      ...(current.requirementOverrides || {}),
    };
    payload.attachedEvidence.forEach((ev) => {
      reqStatusMap[ev.requirementId] = "UPLOADED";
    });

    const newTimelineEntry: NoticeTimelineEntry = {
      id: `time-sub-${Date.now()}`,
      date: submissionTime,
      status: "REMEDIATION_SUBMITTED",
      title: "Comprehensive CAPA & Corrective Evidence Package Submitted",
      description: `Remediation package (Ref: ${submissionRef}) furnished by ${payload.signatoryName} (${payload.designation}). Awaiting formal scrutiny by BIS Branch Office.`,
      actor: "APPLICANT",
      officialReference: submissionRef,
    };

    overrides[noticeId] = {
      ...current,
      status: "REMEDIATION_SUBMITTED",
      remediationSubmission: {
        ...payload,
        submittedAt: submissionTime,
      },
      timelineEntries: [...(current.timelineEntries || []), newTimelineEntry],
      requirementOverrides: reqStatusMap,
    };

    this.saveLocalOverrides(overrides);
    return { success: true, submissionReference: submissionRef };
  },

  getLocalOverrides(): Record<string, LocalNoticeOverride> {
    try {
      if (typeof window === "undefined") return {};
      const val = localStorage.getItem(LOCAL_LICENSE_STATE_KEY);
      return val ? JSON.parse(val) : {};
    } catch {
      return {};
    }
  },

  saveLocalOverrides(overrides: Record<string, LocalNoticeOverride>): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_LICENSE_STATE_KEY, JSON.stringify(overrides));
      }
    } catch {
      // Storage unavailable
    }
  },
};
