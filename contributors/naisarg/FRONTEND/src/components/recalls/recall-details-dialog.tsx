import { useTranslation } from "react-i18next";
import {
  AlertOctagon,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  Download,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { RecallAlert } from "@/lib/recalls-api";
import { RecallSeverityBadge, RecallTypeBadge } from "./recall-severity-badge";
import { DEMO_WATERMARK_TEXT } from "@/lib/demo/demo-context";

interface RecallDetailsDialogProps {
  alert: RecallAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecallDetailsDialog({
  alert,
  open,
  onOpenChange,
}: RecallDetailsDialogProps) {
  const { t } = useTranslation(["recalls"]);

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[90dvh] overflow-y-auto p-4 sm:p-7">
        <DialogHeader className="gap-2 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RecallSeverityBadge severity={alert.severity} />
              <RecallTypeBadge type={alert.alertType} />
            </div>
            {alert.isDemo && (
              <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {DEMO_WATERMARK_TEXT}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1 break-words">
            {alert.title}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-0.5">
            <div className="flex items-center gap-1.5 font-mono break-all">
              <span className="font-semibold text-foreground">Directive Ref:</span>
              <span>{alert.alertNumber}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>Effective: {new Date(alert.effectiveDate).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-3 text-sm">
          {/* What happened */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {t("recalls:card.whatHappened")}
            </h4>
            <p className="text-foreground leading-relaxed bg-muted/25 p-3.5 rounded-xl border border-border/40 text-xs sm:text-sm">
              {alert.whatHappened}
            </p>
          </div>

          {/* Why it matters & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border/60 bg-muted/15">
              <h5 className="font-bold text-foreground mb-1">
                {t("recalls:card.whyItMatters")}
              </h5>
              <p className="text-muted-foreground leading-relaxed">
                {alert.whyItMatters}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/60 bg-muted/15">
              <h5 className="font-bold text-foreground mb-1">
                Commercial & Compliance Impact
              </h5>
              <p className="text-muted-foreground leading-relaxed">
                {alert.potentialImpact}
              </p>
            </div>
          </div>

          {/* Affected Scope */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-card flex flex-col gap-2.5 text-xs">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
              <Layers className="size-4 text-primary" />
              <span>{t("recalls:dialog.scopeTitle")}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span className="font-medium text-foreground block">Product & Model:</span>
                <span>{alert.affectedScope.productName} ({alert.affectedScope.modelNumber})</span>
              </div>
              <div>
                <span className="font-medium text-foreground block">Standard Clause:</span>
                <span className="font-mono text-primary font-semibold">{alert.affectedScope.standardClause || alert.affectedScope.standardNumber}</span>
              </div>
              {alert.affectedScope.affectedBatches && (
                <div>
                  <span className="font-medium text-foreground block">Production Batches:</span>
                  <span className="font-mono">{alert.affectedScope.affectedBatches.join(", ")}</span>
                </div>
              )}
              {alert.affectedScope.estimatedUnitsAffected && (
                <div>
                  <span className="font-medium text-foreground block">Estimated Affected Units:</span>
                  <span>~{alert.affectedScope.estimatedUnitsAffected} units</span>
                </div>
              )}
            </div>
          </div>

          {/* Required Corrective Action */}
          <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 text-xs flex flex-col gap-1.5">
            <h4 className="font-bold text-destructive flex items-center gap-1.5 text-sm">
              <AlertOctagon className="size-4" />
              <span>{t("recalls:card.requiredAction")}</span>
            </h4>
            <p className="text-foreground leading-relaxed">{alert.requiredAction}</p>
            <div className="flex items-center gap-1.5 text-destructive font-mono font-bold mt-1">
              <Clock className="size-3.5" />
              <span>Remediation Deadline: {new Date(alert.remediationDeadline).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* Official Source Reference */}
          <div className="p-3 rounded-xl border border-border/60 bg-muted/15 text-xs flex flex-col gap-1">
            <span className="font-bold text-foreground">{alert.officialSource.authorityName}</span>
            <span className="text-muted-foreground font-mono">
              Order Ref: {alert.officialSource.orderReferenceNumber} · Published: {alert.officialSource.publishedDate}
            </span>
            <span className="text-2xs text-muted-foreground italic">
              {alert.officialSource.officialOrderTitle}
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
            <Link to="/conformity">
              <Button variant="outline" size="sm" className="gap-1 text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                <span>{t("recalls:card.viewGaps")}</span>
              </Button>
            </Link>

            <Link to="/license-actions">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <span>{t("recalls:card.startRemediation")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
