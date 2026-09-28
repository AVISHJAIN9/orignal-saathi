import { useTranslation } from "react-i18next";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
  Calendar,
  Layers,
  XCircle,
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
import type { LaboratoryMatch } from "@/lib/laboratory-api";

interface LaboratoryDetailsDialogProps {
  laboratory: LaboratoryMatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (lab: LaboratoryMatch) => void;
  isSelected?: boolean;
}

export function LaboratoryDetailsDialog({
  laboratory,
  open,
  onOpenChange,
  onSelect,
  isSelected,
}: LaboratoryDetailsDialogProps) {
  const { t } = useTranslation(["laboratory"]);

  if (!laboratory) return null;

  const renderCapabilityStatus = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            {t("laboratory:results.verified")}
          </span>
        );
      case "not_supported":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <XCircle className="size-3.5" />
            {t("laboratory:results.unverified")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <HelpCircle className="size-3.5" />
            {t("laboratory:results.unknown")}
          </span>
        );
    }
  };

  const renderVerificationBadge = (status: string) => {
    if (status === "verified") {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
          <CheckCircle2 className="mr-1 size-3" />
          {t("laboratory:results.verified")}
        </Badge>
      );
    }
    if (status === "unverified") {
      return (
        <Badge variant="outline" className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30">
          <XCircle className="mr-1 size-3" />
          {t("laboratory:results.unverified")}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
        <HelpCircle className="mr-1 size-3" />
        {t("laboratory:results.unknown")}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl border-border/50 bg-card/95 backdrop-blur-2xl">
        <DialogHeader className="gap-2 border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                LAB ID: {laboratory.laboratoryId}
              </span>
              {laboratory.oslCode && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-2xs font-bold text-primary">
                  OSL: {laboratory.oslCode}
                </span>
              )}
            </div>
            {renderVerificationBadge(laboratory.verificationStatus)}
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {laboratory.laboratoryName}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>{laboratory.location}</span>
            </span>
            {laboratory.distanceKm !== undefined && (
              <span className="font-mono text-primary font-medium">({laboratory.distanceKm} km away)</span>
            )}
            {laboratory.validTill && (
              <span className="flex items-center gap-1 font-mono text-2xs">
                <Calendar className="size-3" />
                Valid till: {laboratory.validTill}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Match Score & Coverage summary */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase">
                {t("laboratory:breakdown.title")}
              </span>
              <span className="text-lg font-extrabold text-primary">
                {laboratory.matchScore}% MATCH
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase">
                {t("laboratory:breakdown.testCoverage")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {laboratory.testsCoveredCount} / {laboratory.totalRequiredTestsCount} tests
              </span>
            </div>
          </div>

          {/* Capabilities List */}
          {laboratory.capabilities && laboratory.capabilities.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("laboratory:details.capabilities")}
              </h3>
              <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card p-3">
                {laboratory.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">{cap.testName}</span>
                      {cap.notes && (
                        <span className="text-2xs text-muted-foreground">{cap.notes}</span>
                      )}
                    </div>
                    <div className="shrink-0">{renderCapabilityStatus(cap.status)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tested Products & Scope Details (from Excel / LIMS data) */}
          {laboratory.scopeDetails && laboratory.scopeDetails.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  Recognized Product & Testing Scope ({laboratory.scopeDetails.length} items)
                </h3>
              </div>
              <div className="max-h-56 overflow-y-auto rounded-xl border border-border/60 bg-muted/20">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-2xs uppercase text-muted-foreground sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Indian Standard</th>
                      <th className="px-3 py-2">Product / Scope</th>
                      <th className="px-3 py-2 text-right">Testing Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {laboratory.scopeDetails.map((sc, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="px-3 py-2 font-mono font-medium text-primary">
                          {sc.standard}
                        </td>
                        <td className="px-3 py-2 text-foreground">
                          <span className="font-semibold block">{sc.product && sc.product !== '-' ? sc.product : sc.title}</span>
                          {sc.title && sc.product && sc.product !== '-' && sc.title !== sc.product && (
                            <span className="text-2xs text-muted-foreground block">{sc.title}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                          {sc.fee && sc.fee.trim() ? `₹${sc.fee.replace('\n', '').trim()}` : "Standard BIS Fee"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Relevant Standards */}
          {laboratory.relevantStandards && laboratory.relevantStandards.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                {t("laboratory:details.standards")} ({laboratory.relevantStandards.length})
              </h3>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {laboratory.relevantStandards.map((std, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-xs bg-muted/30">
                    {std}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Accreditation */}
          <div className="flex flex-col gap-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("laboratory:details.accreditation")}
            </h3>
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-xs">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span className="text-foreground">
                {laboratory.accreditationDetails || t("laboratory:results.verified")}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          {(laboratory.contactEmail || laboratory.contactPhone || laboratory.websiteUrl || laboratory.location) && (
            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("laboratory:details.contact")}
              </h3>
              <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-3 text-xs">
                {laboratory.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span className="text-foreground">{laboratory.location}</span>
                  </div>
                )}
                {laboratory.contactPhone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5 text-primary shrink-0" />
                    <span className="text-foreground">{laboratory.contactPhone}</span>
                  </div>
                )}
                {laboratory.contactEmail && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-3.5 text-primary shrink-0" />
                    <span className="text-foreground">{laboratory.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Official BIS LIMS Verification Link */}
          {laboratory.scopeUrl && (
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
              <div className="flex flex-col">
                <span className="font-mono text-2xs font-semibold text-primary uppercase">
                  Official Bureau of Indian Standards Record
                </span>
                <span className="text-xs font-semibold text-foreground">
                  BIS LIMS Scope Verification (OSL Code: {laboratory.oslCode || laboratory.laboratoryId})
                </span>
              </div>
              <a
                href={laboratory.scopeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
              >
                <span>View Official BIS LIMS Scope</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          )}

          {/* Action buttons */}
          {onSelect && (
            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button
                variant={isSelected ? "outline" : "default"}
                onClick={() => {
                  onSelect(laboratory);
                  onOpenChange(false);
                }}
                className="gap-2"
              >
                <CheckCircle2 className="size-4" />
                {isSelected
                  ? t("laboratory:results.labSelected")
                  : t("laboratory:results.selectLab")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
