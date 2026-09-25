import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RenewalLicence } from "@/lib/mock-renewals";
import { cn } from "@/lib/utils";

interface LicenceDetailsStepProps {
  licence: RenewalLicence;
  isSurveillanceTriggered: boolean;
  onProceed: () => void;
}

export function LicenceDetailsStep({
  licence,
  isSurveillanceTriggered,
  onProceed,
}: LicenceDetailsStepProps) {
  const { t } = useTranslation("renewal");

  const isUrgent = licence.daysRemaining <= 30;
  // True when the demo toggle above is showing a branch that differs from
  // the licence's real QCO-derived determination — the reasons list below
  // always describes the real determination, never the demo override, so
  // this flags when that needs an explicit "independent of the toggle"
  // label to avoid reading as a contradiction.
  const isOverridden =
    isSurveillanceTriggered !== licence.surveillanceTriggered;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {t("step1.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("step1.subtitle")}
        </p>
      </div>

      {/* Sample testing outcome — informational, never a gate */}
      {licence.sampleTestingOutcome === "failed" && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-xs">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-destructive">
              {t("step1.testingCallout.failedHeading")}
            </span>
            <p className="text-muted-foreground">
              {t("step1.testingCallout.failedBody")}{" "}
              <Link
                to="/sample-tracker"
                className="text-primary underline underline-offset-2"
              >
                {t("step1.testingCallout.link")}
              </Link>
            </p>
          </div>
        </div>
      )}
      {licence.sampleTestingOutcome === "in_progress" && (
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-xs">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            {t("step1.testingCallout.inProgressBody")}{" "}
            <Link
              to="/sample-tracker"
              className="text-primary underline underline-offset-2"
            >
              {t("step1.testingCallout.link")}
            </Link>
          </p>
        </div>
      )}

      {/* Surveillance Audit Trigger Status Callout */}
      {isSurveillanceTriggered ? (
        <div className="elevation-1 flex flex-col gap-3.5 rounded-2xl border-2 border-amber-400 bg-amber-50/90 p-5 dark:border-amber-700/60 dark:bg-amber-950/25">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-800 dark:text-amber-300">
              <ShieldAlert className="size-5 shrink-0" aria-hidden />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-amber-950 dark:text-amber-100">
                  {t("step1.statusBanner.triggeredHeading")}
                </span>
                <Badge className="border-transparent bg-amber-600 font-mono text-2xs text-foreground uppercase tracking-wider">
                  {t("step1.statusBanner.triggeredBadge")}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                {t("step1.statusBanner.triggeredDesc")}
              </p>
            </div>
          </div>

          <div className="ml-11 flex flex-col gap-2 border-t border-amber-300/60 pt-3 dark:border-amber-800/40">
            <span className="font-mono text-2xs font-semibold text-amber-900 uppercase tracking-wide dark:text-amber-300">
              {isOverridden
                ? t("step1.reasonsHeadingReal")
                : t("step1.reasonsHeading")}
            </span>
            <ul className="flex flex-col gap-1.5">
              {licence.surveillanceReasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-amber-950 dark:text-amber-200"
                >
                  <AlertTriangle
                    className="mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-400"
                    aria-hidden
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="elevation-1 flex items-start gap-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-5 dark:border-emerald-800/60 dark:bg-emerald-950/25">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="size-5 shrink-0" aria-hidden />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                {t("step1.statusBanner.routineHeading")}
              </span>
              <Badge className="border-transparent bg-emerald-600 font-mono text-2xs text-foreground uppercase tracking-wider">
                {t("step1.statusBanner.routineBadge")}
              </Badge>
            </div>
            {isOverridden && (
              <span className="text-2xs font-medium text-emerald-800/80 dark:text-emerald-300/80">
                {t("step1.reasonsHeadingReal")}
              </span>
            )}
            <ul className="flex flex-col gap-1">
              {licence.surveillanceReasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="text-xs leading-relaxed text-emerald-900/90 dark:text-emerald-200/90"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="size-4 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold text-foreground">
                {t("step1.product")}
              </h3>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold",
                isUrgent
                  ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                  : "bg-primary/10 text-primary",
              )}
            >
              {t("step1.daysLeft", { count: licence.daysRemaining })}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">
                {t("step1.product")}
              </span>
              <p className="font-medium text-foreground">
                {licence.productName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.licenceNumber")}
                </span>
                <p className="font-mono text-xs font-bold text-foreground">
                  {licence.licenceNumber}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.standard")}
                </span>
                {licence.standardKey ? (
                  <Link
                    to={`/standards/${licence.standardKey}`}
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary hover:underline"
                  >
                    {licence.standardNumber}
                    <ExternalLink className="size-3" aria-hidden />
                  </Link>
                ) : (
                  <p className="font-mono text-xs font-bold text-foreground">
                    {licence.standardNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.validity")}
                </span>
                <div className="flex items-center gap-1.5 pt-0.5 text-xs text-foreground">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{licence.validFrom.slice(0, 10)}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.validUntil", { date: "" })}
                </span>
                <div className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-foreground">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>{licence.validUntil.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 border-b border-border/70 pb-3">
            <Building2 className="size-4 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold text-foreground">
              {t("step1.factoryUnit")}
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">
                {t("step1.organizationName")}
              </span>
              <p className="font-semibold text-foreground">
                {licence.operativeUnit.organizationName || "—"}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.address")}
                </span>
                <p className="text-xs text-foreground">
                  {[
                    licence.operativeUnit.addressLine1,
                    licence.operativeUnit.addressLine2,
                    licence.operativeUnit.city,
                    licence.operativeUnit.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {licence.operativeUnit.pincode
                    ? ` – ${licence.operativeUnit.pincode}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.contactPerson")}
                </span>
                <div className="flex items-center gap-1 text-xs text-foreground">
                  <User className="size-3 text-muted-foreground" />
                  <span>{licence.operativeUnit.contactName || "—"}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  {t("step1.phone")}
                </span>
                <div className="flex items-center gap-1 font-mono text-xs text-foreground">
                  <Phone className="size-3 text-muted-foreground" />
                  <span>{licence.operativeUnit.contactPhone || "—"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">
                {t("step1.email")}
              </span>
              <div className="flex items-center gap-1 text-xs text-foreground">
                <Mail className="size-3 text-muted-foreground" />
                <span className="truncate">
                  {licence.operativeUnit.contactEmail || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-border/60 pt-4">
        <Button
          type="button"
          onClick={onProceed}
          size="lg"
          className="rounded-xl px-6 font-semibold shadow-sm"
        >
          {t("step1.nextBtn")}
        </Button>
      </div>
    </div>
  );
}
