import { Badge } from "@/components/ui/badge";
import type { NoticeStatus, NoticeType } from "@/lib/license-actions-api";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldAlert,
  FileWarning,
  XCircle,
} from "lucide-react";

interface LicenseStatusBadgeProps {
  status: NoticeStatus;
  className?: string;
}

export function LicenseStatusBadge({
  status,
  className = "",
}: LicenseStatusBadgeProps) {
  const getMeta = () => {
    switch (status) {
      case "NOTICE_ISSUED":
        return {
          label: "Notice Issued",
          icon: AlertTriangle,
          className:
            "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
        };
      case "SUSPENDED":
        return {
          label: "License Suspended",
          icon: AlertOctagon,
          className:
            "bg-destructive/15 text-destructive border-destructive/30 animate-pulse",
        };
      case "REMEDIATION_REQUIRED":
        return {
          label: "Remediation Required",
          icon: FileWarning,
          className:
            "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        };
      case "REMEDIATION_SUBMITTED":
        return {
          label: "Remediation Submitted",
          icon: Clock,
          className:
            "bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
        };
      case "UNDER_REVIEW":
        return {
          label: "Under BIS Review",
          icon: Clock,
          className:
            "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
        };
      case "REINSTATED":
        return {
          label: "License Reinstated",
          icon: CheckCircle2,
          className:
            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
        };
      case "CANCELLED":
        return {
          label: "License Cancelled",
          icon: XCircle,
          className: "bg-destructive/20 text-destructive border-destructive/40",
        };
      case "CLOSED":
      default:
        return {
          label: "Closed Case",
          icon: CheckCircle2,
          className: "bg-muted text-muted-foreground border-border/50",
        };
    }
  };

  const meta = getMeta();
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 font-bold text-xs py-0.5 px-2.5 rounded-full ${meta.className} ${className}`}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{meta.label}</span>
    </Badge>
  );
}

export function NoticeTypeBadge({ type }: { type: NoticeType }) {
  const getLabel = () => {
    switch (type) {
      case "SUSPENSION_NOTICE":
        return "Suspension Notice";
      case "SHOW_CAUSE_NOTICE":
        return "Show-Cause Notice";
      case "STOP_MARKING_ORDER":
        return "Stop-Marking Order";
      case "CANCELLATION_NOTICE":
        return "Cancellation Notice";
      case "REINSTATEMENT_ORDER":
        return "Reinstatement Order";
      default:
        return "Enforcement Action";
    }
  };

  return (
    <span className="font-mono text-2xs font-semibold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
      {getLabel()}
    </span>
  );
}
