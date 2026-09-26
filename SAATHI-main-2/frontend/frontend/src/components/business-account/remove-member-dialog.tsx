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
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { BusinessMember } from "@/lib/business-account-api";

interface RemoveMemberDialogProps {
  member: BusinessMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmRemove: (memberId: string) => Promise<boolean>;
}

export function RemoveMemberDialog({
  member,
  open,
  onOpenChange,
  onConfirmRemove,
}: RemoveMemberDialogProps) {
  const { t } = useTranslation("businessAccount");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirmRemove(member.id);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.removeFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-destructive">
                {t("removeMember.title")}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t("removeMember.desc", { name: member.name, email: member.email })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("removeMember.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
            {loading ? t("removeMember.removing") : t("removeMember.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
