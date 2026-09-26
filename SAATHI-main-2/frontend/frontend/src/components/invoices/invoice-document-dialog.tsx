import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Printer,
  Calendar,
  Building2,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  CreditCard,
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
import { invoicesApi } from "@/lib/invoices-api";

interface InvoiceDocumentDialogProps {
  invoice: StatutoryInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewReceipt: (invoice: StatutoryInvoice) => void;
  onInvoiceUpdated: () => void;
}

export function InvoiceDocumentDialog({
  invoice,
  open,
  onOpenChange,
  onViewReceipt,
  onInvoiceUpdated,
}: InvoiceDocumentDialogProps) {
  const { t } = useTranslation(["invoices"]);
  const [isSettling, setIsSettling] = useState(false);

  if (!invoice) return null;

  const isPaid = invoice.status === "PAID";
  const isPending = invoice.status === "PENDING" || invoice.status === "OVERDUE";

  const handlePrint = () => {
    window.print();
  };

  const handleSettlePayment = async () => {
    setIsSettling(true);
    try {
      const updated = await invoicesApi.payDemoInvoice(invoice.id);
      onInvoiceUpdated();
      onViewReceipt(updated);
    } catch (err) {
      console.error("Demo settlement error:", err);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 md:p-7">
        <DialogHeader className="gap-2 pb-4 border-b border-border/70 mt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-primary/10 text-primary">
                {invoice.invoiceNumber}
              </span>
              <Badge
                variant={isPaid ? "default" : "destructive"}
                className="text-2xs font-bold uppercase tracking-wider"
              >
                {invoice.status}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Due Date: {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-1">
            Tax Invoice (Technical Testing & Certification)
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-0.5">
            <span>Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}</span>
            <span>·</span>
            <span>Category: {invoice.category.replace(/_/g, " ")}</span>
          </div>
        </DialogHeader>

        {/* Invoice Body */}
        <div className="flex flex-col gap-5 py-3 text-xs sm:text-sm">
          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Billed To (Applicant Organization)
              </span>
              <span className="font-bold text-foreground text-sm block mt-0.5">
                {invoice.billedTo.legalName}
              </span>
              <span className="text-xs text-muted-foreground block">
                {invoice.billedTo.address}, {invoice.billedTo.city}, {invoice.billedTo.state} - {invoice.billedTo.pincode}
              </span>
              <span className="font-mono text-xs font-medium text-foreground block mt-1">
                GSTIN: {invoice.billedTo.gstin} · State Code: {invoice.billedTo.stateCode}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Issuing Regulatory Directorate
              </span>
              <span className="font-bold text-foreground block text-xs mt-0.5">
                {invoice.issuingAuthority.name}
              </span>
              <span className="text-xs text-muted-foreground block">
                {invoice.issuingAuthority.branch}
              </span>
              <span className="text-xs text-muted-foreground block">
                {invoice.issuingAuthority.address}
              </span>
              <span className="font-mono text-xs text-muted-foreground block mt-1">
                GSTIN: {invoice.issuingAuthority.gstin} · PAN: {invoice.issuingAuthority.pan}
              </span>
            </div>
          </div>

          {/* Line Items Table Container (Scrollable internally) */}
          <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/70 bg-muted/50 font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">SAC Code</th>
                    <th className="p-2.5 min-w-[200px]">Description of Statutory Service</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Rate (INR)</th>
                    <th className="p-2.5 text-right">Taxable Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoice.lineItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="p-2.5 font-mono font-semibold text-primary">{item.sacCode}</td>
                      <td className="p-2.5 text-foreground">{item.description}</td>
                      <td className="p-2.5 text-right font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{item.unitRate.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        ₹{item.taxableAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GST Calculation Breakdown Summary */}
          <div className="flex flex-col items-end gap-1.5 p-4 rounded-xl border border-border/60 bg-muted/10 text-xs font-mono">
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-muted-foreground">Subtotal (Taxable Value):</span>
              <span className="font-bold text-foreground">
                ₹{invoice.subtotalTaxable.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-muted-foreground">CGST (9.0%):</span>
              <span className="font-medium text-foreground">
                ₹{invoice.cgstAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-muted-foreground">SGST (9.0%):</span>
              <span className="font-medium text-foreground">
                ₹{invoice.sgstAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-xs pt-2 border-t border-border/70 text-sm">
              <span className="font-bold text-foreground">Total Payable Amount:</span>
              <span className="font-black text-primary text-base">
                ₹{invoice.totalPayable.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Dialog Actions */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              <span>{t("invoices:labels.downloadPdf")}</span>
            </Button>

            {isPaid && invoice.receipt && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onViewReceipt(invoice);
                }}
                className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-foreground"
              >
                <Receipt className="size-3.5" />
                <span>{t("invoices:labels.viewReceipt")}</span>
              </Button>
            )}

            {isPending && (
              <Button
                size="sm"
                disabled={isSettling}
                onClick={handleSettlePayment}
                className="gap-1.5 text-xs font-semibold"
              >
                <CreditCard className="size-3.5" />
                <span>{isSettling ? "Settling..." : t("invoices:labels.settleDemo")}</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
