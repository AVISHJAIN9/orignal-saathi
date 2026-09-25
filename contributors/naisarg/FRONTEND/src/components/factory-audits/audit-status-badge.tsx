import { Badge } from "@/components/ui/badge";
import type { AuditStatus } from "@/lib/factory-audits-api";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  PlayCircle,
  XCircle,
} from "lucide-react";

interface AuditStatusBadgeProps {
  status: AuditStatus;
  className?: string;
}

export function AuditStatusBadge({ status, className = "" }: AuditStatusBadgeProps) {
  const getMeta = () => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          className:
            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
        };
      case "SCHEDULED":
        return {
          label: "Scheduled",
          icon: CalendarCheck,
          className:
            "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
        };
      case "RESCHEDULE_REQUESTED":
        return {
          label: "Reschedule Requested",
          icon: RotateCcw,
          className:
            "bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
        };
      case "RESCHEDULED":
        return {
          label: "Rescheduled",
          icon: Clock,
          className:
            "bg-cyan-500/10 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: PlayCircle,
          className:
            "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
        };
      case "COMPLETED":
        return {
          label: "Completed",
          icon: CheckCircle2,
          className:
            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
        };
      case "ACTION_REQUIRED":
        return {
          label: "Action Required",
          icon: AlertTriangle,
          className:
            "bg-destructive/15 text-destructive border-destructive/30 animate-pulse",
        };
      case "CANCELLED":
      default:
        return {
          label: "Cancelled",
          icon: XCircle,
          className: "bg-muted text-muted-foreground border-border/50",
        };
    }
  };

  const meta = getMeta();
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 font-semibold text-xs py-0.5 px-2.5 rounded-full ${meta.className} ${className}`}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{meta.label}</span>
    </Badge>
  );
}
