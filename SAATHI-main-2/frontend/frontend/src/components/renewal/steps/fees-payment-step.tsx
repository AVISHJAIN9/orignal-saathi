import { ArrowRight, Info, Receipt, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RenewalFeeSummary } from "@/lib/mock-renewals";
import { cn } from "@/lib/utils";

interface FeesPaymentStepProps {
  fees: RenewalFeeSummary;
  onSubmitPayment: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function FeesPaymentStep({
  fees,
  onSubmitPayment,
  onBack,
  isSubmitting,
}: FeesPaymentStepProps) {
  const { t } = useTranslation("renewal");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {t("step4.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("step4.subtitle")}
        </p>
      </div>

      {/* Itemized Fee Ledger */}
      <div className="elevation-1 flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border/70 p-5 pb-3">
          <Receipt className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("step4.feeLedger")}
          </h3>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/3">{t("step4.feeItem")}</TableHead>
              <TableHead className="text-right">
                {t("step4.feeAmount")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{t("step4.appFee")}</TableCell>
              <TableCell className="text-right font-mono font-medium">
                {currencyFormatter.format(fees.applicationFee)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">
                {t("step4.licenceFee")}
              </TableCell>
              <TableCell className="text-right font-mono font-medium">
                {currencyFormatter.format(fees.annualLicenceFee)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{t("step4.markingFee")}</span>
                  <span className="text-2xs text-muted-foreground">
                    {t("step4.markingFeeNote")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono font-medium">
                {currencyFormatter.format(fees.markingFee)}
              </TableCell>
            </TableRow>

            <TableRow
              className={cn(
                fees.isSurveillanceTriggered
                  ? "bg-amber-500/5 font-semibold dark:bg-amber-950/20"
                  : "",
              )}
            >
              <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      fees.isSurveillanceTriggered
                        ? "text-amber-950 dark:text-amber-200"
                        : "text-foreground"
                    }
                  >
                    {t("step4.auditFee")}
                  </span>
                  {fees.isSurveillanceTriggered ? (
                    <Badge className="border-transparent bg-amber-500/20 font-mono text-2xs font-bold text-amber-800 dark:text-amber-300">
                      {t("step4.auditFeeBadge")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-300 bg-emerald-50 text-2xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                    >
                      {t("step4.exempt")}
                    </Badge>
                  )}
                </div>
                {!fees.isSurveillanceTriggered && (
                  <span className="text-2xs text-muted-foreground">
                    {t("step4.auditFeeExempt")}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right font-mono">
                {fees.isSurveillanceTriggered ? (
                  <span className="font-bold text-amber-900 dark:text-amber-300">
                    {currencyFormatter.format(fees.surveillanceAuditFee)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">₹0</span>
                )}
              </TableCell>
            </TableRow>

            <TableRow className="border-t-2 border-border/70">
              <TableCell className="text-muted-foreground font-medium">
                {t("step4.subtotal")}
              </TableCell>
              <TableCell className="text-right font-mono font-semibold text-foreground">
                {currencyFormatter.format(fees.subtotal)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-xs">
                {t("step4.gst")}
              </TableCell>
              <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {currencyFormatter.format(fees.gst18)}
              </TableCell>
            </TableRow>

            <TableRow className="bg-primary/5 dark:bg-primary/10">
              <TableCell className="text-base font-bold text-primary">
                {t("step4.total")}
              </TableCell>
              <TableCell className="text-right font-mono text-lg font-bold text-primary">
                {currencyFormatter.format(fees.totalPayable)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Payment — a single generic demo action, not a real gateway. No
       * bank names, IFSC codes, UPI IDs, or account numbers: this repo has
       * no real BIS fee schedule or payment integration to ground any of
       * that against (same honesty bar S5's payment-status-page.tsx
       * already holds itself to). */}
      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{t("step4.simulatedPaymentNote")}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-xl px-5"
        >
          {t("step4.backBtn")}
        </Button>

        <Button
          type="button"
          onClick={onSubmitPayment}
          disabled={isSubmitting}
          size="lg"
          className="rounded-xl px-6 font-semibold shadow-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t("step4.submitting")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              {t("step4.simulatePayment", {
                amount: currencyFormatter.format(fees.totalPayable),
              })}
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
