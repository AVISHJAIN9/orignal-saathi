import { useTranslation } from "react-i18next";
import {
  History,
  Calendar,
  MapPin,
  Building2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VisitStatusBadge } from "./visit-status-badge";
import type { OfficerVisit } from "@/lib/officer-visits-api";

interface VisitHistoryProps {
  visits: OfficerVisit[];
  onViewDetails: (visit: OfficerVisit) => void;
}

export function VisitHistory({ visits, onViewDetails }: VisitHistoryProps) {
  const { t } = useTranslation(["visits"]);

  if (visits.length === 0) {
    return (
      <Card className="rounded-2xl border border-border/50 bg-card/90 p-6 shadow-sm backdrop-blur-xl dark:border-border/50 dark:bg-card/80">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <History className="size-8 text-muted-foreground/50 mb-2" />
          <h4 className="text-sm font-semibold text-foreground">
            {t("visits:history.title")}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("visits:history.empty")}
          </p>
        </div>
      </Card>
    );
  }

  const formatLocation = (location?: OfficerVisit["location"]) => {
    if (!location) return null;
    if (typeof location === "string") return location;
    return [location.city, location.state].filter(Boolean).join(", ");
  };

  return (
    <Card className="rounded-2xl border border-border/50 bg-card/90 shadow-sm backdrop-blur-xl dark:border-border/50 dark:bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <History className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              {t("visits:history.title")}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {t("visits:history.subtitle")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        <div className="flex flex-col divide-y divide-border/40 rounded-xl border border-border/60 bg-muted/20">
          {visits.map((visit) => {
            const loc = formatLocation(visit.location);
            return (
              <div
                key={visit.id}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground truncate">
                      {visit.visitType}
                    </span>
                    <VisitStatusBadge status={visit.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3 text-primary" />
                      {visit.scheduledDate}
                    </span>
                    {loc && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3 text-primary" />
                        {loc}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="size-3 text-primary" />
                      {visit.applicationTitle || visit.applicationNumber || visit.applicationId}
                    </span>
                  </div>

                  {visit.purpose && visit.purpose !== visit.visitType && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {visit.purpose}
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-1 sm:pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(visit)}
                    className="h-8 gap-1 px-3 text-xs font-semibold text-primary hover:bg-primary/10"
                  >
                    {t("visits:history.viewDetails")}
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
