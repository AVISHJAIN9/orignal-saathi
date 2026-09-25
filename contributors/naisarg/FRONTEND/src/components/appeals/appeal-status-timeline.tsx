import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  FileSearch,
  User,
  Shield,
  XCircle,
  Gavel,
  HelpCircle,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AppealTimelineEvent, AppealStatus } from "@/lib/appeals-api";
import { cn } from "@/lib/utils";

interface AppealStatusTimelineProps {
  events: AppealTimelineEvent[];
  currentStatus: AppealStatus;
  className?: string;
}

export function AppealStatusTimeline({
  events,
  currentStatus,
  className,
}: AppealStatusTimelineProps) {
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
          icon: FileCheck2,
          iconColor: "text-primary",
          bgColor: "bg-primary/10 border-primary/30",
          badgeClass: "bg-primary/15 text-primary border-primary/30",
        };
    }
  };

  const getActorLabel = (actor?: AppealTimelineEvent["actor"]) => {
    switch (actor) {
      case "applicant":
        return "Applicant Action";
      case "scrutiny_officer":
        return "Scrutiny Officer";
      case "appellate_authority":
        return "Appellate Authority";
      case "system":
        return "BIS Manak System";
      default:
        return "Official Record";
    }
  };

  const getActorIcon = (actor?: AppealTimelineEvent["actor"]) => {
    switch (actor) {
      case "applicant":
        return User;
      case "scrutiny_officer":
        return Building;
      case "appellate_authority":
        return Gavel;
      default:
        return Shield;
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <HelpCircle className="size-8 opacity-40 mb-2" />
        <p className="text-xs">{t("appeals:timeline.noEvents")}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {events.map((evt, idx) => {
        const isLast = idx === events.length - 1;
        const visuals = getStatusVisuals(evt.status);
        const IconComponent = visuals.icon;
        const ActorIcon = getActorIcon(evt.actor);

        return (
          <div key={evt.id || idx} className="relative flex gap-4">
            {/* Timeline vertical rail */}
            {!isLast && (
              <div className="absolute left-4 top-8 -bottom-2 w-0.5 bg-border/80" />
            )}

            {/* Timeline icon dot */}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
                visuals.bgColor
              )}
            >
              <IconComponent className={cn("size-4", visuals.iconColor)} />
            </div>

            {/* Timeline content */}
            <div className="flex-1 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-foreground sm:text-sm">
                    {evt.title}
                  </h4>
                  <Badge variant="outline" className={cn("text-2xs py-0 px-1.5", visuals.badgeClass)}>
                    {t(`appeals:statuses.${evt.status}`, { defaultValue: evt.status })}
                  </Badge>
                </div>
                <time className="font-mono text-2xs text-muted-foreground">
                  {new Date(evt.timestamp).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>

              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {evt.description}
              </p>

              {/* Official Remarks / Feedback box if present */}
              {evt.officialRemarks && (
                <div className="mt-2 rounded-lg border border-amber-500/25 bg-amber-500/5 p-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-semibold">Authority Observation: </span>
                  {evt.officialRemarks}
                </div>
              )}

              {/* Actor attribution tag */}
              <div className="mt-2 flex items-center gap-1.5 text-2xs text-muted-foreground/80">
                <ActorIcon className="size-3" />
                <span>{getActorLabel(evt.actor)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
