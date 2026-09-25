import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  Filter,
  Info,
  Radar,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/lib/router-compat";
import {
  regulatoryAlertsApi,
  RegulatoryAlertsApiError,
  type AlertSeverity,
  type RegulatoryAlert,
  type RegulatoryAlertsResult,
} from "@/lib/regulatory-alerts-api";
import { AlertCard } from "@/components/regulatory-alerts/alert-card";
import { AlertDetailsDialog } from "@/components/regulatory-alerts/alert-details-dialog";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "CRITICAL" | "HIGH" | "MEDIUM" | "INFORMATIONAL" | "unread";

interface RegulatoryAlertsViewProps {
  initialProductId?: string;
  initialStandardNumber?: string;
}

export function RegulatoryAlertsView({
  initialProductId,
  initialStandardNumber,
}: RegulatoryAlertsViewProps) {
  const { t } = useTranslation(["alerts", "radar"]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegulatoryAlertsResult | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [detailModalAlert, setDetailModalAlert] = useState<RegulatoryAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await regulatoryAlertsApi.getAlerts({
        productId: initialProductId,
        standardNumber: initialStandardNumber,
      });
      setData(res);
    } catch (err) {
      if (err instanceof RegulatoryAlertsApiError) {
        setError(err.message);
      } else {
        setError(t("alerts:states.errorMsg"));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAlerts();
  }, [initialProductId, initialStandardNumber]);

  const handleMarkRead = async (alertId: string) => {
    const success = await regulatoryAlertsApi.markAsRead(alertId);
    if (!success) return; // Do not mark read locally if backend request failed
    setData((prev) => {
      if (!prev) return null;
      const updatedAlerts = prev.alerts.map((a) =>
        a.id === alertId ? { ...a, read: true } : a
      );
      const unread = updatedAlerts.filter((a) => !a.read).length;
      return {
        ...prev,
        alerts: updatedAlerts,
        summary: {
          ...prev.summary,
          unreadCount: unread,
        },
      };
    });
  };

  const handleViewDetails = (alert: RegulatoryAlert) => {
    setDetailModalAlert(alert);
    setIsModalOpen(true);
    if (!alert.read) {
      void handleMarkRead(alert.id);
    }
  };

  const alerts = data?.alerts || [];
  const summary = data?.summary;
  const monitoredItems = data?.monitoredItems || [];

  // Filter alerts based on active tab
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "unread") return !alert.read;
    return alert.severity === filter;
  });

  // Action required alerts (CRITICAL or HIGH)
  const actionRequiredAlerts = alerts.filter(
    (a) => a.severity === "CRITICAL" || a.severity === "HIGH"
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 1. TOP HEADER SUMMARY / STATUS METRICS */}
      {summary && !loading && !error && (
        <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                {t("alerts:summary.title")}
              </span>
              <Link
                to="/regulatory-radar"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-4"
              >
                <Radar className="size-3.5" />
                {t("alerts:backToRadar")}
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-3 text-center">
                <span className="font-mono text-2xs font-bold text-muted-foreground uppercase">
                  {t("alerts:summary.relevantAlerts")}
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  {summary.totalCount}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center">
                <span className="font-mono text-2xs font-bold text-red-600 dark:text-red-400 uppercase">
                  {t("alerts:summary.critical")}
                </span>
                <span className="text-xl font-extrabold text-red-600 dark:text-red-400">
                  {summary.criticalCount}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                <span className="font-mono text-2xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  {t("alerts:summary.high")}
                </span>
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {summary.highCount}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-3 text-center">
                <span className="font-mono text-2xs font-bold text-muted-foreground uppercase">
                  {t("alerts:summary.medium")}
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  {summary.mediumCount}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/10 p-3 text-center col-span-2 sm:col-span-1">
                <span className="font-mono text-2xs font-bold text-primary uppercase">
                  {t("alerts:summary.unread")}
                </span>
                <span className="text-xl font-extrabold text-primary">
                  {summary.unreadCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. MY MONITORED ITEMS BAR */}
      {monitoredItems.length > 0 && !loading && !error && (
        <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur-md">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("alerts:monitoredItems.title")}
          </span>
          <div className="flex flex-wrap gap-2">
            {monitoredItems.map((item) => (
              <Badge key={item.id} variant="outline" className="gap-1.5 font-mono text-xs">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>{item.code}</span>
                <span className="text-muted-foreground">({item.title})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACTION REQUIRED HERO SECTION (surfaces CRITICAL / HIGH alerts) */}
      {actionRequiredAlerts.length > 0 && !loading && !error && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-amber-500 animate-pulse" />
            <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {t("alerts:actionRequired.title")}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {actionRequiredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isActionRequiredHero={true}
                onViewDetails={handleViewDetails}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. FILTER TABS */}
      {!loading && !error && data && alerts.length > 0 && (
        <Tabs value={filter} onValueChange={(val) => setFilter(val as FilterTab)}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
            <TabsTrigger value="all" className="text-xs">
              {t("alerts:filters.all")} ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="CRITICAL" className="text-xs">
              {t("alerts:filters.critical")} ({summary?.criticalCount || 0})
            </TabsTrigger>
            <TabsTrigger value="HIGH" className="text-xs">
              {t("alerts:filters.high")} ({summary?.highCount || 0})
            </TabsTrigger>
            <TabsTrigger value="MEDIUM" className="text-xs">
              {t("alerts:filters.medium")} ({summary?.mediumCount || 0})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              {t("alerts:filters.unread")} ({summary?.unreadCount || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* 5. LOADING STATE */}
      {loading && (
        <Card className="border-border/50 bg-card/90 p-8 text-center backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <RefreshCw className="size-8 animate-spin text-primary" />
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-foreground">
                {t("alerts:states.loadingTitle")}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                {t("alerts:states.loadingSub")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 6. ERROR STATE */}
      {error && !loading && (
        <Card className="border-red-500/30 bg-red-500/5 p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="size-8 text-red-500" />
            <h3 className="text-base font-bold text-foreground">
              {t("alerts:states.errorTitle")}
            </h3>
            <p className="max-w-md text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void fetchAlerts()} className="gap-2 mt-2">
              <RefreshCw className="size-3.5" />
              {t("alerts:states.retry")}
            </Button>
          </div>
        </Card>
      )}

      {/* 7. YOU'RE UP TO DATE (EMPTY STATE) */}
      {!loading && !error && data && alerts.length === 0 && (
        <Card className="border-emerald-500/30 bg-emerald-500/5 p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="text-lg font-bold text-foreground">
                {t("alerts:states.emptyTitle")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("alerts:states.emptyMsg")}
              </p>
              <p className="text-2xs text-muted-foreground/80 mt-1">
                {t("alerts:states.emptySub")}
              </p>
            </div>
            <Link to="/regulatory-radar">
              <Button variant="outline" size="sm" className="gap-2 mt-2">
                <Radar className="size-4 text-primary" />
                {t("alerts:backToRadar")}
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 8. ALERTS LIST */}
      {!loading && !error && filteredAlerts.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isActionRequiredHero={false}
              onViewDetails={handleViewDetails}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}

      {/* ALERT DETAILS DIALOG */}
      <AlertDetailsDialog
        alert={detailModalAlert}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
}
