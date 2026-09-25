import { useTranslation } from "react-i18next";
import {
  FileText,
  AlertTriangle,
  Clock,
  ExternalLink,
  History,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/lib/router-compat";
import type { DocumentCorrectionItem, DocumentCorrectionStatus } from "@/lib/document-corrections-api";

interface CorrectionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correction: DocumentCorrectionItem | null;
  onStartCorrection: (correction: DocumentCorrectionItem) => void;
}

export function CorrectionDetailsDialog({
  open,
  onOpenChange,
  correction,
  onStartCorrection,
}: CorrectionDetailsDialogProps) {
  const { t, i18n } = useTranslation(["corrections", "chain", "admin"]);

  if (!correction) return null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: DocumentCorrectionStatus) => {
    switch (status) {
      case "CORRECTION_REQUIRED":
      case "ACTION_REQUIRED":
        return (
          <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
            {t(`corrections:statuses.${status}`, { defaultValue: "Correction Required" })}
          </Badge>
        );
      case "RESUBMITTED":
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-xs">
            {t(`corrections:statuses.${status}`, { defaultValue: "Re-submitted" })}
          </Badge>
        );
      case "UNDER_REVIEW":
      case "REVIEW_PENDING":
        return (
          <Badge variant="outline" className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 text-xs">
            {t(`corrections:statuses.${status}`, { defaultValue: "Under Review" })}
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs">
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="shrink-0 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {t("corrections:detailsDialog.title")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {correction.documentType} • {correction.applicationId}
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(correction.status)}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 pr-3">
          <div className="flex flex-col gap-4 py-2">
            {/* Scrutiny Feedback Alert */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    {t("corrections:detailsDialog.officialFeedback")}
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                    {correction.officialFeedback}
                  </p>
                </div>
              </div>
            </div>

            {/* Mandatory Action & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/60 p-3.5 flex flex-col gap-1.5">
                <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("corrections:detailsDialog.requiredAction")}
                </span>
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {correction.requiredAction}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-3.5 flex flex-col gap-1.5">
                <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("corrections:detailsDialog.relatedClause")}
                </span>
                <p className="text-xs font-semibold text-primary">
                  {correction.relatedClause || "Scheme Requirements"}
                </p>
                {correction.deadline && (
                  <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border/60 text-destructive text-xs font-medium">
                    <Clock className="size-3.5 shrink-0" />
                    <span>{t("corrections:detailsDialog.deadline")}: {formatDate(correction.deadline)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Compliance Gap (C3) if present */}
            {correction.relatedComplianceGapTitle && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <span className="text-2xs font-bold uppercase tracking-wider text-primary">
                      {t("corrections:detailsDialog.relatedGap")}
                    </span>
                    <p className="text-xs font-semibold text-foreground truncate">
                      {correction.relatedComplianceGapTitle}
                    </p>
                  </div>
                </div>
                <Link to="/intel-feed">
                  <Button variant="outline" size="xs" className="rounded-lg text-2xs gap-1 shrink-0">
                    {t("corrections:detailsDialog.viewGap")}
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Document Version History */}
            <div className="rounded-xl border border-border bg-card/80 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <History className="size-4 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("corrections:detailsDialog.historyTitle")}
                </h4>
              </div>

              {correction.history && correction.history.length > 0 ? (
                <div className="relative pl-4 flex flex-col gap-4 border-l-2 border-border/70 ml-2">
                  {correction.history.map((ver, idx) => (
                    <div key={idx} className="relative flex flex-col gap-1">
                      <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary border-2 border-background" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">
                          Version {ver.version}: {ver.fileName}
                        </span>
                        {getStatusBadge(ver.status)}
                      </div>
                      <span className="text-2xs text-muted-foreground">
                        Submitted: {formatDate(ver.submittedAt)}
                        {ver.scrutinyOfficer && ` • ${ver.scrutinyOfficer}`}
                      </span>
                      {ver.feedback && (
                        <p className="text-2xs text-muted-foreground/90 italic mt-0.5 bg-muted/40 p-2 rounded-lg">
                          "{ver.feedback}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("corrections:detailsDialog.historyEmpty")}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 pt-4 border-t border-border flex flex-row items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            {t("corrections:detailsDialog.close")}
          </Button>

          {isActionRequired && (
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onStartCorrection(correction);
              }}
              className="rounded-xl text-xs gap-1.5 font-semibold bg-primary text-primary-foreground shadow-sm"
            >
              {t("corrections:detailsDialog.startCorrection")}
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
