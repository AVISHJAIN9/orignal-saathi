import { Badge } from "@/components/ui/badge";
import type { RecallSeverity, RecallAlertType } from "@/lib/recalls-api";
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  ShieldAlert,
  RotateCcw,
  FileWarning,
} from "lucide-react";

interface RecallSeverityBadgeProps {
  severity: RecallSeverity;
  className?: string;
}

export function RecallSeverityBadge({
  severity,
  className = "",
}: RecallSeverityBadgeProps) {
  switch (severity) {
    case "CRITICAL":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-bold text-2xs uppercase tracking-wider py-0.5 px-2.5 rounded-full bg-destructive/15 text-destructive border-destructive/30 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
          <AlertOctagon className="size-3.5 shrink-0" />
          <span>Critical Non-Conformance</span>
        </Badge>
      );
    case "HIGH":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-bold text-2xs uppercase tracking-wider py-0.5 px-2.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 ${className}`}
        >
          <AlertTriangle className="size-3.5 shrink-0" />
          <span>High Severity</span>
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-2xs uppercase tracking-wider py-0.5 px-2.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 ${className}`}
        >
          <ShieldAlert className="size-3.5 shrink-0" />
          <span>Medium</span>
        </Badge>
      );
    case "LOW":
    default:
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-2xs uppercase tracking-wider py-0.5 px-2.5 rounded-full bg-muted text-muted-foreground border-border/60 ${className}`}
        >
          <Info className="size-3.5 shrink-0" />
          <span>Informational</span>
        </Badge>
      );
  }
}

export function RecallTypeBadge({ type }: { type: RecallAlertType }) {
  const getMeta = () => {
    switch (type) {
      case "PRODUCT_RECALL":
        return { label: "Product Recall", icon: RotateCcw };
      case "NON_CONFORMANCE":
        return { label: "Surveillance Non-Conformance", icon: AlertOctagon };
      case "SAFETY_ALERT":
        return { label: "Safety Advisory", icon: ShieldAlert };
      case "STANDARD_WITHDRAWAL":
        return { label: "Standard Clause Withdrawal", icon: FileWarning };
      case "CERTIFICATION_ACTION":
        return { label: "Certification Scrutiny", icon: AlertTriangle };
      case "REGULATORY_ACTION":
      default:
        return { label: "Regulatory Directive", icon: Info };
    }
  };
  const meta = getMeta();
  const Icon = meta.icon;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80 font-mono">
      <Icon className="size-3.5 text-primary shrink-0" />
      <span>{meta.label}</span>
    </span>
  );
}
