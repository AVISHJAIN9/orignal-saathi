import { useTranslation } from "react-i18next";
import {
  Gavel,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  FileCheck2,
  Shield,
  GitMerge,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/router-compat";
import type { AppealItem, AppealStatus } from "@/lib/appeals-api";
import { AppealStatusTimeline } from "./appeal-status-timeline";
import { SupportingEvidence } from "./supporting-evidence";
import { cn } from "@/lib/utils";

interface AppealDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appeal: AppealItem | null;
  onOpenAdditionalInfo?: () => void;
}

export function AppealDetailsDialog({
  open,
  onOpenChange,
  appeal,
  onOpenAdditionalInfo,
}: AppealDetailsDialogProps) {
  const { t } = useTranslation(["appeals", "chain"]);

  if (!appeal) return null;

  const getStatusBadgeVariant = (status: AppealStatus) => {
    switch (status) {
      case "RESOLVED":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      case "ADDITIONAL_INFORMATION_REQUIRED":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "UNDER_REVIEW":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "ACKNOWLEDGED":
        return "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30";
      case "REJECTED":
      case "WITHDRAWN":
      case "CLOSED":
        return "bg-muted text-foreground border-border";
      default:
        return "bg-primary/15 text-primary border-primary/30";
    }
  };

  const res = appeal.officialResolution;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl border-border/50 bg-background/95 backdrop-blur-2xl">
        <DialogHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Gavel className="size-4" />
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-2xs font-bold text-primary tracking-wide">
                  {appeal.referenceNumber}
                </span>
                <DialogTitle className="text-sm font-bold text-foreground sm:text-base">
                  {t(`appeals:resolutionPaths.${appeal.resolutionType}.title`, { defaultValue: appeal.resolutionType })}
                </DialogTitle>
              </div>
            </div>

            <Badge variant="outline" className={cn("text-xs py-0.5 px-2.5 font-semibold", getStatusBadgeVariant(appeal.status))}>
              {t(`appeals:statuses.${appeal.status}`, { defaultValue: appeal.status })}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Application: <span className="font-mono font-medium text-foreground">{appeal.applicationId}</span> • Product: <span className="font-medium text-foreground">{appeal.productTitle}</span> ({appeal.standardNumber})
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Action Required Banner if status is ADDITIONAL_INFORMATION_REQUIRED */}
          {appeal.status === "ADDITIONAL_INFORMATION_REQUIRED" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-amber-900 dark:text-amber-200">
                    {t("appeals:additionalInfo.badge")}
                  </span>
                  <p className="text-amber-800/90 dark:text-amber-300/90 text-2xs">
                    {appeal.additionalInformationRequest?.description || "The reviewing authority has requested supplementary clarification."}
                  </p>
                </div>
              </div>

              {onOpenAdditionalInfo && (
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenAdditionalInfo();
                  }}
                  className="shrink-0 bg-amber-600 hover:bg-amber-700 text-foreground text-xs rounded-lg font-semibold gap-1"
                >
                  {t("appeals:actions.provideInfo")}
                </Button>
              )}
            </div>
          )}

          {/* Official Resolution Card if present */}
          {res && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-foreground">
                    {t("appeals:resolution.title")}
                  </h3>
                </div>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                  {t(`appeals:resolution.${res.decisionOutcome}`, { defaultValue: res.decisionOutcome })}
                </Badge>
              </div>

              <div className="mt-3 flex flex-col gap-2.5 text-xs">
                <div className="flex flex-col">
                  <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("appeals:resolution.summary")}
                  </span>
                  <p className="text-foreground leading-relaxed mt-0.5">
                    {res.summary}
                  </p>
                </div>

                {res.officialOrderReference && (
                  <div className="flex items-center gap-2 font-mono text-2xs text-muted-foreground">
                    <span>Order Ref:</span>
                    <span className="font-semibold text-foreground">{res.officialOrderReference}</span>
                    <span>• Resolved: {res.resolutionDate}</span>
                  </div>
                )}

                {res.impactOnApplication && (
                  <div className="mt-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-950 dark:text-emerald-100">
                    <span className="font-semibold">{t("appeals:resolution.impact")}: </span>
                    {res.impactOnApplication}
                  </div>
                )}

                {res.nextSteps && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{t("appeals:resolution.nextSteps")}: </span>
                    {res.nextSteps}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decision Under Scrutiny Context */}
          <div className="rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm dark:border-border/50 dark:bg-card/30">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              {t("appeals:decisionContext.title")}
            </h4>
            <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-muted-foreground">Disputed Matter:</span>
                <p className="font-medium text-foreground">{appeal.decisionTitle}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium text-foreground">
                  {t(`appeals:categories.${appeal.issueCategory}`, { defaultValue: appeal.issueCategory })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Decision Date:</span>
                <p className="font-medium text-foreground">{appeal.decisionDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Standard / Clause:</span>
                <p className="font-medium text-foreground">{appeal.standardNumber}</p>
              </div>
            </div>
          </div>

          {/* Applicant Reason & Detailed Explanation */}
          <div className="rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm dark:border-border/50 dark:bg-card/30">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              {t("appeals:wizard.step2Title")}
            </h4>
            <div className="mt-2.5 flex flex-col gap-2 text-xs">
              <div>
                <span className="font-semibold text-foreground">Summary of Grounds: </span>
                <span className="text-muted-foreground">{appeal.reasonSummary}</span>
              </div>
              <div className="mt-1 rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
                {appeal.detailedExplanation}
              </div>
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              {t("appeals:evidence.title")} ({appeal.evidence.length})
            </h4>
            <SupportingEvidence evidence={appeal.evidence} />
          </div>

          {/* Dispute Progress Timeline */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              {t("appeals:timeline.title")}
            </h4>
            <div className="rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm dark:border-border/50 dark:bg-card/30">
              <AppealStatusTimeline events={appeal.timeline} currentStatus={appeal.status} />
            </div>
          </div>

          {/* Related System Deep Links (C6 Compliance Chain, C3 Gap, C4 Readiness) */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
            <Link
              to="/compliance-chain"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <GitMerge className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              {t("appeals:actions.viewComplianceChain")}
            </Link>
            <Link
              to="/conformity"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Shield className="size-3.5 text-primary" />
              {t("appeals:actions.viewGap")}
            </Link>
            <Link
              to="/registration/new"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <FileText className="size-3.5 text-primary" />
              {t("appeals:actions.viewApplication")}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
