import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import { buildSampleTestingRecord } from "@/lib/mock-sample-testing";
import type { DashboardApplication } from "@/lib/mock-dashboard";

interface SampleTestingCardProps {
  applications: DashboardApplication[];
}

/** S18 — a compact dashboard summary. Every record comes from the same
 * buildSampleTestingRecord() the full tracker page uses (mock-sample-testing.ts)
 * — no separate dashboard-only data. */
export function SampleTestingCard({ applications }: SampleTestingCardProps) {
  const { t } = useTranslation("testing");

  const records = applications
    .map((a) => buildSampleTestingRecord(a.application))
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (records.length === 0) {
    return (
      <EmptyState
        icon={FlaskConical}
        heading={t("dashboardCard.empty")}
        body=""
        compact
      />
    );
  }

  const inProgressCount = records.filter(
    (r) => r.currentStage !== "passed" && r.currentStage !== "failed",
  ).length;
  const mostRecent = [...records].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )[0];

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm font-medium text-foreground">
        {t("dashboardCard.inProgressCount", { count: inProgressCount })}
      </p>
      <p className="text-xs text-muted-foreground">
        {t("dashboardCard.latestUpdate", {
          product: mostRecent.productName,
          stage: t(`stages.${mostRecent.currentStage}`),
        })}
      </p>
      <Link
        to="/sample-tracker"
        className="w-fit text-xs font-medium text-primary underline underline-offset-4"
      >
        {t("dashboardCard.viewTracker")}
      </Link>
    </div>
  );
}
