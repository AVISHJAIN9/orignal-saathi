import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Info,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RetrievalKpiGrid } from "./retrieval-kpi-grid";
import { GroundednessChart } from "./groundedness-chart";
import { FailuresBarChart } from "./failures-bar-chart";
import { retrievalQualityApi, type RetrievalQualityResponse } from "@/lib/retrieval-quality-api";

export function RetrievalQualityDashboard() {
  const { t } = useTranslation(["retrievalQuality"]);
  const [data, setData] = useState<RetrievalQualityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await retrievalQualityApi.getMetrics(timeRange);
      setData(res);
    } catch (err) {
      console.error("Failed to load retrieval metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="flex flex-col gap-6">
      {/* Telemetry Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-card/70 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <Badge
            variant={data?.isLiveBackend ? "default" : "secondary"}
            className={`font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 ${
              !data?.isLiveBackend ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30" : ""
            }`}
          >
            {data?.statusLabel || t("retrievalQuality:status.demoTelemetry")}
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            SIH 2026 Internal AI System Groundedness & Cite-or-Decline Operations
          </span>
        </div>

        {/* Range Selector & Refresh */}
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(val) => setTimeRange(val as any)}
          >
            <SelectTrigger className="text-xs h-8 rounded-lg w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            className="gap-1.5 text-xs font-semibold h-8"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* RAG Groundedness Terminology Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground mr-1">Operational Metric Definition:</span>
          <span>
            {t("retrievalQuality:metrics.groundednessTooltip")} SAATHI maintains high precision by abstaining (declining) when verified citations cannot be guaranteed (cite-or-decline policy).
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      ) : data ? (
        <>
          {/* Main KPI Grid */}
          <RetrievalKpiGrid kpis={data.telemetry.kpis} />

          {/* Charts Section: Groundedness Trends + Failure Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Chart: Groundedness vs Decline over time */}
            <Card className="border border-border/70 bg-card/70 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <Activity className="size-4 text-emerald-600" />
                    <span>{t("retrievalQuality:sections.trends")}</span>
                  </h4>
                  <span className="text-2xs text-muted-foreground font-mono">
                    {data.telemetry.evaluationWindow}
                  </span>
                </div>
                <GroundednessChart data={data.telemetry.timeSeries} />
              </CardContent>
            </Card>

            {/* Right Chart: Retrieval Failure Breakdown */}
            <Card className="border border-border/70 bg-card/70 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <Layers className="size-4 text-rose-500" />
                    <span>{t("retrievalQuality:sections.failures")}</span>
                  </h4>
                  <span className="text-2xs text-muted-foreground font-mono">
                    Top Root Causes
                  </span>
                </div>
                <FailuresBarChart data={data.telemetry.failureCategories} />
              </CardContent>
            </Card>
          </div>

          {/* Standards with Retrieval Coverage Gaps */}
          <Card className="border border-border/70 bg-card/70 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <AlertCircle className="size-4 text-amber-500" />
                  <span>{t("retrievalQuality:sections.coverageGaps")}</span>
                </h4>
                <span className="text-2xs text-muted-foreground font-mono">
                  Targeted for Ingestion Re-chunking
                </span>
              </div>

              <div className="rounded-xl border border-border/60 overflow-hidden bg-background/80">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
                      <tr>
                        <th className="p-2.5">Standard Number</th>
                        <th className="p-2.5">Title</th>
                        <th className="p-2.5 text-center">Coverage Score</th>
                        <th className="p-2.5 text-right">Queries Evaluated</th>
                        <th className="p-2.5 min-w-[220px]">Primary Deficiency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {data.telemetry.coverageGapStandards.map((std) => (
                        <tr key={std.standardNumber}>
                          <td className="p-2.5 font-mono font-bold text-primary">
                            {std.standardNumber}
                          </td>
                          <td className="p-2.5 text-foreground">{std.standardTitle}</td>
                          <td className="p-2.5 text-center font-mono font-semibold">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {std.coverageScore}%
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-mono text-muted-foreground">
                            {std.evaluatedQueries}
                          </td>
                          <td className="p-2.5 text-xs text-muted-foreground">
                            {std.primaryDeficiency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
