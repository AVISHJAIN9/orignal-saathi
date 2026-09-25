import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Mail,
  ShieldCheck,
  Building2,
  Activity,
  RotateCw,
  AlertCircle,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessHeaderCard } from "./business-header-card";
import { TeamMembersList } from "./team-members-list";
import { MemberDetailsDialog } from "./member-details-dialog";
import { InviteMemberDialog } from "./invite-member-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { WorkspaceSwitcherDialog } from "./workspace-switcher-dialog";
import { PendingInvitationsView } from "./pending-invitations-view";
import { RolesPermissionsView } from "./roles-permissions-view";
import { WorkspaceContextView } from "./workspace-context-view";
import { BusinessActivityFeed } from "./business-activity-feed";
import {
  businessAccountApi,
  type BusinessAccountResult,
  type BusinessMember,
  type BusinessRole,
  type BusinessInvitation,
} from "@/lib/business-account-api";

export function BusinessAccountView() {
  const { t } = useTranslation("businessAccount");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BusinessAccountResult | null>(null);

  // Dialog States
  const [selectedMemberForDetails, setSelectedMemberForDetails] = useState<BusinessMember | null>(null);
  const [selectedMemberForRoleChange, setSelectedMemberForRoleChange] = useState<BusinessMember | null>(null);
  const [selectedMemberForRemoval, setSelectedMemberForRemoval] = useState<BusinessMember | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [switcherModalOpen, setSwitcherModalOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("members");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await businessAccountApi.getBusinessAccount();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions Handlers
  const handleSendInvitation = async (payload: { email: string; role: BusinessRole; message?: string }): Promise<BusinessInvitation> => {
    const inv = await businessAccountApi.sendInvitation(payload);
    await loadData();
    return inv;
  };

  const handleCancelInvitation = async (invitationId: string): Promise<boolean> => {
    const res = await businessAccountApi.cancelInvitation(invitationId);
    await loadData();
    return res;
  };

  const handleResendInvitation = async (invitationId: string): Promise<boolean> => {
    const res = await businessAccountApi.resendInvitation(invitationId);
    await loadData();
    return res;
  };

  const handleUpdateRole = async (memberId: string, newRole: BusinessRole): Promise<BusinessMember> => {
    const res = await businessAccountApi.updateMemberRole(memberId, newRole);
    await loadData();
    return res;
  };

  const handleRemoveMember = async (memberId: string): Promise<boolean> => {
    const res = await businessAccountApi.removeMember(memberId);
    await loadData();
    return res;
  };

  const handleSwitchWorkspace = async (businessId: string): Promise<void> => {
    await businessAccountApi.switchWorkspace(businessId);
    await loadData();
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>
        </Card>

        {/* Tab & Content Skeleton */}
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            {t("errors.loadFailed")}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            {error || "We could not connect to the business account API. Please try again."}
          </p>
          <Button onClick={loadData} size="sm" className="mt-2 gap-1.5">
            <RotateCw className="size-3.5" />
            <span>{t("errors.retry")}</span>
          </Button>
        </div>
      </Card>
    );
  }

  const { business, currentUserRole, currentUserPermissions, members, invitations, activities, availableWorkspaces } = data;
  const pendingCount = invitations.filter((i) => i.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Top Organization Header */}
      <BusinessHeaderCard
        business={business}
        currentUserRole={currentUserRole}
        availableWorkspaces={availableWorkspaces}
        onOpenWorkspaceSwitcher={() => setSwitcherModalOpen(true)}
        onOpenInviteModal={() => setInviteModalOpen(true)}
        canInvite={currentUserPermissions.canInviteMembers}
      />

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto p-1 bg-muted/60 rounded-xl h-auto flex flex-wrap gap-1 border border-border/60">
          <TabsTrigger value="members" className="gap-1.5 text-xs py-2 px-3">
            <Users className="size-3.5" />
            <span>{t("tabs.members")}</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-2xs font-mono">
              {members.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="invitations" className="gap-1.5 text-xs py-2 px-3">
            <Mail className="size-3.5" />
            <span>{t("tabs.invitations")}</span>
            {pendingCount > 0 && (
              <Badge variant="default" className="ml-1 px-1.5 py-0 text-2xs font-mono bg-amber-600 text-foreground">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="roles" className="gap-1.5 text-xs py-2 px-3">
            <ShieldCheck className="size-3.5" />
            <span>{t("tabs.roles")}</span>
          </TabsTrigger>

          <TabsTrigger value="workspace" className="gap-1.5 text-xs py-2 px-3">
            <Building2 className="size-3.5" />
            <span>{t("tabs.workspace")}</span>
          </TabsTrigger>

          <TabsTrigger value="activity" className="gap-1.5 text-xs py-2 px-3">
            <Activity className="size-3.5" />
            <span>{t("tabs.activity")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Team Members */}
        <TabsContent value="members" className="space-y-4 focus-visible:outline-none">
          <TeamMembersList
            members={members}
            currentUserPermissions={currentUserPermissions}
            onViewDetails={(m) => setSelectedMemberForDetails(m)}
            onChangeRole={(m) => setSelectedMemberForRoleChange(m)}
            onRemoveMember={(m) => setSelectedMemberForRemoval(m)}
            onOpenInviteModal={() => setInviteModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 2: Pending Invitations */}
        <TabsContent value="invitations" className="space-y-4 focus-visible:outline-none">
          <PendingInvitationsView
            invitations={invitations}
            currentUserPermissions={currentUserPermissions}
            onCancelInvite={handleCancelInvitation}
            onResendInvite={handleResendInvitation}
            onOpenInviteModal={() => setInviteModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 3: Roles & Permissions Matrix */}
        <TabsContent value="roles" className="space-y-4 focus-visible:outline-none">
          <RolesPermissionsView />
        </TabsContent>

        {/* Tab 4: Shared Workspace Context */}
        <TabsContent value="workspace" className="space-y-4 focus-visible:outline-none">
          <WorkspaceContextView business={business} members={members} />
        </TabsContent>

        {/* Tab 5: Activity Audit Log */}
        <TabsContent value="activity" className="space-y-4 focus-visible:outline-none">
          <BusinessActivityFeed activities={activities} />
        </TabsContent>
      </Tabs>

      {/* Modals & Dialogs */}
      <MemberDetailsDialog
        member={selectedMemberForDetails}
        open={selectedMemberForDetails !== null}
        onOpenChange={(open) => !open && setSelectedMemberForDetails(null)}
      />

      <InviteMemberDialog
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onSendInvitation={handleSendInvitation}
      />

      <ChangeRoleDialog
        member={selectedMemberForRoleChange}
        open={selectedMemberForRoleChange !== null}
        onOpenChange={(open) => !open && setSelectedMemberForRoleChange(null)}
        onUpdateRole={handleUpdateRole}
      />

      <RemoveMemberDialog
        member={selectedMemberForRemoval}
        open={selectedMemberForRemoval !== null}
        onOpenChange={(open) => !open && setSelectedMemberForRemoval(null)}
        onConfirmRemove={handleRemoveMember}
      />

      <WorkspaceSwitcherDialog
        workspaces={availableWorkspaces}
        open={switcherModalOpen}
        onOpenChange={setSwitcherModalOpen}
        onSelectWorkspace={handleSwitchWorkspace}
      />
    </div>
  );
}
