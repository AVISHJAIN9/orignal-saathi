import { AlertTriangle, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { GapStatus } from "@/lib/mock-compliance-gaps";
import { cn } from "@/lib/utils";

// Shared 4-status color/icon mapping for GapStatus, split into its own
// file (rather than living inside compliance-gap-analyzer.tsx) so both
// the Compliance Gaps tab and the Readiness tab's Blocking Issues list
// (C4) render the exact same badge instead of each keeping a
// possibly-drifting copy of the mapping.
export const GAP_STATUS_STYLES: Record<GapStatus, string> = {
  pass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  fail: "bg-red-500/15 text-red-700 dark:text-red-400",
  missing_evidence: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
};

export const GAP_STATUS_ICONS: Record<GapStatus, typeof CheckCircle2> = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle,
  missing_evidence: CircleHelp,
};

export function GapStatusBadge({ status }: { status: GapStatus }) {
  const { t } = useTranslation("standards");
  const Icon = GAP_STATUS_ICONS[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase",
        GAP_STATUS_STYLES[status],
      )}
    >
      <Icon className="size-3" aria-hidden />
      {t(`detail.complianceGaps.status.${status}`)}
    </span>
  );
}
