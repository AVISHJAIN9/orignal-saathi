import { useTranslation } from "react-i18next";
import {
  Gavel,
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileSearch,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppealItem, AppealStatus } from "@/lib/appeals-api";
import { cn } from "@/lib/utils";

interface AppealCardProps {
  appeal: AppealItem;
  onViewDetails: (appeal: AppealItem) => void;
  onProvideInfo: (appeal: AppealItem) => void;
  onWithdraw: (appeal: AppealItem) => void;
}

export function AppealCard({
  appeal,
  onViewDetails,
  onProvideInfo,
  onWithdraw,
}: AppealCardProps) {
  const { t } = useTranslation(["appeals"]);

  const getStatusVisuals = (status: AppealStatus) => {
    switch (status) {
      case "RESOLVED":
        return {
          icon: CheckCircle2,
          iconColor: "text-emerald-500 dark:text-emerald-400",
          bgColor: "bg-emerald-500/10 border-emerald-500/30",
          badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        };
      case "ADDITIONAL_INFORMATION_REQUIRED":
        return {
          icon: AlertTriangle,
          iconColor: "text-amber-500 dark:text-amber-400",
          bgColor: "bg-amber-500/10 border-amber-500/30",
          badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        };
      case "UNDER_REVIEW":
        return {
          icon: FileSearch,
          iconColor: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-500/10 border-blue-500/30",
          badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
        };
      case "ACKNOWLEDGED":
        return {
          icon: Clock,
          iconColor: "text-cyan-500 dark:text-cyan-400",
          bgColor: "bg-cyan-500/10 border-cyan-500/30",
          badgeClass: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
        };
      case "REJECTED":
      case "WITHDRAWN":
      case "CLOSED":
        return {
          icon: XCircle,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted border-border",
          badgeClass: "bg-muted text-foreground border-border",
        };
      default:
        return {
          icon: Gavel,
          iconColor: "text-primary",
          bgColor: "bg-primary/10 border-primary/30",
          badgeClass: "bg-primary/15 text-primary border-primary/30",
        };
    }
  };

  const visuals = getStatusVisuals(appeal.status);
  const StatusIcon = visuals.icon;
  const latestEvent = appeal.timeline[appeal.timeline.length - 1];

  return (
    <Card className="elevation-1 border-border/50 bg-card/80 transition-all hover:border-primary/30 dark:border-border/50 dark:bg-card/40">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Top Header: Ref number, Resolution type, Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", visuals.bgColor)}>
              <StatusIcon className={cn("size-4", visuals.iconColor)} />
            </span>

            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-primary tracking-wide">
                {appeal.referenceNumber}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {t(`appeals:resolutionPaths.${appeal.resolutionType}.title`, { defaultValue: appeal.resolutionType })}
              </span>
            </div>
          </div>

          <Badge variant="outline" className={cn("text-xs py-0.5 px-2 font-semibold", visuals.badgeClass)}>
            {t(`appeals:statuses.${appeal.status}`, { defaultValue: appeal.status })}
          </Badge>
        </div>

        {/* Application context & Disputed matter */}
        <div className="flex flex-col gap-1 border-y border-border/50 py-2.5 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Application: <strong className="text-foreground font-mono">{appeal.applicationId}</strong></span>
            <span>Standard: <strong className="text-foreground">{appeal.standardNumber}</strong></span>
          </div>
          <p className="mt-1 font-medium text-foreground line-clamp-1">
            {appeal.reasonSummary}
          </p>
        </div>

        {/* Action Required Alert banner */}
        {appeal.status === "ADDITIONAL_INFORMATION_REQUIRED" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  {t("appeals:additionalInfo.badge")}
                </span>
                <p className="text-amber-800/90 dark:text-amber-300/90 text-2xs line-clamp-1">
                  {appeal.additionalInformationRequest?.description || "Reviewing authority observation requires response."}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onProvideInfo(appeal)}
              className="shrink-0 bg-amber-600 hover:bg-amber-700 text-foreground text-xs font-semibold h-7 px-3 rounded-lg"
            >
              {t("appeals:actions.provideInfo")}
            </Button>
          </div>
        )}

        {/* Resolved Outcome banner */}
        {appeal.status === "RESOLVED" && appeal.officialResolution && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2.5 text-xs flex items-start gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                {t(`appeals:resolution.${appeal.officialResolution.decisionOutcome}`)}
              </span>
              <p className="text-2xs text-emerald-800/90 dark:text-emerald-300/90 line-clamp-1">
                {appeal.officialResolution.summary}
              </p>
            </div>
          </div>
        )}

        {/* Footer: Latest timeline snippet and Details Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-2xs text-muted-foreground">
          {latestEvent ? (
            <span className="truncate max-w-[240px]">
              Latest: <strong className="text-foreground">{latestEvent.title}</strong>
            </span>
          ) : (
            <span className="font-mono">Created: {appeal.decisionDate}</span>
          )}

          <div className="flex items-center gap-2">
            {appeal.status !== "RESOLVED" && appeal.status !== "WITHDRAWN" && appeal.status !== "CLOSED" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWithdraw(appeal)}
                className="h-7 text-2xs text-muted-foreground hover:text-destructive px-2"
              >
                {t("appeals:actions.withdraw")}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(appeal)}
              className="h-7 text-xs rounded-lg gap-1 font-medium"
            >
              {t("appeals:actions.viewDetails")}
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
