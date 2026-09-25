import {
  type BusinessInvitation,
  type BusinessMember,
  type BusinessRole,
  ROLE_PERMISSIONS,
} from "../business-account-api";
import { isDemoMode, DEMO_WATERMARK_TEXT } from "./demo-context";

export interface DemoInvitationSimulationResult {
  acceptedInvitation: BusinessInvitation;
  newMember: BusinessMember;
}

export const S28_INITIAL_DEMO_INVITATIONS: BusinessInvitation[] = [
  {
    id: "inv-demo-01",
    email: "priya.nair@apex-eng.demo",
    role: "COMPLIANCE_MANAGER",
    status: "PENDING",
    invitedBy: "Rahul Sharma (Owner)",
    invitedAt: "2026-09-12T10:30:00.000Z",
    expiresAt: "2026-09-19T23:59:59.000Z",
    message: "Please join the SAATHI compliance portal to coordinate our upcoming Manesar factory audit.",
  },
  {
    id: "inv-demo-02",
    email: "amit.verma@apex-eng.demo",
    role: "TESTING_ENGINEER",
    status: "PENDING",
    invitedBy: "Rahul Sharma (Owner)",
    invitedAt: "2026-09-14T14:15:00.000Z",
    expiresAt: "2026-09-21T23:59:59.000Z",
    message: "Invited to oversee high-voltage dielectric test certificates and NABL laboratory calibration records.",
  },
];

/**
 * Simulates an invitee accepting their invitation and joining the business workspace.
 * STRICTLY available ONLY when isDemoMode() is true.
 */
export function simulateAcceptDemoInvitation(
  invitation: BusinessInvitation
): DemoInvitationSimulationResult {
  if (!isDemoMode()) {
    throw new Error("Simulated acceptance is restricted to SIH 2026 Demonstration Mode.");
  }

  const acceptedInvitation: BusinessInvitation = {
    ...invitation,
    status: "ACCEPTED",
  };

  const namePart = invitation.email.split("@")[0].replace(".", " ");
  const capitalizedName = namePart
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const newMember: BusinessMember = {
    id: `mem-sim-${Date.now()}`,
    userId: `usr-sim-${Date.now()}`,
    name: capitalizedName,
    email: invitation.email,
    role: invitation.role,
    status: "ACTIVE",
    joinedAt: new Date().toISOString(),
    avatarTone: invitation.role === "COMPLIANCE_MANAGER" ? "sage" : "navy",
    assignedModules: [
      "Compliance Calendar",
      "Factory Audits",
      "Compliance Chain",
    ],
    recentActivitySummary: `Joined workspace via accepted invitation as ${invitation.role}.`,
  };

  return {
    acceptedInvitation,
    newMember,
  };
}
