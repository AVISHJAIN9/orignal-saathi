import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Search,
  RefreshCw,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  recallsApi,
  type RecallAlert,
  type RecallSeverity,
  type RecallAlertType,
  type RecallsSummary,
} from "@/lib/recalls-api";
import { RecallAlertCard } from "./recall-alert-card";
import { RecallDetailsDialog } from "./recall-details-dialog";
import { DEMO_DISCLAIMER_LABEL } from "@/lib/demo/demo-context";

export function RecallsView() {
  const { t } = useTranslation(["recalls"]);
  const [alerts, setAlerts] = useState<RecallAlert[]>([]);
  const [summary, setSummary] = useState<RecallsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<RecallSeverity | "ALL">("ALL");
  const [selectedType, setSelectedType] = useState<RecallAlertType | "ALL">("ALL");

  const [selectedAlert, setSelectedAlert] = useState<RecallAlert | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await recallsApi.getAlerts({
        severity: selectedSeverity,
        type: selectedType,
        search: searchQuery || undefined,
      });
      setAlerts(result.alerts);
      setSummary(result.summary);
      setIsDemoFallback(result.isDemoFallback);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recall alerts");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSeverity, selectedType, searchQuery]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleOpenDetails = (alert: RecallAlert) => {
    setSelectedAlert(alert);
    setDetailsOpen(true);
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
              Official surveillance non-conformances & safety advisories shown for Apex Engineering scenario (IS 14543:2018).
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-2xs text-muted-foreground">
            SIH 2026 High-Trust Evaluation
          </span>
        </div>
      )}

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertOctagon className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("recalls:metrics.criticalAlerts")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-destructive font-mono">
                {summary.criticalCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("recalls:metrics.highAlerts")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                {summary.highCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("recalls:metrics.activeAlerts")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.activeCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("recalls:metrics.resolvedAlerts")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                {summary.resolvedCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("recalls:filters.searchPlaceholder")}
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>

        <Select
          value={selectedSeverity}
          onValueChange={(val) => setSelectedSeverity(val as RecallSeverity | "ALL")}
        >
          <SelectTrigger className="text-xs h-9 rounded-lg">
            <SelectValue placeholder={t("recalls:filters.allSeverities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("recalls:filters.allSeverities")}</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="HIGH">High Severity</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Informational</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedType}
          onValueChange={(val) => setSelectedType(val as RecallAlertType | "ALL")}
        >
          <SelectTrigger className="text-xs h-9 rounded-lg">
            <SelectValue placeholder={t("recalls:filters.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("recalls:filters.allTypes")}</SelectItem>
            <SelectItem value="NON_CONFORMANCE">Non-Conformance</SelectItem>
            <SelectItem value="SAFETY_ALERT">Safety Advisory</SelectItem>
            <SelectItem value="PRODUCT_RECALL">Product Recall</SelectItem>
            <SelectItem value="STANDARD_WITHDRAWAL">Standard Withdrawal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <h4 className="text-base font-bold text-foreground">Error Loading Alerts</h4>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <Button onClick={fetchAlerts} size="sm" className="mt-4 gap-1.5 font-semibold">
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40">
          <CheckCircle2 className="size-10 text-emerald-600/70 mb-3" />
          <h4 className="text-base font-semibold text-foreground">No Directives Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            No active non-conformances, recalls, or safety advisories match your current filter selection.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {alerts.map((alert) => (
            <RecallAlertCard
              key={alert.id}
              alert={alert}
              onViewDetails={handleOpenDetails}
            />
          ))}
        </div>
      )}

      {/* Recall Details Dialog Modal */}
      <RecallDetailsDialog
        alert={selectedAlert}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
