import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Mail, Phone, Calendar, Layers, Activity, User, X } from "lucide-react";
import { ROLE_PERMISSIONS, type BusinessMember, type BusinessRole } from "@/lib/business-account-api";

interface MemberDetailsDialogProps {
  member: BusinessMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleKeys: Record<BusinessRole, string> = {
  OWNER: "owner",
  COMPLIANCE_MANAGER: "complianceManager",
  DOCUMENTATION_LEAD: "documentationLead",
  TESTING_ENGINEER: "testingEngineer",
  FINANCIAL_OFFICER: "financialOfficer",
  AUDITOR_VIEWER: "auditorViewer",
};

export function MemberDetailsDialog({
  member,
  open,
  onOpenChange,
}: MemberDetailsDialogProps) {
  const { t } = useTranslation("businessAccount");

  if (!member) return null;

  const permissions = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.AUDITOR_VIEWER;

  const permissionItems = [
    { key: "canManageBusiness", label: t("permissions.canManageBusiness"), granted: permissions.canManageBusiness },
    { key: "canInviteMembers", label: t("permissions.canInviteMembers"), granted: permissions.canInviteMembers },
    { key: "canChangeRoles", label: t("permissions.canChangeRoles"), granted: permissions.canChangeRoles },
    { key: "canRemoveMembers", label: t("permissions.canRemoveMembers"), granted: permissions.canRemoveMembers },
    { key: "canManageDocuments", label: t("permissions.canManageDocuments"), granted: permissions.canManageDocuments },
    { key: "canManagePayments", label: t("permissions.canManagePayments"), granted: permissions.canManagePayments },
    { key: "canViewCompliance", label: t("permissions.canViewCompliance"), granted: permissions.canViewCompliance },
    { key: "canManageVisits", label: t("permissions.canManageVisits"), granted: permissions.canManageVisits },
    { key: "canSubmitAppeals", label: t("permissions.canSubmitAppeals"), granted: permissions.canSubmitAppeals },
    { key: "canReviewAlerts", label: t("permissions.canReviewAlerts"), granted: permissions.canReviewAlerts },
    { key: "canAccessTesting", label: t("permissions.canAccessTesting"), granted: permissions.canAccessTesting },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <User className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {member.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t(`roles.${roleKeys[member.role]}`)} • {member.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2 text-sm">
          {/* Contact & Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border/80 bg-muted/40 p-3.5">
            <div className="space-y-1">
              <span className="text-2xs uppercase font-mono text-muted-foreground">
                {t("details.email")}
              </span>
              <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-foreground">
                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>

            {member.phone && (
              <div className="space-y-1">
                <span className="text-2xs uppercase font-mono text-muted-foreground">
                  {t("details.phone")}
                </span>
                <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-foreground">
                  <Phone className="size-3.5 text-muted-foreground shrink-0" />
                  <span>{member.phone}</span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-2xs uppercase font-mono text-muted-foreground">
                {t("details.status")}
              </span>
              <div>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {member.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-2xs uppercase font-mono text-muted-foreground">
                {t("details.joinedDate")}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-foreground">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <span>{new Date(member.joinedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
              </div>
            </div>
          </div>

          {/* Assigned Modules / Responsibilities */}
          {member.assignedModules && member.assignedModules.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                <Layers className="size-3.5 text-primary" />
                {t("details.assignedTitle")}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {member.assignedModules.map((mod, i) => (
                  <Badge key={i} variant="outline" className="border-border bg-background text-xs py-1 px-2.5">
                    {mod}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Granular Permissions List */}
          <div className="space-y-2.5">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              <ShieldCheck className="size-3.5 text-primary" />
              {t("details.permissionsTitle")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-border/80 bg-background/50 p-3">
              {permissionItems.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                    item.granted
                      ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-medium"
                      : "text-muted-foreground/60 line-through opacity-70"
                  }`}
                >
                  {item.granted ? (
                    <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <X className="size-3.5 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Individual Activity */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              <Activity className="size-3.5 text-primary" />
              {t("details.recentActivityTitle")}
            </h4>
            <div className="rounded-xl border border-border/70 bg-card p-3 text-xs text-foreground">
              {member.recentActivitySummary ? (
                <p className="leading-relaxed">{member.recentActivitySummary}</p>
              ) : (
                <p className="text-muted-foreground italic">{t("details.noActivity")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            {t("details.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
