import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  factoryAuditsApi,
  type FactoryAudit,
  type AuditStatus,
  type FactoryAuditsSummary,
} from "@/lib/factory-audits-api";
import { AuditCard } from "./audit-card";
import { AuditDetailsDialog } from "./audit-details-dialog";
import { RescheduleRequestDialog } from "./reschedule-request-dialog";

type TabFilter = "ALL" | "UPCOMING" | "ACTION_REQUIRED" | "COMPLETED";

export function FactoryAuditsView() {
  const { t } = useTranslation(["audits"]);
  const [audits, setAudits] = useState<FactoryAudit[]>([]);
  const [summary, setSummary] = useState<FactoryAuditsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedAudit, setSelectedAudit] = useState<FactoryAudit | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [rescheduleAudit, setRescheduleAudit] = useState<FactoryAudit | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const fetchAudits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let statusFilter: AuditStatus | "ALL" | undefined = undefined;
      if (activeTab === "ACTION_REQUIRED") statusFilter = "ACTION_REQUIRED";
      if (activeTab === "COMPLETED") statusFilter = "COMPLETED";

      const result = await factoryAuditsApi.getAudits({
        status: statusFilter,
        search: searchQuery || undefined,
      });

      let list = result.audits;
      if (activeTab === "UPCOMING") {
        list = list.filter(
          (a) => a.status === "SCHEDULED" || a.status === "CONFIRMED" || a.status === "ACTION_REQUIRED"
        );
      }

      setAudits(list);
      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load factory audits");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const handleOpenDetails = (audit: FactoryAudit) => {
    setSelectedAudit(audit);
    setDetailsOpen(true);
  };

  const handleConfirmAttendance = async (auditId: string) => {
    await factoryAuditsApi.confirmAttendance(auditId, "Rahul Sharma (Managing Director)");
    fetchAudits();
  };

  const handleRequestReschedule = (audit: FactoryAudit) => {
    setRescheduleAudit(audit);
    setRescheduleOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("audits:metrics.upcoming")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.upcomingCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("audits:metrics.actionRequired")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-destructive font-mono">
                {summary.actionRequiredCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("audits:metrics.readiness")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                {summary.overallReadinessPercent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("audits:metrics.totalAudits")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.totalAudits}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabFilter)}>
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="ALL" className="text-xs font-semibold px-3 py-1.5">
              {t("audits:tabs.all")}
            </TabsTrigger>
            <TabsTrigger value="UPCOMING" className="text-xs font-semibold px-3 py-1.5">
              {t("audits:tabs.upcoming")}
            </TabsTrigger>
            <TabsTrigger value="ACTION_REQUIRED" className="text-xs font-semibold px-3 py-1.5">
              {t("audits:tabs.actionRequired")}
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="text-xs font-semibold px-3 py-1.5">
              {t("audits:tabs.completed")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audits, officers, products..."
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      {/* Audits List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <h4 className="text-base font-bold text-foreground">Error Loading Factory Audits</h4>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <Button onClick={fetchAudits} size="sm" className="mt-4 gap-1.5 font-semibold">
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : audits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40">
          <CalendarCheck className="size-10 text-muted-foreground/60 mb-3" />
          <h4 className="text-base font-semibold text-foreground">No Audits Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            No factory inspection appointments correspond to the selected filter tab.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {audits.map((audit) => (
            <AuditCard
              key={audit.id}
              audit={audit}
              onViewDetails={handleOpenDetails}
              onConfirmAttendance={handleConfirmAttendance}
              onRequestReschedule={handleRequestReschedule}
            />
          ))}
        </div>
      )}

      {/* Audit Details Coordination Dialog */}
      <AuditDetailsDialog
        audit={selectedAudit}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onAuditUpdated={fetchAudits}
      />

      {/* Reschedule Request Dialog */}
      <RescheduleRequestDialog
        audit={rescheduleAudit}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onRescheduleSubmitted={fetchAudits}
      />
    </div>
  );
}
