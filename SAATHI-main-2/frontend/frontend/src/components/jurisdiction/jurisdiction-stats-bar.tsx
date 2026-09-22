import { Globe, Layers, RefreshCw, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { JURISDICTION_SUMMARY_STATS } from "@/lib/mock-jurisdictions";

export function JurisdictionStatsBar() {
  const { t } = useTranslation("jurisdiction");

  const stats = [
    {
      label: t("stats.totalTracked"),
      value: JURISDICTION_SUMMARY_STATS.totalTracked,
      icon: Globe,
      color: "text-secondary-foreground bg-secondary border-border",
    },
    {
      label: t("stats.activeZones"),
      value: JURISDICTION_SUMMARY_STATS.activeRegulatoryZones,
      icon: Layers,
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: t("stats.recentUpdates"),
      value: JURISDICTION_SUMMARY_STATS.recentHarmonizationUpdates,
      icon: RefreshCw,
      color:
        "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: t("stats.highImpact"),
      value: JURISDICTION_SUMMARY_STATS.highImpactRegimes,
      icon: ShieldAlert,
      color:
        "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="elevation-1 flex flex-col justify-between rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="line-clamp-1 text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${stat.color}`}
              >
                <Icon className="size-3.5" />
              </div>
            </div>
            <span className="mt-2 font-mono text-xl font-bold tracking-tight text-foreground">
              {stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
