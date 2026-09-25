import {
  Building,
  Calendar,
  CalendarPlus,
  CheckCircle,
  Download,
  FileCheck2,
  Phone,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { Button } from "@/components/ui/button";
import { downloadIcsFile } from "@/lib/ics-export";
import type { RenewalLicence, RenewalRecord } from "@/lib/mock-renewals";

interface ConfirmationStepProps {
  licence: RenewalLicence;
  record: RenewalRecord;
  onReset: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ConfirmationStep({
  licence,
  record,
  onReset,
}: ConfirmationStepProps) {
  const { t } = useTranslation("renewal");

  const isAuditScheduled = Boolean(record.surveillanceAudit);

  const currentExpiry = new Date(licence.validUntil);
  const nextExpiry = new Date(currentExpiry);
  nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);
  const extendedDateStr = nextExpiry.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadCalendar = () => {
    if (!record.surveillanceAudit) return;
    const auditDate = record.surveillanceAudit.preferredDate;
    const cleanDate = auditDate.replace(/-/g, "");

    // Same UID/PRODID convention S20's ics-export.ts already uses
    // (@saathi.local) — never the real bis.gov.in domain.
    const icsString = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SAATHI//Surveillance Audit//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:renewal-audit-${record.renewalId}@saathi.local`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `SUMMARY:Surveillance Audit — ${licence.licenceNumber}`,
      `DESCRIPTION:Surveillance audit reminder for ${licence.productName} (${licence.standardNumber}). Contact: ${record.surveillanceAudit.qcContactName} (${record.surveillanceAudit.qcContactPhone}).`,
      `LOCATION:${[licence.operativeUnit.city, licence.operativeUnit.state].filter(Boolean).join(", ")}`,
      "STATUS:TENTATIVE",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    downloadIcsFile(`renewal-audit-${record.renewalId}.ics`, icsString);
  };

  const handleDownloadSummary = () => {
    const lines = [
      "SAATHI RENEWAL SUMMARY",
      "========================================================================",
      `Renewal reference: ${record.renewalId}`,
      `Payment reference: ${record.paymentReferenceId}`,
      `Licence number:    ${licence.licenceNumber}`,
      `Standard:          ${licence.standardNumber}`,
      `Product:           ${licence.productName}`,
      `Summary generated: ${new Date().toISOString().split("T")[0]}`,
      "",
      "FEE BREAKDOWN:",
      "------------------------------------------------------------------------",
      `Application Renewal Fee:       INR ${record.fees.applicationFee}`,
      `Annual Licence Fee:            INR ${record.fees.annualLicenceFee}`,
      `Production Marking Fee:        INR ${record.fees.markingFee}`,
      `Surveillance Audit Fee:        INR ${record.fees.surveillanceAuditFee}`,
      `Subtotal:                      INR ${record.fees.subtotal}`,
      `GST (18%):                     INR ${record.fees.gst18}`,
      `Total:                         INR ${record.fees.totalPayable}`,
      "",
      isAuditScheduled
        ? `Surveillance audit: ${record.surveillanceAudit?.preferredDate} (${record.surveillanceAudit?.timeSlot})`
        : "No surveillance audit required for this renewal cycle.",
      "========================================================================",
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saathi-renewal-summary-${record.renewalId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/90 p-6 text-center dark:border-emerald-800/60 dark:bg-emerald-950/20 sm:p-8">
        <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-700 dark:text-emerald-300">
          <CheckCircle className="size-10" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-100 sm:text-2xl">
            {t("step5.successTitle")}
          </h2>
          <p className="font-mono text-sm text-emerald-800 dark:text-emerald-300">
            {t("step5.successSubtitle", { id: record.renewalId })}
          </p>
        </div>
      </div>

      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <FileCheck2 className="size-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t("step5.provisionalBanner.title")}
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("step5.provisionalBanner.body", {
            licence: licence.licenceNumber,
            date: extendedDateStr,
          })}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-muted/40 p-3">
            <span className="text-muted-foreground block text-2xs">
              {t("step5.labels.licenceNumber")}
            </span>
            <span className="font-mono font-bold text-foreground">
              {licence.licenceNumber}
            </span>
          </div>
          <div className="rounded-xl bg-muted/40 p-3">
            <span className="text-muted-foreground block text-2xs">
              {t("step5.labels.standard")}
            </span>
            <span className="font-mono font-bold text-primary">
              {licence.standardNumber}
            </span>
          </div>
          <div className="rounded-xl bg-muted/40 p-3">
            <span className="text-muted-foreground block text-2xs">
              {t("step5.labels.certifiedUnits")}
            </span>
            <span className="font-mono font-bold text-foreground">
              {record.production.quantityProduced.toLocaleString()}
            </span>
          </div>
          <div className="rounded-xl bg-muted/40 p-3">
            <span className="text-muted-foreground block text-2xs">
              {t("step5.labels.extendedTo")}
            </span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {extendedDateStr}
            </span>
          </div>
        </div>
      </div>

      {isAuditScheduled && record.surveillanceAudit ? (
        <div className="elevation-1 flex flex-col gap-4 rounded-2xl border-2 border-amber-400 bg-amber-50/80 p-5 dark:border-amber-700/60 dark:bg-amber-950/20">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300/70 pb-3 dark:border-amber-800/40">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-amber-700 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-950 dark:text-amber-100 text-sm sm:text-base">
                {t("step5.auditCard.title")}
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadCalendar}
              className="rounded-xl border-amber-400 bg-background text-xs font-semibold text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200"
            >
              <CalendarPlus className="mr-1.5 size-3.5" />
              {t("step5.auditCard.calendarBtn")}
            </Button>
          </div>

          <p className="text-xs text-amber-900/90 dark:text-amber-200/90">
            {t("step5.auditCard.desc")}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-card/70 p-3 dark:bg-background/50">
              <Calendar className="size-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-muted-foreground block text-2xs">
                  {t("step5.labels.window")}
                </span>
                <span className="font-mono font-bold text-foreground">
                  {record.surveillanceAudit.preferredDate} (
                  {t(`step3.slotLabels.${record.surveillanceAudit.timeSlot}`)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-card/70 p-3 dark:bg-background/50">
              <Building className="size-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-muted-foreground block text-2xs">
                  {t("step5.labels.location")}
                </span>
                <span className="font-semibold text-foreground truncate block">
                  {[licence.operativeUnit.city, licence.operativeUnit.state]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-card/70 p-3 dark:bg-background/50">
              <User className="size-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-muted-foreground block text-2xs">
                  {t("step5.labels.liaison")}
                </span>
                <span className="font-semibold text-foreground">
                  {record.surveillanceAudit.qcContactName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-card/70 p-3 dark:bg-background/50">
              <Phone className="size-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-muted-foreground block text-2xs">
                  {t("step5.labels.directContact")}
                </span>
                <span className="font-mono font-medium text-foreground">
                  {record.surveillanceAudit.qcContactPhone}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="elevation-1 flex items-start gap-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-800/50 dark:bg-emerald-950/20">
          <ShieldCheck className="size-6 shrink-0 text-emerald-700 dark:text-emerald-400" />
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-emerald-950 dark:text-emerald-100 text-sm">
              {t("step5.noAuditCard.title")}
            </h3>
            <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90">
              {t("step5.noAuditCard.desc")}
            </p>
          </div>
        </div>
      )}

      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">
          {t("step5.summaryTitle")}
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-muted/40 p-3">
            <span className="text-muted-foreground block text-2xs">
              {t("step5.labels.totalRemitted")}
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {currencyFormatter.format(record.fees.totalPayable)}
            </span>
          </div>

          <div className="rounded-xl bg-muted/40 p-3">
            <span className="text-muted-foreground block text-2xs">
              {t("step5.labels.paymentReference")}
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {record.paymentReferenceId}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleDownloadSummary}
          className="rounded-xl gap-1.5"
        >
          <Download className="size-4" />
          {t("step5.actions.downloadSummary")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="rounded-xl gap-1.5"
          >
            <RefreshCw className="size-4" />
            {t("step5.actions.renewAnother")}
          </Button>

          <Link to="/dashboard">
            <Button className="rounded-xl px-5 font-semibold">
              {t("step5.actions.viewLicence")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
