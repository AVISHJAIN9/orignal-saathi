import { useTranslation } from "react-i18next";
import {
  AlertOctagon,
  Calendar,
  Building2,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { RecallAlert } from "@/lib/recalls-api";
import { RecallSeverityBadge, RecallTypeBadge } from "./recall-severity-badge";

interface RecallAlertCardProps {
  alert: RecallAlert;
  onViewDetails: (alert: RecallAlert) => void;
}

export function RecallAlertCard({
  alert,
  onViewDetails,
}: RecallAlertCardProps) {
  const { t } = useTranslation(["recalls"]);

  const isCritical = alert.severity === "CRITICAL";

  return (
    <Card
      className={`overflow-hidden border backdrop-blur-sm shadow-sm transition-all hover:shadow-md ${
        isCritical
          ? "border-destructive/40 bg-card ring-1 ring-destructive/20"
          : "border-border/70 bg-card/80"
      }`}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Top bar: Severity, Type, Alert Number, Effective Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2.5">
            <RecallSeverityBadge severity={alert.severity} />
            <RecallTypeBadge type={alert.alertType} />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="font-semibold">{alert.alertNumber}</span>
            <span>·</span>
            <span>Effective: {new Date(alert.effectiveDate).toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        {/* Header & Product scope */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {alert.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
            <span className="font-semibold text-foreground">
              {alert.affectedScope.productName} ({alert.affectedScope.modelNumber})
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
              {alert.affectedScope.standardClause || alert.affectedScope.standardNumber}
            </span>
            {alert.affectedScope.affectedBatches && (
              <span className="font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded text-2xs">
                {alert.affectedScope.affectedBatches.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Structured Sections: WHAT HAPPENED & WHY IT MATTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 flex flex-col gap-1">
            <span className="font-bold text-foreground uppercase tracking-wider text-2xs text-primary">
              {t("recalls:card.whatHappened")}
            </span>
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {alert.whatHappened}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 flex flex-col gap-1">
            <span className="font-bold text-foreground uppercase tracking-wider text-2xs text-primary">
              {t("recalls:card.whyItMatters")}
            </span>
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {alert.whyItMatters}
            </p>
          </div>
        </div>

        {/* Required Action Row */}
        <div className="p-3.5 rounded-xl border border-destructive/25 bg-destructive/5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertOctagon className="size-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-destructive block">
                {t("recalls:card.requiredAction")}:
              </span>
              <span className="text-foreground leading-relaxed">
                {alert.requiredAction}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-destructive shrink-0 text-2xs bg-destructive/10 px-2 py-1 rounded-md">
            <Clock className="size-3.5" />
            <span>Deadline: {new Date(alert.remediationDeadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
          </div>
        </div>

        {/* Official Source Citation */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-muted-foreground border-t border-border/50 pt-2.5">
          <div className="flex items-center gap-1.5 truncate max-w-full sm:max-w-md">
            <span className="font-semibold text-foreground shrink-0">Official Source:</span>
            <span className="truncate">{alert.officialSource.authorityName} ({alert.officialSource.orderReferenceNumber})</span>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <Link to="/conformity">
              <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground">
                <ShieldCheck className="size-3" />
                <span>Gaps</span>
              </Button>
            </Link>

            <Link to="/calendar">
              <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground">
                <Calendar className="size-3" />
                <span>Calendar</span>
              </Button>
            </Link>

            <Link to="/license-actions">
              <Button variant="outline" size="sm" className="h-7 text-xs font-semibold gap-1 text-primary border-primary/30 hover:bg-primary/10">
                <span>Remediate</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>

            <Button
              size="sm"
              onClick={() => onViewDetails(alert)}
              className="h-7 text-xs font-semibold gap-1"
            >
              <span>Details</span>
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
