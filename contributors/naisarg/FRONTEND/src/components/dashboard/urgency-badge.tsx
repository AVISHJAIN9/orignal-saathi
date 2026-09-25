import { AlertCircle, CalendarClock, CheckCircle2, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  daysRemaining,
  formatDaysRemaining,
  getUrgencyTier,
  type UrgencyTier,
} from "@/lib/dashboard-urgency";
import { cn } from "@/lib/utils";

// Icon + text per tier, never color alone (see the S2 task's accessibility
// requirement, same rule the registration wizard's document-status chips
// and stepper already follow).
const TIER_ICONS: Record<UrgencyTier, typeof CheckCircle2> = {
  normal: CheckCircle2,
  approaching: CalendarClock,
  urgent: AlertCircle,
  overdue: Flame,
};

const TIER_STYLES: Record<UrgencyTier, string> = {
  normal: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  approaching: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  urgent: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
};

interface UrgencyBadgeProps {
  dueDate: string;
  className?: string;
}

/** Urgency tier is pure presentation over a real days-remaining number —
 * never a stored/pre-computed label (see dashboard-urgency.ts). Overdue
 * always reads "N days overdue", never a negative countdown. */
export function UrgencyBadge({ dueDate, className }: UrgencyBadgeProps) {
  const { t } = useTranslation("dashboard");
  const days = daysRemaining(dueDate);
  const tier = getUrgencyTier(days);
  const { key, count } = formatDaysRemaining(days);
  const Icon = TIER_ICONS[tier];

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase",
        TIER_STYLES[tier],
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {key === "overdue"
        ? t("urgency.overdueByDays", { count })
        : key === "dueToday"
          ? t("urgency.dueToday")
          : t("urgency.dueInDays", { count })}
    </span>
  );
}
