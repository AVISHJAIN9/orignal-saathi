import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ListFilter,
  Download,
  Search,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  calendarApi,
  type ComplianceCalendarEvent,
  type CalendarEventType,
  type EventPriority,
  type CalendarMetricsSummary,
} from "@/lib/calendar-api";
import { CalendarMonthGrid } from "./calendar-month-grid";
import { CalendarWeekGrid } from "./calendar-week-grid";
import { CalendarAgendaList } from "./calendar-agenda-list";
import { EventDetailsDialog } from "./event-details-dialog";
import { DEMO_DISCLAIMER_LABEL } from "@/lib/demo/demo-context";

type ViewMode = "month" | "week" | "agenda";

export function ComplianceCalendarView() {
  const { t } = useTranslation(["calendar"]);
  const [events, setEvents] = useState<ComplianceCalendarEvent[]>([]);
  const [summary, setSummary] = useState<CalendarMetricsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  // Filters & State
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<CalendarEventType | "ALL">("ALL");
  const [selectedPriority, setSelectedPriority] = useState<EventPriority | "ALL">("ALL");

  // Selected event for modal
  const [selectedEvent, setSelectedEvent] = useState<ComplianceCalendarEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchCalendarEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await calendarApi.getEvents({
        eventType: selectedType,
        priority: selectedPriority,
        search: searchQuery || undefined,
      });
      setEvents(result.events);
      setSummary(result.summary);
      setIsDemoFallback(result.isDemoFallback);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, selectedPriority, searchQuery]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const handleSelectEvent = (event: ComplianceCalendarEvent) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  const handleExportAll = () => {
    calendarApi.exportToIcs(events, "saathi_compliance_calendar.ics");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Demo indicator banner */}
      {isDemoFallback && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20">
              {DEMO_DISCLAIMER_LABEL}
            </span>
            <span>
              Connected to SAATHI Offline Sandbox. Compliance events shown for Apex Engineering Pvt Ltd (IS 14543:2018).
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-2xs text-muted-foreground">
            SIH 2026 Evaluation Mode
          </span>
        </div>
      )}

      {/* KPI Metric Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("calendar:metrics.dueThisWeek")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.dueThisWeek}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("calendar:metrics.criticalDeadlines")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-destructive font-mono">
                {summary.criticalDeadlines}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("calendar:metrics.scheduledAudits")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.scheduledAudits}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarIcon className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("calendar:metrics.totalEvents")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.totalEvents}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: Views Switcher & Export */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm">
        {/* Left: View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as ViewMode)}>
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="month" className="text-xs font-semibold px-3 py-1.5">
              {t("calendar:viewMode.month")}
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs font-semibold px-3 py-1.5">
              {t("calendar:viewMode.week")}
            </TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs font-semibold px-3 py-1.5">
              {t("calendar:viewMode.agenda")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right: Export & Sync Status */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Download className="size-3.5" />
            <span>{t("calendar:sync.exportIcal")}</span>
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("calendar:filters.searchPlaceholder")}
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>

        <Select
          value={selectedType}
          onValueChange={(val) => setSelectedType(val as CalendarEventType | "ALL")}
        >
          <SelectTrigger className="text-xs h-9 rounded-lg">
            <SelectValue placeholder={t("calendar:filters.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("calendar:filters.allTypes")}</SelectItem>
            <SelectItem value="FACTORY_AUDIT">Factory Audit</SelectItem>
            <SelectItem value="OFFICER_VISIT">Officer Visit</SelectItem>
            <SelectItem value="APPLICATION_DEADLINE">Application Deadline</SelectItem>
            <SelectItem value="DOCUMENT_DEADLINE">Document Deadline</SelectItem>
            <SelectItem value="PAYMENT_DUE">Payment Due</SelectItem>
            <SelectItem value="APPEAL_DEADLINE">Appeal Window</SelectItem>
            <SelectItem value="CERTIFICATE_EXPIRY">Certificate Expiry</SelectItem>
            <SelectItem value="REGULATORY_CHANGE">Regulatory Change</SelectItem>
            <SelectItem value="REMINDER">Workspace Reminder</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedPriority}
          onValueChange={(val) => setSelectedPriority(val as EventPriority | "ALL")}
        >
          <SelectTrigger className="text-xs h-9 rounded-lg">
            <SelectValue placeholder={t("calendar:filters.allPriorities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("calendar:filters.allPriorities")}</SelectItem>
            <SelectItem value="CRITICAL">Critical Priority</SelectItem>
            <SelectItem value="HIGH">High Priority</SelectItem>
            <SelectItem value="MEDIUM">Medium Priority</SelectItem>
            <SelectItem value="LOW">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sync Status Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground mr-1">
            {t("calendar:sync.syncTitle")}:
          </span>
          <span>{t("calendar:sync.syncNotice")}</span>
        </div>
      </div>

      {/* Main View Container */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <h4 className="text-base font-bold text-foreground">Failed to Load Calendar</h4>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <Button
            onClick={fetchCalendarEvents}
            size="sm"
            className="mt-4 gap-1.5 font-semibold"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "month" && (
            <CalendarMonthGrid
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {viewMode === "week" && (
            <CalendarWeekGrid
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {viewMode === "agenda" && (
            <CalendarAgendaList
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          )}
        </>
      )}

      {/* Event Details Dialog Modal */}
      <EventDetailsDialog
        event={selectedEvent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onReminderUpdated={fetchCalendarEvents}
      />
    </div>
  );
}
