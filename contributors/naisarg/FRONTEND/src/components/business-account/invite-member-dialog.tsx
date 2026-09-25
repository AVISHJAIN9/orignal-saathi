import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, UserPlus, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { ROLE_PERMISSIONS, type BusinessRole, type BusinessInvitation } from "@/lib/business-account-api";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendInvitation: (payload: { email: string; role: BusinessRole; message?: string }) => Promise<BusinessInvitation>;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onSendInvitation,
}: InviteMemberDialogProps) {
  const { t } = useTranslation("businessAccount");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BusinessRole>("COMPLIANCE_MANAGER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const permissions = ROLE_PERMISSIONS[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid work email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSendInvitation({
        email: email.trim(),
        role,
        message: message.trim() || undefined,
      });
      setEmail("");
      setMessage("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.inviteFailed"));
    } finally {
      setLoading(false);
    }
  };

  const roleDescriptions: Record<BusinessRole, string> = {
    OWNER: t("roles.descriptions.owner"),
    COMPLIANCE_MANAGER: t("roles.descriptions.complianceManager"),
    DOCUMENTATION_LEAD: t("roles.descriptions.documentationLead"),
    TESTING_ENGINEER: t("roles.descriptions.testingEngineer"),
    FINANCIAL_OFFICER: t("roles.descriptions.financialOfficer"),
    AUDITOR_VIEWER: t("roles.descriptions.auditorViewer"),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90dvh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserPlus className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {t("invitations.dialogTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {t("invitations.dialogDesc")}
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

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs font-semibold">
                {t("invitations.emailLabel")} *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  required
                  placeholder={t("invitations.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-role" className="text-xs font-semibold">
                {t("invitations.roleLabel")} *
              </Label>
              <Select value={role} onValueChange={(val) => setRole(val as BusinessRole)} disabled={loading}>
                <SelectTrigger id="invite-role" className="h-9">
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
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {roleDescriptions[role]}
              </p>
            </div>

            {/* Role Capabilities Quick Preview */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-2xs uppercase font-semibold text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Assigned Capabilities</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {permissions.canManageDocuments && (
                  <Badge variant="secondary" className="text-2xs">Document Corrections</Badge>
                )}
                {permissions.canViewCompliance && (
                  <Badge variant="secondary" className="text-2xs">Compliance Chain</Badge>
                )}
                {permissions.canReviewAlerts && (
                  <Badge variant="secondary" className="text-2xs">Regulatory Alerts</Badge>
                )}
                {permissions.canAccessTesting && (
                  <Badge variant="secondary" className="text-2xs">Lab Testing Matcher</Badge>
                )}
                {permissions.canManageVisits && (
                  <Badge variant="secondary" className="text-2xs">Officer Visits</Badge>
                )}
                {permissions.canSubmitAppeals && (
                  <Badge variant="secondary" className="text-2xs">Official Appeals</Badge>
                )}
                {permissions.canManagePayments && (
                  <Badge variant="secondary" className="text-2xs">Fee Payments</Badge>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-msg" className="text-xs font-semibold">
                {t("invitations.messageLabel")}
              </Label>
              <Textarea
                id="invite-msg"
                rows={2}
                placeholder={t("invitations.messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none text-xs"
                disabled={loading}
              />
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
              {t("invitations.cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={loading || !email.trim()}>
              {loading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
              {loading ? t("invitations.sending") : t("invitations.sendButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
