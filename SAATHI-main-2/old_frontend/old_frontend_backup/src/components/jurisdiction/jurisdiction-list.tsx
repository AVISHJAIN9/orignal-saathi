import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { JurisdictionData } from "@/lib/mock-jurisdictions";

interface JurisdictionListProps {
  jurisdictions: JurisdictionData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function JurisdictionList({
  jurisdictions,
  selectedId,
  onSelect,
}: JurisdictionListProps) {
  const { t } = useTranslation("jurisdiction");

  if (jurisdictions.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card py-14 text-center text-sm text-muted-foreground">
        {t("emptyState")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jurisdictions.map((j) => {
        const isSelected = selectedId === j.id;

        return (
          <button
            key={j.id}
            type="button"
            onClick={() => onSelect(j.id)}
            className={`group flex cursor-pointer flex-col justify-between rounded-2xl border p-5 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "elevation-1 elevation-lift border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{j.flag}</span>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {j.name}
                    </h3>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      {j.code} • {j.region}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                    j.status === "high_relevance"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : j.status === "active_changes"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {j.status === "active_changes" && (
                    <Sparkles className="size-2.5" />
                  )}
                  {j.status === "high_relevance" && (
                    <ShieldCheck className="size-2.5" />
                  )}
                  {j.status.replace("_", " ")}
                </span>
              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {j.primaryAuthority}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2.5 border-t border-border/60 pt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  {t("drawer.alignmentScore")}
                </span>
                <span className="font-mono font-bold text-primary">
                  {j.bisRelationship.alignmentScore}%
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${j.bisRelationship.alignmentScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                <span>{j.bisRelationship.status}</span>
                <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
                  {t("drawer.details")} <ArrowRight className="size-2.5" />
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
