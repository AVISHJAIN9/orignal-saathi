import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  Award,
  CheckCircle2,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RenewalCard } from "./renewal-card";
import { RenewalDetailsDialog } from "./renewal-details-dialog";
import { renewalsApi, type RenewalsResult } from "@/lib/renewals-api";
import type { LicenseRenewalItem } from "@/lib/demo/s11-demo-data";

interface RenewalTimelineViewProps {
  /** Highlight and scroll to this application's licence once loaded. */
  focusApplicationId?: string;
}

export function RenewalTimelineView({
  focusApplicationId,
}: RenewalTimelineViewProps = {}) {
  const { t } = useTranslation(["renewals"]);
  const [data, setData] = useState<RenewalsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRenewal, setSelectedRenewal] =
    useState<LicenseRenewalItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchRenewals = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await renewalsApi.getRenewals();
      setData(res);
    } catch (err) {
      console.error("Failed to load renewals:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRenewals();
  }, [fetchRenewals]);

  useEffect(() => {
    if (!focusApplicationId || !data) return;
    document
      .querySelector(
        `[data-application-id="${CSS.escape(focusApplicationId)}"]`,
      )
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusApplicationId, data]);

  const handleInspect = (item: LicenseRenewalItem) => {
    setSelectedRenewal(item);
    setDialogOpen(true);
  };

  const filteredRenewals = (data?.renewals || []).filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.certificateNumber.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.standardNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Award className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("renewals:metrics.totalRenewals")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.totalRenewals}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("renewals:metrics.criticalCount")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-destructive font-mono">
                {data.criticalCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("renewals:metrics.upcomingCount")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {data.upcomingCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("renewals:metrics.onTrack")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {Math.max(0, data.totalRenewals - data.criticalCount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by license number, standard, product..."
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchRenewals}
          className="gap-1.5 text-xs font-semibold self-end sm:self-auto h-9"
        >
          <RefreshCw className="size-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Renewals Card List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : filteredRenewals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <CalendarClock className="size-8 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-bold text-foreground">
            No matching license renewals found
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Try refining your search filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filteredRenewals.map((renewal) => (
            <RenewalCard
              key={renewal.id}
              renewal={renewal}
              onInspectTimeline={handleInspect}
              isFocused={renewal.applicationId === focusApplicationId}
            />
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <RenewalDetailsDialog
        renewal={selectedRenewal}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
