import {
  CalendarCheck,
  CalendarDays,
  FileCheck,
  FileClock,
  FileWarning,
  Scale,
  ShieldAlert,
  CreditCard,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CalendarEventType, EventPriority } from "@/lib/calendar-api";

interface EventTypeBadgeProps {
  type: CalendarEventType;
  priority?: EventPriority;
  className?: string;
  showIcon?: boolean;
}

export function EventTypeBadge({
  type,
  priority,
  className = "",
  showIcon = true,
}: EventTypeBadgeProps) {
  const getMeta = () => {
    switch (type) {
      case "FACTORY_AUDIT":
        return {
          label: "Factory Audit",
          icon: CalendarCheck,
          className:
            "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
        };
      case "OFFICER_VISIT":
        return {
          label: "Officer Visit",
          icon: CalendarDays,
          className:
            "bg-indigo-500/10 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300",
        };
      case "APPLICATION_DEADLINE":
        return {
          label: "Application Deadline",
          icon: FileClock,
          className:
            "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
        };
      case "DOCUMENT_DEADLINE":
        return {
          label: "Document Due",
          icon: FileWarning,
          className:
            "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300",
        };
      case "PAYMENT_DUE":
        return {
          label: "Payment Due",
          icon: CreditCard,
          className:
            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
        };
      case "APPEAL_DEADLINE":
        return {
          label: "Appeal Window",
          icon: Scale,
          className:
            "bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
        };
      case "CERTIFICATE_EXPIRY":
        return {
          label: "License Renewal",
          icon: FileCheck,
          className:
            "bg-cyan-500/10 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300",
        };
      case "REGULATORY_CHANGE":
        return {
          label: "Regulatory Change",
          icon: ShieldAlert,
          className:
            "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300",
        };
      case "REMINDER":
      default:
        return {
          label: "Reminder",
          icon: Bell,
          className:
            "bg-muted text-muted-foreground border-muted-foreground/30",
        };
    }
  };

  const meta = getMeta();
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 font-medium text-xs py-0.5 px-2.5 rounded-full transition-colors ${meta.className} ${className}`}
    >
      {showIcon && <Icon className="size-3.5 shrink-0" />}
      <span>{meta.label}</span>
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: EventPriority }) {
  switch (priority) {
    case "CRITICAL":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-bold uppercase tracking-wider bg-destructive/15 text-destructive border border-destructive/30">
          <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
          Critical
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-medium uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          Medium
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-medium uppercase tracking-wider bg-muted text-muted-foreground">
          Low
        </span>
      );
  }
}
