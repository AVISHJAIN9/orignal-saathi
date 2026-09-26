import { useTranslation } from "react-i18next";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  CalendarDays,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OfficerVisitStatus } from "@/lib/officer-visits-api";
import { cn } from "@/lib/utils";

interface VisitStatusBadgeProps {
  status: OfficerVisitStatus;
  className?: string;
  showIcon?: boolean;
}

export function VisitStatusBadge({
  status,
  className,
  showIcon = true,
}: VisitStatusBadgeProps) {
  const { t } = useTranslation(["visits"]);

  const getStatusConfig = (s: OfficerVisitStatus) => {
    switch (s) {
      case "CONFIRMED":
        return {
          icon: CheckCircle2,
          label: t("visits:statuses.CONFIRMED"),
          className:
            "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        };
      case "SCHEDULED":
        return {
          icon: CalendarClock,
          label: t("visits:statuses.SCHEDULED"),
          className:
            "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
        };
      case "PENDING":
        return {
          icon: Clock,
          label: t("visits:statuses.PENDING"),
          className:
            "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        };
      case "RESCHEDULED":
        return {
          icon: RotateCcw,
          label: t("visits:statuses.RESCHEDULED"),
          className:
            "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
        };
      case "COMPLETED":
        return {
          icon: CalendarDays,
          label: t("visits:statuses.COMPLETED"),
          className:
            "bg-muted text-foreground border-border",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          label: t("visits:statuses.CANCELLED"),
          className:
            "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
        };
      case "ACTION_REQUIRED":
        return {
          icon: AlertTriangle,
          label: t("visits:statuses.ACTION_REQUIRED"),
          className:
            "bg-amber-600/15 text-amber-800 dark:text-amber-300 border-amber-600/30",
        };
      default:
        return {
          icon: Clock,
          label: status,
          className:
            "bg-muted text-foreground border-border",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold shadow-xs transition-colors",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </Badge>
  );
}
