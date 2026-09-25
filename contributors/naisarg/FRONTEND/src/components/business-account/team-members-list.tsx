import { useState } from "react";
import { Search, Filter, Users, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMemberCard } from "./team-member-card";
import type { BusinessMember, BusinessPermissionSet, BusinessRole } from "@/lib/business-account-api";

interface TeamMembersListProps {
  members: BusinessMember[];
  currentUserPermissions: BusinessPermissionSet;
  onViewDetails: (member: BusinessMember) => void;
  onChangeRole: (member: BusinessMember) => void;
  onRemoveMember: (member: BusinessMember) => void;
  onOpenInviteModal: () => void;
}

export function TeamMembersList({
  members,
  currentUserPermissions,
  onViewDetails,
  onChangeRole,
  onRemoveMember,
  onOpenInviteModal,
}: TeamMembersListProps) {
  const { t } = useTranslation("businessAccount");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "ALL" || member.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("members.searchPlaceholder")}
            className="pl-9 bg-card/80 border-border/80 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-xs bg-card/80">
              <Filter className="mr-1.5 size-3 text-muted-foreground" />
              <SelectValue placeholder={t("members.filterRoleAll")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("members.filterRoleAll")}</SelectItem>
              <SelectItem value="OWNER">{t("roles.owner")}</SelectItem>
              <SelectItem value="COMPLIANCE_MANAGER">{t("roles.complianceManager")}</SelectItem>
              <SelectItem value="DOCUMENTATION_LEAD">{t("roles.documentationLead")}</SelectItem>
              <SelectItem value="TESTING_ENGINEER">{t("roles.testingEngineer")}</SelectItem>
              <SelectItem value="FINANCIAL_OFFICER">{t("roles.financialOfficer")}</SelectItem>
              <SelectItem value="AUDITOR_VIEWER">{t("roles.auditorViewer")}</SelectItem>
            </SelectContent>
          </Select>

          {currentUserPermissions.canInviteMembers && (
            <Button
              size="sm"
              onClick={onOpenInviteModal}
              className="h-9 gap-1.5 text-xs shrink-0"
            >
              <UserPlus className="size-3.5" />
              <span className="hidden xs:inline">{t("members.inviteMember")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              currentUserPermissions={currentUserPermissions}
              onViewDetails={onViewDetails}
              onChangeRole={onChangeRole}
              onRemoveMember={onRemoveMember}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <Users className="size-6" />
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base">
            {t("members.noMembers")}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Try adjusting your search query or role filters.
          </p>
          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setRoleFilter("ALL");
              }}
              className="mt-4 text-xs h-8"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
