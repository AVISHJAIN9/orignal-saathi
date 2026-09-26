import { useTranslation } from "react-i18next";
import {
  Target,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Search,
  BookCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { RetrievalQualityKpi } from "@/lib/demo/s27-demo-data";

interface RetrievalKpiGridProps {
  kpis: RetrievalQualityKpi;
}

export function RetrievalKpiGrid({ kpis }: RetrievalKpiGridProps) {
  const { t } = useTranslation(["retrievalQuality"]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Groundedness Rate */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.groundedness")}
          </span>
          <Target className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
            {kpis.groundednessRate}%
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          Claims directly substantiated by verified BIS standards.
        </p>
      </div>

      {/* 2. Cite-or-Decline Rate */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.declineRate")}
          </span>
          <ShieldAlert className="size-4 text-amber-500" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {kpis.declineRate}%
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          Safe abstention rate for ambiguous queries (cite-or-decline policy).
        </p>
      </div>

      {/* 3. Avg Retrieval Latency */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.retrievalLatency")}
          </span>
          <Clock className="size-4 text-primary" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {kpis.avgRetrievalLatencyMs}ms
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          M3 dense-sparse hybrid vector search latency.
        </p>
      </div>

      {/* 4. Citation Coverage Rate */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.citationCoverage")}
          </span>
          <BookCheck className="size-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {kpis.citationCoverageRate}%
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          Responses with pin-point clause and table citations.
        </p>
      </div>

      {/* 5. Total Queries Evaluated */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.queriesEvaluated")}
          </span>
          <Search className="size-4 text-muted-foreground" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {kpis.totalQueriesEvaluated.toLocaleString()}
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          Evaluated via automated synthetic & human golden sets.
        </p>
      </div>

      {/* 6. Retrieval Success Rate */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.retrievalSuccess")}
          </span>
          <ShieldCheck className="size-4 text-emerald-600" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {kpis.retrievalSuccessRate}%
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          Gold-standard chunk presence in top-5 retrieved results.
        </p>
      </div>

      {/* 7. Low-Confidence Query Rate */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.lowConfidence")}
          </span>
          <AlertTriangle className="size-4 text-amber-500" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {kpis.lowConfidenceRate}%
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          M8 confidence score beneath advisory threshold.
        </p>
      </div>

      {/* 8. Avg Answer Latency */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("retrievalQuality:metrics.generationLatency")}
          </span>
          <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {kpis.avgGenerationLatencyMs}ms
          </span>
        </div>
        <p className="text-2xs text-muted-foreground leading-snug">
          M5 generation + streaming token time-to-first-chunk.
        </p>
      </div>
    </div>
  );
}
