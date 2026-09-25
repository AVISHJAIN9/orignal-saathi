import { API_BASE_URL } from "./developer-data";
import { registrationApi, type BISApplication } from "./registration-api";

export type BusinessRole =
  | "OWNER"
  | "COMPLIANCE_MANAGER"
  | "DOCUMENTATION_LEAD"
  | "TESTING_ENGINEER"
  | "FINANCIAL_OFFICER"
  | "AUDITOR_VIEWER";

export type MemberStatus =
  | "ACTIVE"
  | "PENDING"
  | "EXPIRED"
  | "CANCELLED"
  | "DECLINED"
  | "DEACTIVATED";

export interface BusinessPermissionSet {
  canManageBusiness: boolean;
  canInviteMembers: boolean;
  canChangeRoles: boolean;
  canRemoveMembers: boolean;
  canManageDocuments: boolean; // S7 Document Corrections
  canManagePayments: boolean;   // S5 Payment Tracking
  canViewCompliance: boolean;   // C6 Compliance Chain
  canManageVisits: boolean;      // S6 Officer Visits
  canSubmitAppeals: boolean;     // S8 Appeals & Disputes
  canReviewAlerts: boolean;      // C8 Regulatory Alerts
  canAccessTesting: boolean;     // C7 Laboratory Matcher
}

export const ROLE_PERMISSIONS: Record<BusinessRole, BusinessPermissionSet> = {
  OWNER: {
    canManageBusiness: true,
    canInviteMembers: true,
    canChangeRoles: true,
    canRemoveMembers: true,
    canManageDocuments: true,
    canManagePayments: true,
    canViewCompliance: true,
    canManageVisits: true,
    canSubmitAppeals: true,
    canReviewAlerts: true,
    canAccessTesting: true,
  },
  COMPLIANCE_MANAGER: {
    canManageBusiness: false,
    canInviteMembers: true,
    canChangeRoles: false,
    canRemoveMembers: false,
    canManageDocuments: true,
    canManagePayments: false,
    canViewCompliance: true,
    canManageVisits: true,
    canSubmitAppeals: true,
    canReviewAlerts: true,
    canAccessTesting: true,
  },
  DOCUMENTATION_LEAD: {
    canManageBusiness: false,
    canInviteMembers: false,
    canChangeRoles: false,
    canRemoveMembers: false,
    canManageDocuments: true,
    canManagePayments: false,
    canViewCompliance: true,
    canManageVisits: false,
    canSubmitAppeals: false,
    canReviewAlerts: false,
    canAccessTesting: false,
  },
  TESTING_ENGINEER: {
    canManageBusiness: false,
    canInviteMembers: false,
    canChangeRoles: false,
    canRemoveMembers: false,
    canManageDocuments: false,
    canManagePayments: false,
    canViewCompliance: true,
    canManageVisits: false,
    canSubmitAppeals: false,
    canReviewAlerts: false,
    canAccessTesting: true,
  },
  FINANCIAL_OFFICER: {
    canManageBusiness: false,
    canInviteMembers: false,
    canChangeRoles: false,
    canRemoveMembers: false,
    canManageDocuments: false,
    canManagePayments: true,
    canViewCompliance: true,
    canManageVisits: false,
    canSubmitAppeals: false,
    canReviewAlerts: false,
    canAccessTesting: false,
  },
  AUDITOR_VIEWER: {
    canManageBusiness: false,
    canInviteMembers: false,
    canChangeRoles: false,
    canRemoveMembers: false,
    canManageDocuments: false,
    canManagePayments: false,
    canViewCompliance: true,
    canManageVisits: false,
    canSubmitAppeals: false,
    canReviewAlerts: true,
    canAccessTesting: false,
  },
};

export interface BusinessAccount {
  id: string; // e.g. "biz_apex_01"
  name: string;
  legalName: string;
  entityType: "pvt_ltd" | "public_ltd" | "llp" | "proprietorship" | "foreign";
  gstin: string;
  cin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  verified: boolean;
  memberCount: number;
  activeCount: number;
  pendingCount: number;
  activeApplicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessMember {
  id: string; // e.g. "mem_1"
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: BusinessRole;
  status: MemberStatus;
  joinedAt: string;
  invitedAt?: string;
  avatarTone: "navy" | "sage" | "clay";
  isCurrentUser?: boolean;
  assignedModules?: string[];
  recentActivitySummary?: string;
}

export interface BusinessInvitation {
  id: string; // e.g. "inv_01"
  email: string;
  role: BusinessRole;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED" | "DECLINED";
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  message?: string;
}

export interface BusinessActivityItem {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: BusinessRole;
  actionType:
    | "INVITE_SENT"
    | "INVITE_ACCEPTED"
    | "ROLE_UPDATED"
    | "MEMBER_REMOVED"
    | "DOCUMENT_CORRECTED"
    | "APPEAL_LODGED"
    | "VISIT_SCHEDULED"
    | "TEST_SUBMITTED"
    | "WORKSPACE_SWITCHED";
  description: string;
  timestamp: string;
  category: "team" | "compliance" | "documents" | "appeals" | "visits";
  deepLink?: string;
}

export interface WorkspaceMembership {
  businessId: string;
  businessName: string;
  entityType: string;
  gstin: string;
  role: BusinessRole;
  isCurrent: boolean;
  status: "ACTIVE" | "PENDING";
  memberCount: number;
  unreadAlertsCount?: number;
}

export interface BusinessAccountResult {
  business: BusinessAccount;
  currentUserRole: BusinessRole;
  currentUserPermissions: BusinessPermissionSet;
  members: BusinessMember[];
  invitations: BusinessInvitation[];
  activities: BusinessActivityItem[];
  availableWorkspaces: WorkspaceMembership[];
}

export class BusinessAccountApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public rawPayload?: unknown
  ) {
    super(message);
    this.name = "BusinessAccountApiError";
  }
}

const BUSINESS_STORAGE_KEY = "saathi:business_account_data";
const ACTIVE_WORKSPACE_KEY = "saathi:active_workspace_id";

/**
 * Authoritative API client for S9 — Multi-User Business Accounts.
 * Targets `${API_BASE_URL}/business/...` endpoints.
 * Integrates with S1 User Identity and synchronizes workspace context.
 */
export const businessAccountApi = {
  /**
   * Fetches full business account workspace context including members, invites, and permissions.
   */
  async getBusinessAccount(): Promise<BusinessAccountResult> {
    const targetUrl = `${API_BASE_URL}/business/account`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const rawData = await response.json();
        return this.normalizeBusinessResult(rawData);
      }
    } catch {
      // Offline / network fallback
    }

    return this.getDerivedBusinessContext();
  },

  /**
   * Retrieves active team members for the organization.
   */
  async getMembers(): Promise<BusinessMember[]> {
    const targetUrl = `${API_BASE_URL}/business/members`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return (await response.json()) as BusinessMember[];
      }
    } catch {
      // Fallback
    }

    const context = await this.getBusinessAccount();
    return context.members;
  },

  /**
   * Retrieves details for a specific team member.
   */
  async getMemberById(memberId: string): Promise<BusinessMember> {
    const targetUrl = `${API_BASE_URL}/business/members/${encodeURIComponent(memberId)}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return (await response.json()) as BusinessMember;
      }
    } catch {
      // Fallback
    }

    const members = await this.getMembers();
    const found = members.find((m) => m.id === memberId || m.userId === memberId);
    if (!found) {
      throw new BusinessAccountApiError(`Team member ${memberId} not found`, 404);
    }
    return found;
  },

  /**
   * Retrieves pending team invitations.
   */
  async getInvitations(): Promise<BusinessInvitation[]> {
    const targetUrl = `${API_BASE_URL}/business/invitations`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return (await response.json()) as BusinessInvitation[];
      }
    } catch {
      // Fallback
    }

    const context = await this.getBusinessAccount();
    return context.invitations;
  },

  /**
   * Sends an invitation to a colleague to join the business compliance workspace.
   */
  async sendInvitation(payload: {
    email: string;
    role: BusinessRole;
    message?: string;
  }): Promise<BusinessInvitation> {
    const targetUrl = `${API_BASE_URL}/business/invitations`;

    let result: BusinessInvitation | null = null;
    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        result = (await response.json()) as BusinessInvitation;
      }
    } catch {
      // Offline fallback
    }

    if (!result) {
      const now = new Date();
      const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      result = {
        id: `inv-${Date.now()}`,
        email: payload.email.trim().toLowerCase(),
        role: payload.role,
        status: "PENDING",
        invitedBy: "Rahul Sharma (Owner)",
        invitedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        message: payload.message,
      };
    }

    // Save locally
    this.saveLocalInvitation(result);
    this.logActivity({
      actorId: "usr_industry_01",
      actorName: "Rahul Sharma",
      actorRole: "OWNER",
      actionType: "INVITE_SENT",
      description: `Invited ${result.email} as ${result.role}`,
      category: "team",
    });

    return result;
  },

  /**
   * Cancels a pending invitation.
   */
  async cancelInvitation(invitationId: string): Promise<boolean> {
    const targetUrl = `${API_BASE_URL}/business/invitations/${encodeURIComponent(invitationId)}`;

    try {
      const response = await fetch(targetUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        this.removeLocalInvitation(invitationId);
        return true;
      }
    } catch {
      // Fallback
    }

    this.removeLocalInvitation(invitationId);
    this.logActivity({
      actorId: "usr_industry_01",
      actorName: "Rahul Sharma",
      actorRole: "OWNER",
      actionType: "INVITE_ACCEPTED",
      description: `Cancelled invitation ${invitationId}`,
      category: "team",
    });
    return true;
  },

  /**
   * Resends a pending invitation.
   */
  async resendInvitation(invitationId: string): Promise<boolean> {
    const targetUrl = `${API_BASE_URL}/business/invitations/${encodeURIComponent(invitationId)}/resend`;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) return true;
    } catch {
      // Fallback
    }

    return true;
  },

  /**
   * Modifies the role and permission tier of a team member.
   */
  async updateMemberRole(memberId: string, newRole: BusinessRole): Promise<BusinessMember> {
    const targetUrl = `${API_BASE_URL}/business/members/${encodeURIComponent(memberId)}/role`;

    let updatedMember: BusinessMember | null = null;
    try {
      const response = await fetch(targetUrl, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        updatedMember = (await response.json()) as BusinessMember;
      }
    } catch {
      // Fallback
    }

    const members = await this.getMembers();
    const existing = members.find((m) => m.id === memberId);
    if (!existing) {
      throw new BusinessAccountApiError("Member not found", 404);
    }

    const member: BusinessMember = updatedMember || {
      ...existing,
      role: newRole,
    };

    this.saveLocalMember(member);
    this.logActivity({
      actorId: "usr_industry_01",
      actorName: "Rahul Sharma",
      actorRole: "OWNER",
      actionType: "ROLE_UPDATED",
      description: `Updated role for ${member.name} to ${newRole}`,
      category: "team",
    });

    return member;
  },

  /**
   * Revokes a member's access from the business account.
   */
  async removeMember(memberId: string): Promise<boolean> {
    const targetUrl = `${API_BASE_URL}/business/members/${encodeURIComponent(memberId)}`;

    try {
      const response = await fetch(targetUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        this.deleteLocalMember(memberId);
        return true;
      }
    } catch {
      // Fallback
    }

    const members = await this.getMembers();
    const existing = members.find((m) => m.id === memberId);
    if (existing) {
      this.deleteLocalMember(memberId);
      this.logActivity({
        actorId: "usr_industry_01",
        actorName: "Rahul Sharma",
        actorRole: "OWNER",
        actionType: "MEMBER_REMOVED",
        description: `Removed ${existing.name} (${existing.email}) from business account`,
        category: "team",
      });
    }

    return true;
  },

  /**
   * Retrieves business activity audit trail logs.
   */
  async getActivity(): Promise<BusinessActivityItem[]> {
    const targetUrl = `${API_BASE_URL}/business/activity`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return (await response.json()) as BusinessActivityItem[];
      }
    } catch {
      // Fallback
    }

    const context = await this.getBusinessAccount();
    return context.activities;
  },

  /**
   * Retrieves available business workspaces for account switching.
   */
  async getWorkspaces(): Promise<WorkspaceMembership[]> {
    const targetUrl = `${API_BASE_URL}/business/workspaces`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return (await response.json()) as WorkspaceMembership[];
      }
    } catch {
      // Fallback
    }

    const context = await this.getBusinessAccount();
    return context.availableWorkspaces;
  },

  /**
   * Switches the active business workspace.
   */
  async switchWorkspace(businessId: string): Promise<BusinessAccountResult> {
    const targetUrl = `${API_BASE_URL}/business/workspaces/switch`;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessId }),
      });

      if (response.ok) {
        const raw = await response.json();
        return this.normalizeBusinessResult(raw);
      }
    } catch {
      // Fallback
    }

    try {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, businessId);
    } catch {
      // Ignore
    }

    this.logActivity({
      actorId: "usr_industry_01",
      actorName: "Rahul Sharma",
      actorRole: "OWNER",
      actionType: "WORKSPACE_SWITCHED",
      description: `Switched active compliance workspace to ${businessId}`,
      category: "compliance",
    });

    return this.getDerivedBusinessContext();
  },

  /**
   * Helper to derive baseline business data synchronized with active registration & applications.
   */
  async getDerivedBusinessContext(): Promise<BusinessAccountResult> {
    let app: BISApplication | null = null;
    try {
      app = await registrationApi.getApplication();
    } catch {
      // Default
    }

    let activeWorkspaceId = "biz_apex_01";
    try {
      const storedWorkspace = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
      if (storedWorkspace) activeWorkspaceId = storedWorkspace;
    } catch {
      // Ignore
    }

    const isSecondaryWorkspace = activeWorkspaceId === "biz_apex_solar";

    const business: BusinessAccount = isSecondaryWorkspace
      ? {
          id: "biz_apex_solar",
          name: "Apex Solar Solutions Ltd",
          legalName: "Apex Solar Solutions Public Limited",
          entityType: "public_ltd",
          gstin: "GSTIN-000003",
          cin: "CIN-000003",
          address: "Solar Tech Park, Block C, Okhla Phase III",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110020",
          status: "ACTIVE",
          verified: true,
          memberCount: 3,
          activeCount: 3,
          pendingCount: 0,
          activeApplicationsCount: 1,
          createdAt: "2026-01-15T09:00:00Z",
          updatedAt: "2026-09-10T12:00:00Z",
        }
      : {
          id: "biz_apex_01",
          name: app?.business.orgName || "Apex Engineering Pvt Ltd",
          legalName: "Apex Engineering Private Limited",
          entityType: (app?.business.businessType as any) || "pvt_ltd",
          gstin: app?.business.gstin || "GSTIN-000001",
          cin: app?.business.cin || "CIN-000001",
          address: app?.business.address || "Plot 42, Sector 5, IMT Manesar",
          city: app?.business.city || "Gurugram",
          state: app?.business.state || "Haryana",
          pincode: app?.business.pincode || "122050",
          status: "ACTIVE",
          verified: true,
          memberCount: 4,
          activeCount: 3,
          pendingCount: 1,
          activeApplicationsCount: 2,
          createdAt: "2026-02-10T10:00:00Z",
          updatedAt: "2026-09-14T08:00:00Z",
        };

    const defaultMembers: BusinessMember[] = isSecondaryWorkspace
      ? [
          {
            id: "mem_solar_1",
            userId: "usr_industry_01",
            name: "Rahul Sharma",
            email: "rahul.sharma@apexsolar.in",
            phone: "+91 98765 43210",
            role: "OWNER",
            status: "ACTIVE",
            joinedAt: "2026-01-15T09:00:00Z",
            avatarTone: "navy",
            isCurrentUser: true,
            assignedModules: ["Executive Oversight", "Appeals", "Treasury"],
            recentActivitySummary: "Approved IS 14286 Photovoltaic module certification filing.",
          },
          {
            id: "mem_solar_2",
            userId: "usr_solar_02",
            name: "Vikram Mehta",
            email: "vikram.mehta@apexsolar.in",
            phone: "+91 98112 23344",
            role: "COMPLIANCE_MANAGER",
            status: "ACTIVE",
            joinedAt: "2026-02-01T11:00:00Z",
            avatarTone: "sage",
            assignedModules: ["Standards Browser", "Compliance Chain", "Regulatory Alerts"],
            recentActivitySummary: "Monitored Solar PV Inverters QCO revision.",
          },
          {
            id: "mem_solar_3",
            userId: "usr_solar_03",
            name: "Divya Nair",
            email: "divya.nair@apexsolar.in",
            phone: "+91 99223 34455",
            role: "DOCUMENTATION_LEAD",
            status: "ACTIVE",
            joinedAt: "2026-03-10T14:30:00Z",
            avatarTone: "clay",
            assignedModules: ["Document Vault", "Document Corrections"],
            recentActivitySummary: "Updated IEC/IS test certificates.",
          },
        ]
      : [
          {
            id: "mem_1",
            userId: "usr_industry_01",
            name: "Rahul Sharma",
            email: "rahul.sharma@apexeng.in",
            phone: "+91 98765 43210",
            role: "OWNER",
            status: "ACTIVE",
            joinedAt: "2026-02-10T10:00:00Z",
            avatarTone: "navy",
            isCurrentUser: true,
            assignedModules: ["Overall Compliance", "Disputes", "Sign-offs"],
            recentActivitySummary: "Submitted Application APP-2026-8841 for Submersible Pumps.",
          },
          {
            id: "mem_2",
            userId: "usr_ind_02",
            name: "Priya Sharma",
            email: "priya.sharma@apexeng.in",
            phone: "+91 98765 12345",
            role: "COMPLIANCE_MANAGER",
            status: "ACTIVE",
            joinedAt: "2026-03-01T11:30:00Z",
            avatarTone: "sage",
            assignedModules: ["Compliance Chain", "Regulatory Alerts", "Officer Visits"],
            recentActivitySummary: "Reviewed clause-by-clause STI requirements for IS 14543.",
          },
          {
            id: "mem_3",
            userId: "usr_ind_03",
            name: "Ananya Deshmukh",
            email: "ananya.d@apexeng.in",
            phone: "+91 91234 56789",
            role: "DOCUMENTATION_LEAD",
            status: "ACTIVE",
            joinedAt: "2026-04-15T09:45:00Z",
            avatarTone: "clay",
            assignedModules: ["Document Corrections", "Document Cortex"],
            recentActivitySummary: "Re-submitted corrected Factory Layout & Equipment Undertaking.",
          },
          {
            id: "mem_4",
            userId: "usr_ind_04",
            name: "Kartik Raman",
            email: "kartik.raman@apexeng.in",
            phone: "+91 93456 78901",
            role: "TESTING_ENGINEER",
            status: "ACTIVE",
            joinedAt: "2026-05-20T14:15:00Z",
            avatarTone: "sage",
            assignedModules: ["Laboratory Matcher", "Sample Test Tracking"],
            recentActivitySummary: "Matched NABL-accredited test lab for IS 14543 pressure testing.",
          },
        ];

    const defaultInvitations: BusinessInvitation[] = isSecondaryWorkspace
      ? []
      : [
          {
            id: "inv_01",
            email: "suresh.finance@apexeng.in",
            role: "FINANCIAL_OFFICER",
            status: "PENDING",
            invitedBy: "Rahul Sharma (Owner)",
            invitedAt: "2026-09-10T14:30:00Z",
            expiresAt: "2026-09-17T14:30:00Z",
            message: "Please join our BIS compliance workspace to oversee certification fee challans and receipts.",
          },
        ];

    const defaultActivities: BusinessActivityItem[] = [
      {
        id: "act_01",
        actorId: "usr_ind_03",
        actorName: "Ananya Deshmukh",
        actorRole: "DOCUMENTATION_LEAD",
        actionType: "DOCUMENT_CORRECTED",
        description: "Re-submitted Factory Layout & Calibration Certificates for APP-2026-8841",
        timestamp: "2026-09-14T07:45:00Z",
        category: "documents",
        deepLink: "/document-corrections",
      },
      {
        id: "act_02",
        actorId: "usr_ind_02",
        actorName: "Priya Sharma",
        actorRole: "COMPLIANCE_MANAGER",
        actionType: "VISIT_SCHEDULED",
        description: "Confirmed BIS Technical Officer factory inspection visit for 22 Sep 2026",
        timestamp: "2026-09-13T16:20:00Z",
        category: "visits",
        deepLink: "/officer-visits",
      },
      {
        id: "act_03",
        actorId: "usr_industry_01",
        actorName: "Rahul Sharma",
        actorRole: "OWNER",
        actionType: "INVITE_SENT",
        description: "Sent workspace invitation to suresh.finance@apexeng.in as Financial Officer",
        timestamp: "2026-09-10T14:30:00Z",
        category: "team",
      },
      {
        id: "act_04",
        actorId: "usr_ind_04",
        actorName: "Kartik Raman",
        actorRole: "TESTING_ENGINEER",
        actionType: "TEST_SUBMITTED",
        description: "Matched sample test parameters with Regional Laboratory Delhi",
        timestamp: "2026-09-08T11:10:00Z",
        category: "compliance",
        deepLink: "/laboratory-matcher",
      },
    ];

    const availableWorkspaces: WorkspaceMembership[] = [
      {
        businessId: "biz_apex_01",
        businessName: "Apex Engineering Pvt Ltd",
        entityType: "Private Limited",
        gstin: "GSTIN-000001",
        role: "OWNER",
        isCurrent: !isSecondaryWorkspace,
        status: "ACTIVE",
        memberCount: 4,
        unreadAlertsCount: 2,
      },
      {
        businessId: "biz_apex_solar",
        businessName: "Apex Solar Solutions Ltd",
        entityType: "Public Limited",
        gstin: "GSTIN-000003",
        role: "OWNER",
        isCurrent: isSecondaryWorkspace,
        status: "ACTIVE",
        memberCount: 3,
        unreadAlertsCount: 0,
      },
    ];

    // Merge with any locally stored updates
    let storedData: any = {};
    try {
      const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
      if (stored) storedData = JSON.parse(stored);
    } catch {
      // Ignore
    }

    const localMembersMap = storedData.members || {};
    const localInvitesMap = storedData.invitations || {};
    const localDeletedMemberIds: string[] = storedData.deletedMemberIds || [];
    const localDeletedInviteIds: string[] = storedData.deletedInviteIds || [];
    const localActivities: BusinessActivityItem[] = storedData.activities || [];

    // Filter and merge members
    let mergedMembers = defaultMembers
      .filter((m) => !localDeletedMemberIds.includes(m.id))
      .map((m) => (localMembersMap[m.id] ? { ...m, ...localMembersMap[m.id] } : m));

    // Filter and merge invitations
    let mergedInvites = defaultInvitations
      .filter((i) => !localDeletedInviteIds.includes(i.id))
      .map((i) => (localInvitesMap[i.id] ? { ...i, ...localInvitesMap[i.id] } : i));

    // Add any newly created invitations from storage
    Object.values(localInvitesMap).forEach((inv: any) => {
      if (
        !mergedInvites.some((i) => i.id === inv.id) &&
        !localDeletedInviteIds.includes(inv.id)
      ) {
        mergedInvites.unshift(inv);
      }
    });

    const mergedActivities = [...localActivities, ...defaultActivities].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const currentUserRole: BusinessRole = "OWNER";
    const currentUserPermissions = ROLE_PERMISSIONS[currentUserRole];

    return {
      business: {
        ...business,
        memberCount: mergedMembers.length + mergedInvites.length,
        activeCount: mergedMembers.filter((m) => m.status === "ACTIVE").length,
        pendingCount: mergedInvites.filter((i) => i.status === "PENDING").length,
      },
      currentUserRole,
      currentUserPermissions,
      members: mergedMembers,
      invitations: mergedInvites,
      activities: mergedActivities,
      availableWorkspaces,
    };
  },

  normalizeBusinessResult(raw: any): BusinessAccountResult {
    const role: BusinessRole = raw.currentUserRole || "OWNER";
    return {
      business: raw.business,
      currentUserRole: role,
      currentUserPermissions: raw.currentUserPermissions || ROLE_PERMISSIONS[role],
      members: raw.members || [],
      invitations: raw.invitations || [],
      activities: raw.activities || [],
      availableWorkspaces: raw.availableWorkspaces || [],
    };
  },

  saveLocalMember(member: BusinessMember) {
    try {
      const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      data.members = data.members || {};
      data.members[member.id] = member;
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  },

  deleteLocalMember(memberId: string) {
    try {
      const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      data.deletedMemberIds = data.deletedMemberIds || [];
      if (!data.deletedMemberIds.includes(memberId)) {
        data.deletedMemberIds.push(memberId);
      }
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  },

  saveLocalInvitation(invitation: BusinessInvitation) {
    try {
      const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      data.invitations = data.invitations || {};
      data.invitations[invitation.id] = invitation;
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  },

  removeLocalInvitation(invitationId: string) {
    try {
      const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      data.deletedInviteIds = data.deletedInviteIds || [];
      if (!data.deletedInviteIds.includes(invitationId)) {
        data.deletedInviteIds.push(invitationId);
      }
      if (data.invitations && data.invitations[invitationId]) {
        delete data.invitations[invitationId];
      }
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  },

  logActivity(activity: Omit<BusinessActivityItem, "id" | "timestamp">) {
    try {
      const item: BusinessActivityItem = {
        ...activity,
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      data.activities = data.activities || [];
      data.activities.unshift(item);
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  },
};
