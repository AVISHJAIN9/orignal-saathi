import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Gavel,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Plus,
  ArrowRight,
  Filter,
  Sparkles,
  HelpCircle,
  Building,
  Info,
  Layers,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  appealsApi,
  type AppealItem,
  type AppealsResult,
  type DecisionContext,
  type ResolutionType,
  type AppealStatus,
} from "@/lib/appeals-api";
import { AppealCard } from "./appeal-card";
import { AppealWizardDialog } from "./appeal-wizard-dialog";
import { AppealDetailsDialog } from "./appeal-details-dialog";
import { AdditionalInfoDialog } from "./additional-info-dialog";
import { cn } from "@/lib/utils";

interface AppealsViewProps {
  initialApplicationId?: string;
  initialAppealId?: string;
}

export function AppealsView({
  initialApplicationId,
  initialAppealId,
}: AppealsViewProps) {
  const { t } = useTranslation(["appeals"]);

  const [data, setData] = useState<AppealsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [selectedAppId, setSelectedAppId] = useState<string>(initialApplicationId || "all");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dialog states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardDefaultPath, setWizardDefaultPath] = useState<ResolutionType | undefined>();
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAppealForDetails, setSelectedAppealForDetails] = useState<AppealItem | null>(null);
  const [additionalInfoDialogOpen, setAdditionalInfoDialogOpen] = useState(false);
  const [selectedAppealForAddInfo, setSelectedAppealForAddInfo] = useState<AppealItem | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await appealsApi.getAppeals({
        applicationId: selectedAppId !== "all" ? selectedAppId : undefined,
      });
      setData(res);

      // Deep link resolution if initialAppealId is provided
      if (initialAppealId) {
        const found = res.appeals.find((a) => a.id === initialAppealId || a.referenceNumber === initialAppealId);
        if (found) {
          setSelectedAppealForDetails(found);
          setDetailsDialogOpen(true);
        }
      }
    } catch (err) {
      console.error("Appeals API load error:", err);
      setError(err instanceof Error ? err.message : t("appeals:errors.loadFailedDesc"));
    } finally {
      setIsLoading(false);
    }
  }, [selectedAppId, initialAppealId, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartResolution = (path: ResolutionType) => {
    setWizardDefaultPath(path);
    setWizardOpen(true);
  };

  const handleWithdraw = async (appeal: AppealItem) => {
    if (window.confirm(t("appeals:actions.withdrawConfirm"))) {
      try {
        await appealsApi.withdrawAppeal(appeal.id, "Withdrawn by applicant.");
        fetchData();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to withdraw request.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-xl sm:p-12">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <AlertTriangle className="size-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          {t("appeals:errors.loadFailed")}
        </h3>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
          {error || t("appeals:errors.loadFailedDesc")}
        </p>
        <Button onClick={fetchData} className="mt-6 gap-2 rounded-xl px-5 font-semibold">
          <RefreshCw className="size-4" />
          {t("appeals:actions.retry")}
        </Button>
      </div>
    );
  }

  const { decisionContext, summary, appeals, applicationContexts } = data;

  // Filtered appeals list based on tabs and search query
  const filteredAppeals = appeals.filter((a) => {
    if (activeTab === "active") {
      if (!["SUBMITTED", "ACKNOWLEDGED", "UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED"].includes(a.status)) {
        return false;
      }
    } else if (activeTab === "actionRequired") {
      if (a.status !== "ADDITIONAL_INFORMATION_REQUIRED") return false;
    } else if (activeTab === "resolved") {
      if (!["RESOLVED", "REJECTED", "CLOSED", "WITHDRAWN"].includes(a.status)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = a.referenceNumber.toLowerCase().includes(q);
      const matchReason = a.reasonSummary.toLowerCase().includes(q);
      const matchProduct = a.productTitle.toLowerCase().includes(q);
      const matchStd = a.standardNumber.toLowerCase().includes(q);
      return matchRef || matchReason || matchProduct || matchStd;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Application Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card/60 p-4 shadow-sm backdrop-blur-xl dark:border-border/50 dark:bg-card/30">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building className="size-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              {t("appeals:selectApplication")}
            </span>
            <span className="text-2xs text-muted-foreground">
              Filter official findings and dispute workflows by registered file
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedAppId}
            onValueChange={(val) => {
              if (val) setSelectedAppId(val);
            }}
          >
            <SelectTrigger className="w-56 text-xs font-medium rounded-xl">
              <SelectValue placeholder={t("appeals:allApplications")} />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all">{t("appeals:allApplications")}</SelectItem>
              {applicationContexts?.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.applicationNumber} — {app.productTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            title={t("appeals:actions.refresh")}
            className="size-9 shrink-0 rounded-xl"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {/* Decision / Issue Context Banner */}
      {decisionContext && (
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card/90 to-primary/5 p-5 shadow-sm dark:border-border/50 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wide">
                  {decisionContext.decisionType}
                </span>
                <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                  {decisionContext.productTitle} ({decisionContext.standardNumber})
                </h2>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Application: <strong className="font-mono text-foreground">{decisionContext.applicationId}</strong> • Date: {decisionContext.decisionDate}
                </span>
              </div>
            </div>

            {decisionContext.submissionDeadline && (
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono text-xs py-1 px-2.5">
                <Calendar className="size-3.5 mr-1.5" />
                Deadline: {decisionContext.submissionDeadline}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 text-xs">
              <span className="font-semibold text-foreground">
                {t("appeals:decisionContext.officialExplanation")}:
              </span>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                {decisionContext.officialExplanation}
              </p>
            </div>

            {/* Available Resolution Paths Section */}
            {decisionContext.appealAvailable && decisionContext.supportedResolutionTypes?.length > 0 ? (
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("appeals:resolutionPaths.title")}
                  </h3>
                  <span className="text-2xs text-muted-foreground">
                    Authoritative BIS options
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {decisionContext.supportedResolutionTypes.map((typeKey) => (
                    <div
                      key={typeKey}
                      className="group flex flex-col justify-between rounded-xl border border-border/50 bg-card/70 p-4 shadow-sm transition-all hover:border-primary/40 dark:border-border/50 dark:bg-card/40"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {t(`appeals:resolutionPaths.${typeKey}.title`)}
                        </span>
                        <p className="text-2xs text-muted-foreground leading-relaxed">
                          {t(`appeals:resolutionPaths.${typeKey}.description`)}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleStartResolution(typeKey)}
                        className="mt-4 w-full gap-1 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors"
                      >
                        {t(`appeals:resolutionPaths.${typeKey}.action`)}
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                {t("appeals:decisionContext.noAppeal")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card/60 p-3.5 shadow-sm dark:border-border/50 dark:bg-card/30 flex flex-col">
          <span className="text-2xs font-semibold text-muted-foreground uppercase">
            Total Requests
          </span>
          <span className="font-mono text-xl font-bold text-foreground mt-1">
            {summary.totalCount}
          </span>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 shadow-sm flex flex-col">
          <span className="text-2xs font-semibold text-blue-700 dark:text-blue-300 uppercase">
            Under Review
          </span>
          <span className="font-mono text-xl font-bold text-blue-800 dark:text-blue-200 mt-1">
            {summary.underReviewCount}
          </span>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 shadow-sm flex flex-col">
          <span className="text-2xs font-semibold text-amber-700 dark:text-amber-300 uppercase">
            Action Required
          </span>
          <span className="font-mono text-xl font-bold text-amber-800 dark:text-amber-200 mt-1">
            {summary.actionRequiredCount}
          </span>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 shadow-sm flex flex-col">
          <span className="text-2xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
            Resolved
          </span>
          <span className="font-mono text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-1">
            {summary.resolvedCount}
          </span>
        </div>
      </div>

      {/* Main List Section with Search & Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 sm:flex w-full text-xs">
              <TabsTrigger value="all" className="text-xs">
                {t("appeals:tabs.all")} ({summary.totalCount})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs">
                {t("appeals:tabs.active")} ({summary.activeCount})
              </TabsTrigger>
              <TabsTrigger value="actionRequired" className="text-xs">
                {t("appeals:tabs.actionRequired")} ({summary.actionRequiredCount})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs">
                {t("appeals:tabs.resolved")} ({summary.resolvedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, standard..."
              className="pl-9 text-xs rounded-xl h-9"
            />
          </div>
        </div>

        {/* List of Appeal Cards */}
        {filteredAppeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredAppeals.map((appeal) => (
              <AppealCard
                key={appeal.id}
                appeal={appeal}
                onViewDetails={(app) => {
                  setSelectedAppealForDetails(app);
                  setDetailsDialogOpen(true);
                }}
                onProvideInfo={(app) => {
                  setSelectedAppealForAddInfo(app);
                  setAdditionalInfoDialogOpen(true);
                }}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center">
            <Gavel className="size-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-bold text-foreground">
              {activeTab === "resolved" ? t("appeals:empty.noHistory") : t("appeals:empty.noActive")}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {activeTab === "resolved" ? t("appeals:empty.noHistoryDesc") : t("appeals:empty.noActiveDesc")}
            </p>
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      <AppealWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        decisionContext={decisionContext || null}
        defaultResolutionType={wizardDefaultPath}
        onSuccess={() => {
          fetchData();
        }}
      />

      {/* Details Dialog Modal */}
      <AppealDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        appeal={selectedAppealForDetails}
        onOpenAdditionalInfo={() => {
          if (selectedAppealForDetails) {
            setSelectedAppealForAddInfo(selectedAppealForDetails);
            setAdditionalInfoDialogOpen(true);
          }
        }}
      />

      {/* Additional Information Dialog Modal */}
      <AdditionalInfoDialog
        open={additionalInfoDialogOpen}
        onOpenChange={setAdditionalInfoDialogOpen}
        appeal={selectedAppealForAddInfo}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
}
