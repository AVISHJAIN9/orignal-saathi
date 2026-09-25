import { useTranslation } from "react-i18next";
import {
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Bell,
  ArrowRight,
  ExternalLink,
  Building2,
  FileText,
  AlertOctagon,
  ShieldCheck,
  Receipt,
  ClipboardCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/router-compat";
import type { LicenseRenewalItem } from "@/lib/demo/s11-demo-data";

interface RenewalDetailsDialogProps {
  renewal: LicenseRenewalItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenewalDetailsDialog({
  renewal,
  open,
  onOpenChange,
}: RenewalDetailsDialogProps) {
  const { t } = useTranslation(["renewals"]);

  if (!renewal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 md:p-7">
        <DialogHeader className="gap-2 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                {renewal.certificateNumber}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                App: {renewal.applicationId}
              </span>
            </div>
          </div>

          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground break-words">
            {renewal.productName} ({renewal.modelNumber})
          </DialogTitle>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-0.5">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Award className="size-4 text-primary shrink-0" />
              <span>{renewal.standardNumber} — {renewal.standardTitle}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" />
              <span>{renewal.grantingBranch}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-3 text-sm">
          {/* Key Dates Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-border/70 bg-card/70 text-xs">
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Initial Issue Date
              </span>
              <span className="font-mono font-bold text-foreground">
                {new Date(renewal.issueDate).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Expiry Date
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {new Date(renewal.expiryDate).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Days Remaining
              </span>
              <span className="font-mono font-bold text-primary">
                {renewal.daysRemaining} days
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Audit Status
              </span>
              <span className="font-bold text-foreground">
                {renewal.surveillanceAuditStatus}
              </span>
            </div>
          </div>

          {/* RENEWAL TIMELINE PROGRESSION (90 / 30 / 7 / Expiry / Renewal) */}
          <div className="rounded-xl border border-border/70 bg-card/80 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Statutory Renewal Milestone Schedule</span>
              </h4>
              <span className="text-2xs text-muted-foreground font-mono">
                90 · 30 · 7 Day Notice Protocol
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
              {renewal.milestones.map((ms) => {
                const isCompleted = ms.status === "COMPLETED";
                const isCurrent = ms.status === "CURRENT";
                const isOverdue = ms.status === "OVERDUE";

                return (
                  <div key={ms.id} className="relative group">
                    {/* Node circle */}
                    <div
                      className={`absolute -left-[1.85rem] top-0.5 size-5 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-emerald-500 text-foreground shadow-xs"
                          : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse"
                          : isOverdue
                          ? "bg-rose-600 text-foreground ring-4 ring-rose-500/20"
                          : "bg-muted border border-border text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Circle className="size-2 fill-current" />
                      )}
                    </div>

                    {/* Milestone content */}
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? "border-primary/40 bg-primary/5 shadow-xs"
                          : "border-border/60 bg-background/70"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-foreground text-xs sm:text-sm">
                            {ms.title}
                          </h5>
                          {isCurrent && (
                            <Badge className="text-2xs bg-primary text-primary-foreground">
                              CURRENT POINT
                            </Badge>
                          )}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(ms.targetDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {ms.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-border/40 text-2xs">
                        <span className="text-foreground font-medium">
                          <strong>Action: </strong> {ms.recommendedAction}
                        </span>
                        <span className="font-mono text-muted-foreground flex items-center gap-1">
                          <Bell className="size-3 text-primary" />
                          <span>{ms.deliveryChannel.replace(/_/g, " ")}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* G6 Notification Integration Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <Bell className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground mr-1">
                Notification Center Sync:
              </span>
              <span>
                Renewal milestones trigger automated notifications in your header bell and are reflected in your Compliance Calendar.
              </span>
            </div>
          </div>
        </div>

        {/* Dialog Actions & Deep Links */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
            <Link to="/certificates">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <Award className="size-3.5 text-emerald-600" />
                <span>Certificate</span>
              </Button>
            </Link>

            <Link to="/calendar">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <Calendar className="size-3.5 text-primary" />
                <span>Calendar</span>
              </Button>
            </Link>

            <Link to="/invoices">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <Receipt className="size-3.5" />
                <span>Marking Fee</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
