import {
  BadgeCheck,
  BookOpenCheck,
  CalendarClock,
  Gavel,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import type {
  RegulatoryCategory,
  RegulatoryEventDatum,
} from "@/lib/mock-regulatory-events";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<RegulatoryCategory, typeof Gavel> = {
  bis: Gavel,
  standards: BookOpenCheck,
  certification: BadgeCheck,
  international: Globe,
  upcoming: CalendarClock,
};

// Same navy/emerald/amber tint family used for notification type chips in
// notification-item.tsx, so a category reads the same way across the app.
const CATEGORY_STYLES: Record<RegulatoryCategory, string> = {
  bis: "bg-primary/10 text-primary",
  standards: "bg-secondary text-secondary-foreground",
  certification: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  international: "bg-[var(--chart-2)]/25 text-[oklch(0.4_0.1_250)]",
  upcoming: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

interface RadarTimelineProps {
  events: RegulatoryEventDatum[];
  emptyLabel: string;
}

/** Vertical timeline of regulatory events. Each entry fades/slides in as it
 * scrolls into view, reusing Reveal (src/components/landing/reveal.tsx) —
 * the same scroll-reveal already used for the landing page's sections —
 * rather than introducing a new animation approach. */
export function RadarTimeline({ events, emptyLabel }: RadarTimelineProps) {
  const { t, i18n } = useTranslation("radar");
  const now = Date.now();

  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card py-14 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="relative flex flex-col gap-5">
      <div
        aria-hidden
        className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-border"
      />
      {events.map((event, index) => {
        const Icon = CATEGORY_ICONS[event.category];
        const isFuture = new Date(event.date).getTime() > now;
        const showUpcomingBadge = isFuture && event.category !== "upcoming";

        return (
          <Reveal
            key={event.key}
            delay={Math.min(index * 0.05, 0.3)}
            className="relative pl-11"
          >
            <span
              className={cn(
                "absolute left-0 top-1 flex size-9 items-center justify-center rounded-full border-4 border-background",
                CATEGORY_STYLES[event.category],
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>

            <div
              className={cn(
                "elevation-1 elevation-transition rounded-xl border border-border bg-card p-4 transition-colors",
                isFuture && "border-primary/25 bg-primary/[0.03]",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-transparent",
                    CATEGORY_STYLES[event.category],
                  )}
                >
                  {t(`categories.${event.category}`)}
                </Badge>
                {showUpcomingBadge && (
                  <Badge
                    variant="outline"
                    className="border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  >
                    {t("upcomingBadge")}
                  </Badge>
                )}
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString(i18n.language, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                {t(`items.${event.key}.title`)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${event.key}.description`)}
              </p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
