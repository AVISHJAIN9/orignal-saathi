import { useTranslation } from "react-i18next";

import type { StatusSummary } from "@/lib/mock-dashboard";

interface ProgressSummaryCardProps {
  summary: StatusSummary;
}

/** Real application-status counts, never a fabricated aggregate
 * percentage (see mock-dashboard.ts's `getStatusSummary` for why). */
export function ProgressSummaryCard({ summary }: ProgressSummaryCardProps) {
  const { t } = useTranslation("dashboard");

  const tiles: { label: string; value: number }[] = [
    { label: t("progressSummary.completed"), value: summary.completed },
    { label: t("progressSummary.inProgress"), value: summary.inProgress },
    { label: t("progressSummary.pending"), value: summary.pending },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-muted/30 py-3 text-center"
        >
          <span className="text-xl font-bold text-foreground">
            {tile.value}
          </span>
          <span className="text-2xs leading-tight text-muted-foreground">
            {tile.label}
          </span>
        </div>
      ))}
    </div>
  );
}
