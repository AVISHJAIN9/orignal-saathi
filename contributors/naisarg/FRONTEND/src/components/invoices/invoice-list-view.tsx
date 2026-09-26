import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  FileText,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building2,
  ChevronRight,
  Printer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceDocumentDialog } from "./invoice-document-dialog";
import { ReceiptDocumentDialog } from "./receipt-document-dialog";
import { invoicesApi, type InvoicesResult } from "@/lib/invoices-api";
import type { StatutoryInvoice } from "@/lib/demo/s24-demo-data";

export function InvoiceListView() {
  const { t } = useTranslation(["invoices"]);
  const [data, setData] = useState<InvoicesResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING" | "OVERDUE">("ALL");

  const [selectedInvoice, setSelectedInvoice] = useState<StatutoryInvoice | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await invoicesApi.getInvoices({
        status: statusFilter,
        search: searchQuery || undefined,
      });
      setData(res);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleOpenInvoice = (inv: StatutoryInvoice) => {
    setSelectedInvoice(inv);
    setInvoiceOpen(true);
  };

  const handleOpenReceipt = (inv: StatutoryInvoice) => {
    setSelectedInvoice(inv);
    setReceiptOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("invoices:metrics.totalInvoices")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.summary.totalInvoices}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("invoices:metrics.paidAmount")}
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{data.summary.totalPaidAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("invoices:metrics.pendingAmount")}
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                ₹{data.summary.pendingAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Receipt className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("invoices:metrics.paidCount")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.summary.paidCount} / {data.summary.totalInvoices}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice number, fee description, category..."
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as any)}
          >
            <SelectTrigger className="text-xs h-9 rounded-lg flex-1">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PAID">Paid & Reconciled</SelectItem>
              <SelectItem value="PENDING">Pending Payment</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchInvoices}
            className="gap-1.5 text-xs font-semibold h-9 shrink-0"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Invoice Cards List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : (data?.invoices || []).length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <Receipt className="size-8 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-bold text-foreground">No invoices match your filter criteria</h4>
          <p className="text-xs text-muted-foreground mt-1">Try resetting the status filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {(data?.invoices || []).map((inv) => {
            const isPaid = inv.status === "PAID";
            return (
              <Card
                key={inv.id}
                className={`border backdrop-blur-sm transition-all hover:shadow-md ${
                  isPaid ? "border-border/70 bg-card/70" : "border-amber-500/40 bg-amber-500/5"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col gap-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded">
                        {inv.invoiceNumber}
                      </span>
                      <Badge
                        variant={isPaid ? "default" : "destructive"}
                        className="text-2xs font-bold uppercase tracking-wider"
                      >
                        {inv.status}
                      </Badge>
                    </div>

                    <span className="text-xs text-muted-foreground font-mono">
                      Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        {inv.category.replace(/_/g, " ")}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {inv.lineItems.map((li) => li.description).join(" + ")}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xs text-muted-foreground block font-mono">
                        Taxable: ₹{inv.subtotalTaxable.toLocaleString("en-IN")} + 18% GST
                      </span>
                      <span className="font-mono text-lg sm:text-xl font-black text-foreground">
                        ₹{inv.totalPayable.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground text-2xs font-mono">
                      Issued by: {inv.issuingAuthority.branch}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenInvoice(inv)}
                        className="h-8 text-xs font-semibold gap-1"
                      >
                        <FileText className="size-3.5" />
                        <span>{t("invoices:labels.viewInvoice")}</span>
                      </Button>

                      {isPaid && inv.receipt && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenReceipt(inv)}
                          className="h-8 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-foreground"
                        >
                          <Receipt className="size-3.5" />
                          <span>{t("invoices:labels.viewReceipt")}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Invoice Document Dialog */}
      <InvoiceDocumentDialog
        invoice={selectedInvoice}
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
        onViewReceipt={handleOpenReceipt}
        onInvoiceUpdated={fetchInvoices}
      />

      {/* Receipt Document Dialog */}
      <ReceiptDocumentDialog
        invoice={selectedInvoice}
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
      />
    </div>
  );
}
