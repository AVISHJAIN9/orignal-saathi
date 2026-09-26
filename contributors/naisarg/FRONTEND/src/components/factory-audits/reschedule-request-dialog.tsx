import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarClock, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  factoryAuditsApi,
  type FactoryAudit,
} from "@/lib/factory-audits-api";

interface RescheduleRequestDialogProps {
  audit: FactoryAudit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRescheduleSubmitted: () => void;
}

export function RescheduleRequestDialog({
  audit,
  open,
  onOpenChange,
  onRescheduleSubmitted,
}: RescheduleRequestDialogProps) {
  const { t } = useTranslation(["audits"]);
  const [reason, setReason] = useState("");
  const [preferredDate1, setPreferredDate1] = useState("");
  const [preferredDate2, setPreferredDate2] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!audit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !preferredDate1) return;

    setIsSubmitting(true);
    try {
      await factoryAuditsApi.requestReschedule(audit.id, {
        reason,
        preferredDate1,
        preferredDate2: preferredDate2 || undefined,
        notes: notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
        onRescheduleSubmitted();
      }, 1500);
    } catch (err) {
      console.error("Reschedule request error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90dvh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="gap-1 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <CalendarClock className="size-4" />
            <span>{audit.auditNumber}</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {t("audits:reschedule.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{t("audits:reschedule.disclaimer")}</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reason" className="text-xs font-semibold">
              {t("audits:reschedule.reasonLabel")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("audits:reschedule.reasonPlaceholder")}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date1" className="text-xs font-semibold">
                {t("audits:reschedule.preferredDate1")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date1"
                type="date"
                required
                value={preferredDate1}
                onChange={(e) => setPreferredDate1(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date2" className="text-xs font-semibold">
                {t("audits:reschedule.preferredDate2")}
              </Label>
              <Input
                id="date2"
                type="date"
                value={preferredDate2}
                onChange={(e) => setPreferredDate2(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              {t("audits:reschedule.notes")}
            </Label>
            <Textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any laboratory maintenance or operational constraints..."
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !reason || !preferredDate1}
              className="gap-1.5 font-semibold"
            >
              {success ? (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Submitted</span>
                </>
              ) : (
                <span>{t("audits:reschedule.submit")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
