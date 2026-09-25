import {
  businessAccountApi,
  type BusinessInvitation,
  type BusinessMember,
  type BusinessRole,
} from "./business-account-api";
import { isDemoMode } from "./demo/demo-context";
import {
  simulateAcceptDemoInvitation,
  S28_INITIAL_DEMO_INVITATIONS,
} from "./demo/s28-demo-data";

export const staffInvitationsApi = {
  /**
   * Retrieves pending invitations for the business account.
   */
  async getInvitations(): Promise<BusinessInvitation[]> {
    const list = await businessAccountApi.getInvitations();
    if (list && list.length > 0) return list;
    return S28_INITIAL_DEMO_INVITATIONS;
  },

  /**
   * Sends an invitation to a staff member.
   */
  async sendInvitation(payload: {
    email: string;
    role: BusinessRole;
    message?: string;
  }): Promise<BusinessInvitation> {
    return businessAccountApi.sendInvitation(payload);
  },

  /**
   * Resends an existing pending invitation.
   */
  async resendInvitation(invitationId: string): Promise<boolean> {
    return businessAccountApi.resendInvitation(invitationId);
  },

  /**
   * Cancels / revokes a pending invitation.
   */
  async cancelInvitation(invitationId: string): Promise<boolean> {
    return businessAccountApi.cancelInvitation(invitationId);
  },

  /**
   * Simulates an invitee accepting the invitation.
   * STRICTLY restricted to Demo Mode only!
   */
  async simulateAccept(invitation: BusinessInvitation): Promise<{
    invitation: BusinessInvitation;
    member: BusinessMember;
  }> {
    if (!isDemoMode()) {
      throw new Error("Simulated acceptance is restricted to Demonstration Mode.");
    }

    const res = simulateAcceptDemoInvitation(invitation);

    // Persist accepted status in local business account state
    try {
      await businessAccountApi.cancelInvitation(invitation.id);
    } catch {
      // ignore
    }

    return {
      invitation: res.acceptedInvitation,
      member: res.newMember,
    };
  },
};
