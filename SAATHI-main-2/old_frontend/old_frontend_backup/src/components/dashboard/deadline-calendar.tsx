import { CalendarDays, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buildIcsCalendar, downloadIcsFile } from "@/lib/ics-export";
import type { DashboardDeadline } from "@/lib/mock-dashboard";

interface DeadlineCalendarProps {
  deadlines: DashboardDeadline[];
}

function isSameDay(iso: string, date: Date): boolean {
  const d = new Date(`${iso}T00:00:00`);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

/**
 * S20 — a month view of S2's real DashboardDeadline[] data, plus a
 * client-side .ics export (see src/lib/ics-export.ts). No new data
 * source: this is the exact same `deadlines` array UpcomingDeadlines
 * already renders as a list, just also shown on a calendar grid.
 */
export function DeadlineCalendar({ deadlines }: DeadlineCalendarProps) {
  const { t } = useTranslation("dashboard");
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const deadlineDates = useMemo(
    () => deadlines.map((d) => new Date(`${d.dueDate}T00:00:00`)),
    [deadlines],
  );
  const selectedDayDeadlines = selected
    ? deadlines.filter((d) => isSameDay(d.dueDate, selected))
    : [];

  if (deadlines.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        heading={t("calendar.empty")}
        body=""
        compact
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{t("calendar.hint")}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            downloadIcsFile("saathi-deadlines.ics", buildIcsCalendar(deadlines))
          }
        >
          <Download className="size-3.5" aria-hidden />
          {t("calendar.exportAll")}
        </Button>
      </div>

      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        modifiers={{ deadline: deadlineDates }}
        modifiersClassNames={{
          deadline:
            "relative after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
        }}
        className="mx-auto w-fit rounded-xl border border-border"
      />

      {selected && (
        <div className="flex flex-col gap-2">
          {selectedDayDeadlines.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {t("calendar.noneOnDay")}
            </p>
          ) : (
            selectedDayDeadlines.map((deadline) => (
              <div
                key={deadline.key}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <CalendarDays
                    className="size-3.5 shrink-0 text-primary"
                    aria-hidden
                  />
                  {deadline.label}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    downloadIcsFile(
                      `${deadline.key}.ics`,
                      buildIcsCalendar([deadline]),
                    )
                  }
                >
                  {t("calendar.addOne")}
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
