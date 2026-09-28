import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Info,
  MapPin,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LaboratoryMatch } from "@/lib/laboratory-api";
import { cn } from "@/lib/utils";

interface LaboratoryCardProps {
  laboratory: LaboratoryMatch;
  isBestMatch?: boolean;
  onViewDetails: (lab: LaboratoryMatch) => void;
  onSelect?: (lab: LaboratoryMatch) => void;
  isSelected?: boolean;
}

export function LaboratoryCard({
  laboratory,
  isBestMatch = false,
  onViewDetails,
  onSelect,
  isSelected = false,
}: LaboratoryCardProps) {
  const { t } = useTranslation(["laboratory"]);

  const hasFullCoverage =
    laboratory.testsCoveredCount >= laboratory.totalRequiredTestsCount &&
    laboratory.totalRequiredTestsCount > 0;

  const renderVerificationBadge = () => {
    if (laboratory.verificationStatus === "verified") {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
          <CheckCircle2 className="mr-1 size-3" />
          {t("laboratory:results.verified")}
        </Badge>
      );
    }
    if (laboratory.verificationStatus === "unverified") {
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
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isBestMatch
          ? "border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl ring-1 ring-primary/30"
          : "border-border/50 bg-card/90 backdrop-blur-xl shadow-md hover:border-primary/40",
        isSelected && "ring-2 ring-emerald-500 border-emerald-500"
      )}
    >
      {/* Best Match Header Ribbon */}
      {isBestMatch && (
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 px-4 py-1.5 text-xs font-bold text-foreground shadow-sm">
          <Star className="size-3.5 fill-white" />
          <span>{t("laboratory:results.bestMatchHeading")}</span>
        </div>
      )}

      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl font-bold shadow-inner",
                isBestMatch
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Building2 className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  {laboratory.laboratoryName}
                </h3>
                {laboratory.oslCode && (
                  <Badge variant="outline" className="font-mono text-2xs font-bold text-primary border-primary/30 bg-primary/5">
                    OSL: {laboratory.oslCode}
                  </Badge>
                )}
                {renderVerificationBadge()}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  {laboratory.location}
                </span>
                {laboratory.distanceKm !== undefined && (
                  <span className="font-mono text-primary/90 font-medium">
                    ({t("laboratory:results.distanceKm", { distance: laboratory.distanceKm })})
                  </span>
                )}
                {laboratory.validTill && (
                  <span className="font-mono text-2xs text-muted-foreground/80">
                    • Valid till: {laboratory.validTill}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-center shadow-sm">
              <span className="text-base font-extrabold text-primary sm:text-lg">
                {laboratory.matchScore}%
              </span>
              <span className="block font-mono text-2xs font-semibold text-primary/80 uppercase">
                MATCH
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex flex-col gap-4">
        {/* Coverage & Accreditation Bar */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Coverage info */}
          <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
            <CheckCircle2
              className={cn(
                "size-5 shrink-0",
                hasFullCoverage ? "text-emerald-500" : "text-amber-500"
              )}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">
                {laboratory.testsCoveredCount} / {laboratory.totalRequiredTestsCount} tests covered
              </span>
              <span className="text-2xs text-muted-foreground">
                {hasFullCoverage
                  ? t("laboratory:results.fullCoverage")
                  : t("laboratory:results.partialCoverage")}
              </span>
            </div>
          </div>

          {/* Accreditation info */}
          <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
            <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">
                {laboratory.accreditationStatus === "verified"
                  ? t("laboratory:results.verified")
                  : laboratory.accreditationStatus === "unverified"
                  ? t("laboratory:results.unverified")
                  : t("laboratory:results.unknown")}
              </span>
              <span className="text-2xs text-muted-foreground truncate">
                {laboratory.accreditationDetails || "Standard Accreditation"}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown preview if present */}
        {laboratory.explanation && (
          <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/20 p-3 rounded-lg border border-border/40">
            "{laboratory.explanation}"
          </p>
        )}

        {/* Capabilities Pill Matrix */}
        {laboratory.capabilities && laboratory.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {laboratory.capabilities.slice(0, 4).map((cap, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-2xs font-medium border",
                  cap.status === "verified"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : cap.status === "not_supported"
                    ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                )}
              >
                {cap.status === "verified" ? "✓" : cap.status === "not_supported" ? "✕" : "?"}{" "}
                {cap.testName}
              </span>
            ))}
            {laboratory.capabilities.length > 4 && (
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-2xs text-muted-foreground border border-border">
                +{laboratory.capabilities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Card Action Buttons */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(laboratory)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Info className="size-3.5" />
            {t("laboratory:results.viewDetails")}
          </Button>

          {onSelect && (
            <Button
              variant={isSelected ? "outline" : isBestMatch ? "default" : "secondary"}
              size="sm"
              onClick={() => onSelect(laboratory)}
              className={cn("gap-1.5 text-xs font-semibold", isSelected && "border-emerald-500 text-emerald-600")}
            >
              <CheckCircle2 className="size-3.5" />
              {isSelected
                ? t("laboratory:results.labSelected")
                : t("laboratory:results.selectLab")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
