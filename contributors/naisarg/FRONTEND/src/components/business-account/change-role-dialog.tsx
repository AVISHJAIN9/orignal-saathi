import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCog, ShieldCheck, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { ROLE_PERMISSIONS, type BusinessMember, type BusinessRole } from "@/lib/business-account-api";

interface ChangeRoleDialogProps {
  member: BusinessMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRole: (memberId: string, newRole: BusinessRole) => Promise<BusinessMember>;
}

export function ChangeRoleDialog({
  member,
  open,
  onOpenChange,
  onUpdateRole,
}: ChangeRoleDialogProps) {
  const { t } = useTranslation("businessAccount");
  const [newRole, setNewRole] = useState<BusinessRole>("COMPLIANCE_MANAGER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setNewRole(member.role);
    }
  }, [member]);

  if (!member) return null;

  const currentPermissions = ROLE_PERMISSIONS[member.role];
  const targetPermissions = ROLE_PERMISSIONS[newRole];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole === member.role) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onUpdateRole(member.id, newRole);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.roleUpdateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserCog className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {t("changeRole.title")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {t("changeRole.desc", { name: member.name })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 text-sm">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current vs New Role Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {t("changeRole.currentRole")}
                </Label>
                <div className="flex items-center h-9 px-3 rounded-md border bg-muted/40 text-xs font-semibold text-foreground">
                  {member.role.replace("_", " ")}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="change-role-select" className="text-xs font-semibold">
                  {t("changeRole.newRole")} *
                </Label>
                <Select value={newRole} onValueChange={(val) => setNewRole(val as BusinessRole)} disabled={loading}>
                  <SelectTrigger id="change-role-select" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLIANCE_MANAGER">{t("roles.complianceManager")}</SelectItem>
                    <SelectItem value="DOCUMENTATION_LEAD">{t("roles.documentationLead")}</SelectItem>
                    <SelectItem value="TESTING_ENGINEER">{t("roles.testingEngineer")}</SelectItem>
                    <SelectItem value="FINANCIAL_OFFICER">{t("roles.financialOfficer")}</SelectItem>
                    <SelectItem value="AUDITOR_VIEWER">{t("roles.auditorViewer")}</SelectItem>
                    <SelectItem value="OWNER">{t("roles.owner")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Role Capabilities Diff Preview */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-2xs uppercase font-semibold text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>{t("changeRole.permissionChanges")}</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Document Corrections</span>
                  <Badge variant={targetPermissions.canManageDocuments ? "default" : "outline"} className="text-2xs">
                    {targetPermissions.canManageDocuments ? "Allowed" : "Restricted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Compliance Chain</span>
                  <Badge variant={targetPermissions.canViewCompliance ? "default" : "outline"} className="text-2xs">
                    {targetPermissions.canViewCompliance ? "Allowed" : "Restricted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Officer Inspection Visits</span>
                  <Badge variant={targetPermissions.canManageVisits ? "default" : "outline"} className="text-2xs">
                    {targetPermissions.canManageVisits ? "Allowed" : "Restricted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Appeals & Disputes</span>
                  <Badge variant={targetPermissions.canSubmitAppeals ? "default" : "outline"} className="text-2xs">
                    {targetPermissions.canSubmitAppeals ? "Allowed" : "Restricted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Regulatory Alerts</span>
                  <Badge variant={targetPermissions.canReviewAlerts ? "default" : "outline"} className="text-2xs">
                    {targetPermissions.canReviewAlerts ? "Allowed" : "Restricted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Fee Payments & Finance</span>
                  <Badge variant={targetPermissions.canManagePayments ? "default" : "outline"} className="text-2xs">
                    {targetPermissions.canManagePayments ? "Allowed" : "Restricted"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading || newRole === member.role}>
              {loading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
              {loading ? t("changeRole.saving") : t("changeRole.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
