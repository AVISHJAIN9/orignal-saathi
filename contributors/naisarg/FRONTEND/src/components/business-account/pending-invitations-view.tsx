import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Clock, XCircle, RotateCw, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BusinessInvitation, BusinessPermissionSet } from "@/lib/business-account-api";

interface PendingInvitationsViewProps {
  invitations: BusinessInvitation[];
  currentUserPermissions: BusinessPermissionSet;
  onCancelInvite: (id: string) => Promise<boolean>;
  onResendInvite: (id: string) => Promise<boolean>;
  onOpenInviteModal: () => void;
}

export function PendingInvitationsView({
  invitations,
  currentUserPermissions,
  onCancelInvite,
  onResendInvite,
  onOpenInviteModal,
}: PendingInvitationsViewProps) {
  const { t } = useTranslation("businessAccount");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const pendingList = invitations.filter((inv) => inv.status === "PENDING");

  const handleCancel = async (id: string) => {
    setActionLoadingId(id);
    try {
      await onCancelInvite(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResend = async (id: string) => {
    setActionLoadingId(id);
    try {
      await onResendInvite(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (pendingList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          <Mail className="size-6" />
        </div>
        <h3 className="font-semibold text-foreground text-sm sm:text-base">
          {t("invitations.noPending")}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          {t("invitations.subtitle")}
        </p>
        {currentUserPermissions.canInviteMembers && (
          <Button
            size="sm"
            onClick={onOpenInviteModal}
            className="mt-4 gap-1.5 text-xs"
          >
            <UserPlus className="size-3.5" />
            {t("members.inviteMember")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-base">{t("invitations.title")}</h3>
          <p className="text-xs text-muted-foreground">{t("invitations.subtitle")}</p>
        </div>

        {currentUserPermissions.canInviteMembers && (
          <Button
            size="sm"
            onClick={onOpenInviteModal}
            className="gap-1.5 text-xs h-8"
          >
            <UserPlus className="size-3.5" />
            {t("members.inviteMember")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {pendingList.map((inv) => (
          <Card key={inv.id} className="border-border/80 bg-card/70 overflow-hidden shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Mail className="size-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="font-semibold text-foreground text-sm truncate block max-w-full">
                      {inv.email}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-2xs border-primary/30 text-primary shrink-0">
                        {inv.role.replace("_", " ")}
                      </Badge>
                      <Badge variant="secondary" className="text-2xs bg-amber-500/10 text-amber-700 dark:text-amber-300 shrink-0">
                        <Clock className="mr-1 size-2.5" />
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {currentUserPermissions.canInviteMembers && (
                  <div className="flex flex-wrap items-center gap-1 shrink-0 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResend(inv.id)}
                      disabled={actionLoadingId === inv.id}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title={t("invitations.resendInvite")}
                    >
                      <RotateCw className={`size-3.5 ${actionLoadingId === inv.id ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline ml-1">{t("invitations.resendInvite")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(inv.id)}
                      disabled={actionLoadingId === inv.id}
                      className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                      title={t("invitations.cancelInvite")}
                    >
                      <XCircle className="size-3.5" />
                      <span className="hidden sm:inline ml-1">{t("invitations.cancelInvite")}</span>
                    </Button>
                  </div>
                )}
              </div>

              {inv.message && (
                <div className="mt-3 rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground italic leading-relaxed break-words">
                  "{inv.message}"
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between border-t border-border/50 pt-2.5 text-2xs text-muted-foreground font-mono">
                <span>{t("invitations.invitedBy")}: {inv.invitedBy}</span>
                <span>{t("invitations.expiresOn")}: {new Date(inv.expiresAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
