import {
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  ChevronRight,
  Bell,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { ComplianceCalendarEvent } from "@/lib/calendar-api";
import { EventTypeBadge, PriorityBadge } from "./event-type-badge";

interface CalendarAgendaListProps {
  events: ComplianceCalendarEvent[];
  onSelectEvent: (event: ComplianceCalendarEvent) => void;
}

export function CalendarAgendaList({
  events,
  onSelectEvent,
}: CalendarAgendaListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40">
        <CalendarIcon className="size-10 text-muted-foreground/60 mb-3" />
        <h4 className="text-base font-semibold text-foreground">No Upcoming Events</h4>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          No compliance deadlines or scheduled audits match your selected filter criteria.
        </p>
      </div>
    );
  }

  const now = new Date();
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const getDaysDiff = (isoString: string) => {
    const target = new Date(isoString);
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col gap-3">
      {events.map((evt) => {
        const daysDiff = getDaysDiff(evt.startDate);
        const isUrgent = daysDiff >= 0 && daysDiff <= 3;
        const isOverdue = daysDiff < 0;

        return (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-card/80 hover:bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer backdrop-blur-sm"
          >
            {/* Left side: Date Badge & Details */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              {/* Date Box */}
              <div className="flex flex-col items-center justify-center size-13 sm:size-14 rounded-xl border border-border/80 bg-background/90 shrink-0 text-center shadow-xs">
                <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                  {new Date(evt.startDate).toLocaleDateString("en-IN", { month: "short" })}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-foreground leading-none mt-0.5">
                  {new Date(evt.startDate).getDate()}
                </span>
                <span className="text-2xs font-medium text-muted-foreground uppercase">
                  {new Date(evt.startDate).toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <EventTypeBadge type={evt.eventType} />
                  <PriorityBadge priority={evt.priority} />

                  {isOverdue && (
                    <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">
                      Overdue
                    </span>
                  )}
                  {isUrgent && !isOverdue && (
                    <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                      Due in {daysDiff === 0 ? "today" : `${daysDiff}d`}
                    </span>
                  )}

                  {evt.reminder?.enabled && (
                    <span className="inline-flex items-center gap-1 text-2xs text-primary font-medium">
                      <Bell className="size-3" />
                      Reminder On
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {evt.title}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {evt.description}
                </p>

                {/* Subtext info */}
                <div className="flex flex-wrap items-center gap-3 text-2xs text-muted-foreground mt-0.5">
                  {!evt.allDay && (
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{formatTime(evt.startDate)}</span>
                    </div>
                  )}
                  {evt.relatedStandard && (
                    <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                      {evt.relatedStandard}
                    </span>
                  )}
                  {evt.metadata?.location && (
                    <div className="flex items-center gap-1 truncate max-w-xs">
                      <MapPin className="size-3" />
                      <span className="truncate">{evt.metadata.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Action Button */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {evt.deepLink && (
                <Link
                  to={evt.deepLink}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:inline-flex"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1 h-8 font-semibold hover:bg-primary hover:text-primary-foreground"
                  >
                    <span>{evt.deepLinkText || "Action"}</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 rounded-full group-hover:bg-muted"
                aria-label="Inspect Event"
              >
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
