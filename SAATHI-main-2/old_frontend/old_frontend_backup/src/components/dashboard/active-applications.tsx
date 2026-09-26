import { FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { ApplicationProgress } from "@/components/dashboard/application-progress";
import { EmptyState } from "@/components/dashboard/empty-state";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { daysRemaining, getUrgencyTier } from "@/lib/dashboard-urgency";
import type {
  DashboardApplication,
  DashboardDeadline,
} from "@/lib/mock-dashboard";
import { getStandardByKey } from "@/lib/mock-standards";

interface ActiveApplicationsProps {
  applications: DashboardApplication[];
  deadlines: DashboardDeadline[];
}

// Priority order per the S2 task: urgent -> overdue -> next action ->
// recently updated. An application's own nearest deadline (if any) decides
// which of the first two buckets it falls in; "next action" catches an
// application with a real C4 blocker but no matching deadline; everything
// else falls back to most-recently-updated first.
function priorityRank(
  app: DashboardApplication,
  deadlines: DashboardDeadline[],
): number {
  const ownDeadlines = deadlines.filter(
    (d) => d.applicationId === app.application.id,
  );
  const hasUrgent = ownDeadlines.some(
    (d) => getUrgencyTier(daysRemaining(d.dueDate)) === "urgent",
  );
  if (hasUrgent) return 0;
  const hasOverdue = ownDeadlines.some(
    (d) => getUrgencyTier(daysRemaining(d.dueDate)) === "overdue",
  );
  if (hasOverdue) return 1;
  if (app.readiness.blockers.length > 0) return 2;
  return 3;
}

export function ActiveApplications({
  applications,
  deadlines,
}: ActiveApplicationsProps) {
  const { t } = useTranslation("dashboard");

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        heading={t("activeApplications.empty")}
        body=""
        action={
          <Link
            to="/register"
            className="text-xs font-medium text-primary underline underline-offset-4"
          >
            {t("activeApplications.startOne")}
          </Link>
        }
        compact
      />
    );
  }

  const sorted = [...applications].sort((a, b) => {
    const rankDiff = priorityRank(a, deadlines) - priorityRank(b, deadlines);
    if (rankDiff !== 0) return rankDiff;
    return (
      new Date(b.application.updatedAt).getTime() -
      new Date(a.application.updatedAt).getTime()
    );
  });

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map(({ application, readiness }) => {
        const standardKey = application.product.suggestedStandardKey;
        const standard = standardKey
          ? getStandardByKey(standardKey)
          : undefined;
        const ownDeadlines = deadlines.filter(
          (d) => d.applicationId === application.id,
        );
        const nearestDeadline = [...ownDeadlines].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        )[0];

        return (
          <li
            key={application.id}
            className="flex flex-col gap-2.5 rounded-xl border border-border bg-background p-3.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {application.product.productName}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {standard?.standardNumber ?? application.product.categoryKey}
                </span>
              </div>
              <span className="w-fit shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[0.68rem] font-semibold text-muted-foreground uppercase">
                {t(`activeApplications.status.${application.status}`)}
              </span>
            </div>

            <ApplicationProgress readiness={readiness} />

            <div className="flex flex-wrap items-center justify-between gap-2">
              {nearestDeadline ? (
                <UrgencyBadge dueDate={nearestDeadline.dueDate} />
              ) : (
                <span />
              )}
              {standard && (
                <Link
                  to={`/standards/${standardKey}`}
                  className="text-xs font-medium text-primary underline underline-offset-4"
                >
                  {t("activeApplications.viewStandard")}
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
