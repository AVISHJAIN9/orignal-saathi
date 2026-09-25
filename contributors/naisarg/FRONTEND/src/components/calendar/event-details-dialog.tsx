import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  FileText,
  Building2,
  Award,
  ExternalLink,
  Bell,
  Download,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/lib/router-compat";
import {
  calendarApi,
  type ComplianceCalendarEvent,
  type CalendarReminderConfig,
} from "@/lib/calendar-api";
import { EventTypeBadge, PriorityBadge } from "./event-type-badge";
import { DEMO_WATERMARK_TEXT } from "@/lib/demo/demo-context";

interface EventDetailsDialogProps {
  event: ComplianceCalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReminderUpdated?: () => void;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onReminderUpdated,
}: EventDetailsDialogProps) {
  const { t } = useTranslation(["calendar"]);
  const [reminderConfig, setReminderConfig] = useState<CalendarReminderConfig>({
    enabled: false,
    notifyDaysBefore: [1],
    channel: "IN_APP",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (event) {
      setReminderConfig(
        event.reminder || {
          enabled: false,
          notifyDaysBefore: [1],
          channel: "IN_APP",
        }
      );
      setSaveSuccess(false);
    }
  }, [event]);

  if (!event) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: event.allDay ? undefined : "2-digit",
        minute: event.allDay ? undefined : "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const handleToggleDay = (days: number) => {
    const current = [...reminderConfig.notifyDaysBefore];
    const index = current.indexOf(days);
    if (index >= 0) {
      if (current.length > 1) current.splice(index, 1);
    } else {
      current.push(days);
      current.sort((a, b) => a - b);
    }
    setReminderConfig({ ...reminderConfig, notifyDaysBefore: current });
  };

  const handleSaveReminders = () => {
    calendarApi.saveReminderConfig(event.id, reminderConfig);
    setSaveSuccess(true);
    if (onReminderUpdated) onReminderUpdated();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportSingle = () => {
    calendarApi.exportToIcs([event], `event_${event.id}.ics`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[90dvh] overflow-y-auto p-4 sm:p-7">
        <DialogHeader className="gap-2 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <EventTypeBadge type={event.eventType} />
              <PriorityBadge priority={event.priority} />
            </div>
            {event.isDemo && (
              <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {DEMO_WATERMARK_TEXT}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1 break-words">
            {event.title}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <CalendarIcon className="size-4 text-primary" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            {event.endDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                <span>To: {formatDate(event.endDate)}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex flex-col gap-5 py-3 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Description & Statutory Context
            </h4>
            <p className="text-foreground leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border/40">
              {event.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {event.relatedApplication && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/50 bg-background">
                <FileText className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block font-medium">Application ID</span>
                  <span className="font-mono font-bold text-foreground">
                    {event.relatedApplication}
                  </span>
                </div>
              </div>
            )}

            {event.relatedStandard && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/50 bg-background">
                <Building2 className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block font-medium">Indian Standard</span>
                  <span className="font-semibold text-foreground">
                    {event.relatedStandard}
                  </span>
                </div>
              </div>
            )}

            {event.relatedCertificate && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/50 bg-background">
                <Award className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block font-medium">License / Certificate</span>
                  <span className="font-mono font-bold text-foreground">
                    {event.relatedCertificate}
                  </span>
                </div>
              </div>
            )}

            {event.metadata?.assignedOfficer && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/50 bg-background">
                <User className="size-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block font-medium">Assigned Officer</span>
                  <span className="font-semibold text-foreground">
                    {event.metadata.assignedOfficer}
                  </span>
                </div>
              </div>
            )}

            {event.metadata?.location && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/50 bg-background sm:col-span-2">
                <MapPin className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block font-medium">Plant / Inspection Venue</span>
                  <span className="text-foreground">{event.metadata.location}</span>
                </div>
              </div>
            )}

            {event.metadata?.amountDue && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 sm:col-span-2">
                <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <span className="text-muted-foreground block font-medium">Statutory Fee Payable</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {event.metadata.amountDue}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Reminder Configuration Section */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">
                  {t("calendar:dialog.reminders")}
                </span>
              </div>
              <Switch
                checked={reminderConfig.enabled}
                onCheckedChange={(checked) =>
                  setReminderConfig({ ...reminderConfig, enabled: checked })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("calendar:dialog.reminderDesc")}
            </p>

            {reminderConfig.enabled && (
              <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-primary/10">
                {[1, 3, 7].map((days) => (
                  <label
                    key={days}
                    className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                  >
                    <Checkbox
                      checked={reminderConfig.notifyDaysBefore.includes(days)}
                      onCheckedChange={() => handleToggleDay(days)}
                    />
                    <span>{days} {days === 1 ? "day" : "days"} before</span>
                  </label>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveReminders}
                className="gap-1.5 text-xs font-semibold"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>{t("calendar:dialog.saveReminders")}</span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportSingle}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Download className="size-3.5" />
                <span>{t("calendar:dialog.exportSingle")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Dialog Actions */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <span className="text-2xs text-muted-foreground italic truncate">
            Source: {event.source}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>

            {event.deepLink && (
              <Link to={event.deepLink}>
                <Button size="sm" className="gap-1.5 font-semibold">
                  <span>{event.deepLinkText || "Open Linked Feature"}</span>
                  <ExternalLink className="size-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
