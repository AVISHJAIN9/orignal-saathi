import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComplianceCalendarEvent } from "@/lib/calendar-api";

interface CalendarMonthGridProps {
  events: ComplianceCalendarEvent[];
  onSelectEvent: (event: ComplianceCalendarEvent) => void;
}

export function CalendarMonthGrid({
  events,
  onSelectEvent,
}: CalendarMonthGridProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  // Create grid cells (42 cells: 6 rows of 7 days)
  const days = [];

  // Previous month padding
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      dayNumber: prevMonthLastDay - i,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dayDate = new Date(year, month, d);
    days.push({
      date: dayDate,
      isCurrentMonth: true,
      dayNumber: d,
    });
  }

  // Next month padding to fill 35 or 42 cells
  const remainingCells = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const dayDate = new Date(year, month + 1, i);
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      dayNumber: i,
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now);
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

  const selectedDayEvents = getEventsForDay(selectedDay);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const weekDayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-4">
      {/* Month Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/60">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-foreground">
            {monthName} {year}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-xs h-7 px-2.5 font-medium"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="size-8"
            aria-label="Previous Month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="size-8"
            aria-label="Next Month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="rounded-xl border border-border/70 overflow-x-auto bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="min-w-[420px] sm:min-w-0">
          {/* Day Header Row */}
          <div className="grid grid-cols-7 border-b border-border/70 bg-muted/40 text-center font-mono text-2xs font-bold text-muted-foreground uppercase py-2">
          {weekDayHeaders.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>

        {/* 7-Column Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/50">
          {days.map((item, index) => {
            const dayEvents = getEventsForDay(item.date);
            const isToday = isSameDay(item.date, new Date());
            const isSelected = isSameDay(item.date, selectedDay);

            return (
              <div
                key={index}
                onClick={() => setSelectedDay(item.date)}
                className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 cursor-pointer transition-colors relative flex flex-col justify-between ${
                  !item.isCurrentMonth
                    ? "bg-muted/15 text-muted-foreground/50"
                    : "hover:bg-muted/30"
                } ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
              >
                {/* Date header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold size-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-foreground"
                    }`}
                  >
                    {item.dayNumber}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                </div>

                {/* Event previews inside cell */}
                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.slice(0, 2).map((evt) => (
                    <button
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className={`w-full text-left truncate text-2xs px-1.5 py-0.5 rounded font-medium transition-transform hover:scale-[1.02] ${
                        evt.priority === "CRITICAL"
                          ? "bg-destructive/15 text-destructive border border-destructive/30"
                          : evt.eventType === "FACTORY_AUDIT" || evt.eventType === "OFFICER_VISIT"
                          ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                          : "bg-muted text-foreground border border-border/40"
                      }`}
                    >
                      {evt.title}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-2xs text-muted-foreground font-mono pl-1">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Selected Day Agenda Drawer / Summary underneath */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
          <span>Events for {selectedDay.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span className="font-mono text-xs text-primary">{selectedDayEvents.length} event(s)</span>
        </h4>

        {selectedDayEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No compliance events scheduled for this day.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-background/80 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-2.5 rounded-full ${
                      evt.priority === "CRITICAL"
                        ? "bg-destructive animate-pulse"
                        : evt.priority === "HIGH"
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">{evt.title}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-1">{evt.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-medium shrink-0">
                  Inspect
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
