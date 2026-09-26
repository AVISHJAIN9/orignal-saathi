import { useTranslation } from "react-i18next";
import { BookOpen, ShieldCheck, ArrowRight, ExternalLink, Scroll } from "lucide-react";
import type { RegulatoryOverview } from "@/lib/compliance-chain-api";

interface RegulatoryOverviewCardProps {
  overview?: RegulatoryOverview;
}

export function RegulatoryOverviewCard({
  overview,
}: RegulatoryOverviewCardProps) {
  const { t } = useTranslation(["chain"]);

  if (!overview) return null;

  return (
    <div className="rounded-2xl border border-border/50 bg-card/90 p-5 shadow-md backdrop-blur-xl dark:border-border/50 dark:bg-card/90 sm:p-6">
      <div className="flex items-center gap-2.5 text-primary">
        <Scroll className="size-5 shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-mono text-xs font-bold tracking-widest uppercase">
            {t("chain:regulatoryOverview.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("chain:regulatoryOverview.subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {/* Standard Box */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="size-4 shrink-0" />
              <span className="font-mono text-2xs font-bold uppercase">
                {t("chain:regulatoryOverview.standardLabel")}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {overview.standardNumber}
            </p>
          </div>

          {overview.standardSource?.url ? (
            <a
              href={overview.standardSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80"
            >
              <span>{overview.standardSource.title || t("chain:regulatoryOverview.viewSource")}</span>
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="text-2xs text-muted-foreground italic">
              {overview.standardSource?.title || t("chain:regulatoryOverview.unverifiedSource")}
            </span>
          )}
        </div>

        {/* QCO Box */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <ArrowRight className="size-4 shrink-0 hidden md:block" />
              <span className="font-mono text-2xs font-bold uppercase">
                {t("chain:regulatoryOverview.qcoLabel")}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {overview.qcoStatus}
            </p>
          </div>

          {overview.qcoSource?.url ? (
            <a
              href={overview.qcoSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 underline underline-offset-2 hover:opacity-80"
            >
              <span>{overview.qcoSource.title || t("chain:regulatoryOverview.viewSource")}</span>
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="text-2xs text-muted-foreground italic">
              {overview.qcoSource?.title || t("chain:regulatoryOverview.unverifiedSource")}
            </span>
          )}
        </div>

        {/* BIS Scheme Box */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4 shrink-0" />
              <span className="font-mono text-2xs font-bold uppercase">
                {t("chain:regulatoryOverview.schemeLabel")}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {overview.schemeName}
            </p>
          </div>

          {overview.schemeSource?.url ? (
            <a
              href={overview.schemeSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline underline-offset-2 hover:opacity-80"
            >
              <span>{overview.schemeSource.title || t("chain:regulatoryOverview.viewSource")}</span>
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="text-2xs text-muted-foreground italic">
              {overview.schemeSource?.title || t("chain:regulatoryOverview.unverifiedSource")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
