import { useTranslation } from "react-i18next";
import { Check, X, Shield, ShieldCheck, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_PERMISSIONS, type BusinessRole } from "@/lib/business-account-api";

export function RolesPermissionsView() {
  const { t } = useTranslation("businessAccount");

  const roles: BusinessRole[] = [
    "OWNER",
    "COMPLIANCE_MANAGER",
    "DOCUMENTATION_LEAD",
    "TESTING_ENGINEER",
    "FINANCIAL_OFFICER",
    "AUDITOR_VIEWER",
  ];

  const permissionKeys = [
    { key: "canManageBusiness", label: t("permissions.canManageBusiness") },
    { key: "canInviteMembers", label: t("permissions.canInviteMembers") },
    { key: "canChangeRoles", label: t("permissions.canChangeRoles") },
    { key: "canRemoveMembers", label: t("permissions.canRemoveMembers") },
    { key: "canManageDocuments", label: t("permissions.canManageDocuments") },
    { key: "canManagePayments", label: t("permissions.canManagePayments") },
    { key: "canViewCompliance", label: t("permissions.canViewCompliance") },
    { key: "canManageVisits", label: t("permissions.canManageVisits") },
    { key: "canSubmitAppeals", label: t("permissions.canSubmitAppeals") },
    { key: "canReviewAlerts", label: t("permissions.canReviewAlerts") },
    { key: "canAccessTesting", label: t("permissions.canAccessTesting") },
  ] as const;

  const roleNameMap: Record<BusinessRole, string> = {
    OWNER: t("roles.owner"),
    COMPLIANCE_MANAGER: t("roles.complianceManager"),
    DOCUMENTATION_LEAD: t("roles.documentationLead"),
    TESTING_ENGINEER: t("roles.testingEngineer"),
    FINANCIAL_OFFICER: t("roles.financialOfficer"),
    AUDITOR_VIEWER: t("roles.auditorViewer"),
  };

  const roleDescMap: Record<BusinessRole, string> = {
    OWNER: t("roles.descriptions.owner"),
    COMPLIANCE_MANAGER: t("roles.descriptions.complianceManager"),
    DOCUMENTATION_LEAD: t("roles.descriptions.documentationLead"),
    TESTING_ENGINEER: t("roles.descriptions.testingEngineer"),
    FINANCIAL_OFFICER: t("roles.descriptions.financialOfficer"),
    AUDITOR_VIEWER: t("roles.descriptions.auditorViewer"),
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {roles.map((r) => (
          <Card key={r} className="border-border/80 bg-card/70 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  {roleNameMap[r]}
                </CardTitle>
                <Badge variant="outline" className="text-2xs font-mono">
                  {r}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                {roleDescMap[r]}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <Card className="border-border/80 bg-card/80 overflow-hidden shadow-sm">
        <CardHeader className="p-4 sm:p-5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <div>
              <CardTitle className="text-base font-bold">
                Access Control & Permissions Matrix
              </CardTitle>
              <CardDescription className="text-xs">
                Authoritative capability map enforced across the SAATHI shared business workspace.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/60 text-muted-foreground uppercase font-mono text-2xs tracking-wider border-b border-border/70">
              <tr>
                <th className="p-3.5 pl-5 font-semibold text-foreground">Permission Capability</th>
                <th className="p-3.5 text-center">Owner</th>
                <th className="p-3.5 text-center">Compliance</th>
                <th className="p-3.5 text-center">Docs</th>
                <th className="p-3.5 text-center">Testing</th>
                <th className="p-3.5 text-center">Finance</th>
                <th className="p-3.5 pr-5 text-center">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {permissionKeys.map((perm) => (
                <tr key={perm.key} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 pl-5 font-medium text-foreground">
                    {perm.label}
                  </td>
                  {roles.map((r, idx) => {
                    const granted = ROLE_PERMISSIONS[r][perm.key as keyof typeof ROLE_PERMISSIONS[BusinessRole]];
                    const isLast = idx === roles.length - 1;
                    return (
                      <td
                        key={r}
                        className={`p-3.5 text-center ${isLast ? "pr-5" : ""}`}
                      >
                        {granted ? (
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <Check className="size-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                            <X className="size-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
