import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComplianceCalendarEvent } from "@/lib/calendar-api";
import { EventTypeBadge, PriorityBadge } from "./event-type-badge";

interface CalendarWeekGridProps {
  events: ComplianceCalendarEvent[];
  onSelectEvent: (event: ComplianceCalendarEvent) => void;
}

export function CalendarWeekGrid({
  events,
  onSelectEvent,
}: CalendarWeekGridProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Compute start of week (Sunday)
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);

  // Generate 7 days for the week
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const handlePrevWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() - 7);
    setCurrentDate(next);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getEventsForDay = (dayDate: Date) => {
    return events.filter((evt) => {
      const start = new Date(evt.startDate);
      return isSameDay(start, dayDate);
    });
  };

  const startFormatted = weekDays[0].toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
  const endFormatted = weekDays[6].toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/60">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {startFormatted} – {endFormatted}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-xs h-7 px-2.5 font-medium"
          >
            This Week
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevWeek}
            className="size-8"
            aria-label="Previous Week"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            className="size-8"
            aria-label="Next Week"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* 7-Day Horizontal Schedule Columns */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={`flex flex-col rounded-xl border p-3 min-h-[160px] md:min-h-[300px] transition-colors ${
                isToday
                  ? "border-primary/40 bg-primary/5 shadow-xs"
                  : "border-border/60 bg-card/70"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
                <div className="flex flex-col">
                  <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                    {day.toLocaleDateString("en-IN", { weekday: "short" })}
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      isToday ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
                {dayEvents.length > 0 && (
                  <span className="font-mono text-2xs font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Stack for the Day */}
              <div className="flex flex-col gap-2 flex-1">
                {dayEvents.length === 0 ? (
                  <span className="text-2xs text-muted-foreground/60 italic mt-2">
                    No events
                  </span>
                ) : (
                  dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onSelectEvent(evt)}
                      className="p-2 rounded-lg border border-border/70 bg-background/90 hover:bg-muted/50 cursor-pointer transition-all shadow-xs hover:shadow-sm flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <EventTypeBadge type={evt.eventType} showIcon={false} className="text-2xs py-0 px-1.5" />
                        <PriorityBadge priority={evt.priority} />
                      </div>
                      <h5 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
                        {evt.title}
                      </h5>
                      {!evt.allDay && (
                        <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                          <Clock className="size-3" />
                          <span>
                            {new Date(evt.startDate).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
