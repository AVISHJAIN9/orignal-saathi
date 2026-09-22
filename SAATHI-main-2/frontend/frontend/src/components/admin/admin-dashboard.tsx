import { ArrowLeft, MessagesSquare, ShieldOff, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AmbientBackground } from "@/components/ambient-background";
import { KpiCard } from "@/components/admin/kpi-card";
import { QueriesLineChart } from "@/components/admin/queries-line-chart";
import { TopicsBarChart } from "@/components/admin/topics-bar-chart";
import { Reveal } from "@/components/landing/reveal";
import { StampCta } from "@/components/landing/stamp-cta";
import {
  MOCK_DAILY_QUERIES,
  MOCK_DECLINE_RATE,
  MOCK_DECLINE_TREND,
  MOCK_GROUNDEDNESS_RATE,
  MOCK_GROUNDEDNESS_TREND,
  MOCK_TOPICS,
  MOCK_TOTAL_QUERIES,
  MOCK_TOTAL_QUERIES_TREND,
} from "@/lib/mock-analytics";

export function AdminDashboard() {
  const { t } = useTranslation("admin");

  const topicsData = MOCK_TOPICS.map((item) => ({
    topic: t(`topics.${item.key}`),
    count: item.count,
  }));
  const queriesData = MOCK_DAILY_QUERIES.map((item) => ({
    day: t(`days.${item.key}`),
    queries: item.count,
  }));
  const topicsAverage = MOCK_TOPICS.reduce((sum, item) => sum + item.count, 0) / MOCK_TOPICS.length;

  const kpis = [
    {
      label: t("groundednessRate"),
      value: `${MOCK_GROUNDEDNESS_RATE}%`,
      trend: MOCK_GROUNDEDNESS_TREND,
      icon: Target,
      status: t("statusOptimal"),
      accent: "emerald" as const,
    },
    {
      label: t("declineRate"),
      value: `${MOCK_DECLINE_RATE}%`,
      trend: MOCK_DECLINE_TREND,
      icon: ShieldOff,
      status: t("statusWatch"),
      accent: "amber" as const,
    },
    {
      label: t("totalQueries"),
      value: MOCK_TOTAL_QUERIES.toLocaleString(),
      trend: MOCK_TOTAL_QUERIES_TREND,
      icon: MessagesSquare,
      status: t("statusLive"),
      accent: "primary" as const,
    },
  ];

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Management & Operations
            </span>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("title")}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-border bg-card/80 p-1 font-mono text-xs shadow-xs">
              <span className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground shadow-xs">
                Overview
              </span>
              <StampCta
                to="/admin/documents"
                variant="outline"
                className="h-7 border-0 bg-transparent px-3 py-1 text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              >
                Documents
              </StampCta>
            </div>
            <div className="elevation-1 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-sm">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <span
                  aria-hidden
                  className="size-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
                />
                {t("opsOnline")}
              </span>
              <span className="text-border" aria-hidden>
                •
              </span>
              <span className="text-[0.68rem] text-muted-foreground tracking-wider uppercase">
                Live sync
              </span>
            </div>
            <StampCta to="/chat" variant="outline" className="h-9 px-4 py-1.5 text-xs">
              <ArrowLeft className="size-3.5" aria-hidden />
              {t("backToChat")}
            </StampCta>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((kpi, i) => (
            <Reveal key={kpi.label} delay={i * 0.08}>
              <KpiCard
                label={kpi.label}
                value={kpi.value}
                trend={kpi.trend}
                icon={kpi.icon}
                status={kpi.status}
                accent={kpi.accent}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.24}>
          <div className="elevation-2 elevation-lift elevation-transition flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {t("topicsChartTitle")}
              </h2>
              <span className="font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                Distribution
              </span>
            </div>
            <TopicsBarChart
              data={topicsData}
              seriesName={t("queriesLabel")}
              average={topicsAverage}
              averageLabel={t("topicsAverageLabel", { value: Math.round(topicsAverage) })}
            />
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="elevation-2 elevation-lift elevation-transition flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {t("queriesChartTitle")}
              </h2>
              <span className="font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                7-Day Velocity
              </span>
            </div>
            <QueriesLineChart data={queriesData} seriesName={t("queriesLabel")} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
