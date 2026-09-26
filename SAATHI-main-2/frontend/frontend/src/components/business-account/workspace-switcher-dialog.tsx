import { useState } from "react";
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
import { ArrowRightLeft, Building2, CheckCircle2, ShieldCheck, Users, Loader2 } from "lucide-react";
import type { WorkspaceMembership } from "@/lib/business-account-api";

interface WorkspaceSwitcherDialogProps {
  workspaces: WorkspaceMembership[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWorkspace: (businessId: string) => Promise<void>;
}

export function WorkspaceSwitcherDialog({
  workspaces,
  open,
  onOpenChange,
  onSelectWorkspace,
}: WorkspaceSwitcherDialogProps) {
  const { t } = useTranslation("businessAccount");
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const handleSwitch = async (businessId: string) => {
    setSwitchingId(businessId);
    try {
      await onSelectWorkspace(businessId);
      onOpenChange(false);
    } finally {
      setSwitchingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ArrowRightLeft className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {t("workspaceSwitcher.title")}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t("workspaceSwitcher.desc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-3 text-sm">
          {workspaces.map((ws) => (
            <div
              key={ws.businessId}
              className={`flex flex-col gap-2 rounded-xl border p-3.5 transition-all ${
                ws.isCurrent
                  ? "border-primary/50 bg-primary/5 shadow-sm"
                  : "border-border/80 bg-card/60 hover:border-border hover:bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <span className="font-semibold text-foreground text-sm">
                      {ws.businessName}
                    </span>
                    {ws.isCurrent && (
                      <Badge variant="default" className="text-2xs px-1.5 py-0 bg-primary">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground font-mono">
                    <span>{ws.entityType}</span>
                    <span>•</span>
                    <span>GSTIN: {ws.gstin}</span>
                  </div>
                </div>

                {!ws.isCurrent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSwitch(ws.businessId)}
                    disabled={switchingId !== null}
                    className="h-8 text-xs shrink-0"
                  >
                    {switchingId === ws.businessId && (
                      <Loader2 className="mr-1.5 size-3 animate-spin" />
                    )}
                    {switchingId === ws.businessId ? t("workspaceSwitcher.switching") : t("workspaceSwitcher.switch")}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3 text-muted-foreground" />
                  Your Role: <strong className="text-foreground">{ws.role.replace("_", " ")}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3 text-muted-foreground" />
                  {ws.memberCount} Members
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
