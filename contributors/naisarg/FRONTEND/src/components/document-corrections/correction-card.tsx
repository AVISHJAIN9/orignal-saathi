import { useTranslation } from "react-i18next";
import {
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/router-compat";
import type {
  DocumentCorrectionItem,
  DocumentCorrectionStatus,
} from "@/lib/document-corrections-api";

interface CorrectionCardProps {
  correction: DocumentCorrectionItem;
  onCorrect: (correction: DocumentCorrectionItem) => void;
  onViewDetails: (correction: DocumentCorrectionItem) => void;
}

export function CorrectionCard({
  correction,
  onCorrect,
  onViewDetails,
}: CorrectionCardProps) {
  const { t, i18n } = useTranslation(["corrections", "chain"]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const getDaysLeft = (deadlineIso?: string) => {
    if (!deadlineIso) return null;
    const diff = new Date(deadlineIso).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = getDaysLeft(correction.deadline);

  const getStatusBadge = (status: DocumentCorrectionStatus) => {
    switch (status) {
      case "CORRECTION_REQUIRED":
      case "ACTION_REQUIRED":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs gap-1 font-semibold"
          >
            <AlertTriangle className="size-3" />
            {t(`corrections:statuses.${status}`, { defaultValue: "Correction Required" })}
          </Badge>
        );
      case "RESUBMITTED":
      case "SUBMITTED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-xs gap-1 font-semibold"
          >
            <CheckCircle2 className="size-3" />
            {t(`corrections:statuses.${status}`, { defaultValue: "Re-submitted" })}
          </Badge>
        );
      case "UNDER_REVIEW":
      case "REVIEW_PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 text-xs gap-1 font-semibold"
          >
            <Clock className="size-3" />
            {t(`corrections:statuses.${status}`, { defaultValue: "Under Review" })}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs gap-1 font-semibold"
          >
            <CheckCircle2 className="size-3" />
            {t(`corrections:statuses.${status}`, { defaultValue: "Approved" })}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const isActionRequired =
    correction.status === "CORRECTION_REQUIRED" || correction.status === "ACTION_REQUIRED";

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Top Header: Document Name, Type, Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                isActionRequired
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-500/10"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-foreground truncate">
                  {correction.documentName}
                </h3>
                <span className="text-2xs font-mono font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                  v{correction.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {correction.documentType}
              </p>
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge(correction.status)}</div>
        </div>

        {/* Application Context Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2 px-3 rounded-lg bg-muted/40 border border-border/60 text-xs">
          <div>
            <span className="text-muted-foreground">{t("corrections:card.applicationLabel")}: </span>
            <strong className="text-foreground">{correction.applicationNumber || correction.applicationId}</strong>
          </div>
          {correction.productTitle && (
            <div>
              <span className="text-muted-foreground">• Product: </span>
              <strong className="text-foreground">{correction.productTitle}</strong>
            </div>
          )}
          {correction.standardNumber && (
            <div>
              <span className="text-muted-foreground">• Standard: </span>
              <strong className="text-primary font-mono">{correction.standardNumber}</strong>
            </div>
          )}
        </div>

        {/* Scrutiny Feedback Box */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t("corrections:card.officialFeedbackTitle")}</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
            {correction.officialFeedback}
          </p>
        </div>

        {/* Required Action & Deadline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("corrections:card.requiredActionTitle")}
            </span>
            <p className="text-xs text-foreground font-medium line-clamp-2">
              {correction.requiredAction}
            </p>
          </div>

          <div className="flex flex-col gap-1 sm:items-end">
            {correction.deadline ? (
              <>
                <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("corrections:card.deadlineLabel")}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="size-3.5 text-destructive shrink-0" />
                  <span className="font-semibold text-foreground">
                    {formatDate(correction.deadline)}
                  </span>
                  {daysLeft !== null && (
                    <Badge
                      variant="outline"
                      className={`text-2xs px-1.5 py-0 h-4 font-semibold ${
                        daysLeft < 3
                          ? "bg-destructive/15 text-destructive border-destructive/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {daysLeft < 0
                        ? t("corrections:card.overdue")
                        : daysLeft === 0
                        ? t("corrections:card.dueToday")
                        : t("corrections:card.daysLeft", { count: daysLeft })}
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("corrections:card.lastUpdated")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(correction.lastUpdatedDate)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Related Compliance Gap badge if present */}
        {correction.relatedComplianceGapTitle && (
          <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-primary/5 border border-primary/20 text-primary">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="size-3.5 shrink-0" />
              <span className="truncate">{correction.relatedComplianceGapTitle}</span>
            </div>
            <Link to="/intel-feed" className="shrink-0 ml-2 font-semibold hover:underline flex items-center gap-0.5 text-2xs">
              View Gap
              <ExternalLink className="size-2.5" />
            </Link>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(correction)}
            className="rounded-xl text-xs text-muted-foreground hover:text-foreground"
          >
            <Info className="size-3.5 mr-1" />
            {t("corrections:card.viewDetails")}
          </Button>

          {isActionRequired ? (
            <Button
              size="sm"
              onClick={() => onCorrect(correction)}
              className="rounded-xl text-xs gap-1.5 font-semibold bg-primary text-primary-foreground shadow-sm hover:shadow"
            >
              {t("corrections:card.correctDocument")}
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(correction)}
              className="rounded-xl text-xs gap-1.5"
            >
              {t("corrections:card.trackStatus")}
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
