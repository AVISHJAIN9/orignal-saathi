import { ShieldCheck, MoreVertical, Eye, UserCog, UserMinus, Mail, Phone, Calendar, CheckCircle2, Clock, AlertTriangle, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BusinessMember, BusinessPermissionSet, BusinessRole } from "@/lib/business-account-api";

interface TeamMemberCardProps {
  member: BusinessMember;
  currentUserPermissions: BusinessPermissionSet;
  onViewDetails: (member: BusinessMember) => void;
  onChangeRole: (member: BusinessMember) => void;
  onRemoveMember: (member: BusinessMember) => void;
}

const roleBadgeStyles: Record<BusinessRole, string> = {
  OWNER: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  COMPLIANCE_MANAGER: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  DOCUMENTATION_LEAD: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  TESTING_ENGINEER: "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  FINANCIAL_OFFICER: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300",
  AUDITOR_VIEWER: "border-border bg-muted text-foreground",
};

const avatarToneClasses: Record<string, string> = {
  navy: "bg-primary text-primary-foreground",
  sage: "bg-[#5b8a7b] text-foreground",
  clay: "bg-[#a6634b] text-foreground",
};

export function TeamMemberCard({
  member,
  currentUserPermissions,
  onViewDetails,
  onChangeRole,
  onRemoveMember,
}: TeamMemberCardProps) {
  const { t } = useTranslation("businessAccount");

  const initials =
    member.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "M";

  const isOwner = member.role === "OWNER";
  const canModifyRole = currentUserPermissions.canChangeRoles && !member.isCurrentUser;
  const canRemove = currentUserPermissions.canRemoveMembers && !member.isCurrentUser && !isOwner;

  const roleKey =
    member.role === "OWNER"
      ? "owner"
      : member.role === "COMPLIANCE_MANAGER"
      ? "complianceManager"
      : member.role === "DOCUMENTATION_LEAD"
      ? "documentationLead"
      : member.role === "TESTING_ENGINEER"
      ? "testingEngineer"
      : member.role === "FINANCIAL_OFFICER"
      ? "financialOfficer"
      : "auditorViewer";

  return (
    <Card className="group relative overflow-hidden border-border/80 bg-card/70 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar and Identity */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold shadow-sm ${
                avatarToneClasses[member.avatarTone] || avatarToneClasses["navy"]
              }`}
            >
              {initials}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {member.name}
                </span>
                {member.isCurrentUser && (
                  <Badge variant="secondary" className="text-2xs px-1.5 py-0 font-medium">
                    {t("members.youBadge")}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>

              {member.phone && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3 shrink-0" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Menu */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(member)}
              className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            >
              <Eye className="mr-1 size-3.5" />
              {t("members.viewDetails")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(member)} className="gap-2 text-xs">
                  <Eye className="size-3.5 text-muted-foreground" />
                  <span>{t("members.viewDetails")}</span>
                </DropdownMenuItem>

                {canModifyRole && (
                  <DropdownMenuItem onClick={() => onChangeRole(member)} className="gap-2 text-xs">
                    <UserCog className="size-3.5 text-muted-foreground" />
                    <span>{t("members.changeRole")}</span>
                  </DropdownMenuItem>
                )}

                {canRemove && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onRemoveMember(member)}
                      className="gap-2 text-xs text-destructive focus:text-destructive"
                    >
                      <UserMinus className="size-3.5" />
                      <span>{t("members.removeMember")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Role & Status Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
          <Badge variant="outline" className={`text-xs font-medium ${roleBadgeStyles[member.role]}`}>
            <ShieldCheck className="mr-1 size-3" />
            {t(`roles.${roleKey}`)}
          </Badge>

          <div className="flex items-center gap-2">
            {member.status === "ACTIVE" ? (
              <Badge variant="secondary" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-2xs">
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                {t("members.status.active")}
              </Badge>
            ) : member.status === "PENDING" ? (
              <Badge variant="secondary" className="gap-1 border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-2xs">
                <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                {t("members.status.pending")}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-2xs text-muted-foreground">
                {member.status}
              </Badge>
            )}

            <span className="text-2xs text-muted-foreground font-mono flex items-center gap-1">
              <Calendar className="size-3 shrink-0" />
              {new Date(member.joinedAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Assigned Responsibilities preview */}
        {member.assignedModules && member.assignedModules.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 overflow-hidden text-xs text-muted-foreground">
            <Layers className="size-3 shrink-0 text-primary/70" />
            <span className="truncate">{member.assignedModules.join(" • ")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
