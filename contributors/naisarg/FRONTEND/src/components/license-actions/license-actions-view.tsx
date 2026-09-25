import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FileWarning,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  Scale,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  licenseActionsApi,
  type LicenseNotice,
  type NoticeStatus,
  type LicenseActionsSummary,
} from "@/lib/license-actions-api";
import { LicenseNoticeCard } from "./license-notice-card";
import { LicenseNoticeDetailsDialog } from "./license-notice-details-dialog";
import { RemediationFlowDialog } from "./remediation-flow-dialog";
import { DEMO_DISCLAIMER_LABEL } from "@/lib/demo/demo-context";

type TabFilter = "ALL" | "ACTIVE" | "REMEDIATION" | "RESOLVED";

export function LicenseActionsView() {
  const { t } = useTranslation(["licenseActions"]);
  const [notices, setNotices] = useState<LicenseNotice[]>([]);
  const [summary, setSummary] = useState<LicenseActionsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNotice, setSelectedNotice] = useState<LicenseNotice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [remediationNotice, setRemediationNotice] = useState<LicenseNotice | null>(null);
  const [remediationOpen, setRemediationOpen] = useState(false);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await licenseActionsApi.getNotices({
        search: searchQuery || undefined,
      });

      let list = result.notices;
      if (activeTab === "ACTIVE") {
        list = list.filter(
          (n) => n.status === "NOTICE_ISSUED" || n.status === "SUSPENDED" || n.status === "REMEDIATION_REQUIRED"
        );
      } else if (activeTab === "REMEDIATION") {
        list = list.filter(
          (n) => n.status === "REMEDIATION_REQUIRED" || n.status === "REMEDIATION_SUBMITTED" || n.status === "UNDER_REVIEW"
        );
      } else if (activeTab === "RESOLVED") {
        list = list.filter((n) => n.status === "REINSTATED" || n.status === "CLOSED");
      }

      setNotices(list);
      setSummary(result.summary);
      setIsDemoFallback(result.isDemoFallback);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load license notices");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleOpenDetails = (notice: LicenseNotice) => {
    setSelectedNotice(notice);
    setDetailsOpen(true);
  };

  const handleOpenRemediation = (notice: LicenseNotice) => {
    setRemediationNotice(notice);
    setRemediationOpen(true);
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
              Authoritative demonstration notices shown for License LIC-8842109 (Apex Engineering, IS 14543).
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-2xs text-muted-foreground">
            SIH 2026 Authoritative Sandbox
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
                {t("licenseActions:metrics.activeSuspensions")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-destructive font-mono">
                {summary.activeSuspensions}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <FileWarning className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("licenseActions:metrics.remediationRequired")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                {summary.remediationRequiredCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("licenseActions:metrics.underReview")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {summary.underReviewCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("licenseActions:metrics.reinstated")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                {summary.reinstatedCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabFilter)}>
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="ALL" className="text-xs font-semibold px-3 py-1.5">
              All Notices
            </TabsTrigger>
            <TabsTrigger value="ACTIVE" className="text-xs font-semibold px-3 py-1.5">
              Active Suspensions
            </TabsTrigger>
            <TabsTrigger value="REMEDIATION" className="text-xs font-semibold px-3 py-1.5">
              Under Remediation
            </TabsTrigger>
            <TabsTrigger value="RESOLVED" className="text-xs font-semibold px-3 py-1.5">
              Reinstated / Closed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("licenseActions:filters.searchPlaceholder")}
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      {/* Notices List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <h4 className="text-base font-bold text-foreground">Error Loading Notices</h4>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <Button onClick={fetchNotices} size="sm" className="mt-4 gap-1.5 font-semibold">
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40">
          <CheckCircle2 className="size-10 text-emerald-600/70 mb-3" />
          <h4 className="text-base font-semibold text-foreground">No Notices Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            No enforcement notices or license suspensions correspond to the selected tab.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notices.map((notice) => (
            <LicenseNoticeCard
              key={notice.id}
              notice={notice}
              onViewDetails={handleOpenDetails}
              onOpenRemediation={handleOpenRemediation}
            />
          ))}
        </div>
      )}

      {/* Notice Details Modal */}
      <LicenseNoticeDetailsDialog
        notice={selectedNotice}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onNoticeUpdated={fetchNotices}
      />

      {/* Direct Launch Remediation Workflow Modal */}
      <RemediationFlowDialog
        notice={remediationNotice}
        open={remediationOpen}
        onOpenChange={setRemediationOpen}
        onRemediationSubmitted={fetchNotices}
      />
    </div>
  );
}
