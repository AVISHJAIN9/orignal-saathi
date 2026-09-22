import { useTranslation } from "react-i18next";

import { Progress } from "@/components/ui/progress";
import type { ReadinessReport } from "@/lib/mock-readiness";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ReadinessReport["status"], string> = {
  ready: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  ready_with_non_blocking: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  not_ready: "bg-red-500/15 text-red-700 dark:text-red-400",
  insufficient_evidence: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
};

interface ApplicationProgressProps {
  readiness: ReadinessReport;
}

/** One application's readiness, pulled as-is from C4 (mock-readiness.ts)
 * — the score, status, and blocker count shown here are never recomputed;
 * this component only presents what `runReadinessCheck` already decided. */
export function ApplicationProgress({ readiness }: ApplicationProgressProps) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "w-fit rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase",
            STATUS_STYLES[readiness.status],
          )}
        >
          {t(`activeApplications.readinessStatus.${readiness.status}`)}
        </span>
        <span className="font-mono text-xs font-semibold text-foreground">
          {readiness.readinessScore}%
        </span>
      </div>
      <Progress value={readiness.readinessScore} />
      {readiness.blockers.length > 0 && (
        <span className="text-xs text-destructive">
          {t("activeApplications.blockersLabel", {
            count: readiness.blockers.length,
          })}
        </span>
      )}
    </div>
  );
}
