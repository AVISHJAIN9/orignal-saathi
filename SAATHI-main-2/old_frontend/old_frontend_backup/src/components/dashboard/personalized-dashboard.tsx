import { AlertTriangle, PartyPopper } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ActionRequiredCard } from "@/components/dashboard/action-required-card";
import { ActiveApplications } from "@/components/dashboard/active-applications";
import { BrandMark } from "@/components/brand-mark";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DeadlineCalendar } from "@/components/dashboard/deadline-calendar";
import { EmptyState } from "@/components/dashboard/empty-state";
import { NextDeadlineCard } from "@/components/dashboard/next-deadline-card";
import { PaymentDueAlertCard } from "@/components/dashboard/payment-due-alert-card";
import { ProgressSummaryCard } from "@/components/dashboard/progress-summary-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RegulatoryAlert } from "@/components/dashboard/regulatory-alert";
import { SampleTestingCard } from "@/components/dashboard/sample-testing-card";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useDashboard } from "@/hooks/use-dashboard";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

/**
 * Owns useDashboard() end to end and renders its five states — loading,
 * error, empty, partial, success — as five visibly distinct layouts
 * rather than one component silently reusing the same shell for all of
 * them. See src/hooks/use-dashboard.ts for how those states are derived.
 */
export function PersonalizedDashboard() {
  const { t } = useTranslation("dashboard");
  const { currentUser } = useAuth();
  const { status, data, failedSections, errorMessage, retry, retrySection } =
    useDashboard();

  if (status === "loading" || !currentUser) {
    return <DashboardSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertTriangle className="size-6 text-destructive" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("error.heading")}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
        <Button type="button" onClick={retry}>
          {t("error.retry")}
        </Button>
      </div>
    );
  }

  if (!data) return null;

  if (status === "empty") {
    return (
      <div className="flex flex-col gap-5">
        <DashboardHeader name={currentUser.name} />
        <EmptyState
          icon={PartyPopper}
          heading={t("empty.heading")}
          body={t("empty.body")}
        />
      </div>
    );
  }

  const isFailed = (key: (typeof failedSections)[number]) =>
    failedSections.includes(key);

  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader name={currentUser.name} />

      <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
        <BrandMark size="sm" />
        <span className="pt-0.5">{t("illustrativeNotice")}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardSection
          title={t("sections.progressSummary")}
          failed={isFailed("applications")}
          onRetry={() => retrySection("applications")}
        >
          <ProgressSummaryCard summary={data.statusSummary} />
        </DashboardSection>

        <DashboardSection
          title={t("sections.nextDeadline")}
          failed={isFailed("deadlines")}
          onRetry={() => retrySection("deadlines")}
        >
          <NextDeadlineCard deadlines={data.deadlines} />
        </DashboardSection>

        <DashboardSection
          title={t("sections.actionRequired")}
          failed={isFailed("actionRequired")}
          onRetry={() => retrySection("actionRequired")}
        >
          <ActionRequiredCard items={data.actionRequired} />
        </DashboardSection>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <DashboardSection
            title={t("sections.activeApplications")}
            failed={isFailed("applications")}
            onRetry={() => retrySection("applications")}
          >
            <ActiveApplications
              applications={data.applications}
              deadlines={data.deadlines}
            />
          </DashboardSection>

          <DashboardSection
            title={t("sections.upcomingDeadlines")}
            failed={isFailed("deadlines")}
            onRetry={() => retrySection("deadlines")}
          >
            <UpcomingDeadlines deadlines={data.deadlines} />
          </DashboardSection>

          <DashboardSection
            title={t("sections.calendar")}
            failed={isFailed("deadlines")}
            onRetry={() => retrySection("deadlines")}
          >
            <DeadlineCalendar deadlines={data.deadlines} />
          </DashboardSection>
        </div>

        <div className="flex flex-col gap-4">
          <DashboardSection
            title={t("sections.regulatoryAlerts")}
            failed={isFailed("regulatoryAlerts")}
            onRetry={() => retrySection("regulatoryAlerts")}
          >
            <RegulatoryAlert items={data.regulatoryAlerts} />
          </DashboardSection>

          <DashboardSection
            title={t("sections.paymentAlerts")}
            failed={isFailed("paymentAlerts")}
            onRetry={() => retrySection("paymentAlerts")}
          >
            <PaymentDueAlertCard items={data.paymentAlerts} />
          </DashboardSection>

          <DashboardSection
            title={t("sections.sampleTesting")}
            failed={isFailed("applications")}
            onRetry={() => retrySection("applications")}
          >
            <SampleTestingCard applications={data.applications} />
          </DashboardSection>

          <DashboardSection
            title={t("sections.recentActivity")}
            failed={isFailed("recentActivity")}
            onRetry={() => retrySection("recentActivity")}
          >
            <RecentActivity activity={data.recentActivity} />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
