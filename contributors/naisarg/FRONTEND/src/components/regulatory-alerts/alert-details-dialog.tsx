import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  FileCheck2,
  FileText,
  GitMerge,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/lib/router-compat";
import type { RegulatoryAlert } from "@/lib/regulatory-alerts-api";

interface AlertDetailsDialogProps {
  alert: RegulatoryAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkRead?: (alertId: string) => void;
}

export function AlertDetailsDialog({
  alert,
  open,
  onOpenChange,
  onMarkRead,
}: AlertDetailsDialogProps) {
  const { t } = useTranslation(["alerts"]);

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl border-border/50 bg-card/95 backdrop-blur-2xl">
        <DialogHeader className="gap-2 border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs font-bold uppercase">
                {alert.severity}
              </Badge>
              {alert.relatedStandardNumber && (
                <Badge variant="outline" className="font-mono text-xs">
                  {alert.relatedStandardNumber}
                </Badge>
              )}
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {t("alerts:card.detectedDate")}: {alert.detectedAt}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {alert.title}
          </DialogTitle>
          {alert.userProductContext && (
            <DialogDescription className="text-xs text-muted-foreground">
              Monitored Context: <span className="font-semibold text-foreground">{alert.userProductContext}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Detailed sequence */}
          <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex flex-col gap-1">
              <h4 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("alerts:card.whatChanged")}
              </h4>
              <p className="text-xs text-foreground leading-relaxed">
                {alert.whatChanged}
              </p>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
              <h4 className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t("alerts:card.whyItMatters")}
              </h4>
              <p className="text-xs text-foreground leading-relaxed">
                {alert.whyItMatters}
              </p>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
              <h4 className="font-mono text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                {t("alerts:card.potentialImpact")}
              </h4>
              <p className="text-xs text-foreground leading-relaxed">
                {alert.potentialImpact}
              </p>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
              <h4 className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t("alerts:card.recommendedAction")}
              </h4>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {alert.recommendedAction}
              </p>
            </div>
          </div>

          {/* Official Source Link */}
          {alert.source && (
            <div className="flex flex-col justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center text-xs">
              <div className="flex flex-col">
                <span className="font-mono text-2xs font-bold text-muted-foreground uppercase">
                  {t("alerts:card.source")}
                </span>
                <span className="font-semibold text-foreground">{alert.source.title}</span>
              </div>
              {alert.source.url ? (
                <a
                  href={alert.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-primary underline underline-offset-4"
                >
                  {t("alerts:card.viewSource")}
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <span className="text-2xs italic text-muted-foreground">
                  {t("alerts:card.sourceUnavailable")}
                </span>
              )}
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div className="flex flex-wrap gap-2">
              <Link
                to={alert.c2DeepLink || `/standards?query=${encodeURIComponent(alert.relatedStandardNumber || "")}`}
                onClick={() => onOpenChange(false)}
              >
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  <FileText className="size-3.5" />
                  {t("alerts:card.actions.reviewChanges")}
                </Button>
              </Link>

              <Link
                to={alert.c3DeepLink || `/conformity?standard=${encodeURIComponent(alert.relatedStandardNumber || "")}`}
                onClick={() => onOpenChange(false)}
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                  <FileCheck2 className="size-3.5 text-primary" />
                  {t("alerts:card.actions.runGapAnalysis")}
                </Button>
              </Link>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {t("alerts:states.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
