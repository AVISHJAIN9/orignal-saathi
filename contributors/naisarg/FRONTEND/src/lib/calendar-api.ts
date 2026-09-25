import { API_BASE_URL } from "./developer-data";
import {
  S20_CANONICAL_CALENDAR_EVENTS,
  type ComplianceCalendarEvent,
  type CalendarEventType,
  type EventPriority,
  type EventStatus,
  type CalendarReminderConfig,
} from "./demo-demo/../demo/s20-demo-data";
import { isDemoMode } from "./demo/demo-context";

export type {
  ComplianceCalendarEvent,
  CalendarEventType,
  EventPriority,
  EventStatus,
  CalendarReminderConfig,
};

export interface CalendarFilterOptions {
  eventType?: CalendarEventType | "ALL";
  priority?: EventPriority | "ALL";
  status?: EventStatus | "ALL";
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CalendarMetricsSummary {
  totalEvents: number;
  dueThisWeek: number;
  criticalDeadlines: number;
  scheduledAudits: number;
  activeReminders: number;
}

const LOCAL_REMINDERS_STORAGE_KEY = "saathi_s20_event_reminders_v1";
const LOCAL_CUSTOM_EVENTS_KEY = "saathi_s20_custom_events_v1";

export const calendarApi = {
  /**
   * Fetch compliance calendar events from backend with transparent demo fallback.
   */
  async getEvents(filters?: CalendarFilterOptions): Promise<{
    events: ComplianceCalendarEvent[];
    summary: CalendarMetricsSummary;
    isDemoFallback: boolean;
  }> {
    let rawEvents: ComplianceCalendarEvent[] = [];
    let isDemoFallback = false;

    if (!isDemoMode()) {
      try {
        const query = new URLSearchParams();
        if (filters?.eventType && filters.eventType !== "ALL") {
          query.set("eventType", filters.eventType);
        }
        if (filters?.priority && filters.priority !== "ALL") {
          query.set("priority", filters.priority);
        }
        if (filters?.startDate) query.set("startDate", filters.startDate);
        if (filters?.endDate) query.set("endDate", filters.endDate);

        const url = `${API_BASE_URL}/calendar/events${query.toString() ? `?${query.toString()}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          rawEvents = Array.isArray(data) ? data : data?.events || [];
        } else {
          isDemoFallback = true;
          rawEvents = [...S20_CANONICAL_CALENDAR_EVENTS];
        }
      } catch {
        isDemoFallback = true;
        rawEvents = [...S20_CANONICAL_CALENDAR_EVENTS];
      }
    } else {
      isDemoFallback = true;
      rawEvents = [...S20_CANONICAL_CALENDAR_EVENTS];
    }

    // Merge locally stored custom reminders and modified reminder configurations
    const localReminders = this.getLocalReminderConfigs();
    const localCustomEvents = this.getLocalCustomEvents();

    let combined = [...localCustomEvents, ...rawEvents].map((evt) => {
      const customReminder = localReminders[evt.id];
      if (customReminder) {
        return { ...evt, reminder: customReminder };
      }
      return evt;
    });

    // Apply client filters
    if (filters?.eventType && filters.eventType !== "ALL") {
      combined = combined.filter((e) => e.eventType === filters.eventType);
    }
    if (filters?.priority && filters.priority !== "ALL") {
      combined = combined.filter((e) => e.priority === filters.priority);
    }
    if (filters?.status && filters.status !== "ALL") {
      combined = combined.filter((e) => e.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      combined = combined.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.relatedStandard?.toLowerCase().includes(q) ||
          e.relatedApplication?.toLowerCase().includes(q) ||
          e.relatedCertificate?.toLowerCase().includes(q)
      );
    }

    // Sort chronologically ascending
    combined.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Calculate metrics
    const now = new Date();
    const oneWeekLater = new Date(now);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const summary: CalendarMetricsSummary = {
      totalEvents: combined.length,
      dueThisWeek: combined.filter((e) => {
        const d = new Date(e.startDate);
        return d >= now && d <= oneWeekLater;
      }).length,
      criticalDeadlines: combined.filter(
        (e) => e.priority === "CRITICAL" && e.status !== "COMPLETED"
      ).length,
      scheduledAudits: combined.filter(
        (e) => e.eventType === "FACTORY_AUDIT" || e.eventType === "OFFICER_VISIT"
      ).length,
      activeReminders: combined.filter((e) => e.reminder?.enabled).length,
    };

    return {
      events: combined,
      summary,
      isDemoFallback,
    };
  },

  /**
   * Save a configured reminder for an event locally.
   */
  saveReminderConfig(eventId: string, config: CalendarReminderConfig): void {
    const existing = this.getLocalReminderConfigs();
    existing[eventId] = config;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_REMINDERS_STORAGE_KEY, JSON.stringify(existing));
      }
    } catch {
      // Storage unavailable
    }
  },

  getLocalReminderConfigs(): Record<string, CalendarReminderConfig> {
    try {
      if (typeof window === "undefined") return {};
      const saved = localStorage.getItem(LOCAL_REMINDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  },

  getLocalCustomEvents(): ComplianceCalendarEvent[] {
    try {
      if (typeof window === "undefined") return [];
      const saved = localStorage.getItem(LOCAL_CUSTOM_EVENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveCustomEvent(event: ComplianceCalendarEvent): void {
    const existing = this.getLocalCustomEvents();
    existing.unshift(event);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_CUSTOM_EVENTS_KEY, JSON.stringify(existing));
      }
    } catch {
      // Storage unavailable
    }
  },

  /**
   * Generates a valid RFC 5545 standard .ics iCalendar file string and triggers client download.
   * Can be natively opened by Google Calendar, Apple Calendar, or Microsoft Outlook.
   */
  exportToIcs(events: ComplianceCalendarEvent[], filename = "saathi_compliance_calendar.ics"): void {
    const formatIcsDate = (dateString: string, isAllDay = false): string => {
      const d = new Date(dateString);
      if (isAllDay) {
        return d.toISOString().split("T")[0].replace(/-/g, "");
      }
      return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    };

    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SAATHI//BIS Compliance Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:SAATHI BIS Compliance Calendar",
      "X-WR-TIMEZONE:Asia/Kolkata",
    ];

    for (const evt of events) {
      const startStr = formatIcsDate(evt.startDate, evt.allDay);
      const endStr = evt.endDate
        ? formatIcsDate(evt.endDate, evt.allDay)
        : formatIcsDate(
            new Date(new Date(evt.startDate).getTime() + 3600000).toISOString(),
            evt.allDay
          );

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${evt.id}@saathi.bis.gov.in`);
      lines.push(`DTSTAMP:${formatIcsDate(new Date().toISOString())}`);
      if (evt.allDay) {
        lines.push(`DTSTART;VALUE=DATE:${startStr}`);
        lines.push(`DTEND;VALUE=DATE:${endStr}`);
      } else {
        lines.push(`DTSTART:${startStr}`);
        lines.push(`DTEND:${endStr}`);
      }
      lines.push(`SUMMARY:${evt.title.replace(/[,;]/g, " ")}`);
      lines.push(
        `DESCRIPTION:${(evt.description + (evt.deepLink ? `\\nAction link: https://saathi.bis.gov.in${evt.deepLink}` : "")).replace(/[,;]/g, " ")}`
      );
      if (evt.metadata?.location) {
        lines.push(`LOCATION:${evt.metadata.location.replace(/[,;]/g, " ")}`);
      }
      lines.push(`STATUS:${evt.status === "COMPLETED" ? "CONFIRMED" : "TENTATIVE"}`);
      lines.push(`PRIORITY:${evt.priority === "CRITICAL" ? "1" : evt.priority === "HIGH" ? "3" : "5"}`);
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    const icsContent = lines.join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },
};
