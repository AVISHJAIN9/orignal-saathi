import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileWarning,
  Calendar,
  Building2,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Scale,
  Award,
  AlertOctagon,
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
import type { LicenseNotice } from "@/lib/license-actions-api";
import { LicenseStatusBadge, NoticeTypeBadge } from "./license-status-badge";
import { RemediationFlowDialog } from "./remediation-flow-dialog";
import { DEMO_WATERMARK_TEXT } from "@/lib/demo/demo-context";

interface LicenseNoticeDetailsDialogProps {
  notice: LicenseNotice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoticeUpdated: () => void;
}

export function LicenseNoticeDetailsDialog({
  notice,
  open,
  onOpenChange,
  onNoticeUpdated,
}: LicenseNoticeDetailsDialogProps) {
  const { t } = useTranslation(["licenseActions"]);
  const [remediationOpen, setRemediationOpen] = useState(false);

  if (!notice) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[90dvh] overflow-y-auto p-4 sm:p-7">
          <DialogHeader className="gap-2 pb-3 border-b border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LicenseStatusBadge status={notice.status} />
                <NoticeTypeBadge type={notice.noticeType} />
              </div>
              {notice.isDemo && (
                <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {DEMO_WATERMARK_TEXT}
                </span>
              )}
            </div>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1 break-words">
              {notice.productName} ({notice.certificateNumber})
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-0.5">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-semibold text-foreground">Order Ref:</span>
                <span>{notice.officialOrderRef}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>Effective: {new Date(notice.effectiveDate).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-3 text-xs sm:text-sm">
            {/* Reason Summary */}
            <div className="p-3.5 rounded-xl border border-destructive/25 bg-destructive/5 text-xs">
              <h4 className="font-bold text-destructive mb-1 text-sm flex items-center gap-1.5">
                <AlertOctagon className="size-4" />
                <span>Enforcement Grounds & Statutory Reason</span>
              </h4>
              <p className="text-foreground leading-relaxed">
                {notice.reasonSummary}
              </p>
            </div>

            {/* Official Order Citation */}
            <div className="p-3.5 rounded-xl border border-border/70 bg-card text-xs flex flex-col gap-1.5">
              <span className="font-bold text-foreground uppercase tracking-wider text-2xs text-primary">
                {t("licenseActions:dialog.explanation")}
              </span>
              <p className="text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40 font-mono text-2xs">
                {notice.officialExplanation}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-muted-foreground pt-1">
                <span>Authority: <strong className="text-foreground">{notice.issuingAuthority}</strong></span>
                <span>Signatory: <strong className="text-foreground">{notice.signatoryOfficer}</strong></span>
              </div>
            </div>

            {/* Affected Scope */}
            <div className="p-3 rounded-xl border border-border/60 bg-muted/15 text-xs">
              <h5 className="font-bold text-foreground mb-1">
                {t("licenseActions:dialog.affectedScope")}
              </h5>
              <p className="text-muted-foreground leading-relaxed">
                {notice.affectedScopeSummary}
              </p>
            </div>

            {/* Immediate Required Directives */}
            {notice.immediateDirectives.length > 0 && (
              <div className="p-3.5 rounded-xl border border-border/70 bg-card text-xs flex flex-col gap-2">
                <h5 className="font-bold text-foreground">
                  {t("licenseActions:dialog.immediateActions")}
                </h5>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  {notice.immediateDirectives.map((dir, i) => (
                    <li key={i}>{dir}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {notice.appealEligible && (
                <Link to="/appeals">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <Scale className="size-3.5" />
                    <span>Appeals</span>
                  </Button>
                </Link>
              )}
            </div>

            {notice.status !== "REINSTATED" && notice.status !== "CLOSED" && (
              <Button
                size="sm"
                onClick={() => setRemediationOpen(true)}
                className="gap-1.5 text-xs font-semibold w-full sm:w-auto justify-center"
              >
                <span>{t("licenseActions:dialog.startWorkflow")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Child Remediation Workflow Dialog */}
      <RemediationFlowDialog
        notice={notice}
        open={remediationOpen}
        onOpenChange={setRemediationOpen}
        onRemediationSubmitted={() => {
          onNoticeUpdated();
        }}
      />
    </>
  );
}
