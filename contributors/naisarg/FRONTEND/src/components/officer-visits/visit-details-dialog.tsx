import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Building2,
  FileText,
  Info,
  ShieldAlert,
  ClipboardList,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VisitStatusBadge } from "./visit-status-badge";
import type { OfficerVisit } from "@/lib/officer-visits-api";

interface VisitDetailsDialogProps {
  visit: OfficerVisit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitDetailsDialog({
  visit,
  open,
  onOpenChange,
}: VisitDetailsDialogProps) {
  const { t } = useTranslation(["visits"]);

  if (!visit) return null;

  const formatLocation = () => {
    if (!visit.location) return "Not provided";
    if (typeof visit.location === "string") return visit.location;
    const parts = [
      visit.location.unitName,
      visit.location.address,
      visit.location.city,
      visit.location.state,
      visit.location.pincode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/50 bg-card/95 p-6 backdrop-blur-2xl dark:border-border/50 dark:bg-card/90 sm:rounded-2xl">
        <DialogHeader className="gap-1.5 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
              {visit.visitType}
            </span>
            <VisitStatusBadge status={visit.status} />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {visit.purpose || visit.visitType}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            {t("visits:detailsDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Key Meta Grid */}
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-2">
            {/* Application Ref */}
            <div className="flex items-start gap-2.5">
              <Building2 className="mt-0.5 size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-2xs font-medium text-muted-foreground uppercase">
                  {t("visits:detailsDialog.application")}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {visit.applicationTitle || visit.applicationNumber || visit.applicationId}
                </span>
                {visit.standardNumber && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {visit.standardNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-2.5">
              <Calendar className="mt-0.5 size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-2xs font-medium text-muted-foreground uppercase">
                  {t("visits:detailsDialog.dateTime")}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {visit.scheduledDate}
                </span>
                {visit.scheduledTime && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {visit.scheduledTime}
                    {visit.estimatedDuration && ` (${visit.estimatedDuration})`}
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2.5 sm:col-span-2">
              <MapPin className="mt-0.5 size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-2xs font-medium text-muted-foreground uppercase">
                  {t("visits:detailsDialog.location")}
                </span>
                <span className="text-xs text-foreground sm:text-sm">
                  {formatLocation()}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Officer Section (strictly only if provided by backend) */}
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserCheck className="size-4 text-primary" />
              <span>{t("visits:detailsDialog.officer")}</span>
            </div>
            {visit.officer ? (
              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                {visit.officer.name && (
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase">Name</span>
                    <p className="text-sm font-semibold text-foreground">{visit.officer.name}</p>
                  </div>
                )}
                {visit.officer.designation && (
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase">
                      {t("visits:detailsDialog.officerDesignation")}
                    </span>
                    <p className="text-sm text-foreground">{visit.officer.designation}</p>
                  </div>
                )}
                {visit.officer.branchOffice && (
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase">
                      {t("visits:detailsDialog.officerBranch")}
                    </span>
                    <p className="text-sm text-foreground">{visit.officer.branchOffice}</p>
                  </div>
                )}
                {(visit.officer.email || visit.officer.phone) && (
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase">
                      {t("visits:detailsDialog.officerContact")}
                    </span>
                    <p className="text-xs text-foreground">
                      {[visit.officer.email, visit.officer.phone].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <Info className="size-4 shrink-0 text-muted-foreground" />
                <span>{t("visits:detailsDialog.notAssigned")}</span>
              </div>
            )}
          </div>

          {/* Official Instructions */}
          {visit.instructions && visit.instructions.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                <span>{t("visits:detailsDialog.instructions")}</span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground sm:text-sm">
                {visit.instructions.map((inst, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {inst}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation Checklist Summary */}
          {visit.preparationChecklist && visit.preparationChecklist.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ClipboardList className="size-4 text-primary" />
                  <span>{t("visits:detailsDialog.preparationSummary")}</span>
                </div>
                {visit.preparationSummary && (
                  <span className="font-mono text-xs font-semibold text-primary">
                    {visit.preparationSummary.readyCount} / {visit.preparationSummary.totalCount} ready
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-col gap-1.5">
                {visit.preparationChecklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-foreground">{item.title}</span>
                    <span
                      className={`font-semibold ${
                        item.isReady ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {item.isReady ? "Ready" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Notes (if completed or has actions) */}
          {visit.followUp && (
            <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-300">
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                <span>{t("visits:detailsDialog.followUp")}</span>
              </div>
              {visit.followUp.notes && (
                <div>
                  <span className="text-2xs text-muted-foreground uppercase">
                    {t("visits:detailsDialog.followUpNotes")}
                  </span>
                  <p className="text-xs text-foreground sm:text-sm">{visit.followUp.notes}</p>
                </div>
              )}
              {visit.followUp.actionRequired && (
                <div>
                  <span className="text-2xs text-muted-foreground uppercase">
                    {t("visits:detailsDialog.actionRequired")}
                  </span>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300 sm:text-sm">
                    {visit.followUp.actionRequired}
                  </p>
                </div>
              )}
              {visit.followUp.nextStepDeadline && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{t("visits:detailsDialog.nextStepDeadline")}:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {visit.followUp.nextStepDeadline}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Official BIS Notice */}
          <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
            <Info className="size-4 shrink-0 text-muted-foreground" />
            <p className="leading-normal">
              {t("visits:detailsDialog.officialProtocolNotice")}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-5"
          >
            {t("visits:detailsDialog.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
