import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import {
  type CategoryFilter,
  RadarFilters,
} from "@/components/regulatory-radar/radar-filters";
import { RadarTimeline } from "@/components/regulatory-radar/radar-timeline";
import { MOCK_REGULATORY_EVENTS } from "@/lib/mock-regulatory-events";

export function RegulatoryRadarPage() {
  const { t } = useTranslation("radar");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const events = useMemo(
    () =>
      [...MOCK_REGULATORY_EVENTS].sort((a, b) => a.date.localeCompare(b.date)),
    [],
  );

  const counts = useMemo(() => {
    const base: Record<CategoryFilter, number> = {
      all: events.length,
      bis: 0,
      standards: 0,
      certification: 0,
      international: 0,
      upcoming: 0,
    };
    for (const event of events) base[event.category] += 1;
    return base;
  }, [events]);

  const filtered =
    category === "all"
      ? events
      : events.filter((event) => event.category === category);

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {t("subheading")}
            </p>
          </div>
          <Link
            to="/chat"
            className="shrink-0 text-sm font-medium text-primary underline underline-offset-4"
          >
            {t("backToChat")}
          </Link>
        </div>

        <RadarFilters
          active={category}
          onChange={setCategory}
          counts={counts}
        />

        <RadarTimeline events={filtered} emptyLabel={t("emptyState")} />
      </div>
    </div>
  );
}
