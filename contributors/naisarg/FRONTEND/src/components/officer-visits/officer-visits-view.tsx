import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  RefreshCw,
  CalendarCheck,
  Building2,
  CalendarOff,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/lib/router-compat";
import {
  officerVisitsApi,
  type OfficerVisit,
  type OfficerVisitsResult,
} from "@/lib/officer-visits-api";
import { UpcomingVisitCard } from "./upcoming-visit-card";
import { VisitDetailsDialog } from "./visit-details-dialog";
import { PreparationChecklist } from "./preparation-checklist";
import { VisitHistory } from "./visit-history";

interface OfficerVisitsViewProps {
  initialApplicationId?: string;
}

export function OfficerVisitsView({
  initialApplicationId,
}: OfficerVisitsViewProps) {
  const { t } = useTranslation(["visits"]);
  const [data, setData] = useState<OfficerVisitsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>(
    initialApplicationId || "all"
  );
  const [selectedVisitForDetails, setSelectedVisitForDetails] =
    useState<OfficerVisit | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);

  const checklistRef = useRef<HTMLDivElement>(null);

  const fetchVisits = useCallback(
    async (appId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryAppId = appId && appId !== "all" ? appId : undefined;
        const result = await officerVisitsApi.getVisits({
          applicationId: queryAppId,
        });
        setData(result);
      } catch (err) {
        console.error("Officer Visits API fetch error:", err);
        setError(
          err instanceof Error ? err.message : t("visits:errors.description")
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchVisits(selectedAppId);
  }, [fetchVisits, selectedAppId]);

  const handleViewDetails = (visit: OfficerVisit) => {
    setSelectedVisitForDetails(visit);
    setDetailsDialogOpen(true);
  };

  const handleScrollToChecklist = () => {
    checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading official visits">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
    );
  }

  // Honest Error State
  if (error || !data) {
    const isNetworkOrFetchError =
      !error ||
      error.toLowerCase().includes("failed to fetch") ||
      error.toLowerCase().includes("networkerror") ||
      error.toLowerCase().includes("http");

    const displayMessage = isNetworkOrFetchError
      ? t("visits:errors.description")
      : error;

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-xl sm:p-12">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="size-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          {t("visits:errors.title")}
        </h3>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
          {displayMessage}
        </p>
        <Button
          onClick={() => fetchVisits(selectedAppId)}
          className="mt-6 gap-2 rounded-xl px-5 font-semibold shadow-xs"
        >
          <RefreshCw className="size-4" />
          {t("visits:errors.retry")}
        </Button>
      </div>
    );
  }

  const upcoming = data.upcomingVisit;
  const history = data.history || [];
  const appOptions = data.applicationContexts || [];

  // Empty state when no upcoming visits and no history
  if (!upcoming && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/90 p-8 text-center shadow-sm backdrop-blur-xl dark:border-border/50 dark:bg-card/80 sm:p-12">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarOff className="size-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          {t("visits:emptyStates.noVisitsTitle")}
        </h3>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
          {t("visits:emptyStates.noVisitsDesc")}
        </p>
        <Link to="/registration/new" className="mt-6">
          <Button className="rounded-xl px-5 font-semibold">
            {t("visits:emptyStates.checkApplications")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Application Filter (when multiple applications exist) */}
      {appOptions.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 dark:border-border/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Filter className="size-3.5 text-primary" />
            <span>{t("visits:applicationFilter.filterLabel")}</span>
          </div>
          <Select
            value={selectedAppId}
            onValueChange={(val) => setSelectedAppId(val)}
          >
            <SelectTrigger className="h-8 w-64 rounded-lg bg-card text-xs font-medium">
              <SelectValue placeholder={t("visits:applicationFilter.allApplications")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("visits:applicationFilter.allApplications")}
              </SelectItem>
              {appOptions.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.applicationNumber} — {app.productTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Upcoming Visit Hero Card */}
      {upcoming ? (
        <UpcomingVisitCard
          visit={upcoming}
          onViewDetails={handleViewDetails}
          onScrollToChecklist={
            upcoming.preparationChecklist && upcoming.preparationChecklist.length > 0
              ? handleScrollToChecklist
              : undefined
          }
        />
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-5 text-muted-foreground">
          <CalendarCheck className="size-5 text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {t("visits:emptyStates.pendingTitle")}
            </span>
            <span className="text-xs">
              {t("visits:emptyStates.pendingDesc")}
            </span>
          </div>
        </div>
      )}

      {/* Preparation Checklist */}
      {upcoming?.preparationChecklist && upcoming.preparationChecklist.length > 0 && (
        <div ref={checklistRef}>
          <PreparationChecklist
            items={upcoming.preparationChecklist}
            summary={upcoming.preparationSummary}
          />
        </div>
      )}

      {/* Visit History Section */}
      <VisitHistory visits={history} onViewDetails={handleViewDetails} />

      {/* Detailed Visit Modal Dialog */}
      <VisitDetailsDialog
        visit={selectedVisitForDetails}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}
