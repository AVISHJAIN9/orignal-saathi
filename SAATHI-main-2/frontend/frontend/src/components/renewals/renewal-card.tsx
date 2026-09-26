import { useTranslation } from "react-i18next";
import {
  Award,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/router-compat";
import type { LicenseRenewalItem } from "@/lib/demo/s11-demo-data";

interface RenewalCardProps {
  renewal: LicenseRenewalItem;
  onInspectTimeline: (renewal: LicenseRenewalItem) => void;
  /** This licence is the one named in the URL (/renewals/$applicationId). */
  isFocused?: boolean;
}

export function RenewalCard({
  renewal,
  onInspectTimeline,
  isFocused = false,
}: RenewalCardProps) {
  const { t } = useTranslation(["renewals"]);

  const isCritical = renewal.daysRemaining <= 30;
  const isAdvisory = renewal.daysRemaining <= 90 && !isCritical;

  return (
    <Card
      data-application-id={renewal.applicationId}
      className={`scroll-mt-20 border backdrop-blur-sm transition-all hover:shadow-md ${
        isFocused ? "ring-2 ring-primary/60 " : ""
      }${
        isCritical
          ? "border-rose-500/40 bg-rose-500/5"
          : isAdvisory
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-border/70 bg-card/70"
      }`}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-md">
              {renewal.certificateNumber}
            </span>
            <Badge
              variant={
                isCritical
                  ? "destructive"
                  : isAdvisory
                    ? "secondary"
                    : "outline"
              }
              className="text-2xs font-bold uppercase tracking-wider"
            >
              {isCritical
                ? t("renewals:status.criticalWindow")
                : isAdvisory
                  ? t("renewals:status.actionRequired")
                  : t("renewals:status.onTrack")}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
            <Clock
              className={`size-3.5 ${isCritical ? "text-destructive animate-pulse" : "text-primary"}`}
            />
            <span
              className={isCritical ? "text-destructive" : "text-foreground"}
            >
              {renewal.daysRemaining}{" "}
              {renewal.daysRemaining === 1 ? "day" : "days"} remaining
            </span>
          </div>
        </div>

        {/* Product & Standard */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {renewal.productName} ({renewal.modelNumber})
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="font-mono font-semibold text-primary">
              {renewal.standardNumber}
            </span>
            <span>·</span>
            <span className="truncate max-w-md">{renewal.standardTitle}</span>
          </div>
        </div>

        {/* Timeline Snapshot Bar */}
        <div className="bg-background/80 p-3 rounded-xl border border-border/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              Current Milestone:
            </span>
            <span className="font-bold text-foreground">
              {renewal.milestones.find(
                (m) => m.milestoneKey === renewal.currentMilestone,
              )?.title || renewal.currentMilestone}
            </span>
          </div>

          {/* Stepper progression */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {renewal.milestones.slice(0, 5).map((ms, idx) => (
              <div
                key={ms.id}
                className={`h-2 rounded-full transition-all ${
                  ms.status === "COMPLETED"
                    ? "bg-emerald-500"
                    : ms.status === "CURRENT"
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                }`}
                title={`${ms.title} (${ms.status})`}
              />
            ))}
          </div>
        </div>

        {/* Recommended Action & Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-start gap-2 max-w-xl text-muted-foreground">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-foreground">Next: </strong>
              {renewal.recommendedNextAction}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <Link to="/certificates">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
              >
                <Award className="size-3.5 text-emerald-600" />
                <span>Certificate</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onInspectTimeline(renewal)}
              className="h-8 text-xs font-semibold"
            >
              {t("renewals:actions.openTimeline")}
            </Button>

            {/* The step this card is nudging towards: the renewal wizard
                for this licence's application. */}
            <Link to={`/renewals/${renewal.applicationId}/wizard`}>
              <Button size="sm" className="h-8 text-xs font-semibold gap-1">
                <span>{t("renewals:actions.continueRenewal")}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
