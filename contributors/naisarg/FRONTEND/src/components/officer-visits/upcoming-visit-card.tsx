import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Building2,
  FileCheck2,
  ArrowUpRight,
  ShieldCheck,
  ListTodo,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/lib/router-compat";
import { VisitStatusBadge } from "./visit-status-badge";
import type { OfficerVisit } from "@/lib/officer-visits-api";

interface UpcomingVisitCardProps {
  visit: OfficerVisit;
  onViewDetails: (visit: OfficerVisit) => void;
  onScrollToChecklist?: () => void;
}

export function UpcomingVisitCard({
  visit,
  onViewDetails,
  onScrollToChecklist,
}: UpcomingVisitCardProps) {
  const { t } = useTranslation(["visits"]);

  const formatLocation = () => {
    if (!visit.location) return "Inspection location on file";
    if (typeof visit.location === "string") return visit.location;
    const parts = [
      visit.location.unitName,
      visit.location.city,
      visit.location.state,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Inspection location on file";
  };

  const prepReady = visit.preparationSummary?.readyCount ?? 0;
  const prepTotal = visit.preparationSummary?.totalCount ?? (visit.preparationChecklist?.length || 0);
  const prepPercent = prepTotal > 0 ? Math.round((prepReady / prepTotal) * 100) : 0;

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-md backdrop-blur-xl transition-all duration-200 hover:border-primary/50 hover:shadow-lg">
      <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 size-32 rounded-full bg-blue-500/10 blur-2xl" />

      <CardContent className="relative z-10 flex flex-col gap-5 p-5 sm:p-6">
        {/* Top bar with Eyebrow and Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-primary uppercase">
              <Calendar className="size-3.5" />
              {t("visits:upcoming.scheduledFor")}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {visit.visitType}
            </span>
          </div>
          <VisitStatusBadge status={visit.status} />
        </div>

        {/* Hero Title & Application Info */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {visit.purpose || visit.visitType}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Building2 className="size-3.5 text-primary" />
              {visit.applicationTitle || visit.applicationNumber || visit.applicationId}
            </span>
            {visit.standardNumber && (
              <Badge variant="outline" className="font-mono text-2xs font-medium text-muted-foreground">
                {visit.standardNumber}
              </Badge>
            )}
          </div>
        </div>

        {/* Date, Time, Location & Officer Grid */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/50 bg-muted/30 p-4 dark:border-border/50 dark:bg-muted/20 sm:grid-cols-3">
          {/* Date & Time */}
          <div className="flex items-start gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xs font-medium text-muted-foreground uppercase">
                {t("visits:detailsDialog.dateTime")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {visit.scheduledDate}
              </span>
              {visit.scheduledTime && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {visit.scheduledTime}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xs font-medium text-muted-foreground uppercase">
                {t("visits:upcoming.location")}
              </span>
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {formatLocation()}
              </span>
            </div>
          </div>

          {/* Assigned Officer */}
          <div className="flex items-start gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xs font-medium text-muted-foreground uppercase">
                {t("visits:detailsDialog.officer")}
              </span>
              {visit.officer?.name ? (
                <>
                  <span className="text-xs font-bold text-foreground sm:text-sm">
                    {visit.officer.name}
                  </span>
                  {visit.officer.designation && (
                    <span className="text-2xs text-muted-foreground">
                      {visit.officer.designation}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t("visits:upcoming.noOfficerAssigned")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Preparation Progress Bar if items exist */}
        {prepTotal > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 dark:border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <FileCheck2 className="size-4 text-primary" />
                {t("visits:checklist.progressLabel")}
              </span>
              <span className="font-mono font-bold text-primary">
                {prepReady} / {prepTotal} ready ({prepPercent}%)
              </span>
            </div>
            <Progress value={prepPercent} className="h-2 rounded-full" />
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => onViewDetails(visit)}
              className="gap-1.5 rounded-xl px-4 font-semibold shadow-xs"
            >
              {t("visits:upcoming.viewDetails")}
              <ArrowUpRight className="size-4" />
            </Button>
            {onScrollToChecklist && prepTotal > 0 && (
              <Button
                variant="outline"
                onClick={onScrollToChecklist}
                className="gap-1.5 rounded-xl border-border/70 px-4 font-semibold hover:bg-muted"
              >
                <ListTodo className="size-4 text-primary" />
                {t("visits:upcoming.prepChecklist")}
              </Button>
            )}
          </div>

          <Link
            to="/document-cortex"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            <span>{t("visits:checklist.openVault")}</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
