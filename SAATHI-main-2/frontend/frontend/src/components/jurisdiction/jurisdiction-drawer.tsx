import {
  Award,
  BookOpen,
  Building2,
  Layers,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { JurisdictionData } from "@/lib/mock-jurisdictions";

interface JurisdictionDrawerProps {
  jurisdiction: JurisdictionData | null;
  onClose: () => void;
}

export function JurisdictionDrawer({
  jurisdiction,
  onClose,
}: JurisdictionDrawerProps) {
  const { t } = useTranslation("jurisdiction");

  if (!jurisdiction) return null;

  return (
    <div className="elevation-2 flex flex-col gap-6 rounded-2xl border border-primary/30 bg-card p-6 ring-1 ring-primary/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{jurisdiction.flag}</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {jurisdiction.name}
              </h2>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                {jurisdiction.code}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {jurisdiction.region} • {jurisdiction.lastDataUpdate}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t("drawer.close")}
          className="shrink-0 rounded-full"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Alignment score banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-primary uppercase">
              {jurisdiction.bisRelationship.status}
            </span>
            <p className="mt-0.5 text-xs text-foreground/90">
              {jurisdiction.bisRelationship.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col sm:items-end">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            {t("drawer.alignmentScore")}
          </span>
          <span className="font-mono text-2xl font-black text-primary">
            {jurisdiction.bisRelationship.alignmentScore}%
          </span>
        </div>
      </div>

      {/* Framework / ecosystem grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Building2 className="size-4 text-primary" />
            <span>{t("drawer.framework")}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {jurisdiction.regulatoryFramework}
          </p>
          <div className="mt-auto pt-2 font-mono text-[11px] text-primary/90">
            {t("drawer.authority")}: {jurisdiction.primaryAuthority}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <BookOpen className="size-4 text-primary" />
            <span>{t("drawer.ecosystem")}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {jurisdiction.standardsEcosystem}
          </p>
          <div className="mt-auto pt-2 font-mono text-[11px] text-muted-foreground">
            {t("drawer.wtoTbtNotified")}:{" "}
            {jurisdiction.wtoTbtNotified
              ? t("drawer.yesActive")
              : t("drawer.no")}
          </div>
        </div>
      </div>

      {/* Mandatory schemes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Award className="size-4 text-primary" />
          <span>{t("drawer.schemes")}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {jurisdiction.schemes.map((scheme) => (
            <span
              key={scheme}
              className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {scheme}
            </span>
          ))}
        </div>
      </div>

      {/* Recent updates */}
      {jurisdiction.recentUpdates.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Zap className="size-4 text-primary" />
            <span>{t("drawer.recentNotices")}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {jurisdiction.recentUpdates.map((update) => (
              <div
                key={update.title}
                className="flex flex-col gap-1 rounded-xl border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {update.title}
                  </span>
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.2 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    {t("drawer.impactLabel", { impact: update.impact })}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {update.summary}
                </p>
                <span className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {t("drawer.dateLabel", { date: update.date })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sectors */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Layers className="size-4 text-primary" />
          <span>{t("drawer.affectedSectors")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {jurisdiction.sectors.map((sector) => (
            <span
              key={sector}
              className="rounded-md border border-border bg-muted/20 px-2 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
