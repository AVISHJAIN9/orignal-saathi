import { useTranslation } from "react-i18next";
import { History, Calendar, FileText, CheckCircle2, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CertificateStatusBadge } from "./certificate-status-badge";
import type { BISCertificate, CertificateHistoryItem } from "@/lib/certificates-api";

interface CertificateHistoryDialogProps {
  certificate: BISCertificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateHistoryDialog({
  certificate,
  open,
  onOpenChange,
}: CertificateHistoryDialogProps) {
  const { t } = useTranslation("certificates");

  if (!certificate) return null;

  const historyItems: CertificateHistoryItem[] = certificate.history || [
    {
      id: "initial-grant",
      version: 1,
      certificateNumber: certificate.certificateNumber,
      action: "INITIAL_GRANT",
      actionTitle: "Grant of BIS Standard Mark License",
      effectiveDate: certificate.issueDate,
      validUntil: certificate.validUntil,
      status: certificate.status,
      remarks: "License granted following authoritative compliance scrutiny and audit verification.",
      orderReference: `BIS/ORD/${certificate.certificateNumber.replace(/[^0-9]/g, "")}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-border/50 bg-card/95 backdrop-blur-2xl sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4 text-left">
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary shrink-0" />
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              {t("history.dialogTitle")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            {t("history.dialogDescription")} — <span className="font-semibold text-foreground">{certificate.certificateNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <div className="relative border-l-2 border-primary/30 pl-4 ml-3 space-y-6">
            {historyItems.map((item, idx) => {
              const formattedEffective = new Date(item.effectiveDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const formattedValid = item.validUntil
                ? new Date(item.validUntil).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : undefined;

              return (
                <div key={item.id || idx} className="relative space-y-2">
                  {/* Timeline dot */}
                  <div className="absolute -left-[23px] top-1 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                    <div className="size-1.5 rounded-full bg-primary-foreground" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {t("history.version")} {item.version || idx + 1}:
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {item.actionTitle}
                      </span>
                    </div>
                    <CertificateStatusBadge status={item.status} />
                  </div>

                  <div className="rounded-lg border border-border/60 bg-background/50 p-3 space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {t("history.effectiveFrom")}: <strong className="text-foreground">{formattedEffective}</strong>
                      </span>
                      {formattedValid && (
                        <span>
                          {t("history.validTo")}: <strong className="text-foreground">{formattedValid}</strong>
                        </span>
                      )}
                    </div>

                    {item.orderReference && (
                      <p className="font-mono text-2xs text-muted-foreground">
                        {t("history.orderRef")}: <span className="text-primary font-medium">{item.orderReference}</span>
                      </p>
                    )}

                    {item.remarks && (
                      <p className="text-muted-foreground text-xs italic pt-1 border-t border-border/30">
                        "{item.remarks}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {t("details.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
