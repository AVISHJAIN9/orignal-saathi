import { CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import type { DashboardDeadline } from "@/lib/mock-dashboard";
import { getStandardByKey } from "@/lib/mock-standards";

interface NextDeadlineCardProps {
  deadlines: DashboardDeadline[];
}

/** The single most pressing deadline — sorting by due date ascending
 * naturally surfaces an overdue item before a future one, which is the
 * one that actually needs attention first. */
export function NextDeadlineCard({ deadlines }: NextDeadlineCardProps) {
  const { t } = useTranslation("dashboard");

  if (deadlines.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        heading={t("nextDeadline.empty")}
        body=""
        compact
      />
    );
  }

  const next = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )[0];
  const standard = getStandardByKey(next.standardKey);

  return (
    <div className="flex flex-col gap-2">
      <UrgencyBadge dueDate={next.dueDate} />
      <p className="text-sm font-medium text-foreground">{next.label}</p>
      {standard && (
        <Link
          to={`/standards/${next.standardKey}`}
          search={{ tab: "complianceGaps" }}
          className="w-fit text-xs font-medium text-primary underline underline-offset-4"
        >
          {t("nextDeadline.viewApplication")}
        </Link>
      )}
    </div>
  );
}
