import { useTranslation } from "react-i18next";
import {
  Receipt,
  Printer,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  QrCode,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StatutoryInvoice } from "@/lib/demo/s24-demo-data";

interface ReceiptDocumentDialogProps {
  invoice: StatutoryInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptDocumentDialog({
  invoice,
  open,
  onOpenChange,
}: ReceiptDocumentDialogProps) {
  const { t } = useTranslation(["invoices"]);

  if (!invoice || !invoice.receipt) return null;
  const { receipt } = invoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 md:p-7">
        <DialogHeader className="gap-2 pb-4 border-b border-border/70 mt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                <span>{receipt.acknowledgementStatus}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground font-semibold">
                {receipt.receiptNumber}
              </span>
            </div>
            <span className="font-mono text-2xs text-muted-foreground">
              Invoice Ref: {invoice.invoiceNumber}
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-1">
            Payment Receipt
          </DialogTitle>
        </DialogHeader>

        {/* Receipt Document Body */}
        <div className="flex flex-col gap-5 py-3 text-xs sm:text-sm">
          {/* Header Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Received From (Applicant Organization)
              </span>
              <span className="font-bold text-foreground text-sm block mt-0.5">
                {invoice.billedTo.legalName}
              </span>
              <span className="text-xs text-muted-foreground block">
                {invoice.billedTo.address}, {invoice.billedTo.city}, {invoice.billedTo.state} - {invoice.billedTo.pincode}
              </span>
              <span className="font-mono text-xs font-medium text-foreground block mt-1">
                GSTIN: {invoice.billedTo.gstin}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div>
                <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                  Remittance Gateway / Issuing Office
                </span>
                <span className="font-bold text-foreground block text-xs">
                  {invoice.issuingAuthority.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {invoice.issuingAuthority.branch}
                </span>
              </div>
              <div className="text-2xs text-muted-foreground font-mono mt-1">
                <span>BIS GSTIN: {invoice.issuingAuthority.gstin}</span>
              </div>
            </div>
          </div>

          {/* Transaction Audit Log Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/70 bg-card">
            <div>
              <span className="text-muted-foreground block text-2xs font-semibold uppercase">
                Payment Date & Timestamp
              </span>
              <span className="font-mono font-bold text-foreground">
                {new Date(receipt.receiptDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-2xs font-semibold uppercase">
                Payment Remittance Mode
              </span>
              <span className="font-semibold text-foreground">
                {receipt.paymentMode.replace(/_/g, " ")}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-2xs font-semibold uppercase">
                Payment Reference (UTR)
              </span>
              <span className="font-mono font-bold text-primary break-all">
                {receipt.transactionReference}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-2xs font-semibold uppercase">
                Banking Gateway Entity
              </span>
              <span className="text-foreground font-medium">
                {receipt.bankName}
              </span>
            </div>
          </div>

          {/* Amount Paid Box */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">
                Total Remittance Received (INR)
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
                ₹{receipt.amountPaid.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-muted-foreground italic block mt-0.5">
                ({receipt.amountInWords})
              </span>
            </div>

            {/* QR verification badge */}
            <div className="flex flex-col items-center p-2.5 rounded-lg border border-border/60 bg-background text-center shrink-0">
              <QrCode className="size-12 text-foreground mb-1" />
              <span className="text-2xs font-mono font-bold text-muted-foreground uppercase">
                QR Verification
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              <span>{t("invoices:labels.downloadPdf")}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
