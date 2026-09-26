import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  GitMerge,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/lib/router-compat";
import type { AlertSeverity, RegulatoryAlert } from "@/lib/regulatory-alerts-api";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: RegulatoryAlert;
  isActionRequiredHero?: boolean;
  onViewDetails: (alert: RegulatoryAlert) => void;
  onMarkRead?: (alertId: string) => void;
}

export function AlertCard({
  alert,
  isActionRequiredHero = false,
  onViewDetails,
  onMarkRead,
}: AlertCardProps) {
  const { t } = useTranslation(["alerts"]);

  const getSeverityVisuals = (severity: AlertSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return {
          badgeClass: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
          icon: AlertCircle,
          iconColor: "text-red-600 dark:text-red-400",
          cardBorder: "border-red-500/40 bg-gradient-to-br from-card via-card to-red-500/5",
          label: t("alerts:severities.critical"),
        };
      case "HIGH":
        return {
          badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
          iconColor: "text-amber-600 dark:text-amber-400",
          cardBorder: "border-amber-500/40 bg-gradient-to-br from-card via-card to-amber-500/5",
          label: t("alerts:severities.high"),
        };
      case "MEDIUM":
        return {
          badgeClass: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
          icon: ShieldAlert,
          iconColor: "text-amber-500",
          cardBorder: "border-border/80 bg-card",
          label: t("alerts:severities.medium"),
        };
      default:
        return {
          badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
          icon: Info,
          iconColor: "text-sky-600 dark:text-sky-400",
          cardBorder: "border-border/80 bg-card",
          label: t("alerts:severities.informational"),
        };
    }
  };

  const visuals = getSeverityVisuals(alert.severity);
  const SeverityIcon = visuals.icon;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 backdrop-blur-xl shadow-md",
        visuals.cardBorder,
        !alert.read && "ring-1 ring-primary/30",
        isActionRequiredHero && "shadow-lg ring-2 ring-amber-500/40"
      )}
    >
      {/* Unread indicator ribbon bar */}
      {!alert.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}

      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-inner mt-0.5",
                visuals.iconColor,
                "bg-muted/60"
              )}
            >
              <SeverityIcon className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("font-mono text-2xs font-bold tracking-wider uppercase", visuals.badgeClass)}>
                  {visuals.label}
                </Badge>

                {alert.relatedStandardNumber && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {alert.relatedStandardNumber}
                  </Badge>
                )}

                {alert.relatedQcoNumber && (
                  <Badge variant="outline" className="font-mono text-xs bg-amber-500/5">
                    {alert.relatedQcoNumber}
                  </Badge>
                )}

                {!alert.read && (
                  <span className="inline-flex items-center gap-1 font-mono text-2xs font-bold text-primary uppercase">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    {t("alerts:card.unread")}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-foreground sm:text-lg">
                {alert.title}
              </h3>

              {alert.userProductContext && (
                <span className="text-xs text-muted-foreground">
                  Context: <span className="font-medium text-foreground">{alert.userProductContext}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-2xs text-muted-foreground">
            <span>{t("alerts:card.detectedDate")}: {alert.detectedAt}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex flex-col gap-4">
        {/* WHAT -> IMPACT -> ACTION SEQUENCE */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-3">
          {/* WHAT CHANGED */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-2xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("alerts:card.whatChanged")}
            </span>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {alert.whatChanged}
            </p>
          </div>

          {/* WHY IT MATTERS */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-2xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {t("alerts:card.whyItMatters")}
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {alert.whyItMatters}
            </p>
          </div>

          {/* POTENTIAL IMPACT */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-2xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              {t("alerts:card.potentialImpact")}
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {alert.potentialImpact}
            </p>
          </div>
        </div>

        {/* OFFICIAL SOURCE LINK */}
        {alert.source && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xs font-bold text-muted-foreground uppercase">
                {t("alerts:card.source")}:
              </span>
              <span className="font-semibold text-foreground">{alert.source.title}</span>
            </div>

            {alert.source.url ? (
              <a
                href={alert.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary underline underline-offset-4 hover:text-primary/80 shrink-0"
              >
                {t("alerts:card.viewSource")}
                <ExternalLink className="size-3.5" />
              </a>
            ) : (
              <span className="text-2xs italic text-muted-foreground shrink-0">
                {t("alerts:card.sourceUnavailable")}
              </span>
            )}
          </div>
        )}

        {/* CARD ACTIONS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* C2 Revision Comparison Deep Link */}
            <Link
              to={alert.c2DeepLink || `/standards?query=${encodeURIComponent(alert.relatedStandardNumber || "")}`}
            >
              <Button variant="default" size="sm" className="gap-1.5 text-xs font-semibold">
                <FileText className="size-3.5" />
                {t("alerts:card.actions.reviewChanges")}
              </Button>
            </Link>

            {/* C3 Compliance Gap Analysis Deep Link */}
            <Link
              to={alert.c3DeepLink || `/conformity?standard=${encodeURIComponent(alert.relatedStandardNumber || "")}`}
            >
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <FileCheck2 className="size-3.5 text-primary" />
                {t("alerts:card.actions.runGapAnalysis")}
              </Button>
            </Link>

            {/* C4 Application Readiness Deep Link */}
            {alert.c4DeepLink && (
              <Link to={alert.c4DeepLink}>
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-semibold">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  {t("alerts:card.actions.checkReadiness")}
                </Button>
              </Link>
            )}

            {/* C6 Compliance Chain Deep Link */}
            {alert.c6DeepLink && (
              <Link to={alert.c6DeepLink}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <GitMerge className="size-3.5" />
                  {t("alerts:card.actions.viewComplianceChain")}
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!alert.read && onMarkRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkRead(alert.id)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {t("alerts:card.markRead")}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(alert)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Info className="size-3.5" />
              {t("alerts:card.actions.viewDetails")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
