import { CalendarCheck, CalendarPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { buildIcsCalendar, downloadIcsFile } from "@/lib/ics-export";
import type { DashboardDeadline } from "@/lib/mock-dashboard";

interface UpcomingDeadlinesProps {
  deadlines: DashboardDeadline[];
}

/** Every deadline across the applicant's active applications, soonest
 * (including overdue) first. */
export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const { t } = useTranslation("dashboard");

  if (deadlines.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        heading={t("upcomingDeadlines.empty")}
        body=""
        compact
      />
    );
  }

  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((deadline) => (
        <li
          key={deadline.key}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5"
        >
          <span className="text-sm text-foreground">{deadline.label}</span>
          <div className="flex items-center gap-2">
            <UrgencyBadge dueDate={deadline.dueDate} />
            <button
              type="button"
              onClick={() =>
                downloadIcsFile(
                  `${deadline.key}.ics`,
                  buildIcsCalendar([deadline]),
                )
              }
              className="flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-4"
            >
              <CalendarPlus className="size-3" aria-hidden />
              {t("upcomingDeadlines.addToCalendar")}
            </button>
            {deadline.label.toLowerCase().includes("renewal") ? (
              <Link
                to={`/renewals/${deadline.applicationId}/wizard`}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20"
              >
                Renew Licence
              </Link>
            ) : (
              <Link
                to={`/standards/${deadline.standardKey}`}
                search={{ tab: "complianceGaps" }}
                className="text-xs font-medium text-primary underline underline-offset-4"
              >
                {t("nextDeadline.viewApplication")}
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
