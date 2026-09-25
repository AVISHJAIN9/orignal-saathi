import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { CertificateStatus } from "@/lib/certificates-api";
import { cn } from "@/lib/utils";

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
  className?: string;
  showIcon?: boolean;
}

export function CertificateStatusBadge({
  status,
  className,
  showIcon = true,
}: CertificateStatusBadgeProps) {
  const { t } = useTranslation("certificates");

  const getStatusConfig = () => {
    switch (status) {
      case "ACTIVE":
        return {
          icon: CheckCircle2,
          label: t("status.ACTIVE"),
          symbol: "✓",
          badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        };
      case "EXPIRED":
        return {
          icon: Clock,
          label: t("status.EXPIRED"),
          symbol: "⏱",
          badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        };
      case "SUSPENDED":
        return {
          icon: AlertTriangle,
          label: t("status.SUSPENDED"),
          symbol: "⚠",
          badgeClass: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          label: t("status.CANCELLED"),
          symbol: "✕",
          badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
        };
      case "REVOKED":
        return {
          icon: ShieldAlert,
          label: t("status.REVOKED"),
          symbol: "🚫",
          badgeClass: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
        };
      case "UNDER_RENEWAL":
        return {
          icon: Clock,
          label: t("status.UNDER_RENEWAL"),
          symbol: "↻",
          badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
        };
      default:
        return {
          icon: CheckCircle2,
          label: status,
          symbol: "•",
          badgeClass: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        config.badgeClass,
        className
      )}
    >
      {showIcon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
      <span className="sr-only">[{config.symbol}] </span>
      <span>{config.label}</span>
    </Badge>
  );
}
