import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  FileText,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Filter,
  Layers,
  FolderCheck,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/lib/router-compat";
import {
  documentCorrectionsApi,
  type DocumentCorrectionItem,
  type DocumentCorrectionsResult,
  type DocumentCorrectionStatus,
  type DocumentResubmissionResponse,
} from "@/lib/document-corrections-api";
import { CorrectionCard } from "./correction-card";
import { CorrectionDetailsDialog } from "./correction-details-dialog";
import { ResubmissionWizardDialog } from "./resubmission-wizard-dialog";

type FilterTab = "all" | "CORRECTION_REQUIRED" | "UNDER_REVIEW" | "RESUBMITTED" | "APPROVED";

interface DocumentCorrectionsViewProps {
  initialApplicationId?: string;
  initialDocumentId?: string;
}

export function DocumentCorrectionsView({
  initialApplicationId,
  initialDocumentId,
}: DocumentCorrectionsViewProps) {
  const { t } = useTranslation(["corrections", "chain", "admin"]);

  const [data, setData] = useState<DocumentCorrectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedAppId, setSelectedAppId] = useState<string>(initialApplicationId || "all");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Dialog states
  const [selectedForDetails, setSelectedForDetails] = useState<DocumentCorrectionItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [selectedForWizard, setSelectedForWizard] = useState<DocumentCorrectionItem | null>(null);
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);

  const fetchCorrections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentCorrectionsApi.getCorrections({
        applicationId: selectedAppId !== "all" ? selectedAppId : undefined,
        documentId: initialDocumentId,
      });
      setData(result);

      // If initialDocumentId was supplied, automatically open the relevant modal
      if (initialDocumentId && result.corrections.length > 0) {
        const target = result.corrections.find((c) => c.documentId === initialDocumentId || c.id === initialDocumentId);
        if (target) {
          if (target.status === "CORRECTION_REQUIRED" || target.status === "ACTION_REQUIRED") {
            setSelectedForWizard(target);
            setWizardOpen(true);
          } else {
            setSelectedForDetails(target);
            setDetailsOpen(true);
          }
        }
      }
    } catch (err) {
      console.error("Document Corrections fetch error:", err);
      setError(err instanceof Error ? err.message : t("corrections:errors.description"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAppId, initialDocumentId, t]);

  useEffect(() => {
    void fetchCorrections();
  }, [fetchCorrections]);

  const handleStartCorrection = (item: DocumentCorrectionItem) => {
    setSelectedForWizard(item);
    setWizardOpen(true);
  };

  const handleViewDetails = (item: DocumentCorrectionItem) => {
    setSelectedForDetails(item);
    setDetailsOpen(true);
  };

  const handleSubmissionSuccess = (response: DocumentResubmissionResponse) => {
    // Update local list state immediately to reflect new status
    setData((prev) => {
      if (!prev) return null;
      const updated = prev.corrections.map((item) =>
        item.id === response.correctionId || item.documentId === response.documentId
          ? {
              ...item,
              status: response.status,
              documentName: response.fileName,
              version: response.version,
              lastUpdatedDate: response.submittedAt,
            }
          : item
      );
      return {
        ...prev,
        corrections: updated,
        summary: {
          ...prev.summary,
          actionRequiredCount: updated.filter(
            (c) => c.status === "CORRECTION_REQUIRED" || c.status === "ACTION_REQUIRED"
          ).length,
          resubmittedCount: updated.filter(
            (c) => c.status === "RESUBMITTED" || c.status === "SUBMITTED"
          ).length,
        },
      };
    });
  };

  // Filter list by tab & search query
  const filteredCorrections = (data?.corrections || []).filter((item) => {
    // Tab filter
    if (activeTab === "CORRECTION_REQUIRED") {
      if (item.status !== "CORRECTION_REQUIRED" && item.status !== "ACTION_REQUIRED") return false;
    } else if (activeTab === "UNDER_REVIEW") {
      if (item.status !== "UNDER_REVIEW" && item.status !== "REVIEW_PENDING") return false;
    } else if (activeTab === "RESUBMITTED") {
      if (item.status !== "RESUBMITTED" && item.status !== "SUBMITTED") return false;
    } else if (activeTab === "APPROVED") {
      if (item.status !== "APPROVED") return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDoc = item.documentName.toLowerCase().includes(q);
      const matchType = item.documentType.toLowerCase().includes(q);
      const matchStd = item.standardNumber?.toLowerCase().includes(q);
      const matchApp = item.applicationId.toLowerCase().includes(q);
      const matchFeedback = item.officialFeedback.toLowerCase().includes(q);
      return matchDoc || matchType || matchStd || matchApp || matchFeedback;
    }

    return true;
  });

  const summary = data?.summary || {
    totalCount: 0,
    actionRequiredCount: 0,
    underReviewCount: 0,
    resubmittedCount: 0,
    approvedCount: 0,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Correction Required Metric */}
        <div
          onClick={() => setActiveTab("CORRECTION_REQUIRED")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
            activeTab === "CORRECTION_REQUIRED"
              ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/20"
              : "border-border bg-card/60 hover:bg-muted/60 hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {t("corrections:summary.actionRequired")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">
            {summary.actionRequiredCount}
          </p>
        </div>

        {/* Under Review Metric */}
        <div
          onClick={() => setActiveTab("UNDER_REVIEW")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
            activeTab === "UNDER_REVIEW"
              ? "border-purple-500 bg-purple-500/10 shadow-md ring-2 ring-purple-500/20"
              : "border-border bg-card/60 hover:bg-muted/60 hover:border-purple-500/40"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              {t("corrections:summary.underReview")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">
            {summary.underReviewCount}
          </p>
        </div>

        {/* Resubmitted Metric */}
        <div
          onClick={() => setActiveTab("RESUBMITTED")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
            activeTab === "RESUBMITTED"
              ? "border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/20"
              : "border-border bg-card/60 hover:bg-muted/60 hover:border-blue-500/40"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              {t("corrections:summary.resubmitted")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Send className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">
            {summary.resubmittedCount}
          </p>
        </div>

        {/* Approved Metric */}
        <div
          onClick={() => setActiveTab("APPROVED")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
            activeTab === "APPROVED"
              ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20"
              : "border-border bg-card/60 hover:bg-muted/60 hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t("corrections:summary.approved")}
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">
            {summary.approvedCount}
          </p>
        </div>
      </div>

      {/* Control Bar: Application Selector, Search & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/50 p-3 rounded-2xl border border-border/80">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {data?.applicationContexts && data.applicationContexts.length > 1 && (
            <Select value={selectedAppId} onValueChange={setSelectedAppId}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-xs rounded-xl">
                <SelectValue placeholder={t("corrections:filter.allApplications")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("corrections:filter.allApplications")}</SelectItem>
                {data.applicationContexts.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.applicationNumber} ({app.productTitle})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("corrections:filter.searchPlaceholder")}
              className="pl-8 h-9 text-xs rounded-xl bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchCorrections}
            disabled={isLoading}
            className="rounded-xl h-9 px-3 text-xs gap-1.5"
            aria-label="Refresh document corrections"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Tabs Row */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as FilterTab)}>
        <TabsList className="w-full justify-start overflow-x-auto p-1 bg-muted/60 rounded-xl h-auto">
          <TabsTrigger value="all" className="text-xs rounded-lg px-3 py-1.5">
            {t("corrections:filter.all")} ({summary.totalCount})
          </TabsTrigger>
          <TabsTrigger value="CORRECTION_REQUIRED" className="text-xs rounded-lg px-3 py-1.5">
            {t("corrections:filter.correctionRequired")} ({summary.actionRequiredCount})
          </TabsTrigger>
          <TabsTrigger value="UNDER_REVIEW" className="text-xs rounded-lg px-3 py-1.5">
            {t("corrections:filter.underReview")} ({summary.underReviewCount})
          </TabsTrigger>
          <TabsTrigger value="RESUBMITTED" className="text-xs rounded-lg px-3 py-1.5">
            {t("corrections:filter.resubmitted")} ({summary.resubmittedCount})
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="text-xs rounded-lg px-3 py-1.5">
            {t("corrections:filter.approved")} ({summary.approvedCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-4" aria-busy="true">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-center gap-3">
          <AlertCircle className="size-8 text-destructive" />
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-sm font-bold text-foreground">
              {t("corrections:errors.title")}
            </h3>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
          <Button
            size="sm"
            onClick={fetchCorrections}
            className="rounded-xl text-xs gap-1.5 font-semibold"
          >
            <RefreshCw className="size-3.5" />
            {t("corrections:errors.retry")}
          </Button>
        </div>
      )}

      {/* Main List & Empty State */}
      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {filteredCorrections.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <CorrectionCard
                  correction={item}
                  onCorrect={handleStartCorrection}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCorrections.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-border bg-card/40 text-center gap-4 animate-in fade-in duration-300">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FolderCheck className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-sm">
                <h3 className="text-base font-bold text-foreground">
                  {t("corrections:emptyState.title")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("corrections:emptyState.description")}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Link to="/registration/new">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">
                    {t("corrections:emptyState.viewApps")}
                  </Button>
                </Link>
                <Link to="/compliance-chain">
                  <Button size="sm" className="rounded-xl text-xs font-semibold">
                    {t("corrections:emptyState.viewChain")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Correction Details Modal */}
      <CorrectionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        correction={selectedForDetails}
        onStartCorrection={handleStartCorrection}
      />

      {/* 5-Step Re-submission Wizard Modal */}
      <ResubmissionWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        correction={selectedForWizard}
        onSuccess={handleSubmissionSuccess}
      />
    </div>
  );
}
