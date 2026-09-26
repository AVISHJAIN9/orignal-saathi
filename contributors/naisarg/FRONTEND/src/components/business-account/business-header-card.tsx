import { Building2, CheckCircle2, ShieldCheck, Users, ArrowRightLeft, MapPin, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BusinessAccount, BusinessRole, WorkspaceMembership } from "@/lib/business-account-api";

interface BusinessHeaderCardProps {
  business: BusinessAccount;
  currentUserRole: BusinessRole;
  availableWorkspaces: WorkspaceMembership[];
  onOpenWorkspaceSwitcher: () => void;
  onOpenInviteModal: () => void;
  canInvite: boolean;
}

const roleBadgeColors: Record<BusinessRole, string> = {
  OWNER: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300",
  COMPLIANCE_MANAGER: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
  DOCUMENTATION_LEAD: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-300",
  TESTING_ENGINEER: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30 dark:text-cyan-300",
  FINANCIAL_OFFICER: "bg-purple-500/15 text-purple-700 border-purple-500/30 dark:text-purple-300",
  AUDITOR_VIEWER: "bg-muted text-foreground border-border",
};

export function BusinessHeaderCard({
  business,
  currentUserRole,
  availableWorkspaces,
  onOpenWorkspaceSwitcher,
  onOpenInviteModal,
  canInvite,
}: BusinessHeaderCardProps) {
  const { t } = useTranslation("businessAccount");

  const roleKey =
    currentUserRole === "OWNER"
      ? "owner"
      : currentUserRole === "COMPLIANCE_MANAGER"
      ? "complianceManager"
      : currentUserRole === "DOCUMENTATION_LEAD"
      ? "documentationLead"
      : currentUserRole === "TESTING_ENGINEER"
      ? "testingEngineer"
      : currentUserRole === "FINANCIAL_OFFICER"
      ? "financialOfficer"
      : "auditorViewer";

  return (
    <Card className="w-full overflow-hidden border-border/70 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-md">
      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Main Header Info & Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Organization Identity */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20">
              <Building2 className="size-6 sm:size-7" />
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground truncate max-w-full">
                  {business.name}
                </h2>
                {business.verified && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-2xs sm:text-xs font-medium shrink-0"
                  >
                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                    {t("businessInfo.verifiedBusiness")}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-2xs uppercase font-mono tracking-wider shrink-0">
                  {business.entityType.replace("_", " ")}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{business.address}, {business.city}, {business.state} - {business.pincode}</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Hash className="size-3" />
                  <strong className="font-semibold text-foreground/80">{t("businessInfo.gstin")}:</strong> {business.gstin}
                </span>
                <span className="hidden sm:inline text-muted-foreground/40">•</span>
                <span>
                  <strong className="font-semibold text-foreground/80">{t("businessInfo.cin")}:</strong> {business.cin}
                </span>
              </div>
            </div>
          </div>

          {/* User Role Badge & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 lg:max-w-md lg:justify-end">
            {/* Current Role Card */}
            <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/70 px-3 py-1.5 backdrop-blur-sm shadow-2xs">
              <div className="flex flex-col">
                <span className="text-2xs uppercase font-mono tracking-wider text-muted-foreground">
                  {t("businessInfo.currentRole")}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="size-3 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    {t(`roles.${roleKey}`)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {availableWorkspaces.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenWorkspaceSwitcher}
                  className="gap-1.5 h-9 text-xs border-border/80 bg-background/50 hover:bg-background/90"
                >
                  <ArrowRightLeft className="size-3.5 text-primary" />
                  <span>{t("businessInfo.switchWorkspace")}</span>
                  <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-2xs font-mono">
                    {availableWorkspaces.length}
                  </Badge>
                </Button>
              )}

              {canInvite && (
                <Button
                  size="sm"
                  onClick={onOpenInviteModal}
                  className="gap-1.5 h-9 text-xs shadow-sm"
                >
                  <Users className="size-3.5" />
                  <span>{t("members.inviteMember")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Quick Metrics */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 border-t border-border/60 pt-3.5">
          <div className="flex flex-col rounded-xl bg-background/50 p-2.5 sm:p-3 border border-border/50">
            <span className="text-2xs sm:text-xs text-muted-foreground font-medium">{t("stats.totalMembers")}</span>
            <span className="text-base sm:text-lg font-bold text-foreground mt-0.5">{business.memberCount}</span>
          </div>

          <div className="flex flex-col rounded-xl bg-background/50 p-2.5 sm:p-3 border border-border/50">
            <span className="text-2xs sm:text-xs text-muted-foreground font-medium">{t("stats.activeMembers")}</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {business.activeCount}
            </span>
          </div>

          <div className="flex flex-col rounded-xl bg-background/50 p-2.5 sm:p-3 border border-border/50">
            <span className="text-2xs sm:text-xs text-muted-foreground font-medium">{t("stats.pendingInvites")}</span>
            <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {business.pendingCount}
            </span>
          </div>

          <div className="flex flex-col rounded-xl bg-background/50 p-2.5 sm:p-3 border border-border/50">
            <span className="text-2xs sm:text-xs text-muted-foreground font-medium">{t("stats.assignedApps")}</span>
            <span className="text-base sm:text-lg font-bold text-primary mt-0.5">
              {business.activeApplicationsCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
