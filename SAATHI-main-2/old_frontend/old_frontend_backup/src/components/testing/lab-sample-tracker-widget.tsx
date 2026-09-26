import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  Beaker,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  Info,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  buildSampleTestingRecord,
  setStageOverride,
  type SampleTestingRecord,
  type TestingStage,
} from "@/lib/mock-sample-testing";
import type { Application } from "@/lib/mock-registration";
import { cn } from "@/lib/utils";

interface LabSampleTrackerWidgetProps {
  application: Application;
  compact?: boolean;
  showSimulator?: boolean;
}

const STAGE_ORDER: { key: TestingStage; labelKey: string }[] = [
  { key: "dispatched", labelKey: "stages.dispatched" },
  { key: "received", labelKey: "stages.received" },
  { key: "in_testing", labelKey: "stages.in_testing" },
  { key: "passed", labelKey: "stages.passed" },
];

const STAGE_BADGE_STYLES: Record<TestingStage, string> = {
  dispatched:
    "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
  received:
    "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300",
  in_testing:
    "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  passed:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  failed: "border-destructive/30 bg-destructive/10 text-destructive",
};

const PARAMETER_BADGE_STYLES: Record<string, string> = {
  passed:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
  warning:
    "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  failed: "border-destructive/40 bg-destructive/10 text-destructive",
  in_progress:
    "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  pending: "border-border bg-muted/40 text-muted-foreground",
};

function stageIndex(stage: TestingStage): number {
  if (stage === "dispatched") return 0;
  if (stage === "received") return 1;
  if (stage === "in_testing") return 2;
  return 3;
}

/**
 * S18 — every value rendered here comes from `record` (built by
 * buildSampleTestingRecord() in mock-sample-testing.ts from a real
 * Application + C3's real resolved test data). This component never
 * authors a test result, lab name, or report itself.
 */
export function LabSampleTrackerWidget({
  application,
  compact = false,
  showSimulator = true,
}: LabSampleTrackerWidgetProps) {
  const { t } = useTranslation("testing");
  const prefersReducedMotion = useReducedMotion();
  const [record, setRecord] = useState<SampleTestingRecord | null>(() =>
    buildSampleTestingRecord(application),
  );
  const [showParameters, setShowParameters] = useState(!compact);

  useEffect(() => {
    setRecord(buildSampleTestingRecord(application));
  }, [application]);

  if (!record) return null;

  const currentStage = record.currentStage;
  const isPassed = currentStage === "passed";
  const isFailed = currentStage === "failed";
  const isTerminal = isPassed || isFailed;
  const activeIndex = stageIndex(currentStage);

  function handleStageChange(stage: TestingStage) {
    setStageOverride(application.id, stage);
    setRecord(buildSampleTestingRecord(application));
  }

  function handleResetToReal() {
    setStageOverride(application.id, null);
    setRecord(buildSampleTestingRecord(application));
  }

  function handleDownloadSummary() {
    if (!record) return;
    const lines = [
      "SAATHI PROTOTYPE — ILLUSTRATIVE TEST SUMMARY",
      "This is a demo artifact from the SAATHI prototype, not an official",
      "BIS document and not issued by any real testing laboratory.",
      "========================================================================",
      `Sample reference (illustrative): ${record.sampleId}`,
      `Product:                         ${record.productName}`,
      `Standard:                        ${record.standardNumber}`,
      `Summary generated:               ${new Date().toISOString().split("T")[0]}`,
      "",
      "PARAMETER RESULTS:",
      "------------------------------------------------------------------------",
      ...record.parameters.flatMap((p) => [
        `[${p.status.toUpperCase()}] ${p.clause ? `${p.clause} — ` : ""}${p.label}`,
        p.requiredValue ? `  Required: ${p.requiredValue}` : undefined,
        p.observedValue ? `  Observed: ${p.observedValue}` : undefined,
        p.reason ? `  Note: ${p.reason}` : undefined,
        "------------------------------------------------------------------------",
      ]),
      "",
      `Overall: ${isPassed ? "PASSED (illustrative)" : isFailed ? "FAILED (illustrative)" : "IN PROGRESS"}`,
    ].filter((line): line is string => line !== undefined);

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `saathi-test-summary-${record.sampleId}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary">
              {record.sampleId}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "border font-mono text-[0.68rem] font-semibold uppercase tracking-wider",
                STAGE_BADGE_STYLES[currentStage],
              )}
            >
              {t(`stages.${currentStage}`)}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-foreground">
            {record.productName}
          </h3>
          <p className="font-mono text-xs text-muted-foreground">
            {record.standardNumber}
          </p>
        </div>

        <Link
          to={`/standards/${record.standardKey}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
        >
          <span>{t("widget.viewStandard")}</span>
          <ExternalLink className="size-3" aria-hidden />
        </Link>
      </div>

      {/* Illustrative-data disclaimer — always shown, before any download
          control below is reachable. Same visual tier as S5/S15's
          disclaimers. */}
      <div className="elevation-1 flex items-start gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {t("disclaimer.heading")}
          </p>
          <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {t("disclaimer.body")}
          </p>
        </div>
      </div>

      {/* Demo stage preview — clearly labeled as a presentation control,
          not real laboratory behavior. */}
      {showSimulator && (
        <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 dark:border-primary/30">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            <span className="text-xs font-semibold text-foreground">
              {t("simulator.title")}
            </span>
          </div>
          <p className="text-[0.68rem] text-muted-foreground">
            {t("simulator.description")}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {(
              [
                { key: "dispatched", label: t("stages.dispatched") },
                { key: "received", label: t("stages.received") },
                { key: "in_testing", label: t("stages.in_testing") },
                { key: "passed", label: t("stages.passed") },
                { key: "failed", label: t("stages.failed") },
              ] as const
            ).map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => handleStageChange(s.key)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  currentStage === s.key
                    ? s.key === "failed"
                      ? "bg-destructive text-destructive-foreground font-semibold"
                      : s.key === "passed"
                        ? "bg-emerald-600 text-white font-semibold"
                        : "bg-primary text-primary-foreground font-semibold"
                    : "border border-border bg-background text-foreground hover:bg-muted/80",
                )}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleResetToReal}
              className="rounded-lg border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80"
            >
              {t("simulator.reset")}
            </button>
          </div>
        </div>
      )}

      {/* Animated timeline */}
      <div className="flex flex-col gap-3 py-1">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-4 right-4 top-4 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn(
                "h-full",
                isFailed
                  ? "bg-destructive"
                  : isPassed
                    ? "bg-emerald-500"
                    : "bg-primary",
              )}
              initial={false}
              animate={{
                width: `${(activeIndex / (STAGE_ORDER.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {STAGE_ORDER.map((stageItem, index) => {
            const isCurrent = index === activeIndex;
            const isCompleted = index < activeIndex;
            const isLastNode = index === STAGE_ORDER.length - 1;

            let NodeIcon = Truck;
            if (stageItem.key === "received") NodeIcon = CheckCircle2;
            if (stageItem.key === "in_testing") NodeIcon = FlaskConical;
            if (isLastNode) NodeIcon = isFailed ? AlertTriangle : ShieldCheck;

            const isSpinningBeaker =
              isCurrent &&
              stageItem.key === "in_testing" &&
              !prefersReducedMotion;

            return (
              <div
                key={stageItem.key}
                className="relative z-10 flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-colors duration-300",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      !isTerminal &&
                      "border-primary bg-background font-bold text-primary ring-4 ring-primary/20",
                    isCurrent &&
                      isPassed &&
                      "border-emerald-600 bg-emerald-600 text-white ring-4 ring-emerald-500/25",
                    isCurrent &&
                      isFailed &&
                      "border-destructive bg-destructive text-destructive-foreground ring-4 ring-destructive/25",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-card text-muted-foreground",
                  )}
                >
                  {isSpinningBeaker ? (
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 1.6,
                      }}
                    >
                      <NodeIcon className="size-4" aria-hidden />
                    </motion.span>
                  ) : (
                    <NodeIcon className="size-4" aria-hidden />
                  )}
                </span>

                <span
                  className={cn(
                    "max-w-[5.5rem] text-center text-[0.68rem] leading-tight font-medium",
                    isCurrent
                      ? isFailed
                        ? "font-bold text-destructive"
                        : isPassed
                          ? "font-bold text-emerald-700 dark:text-emerald-300"
                          : "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {isLastNode
                    ? isFailed
                      ? t("stages.failed")
                      : t("stages.passed")
                    : t(stageItem.labelKey)}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className={cn(
            "rounded-xl border p-3 text-xs leading-relaxed transition-colors",
            currentStage === "dispatched" &&
              "border-blue-200 bg-blue-50/60 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-200",
            currentStage === "received" &&
              "border-indigo-200 bg-indigo-50/60 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/20 dark:text-indigo-200",
            currentStage === "in_testing" &&
              "border-amber-300 bg-amber-50/70 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/20 dark:text-amber-200",
            isPassed &&
              "border-emerald-300 bg-emerald-50/80 text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/20 dark:text-emerald-200",
            isFailed &&
              "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/15",
          )}
        >
          <div className="flex items-start gap-2">
            {isFailed ? (
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            ) : isPassed ? (
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-300"
                aria-hidden
              />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            )}
            <p>{t(`stageDescriptions.${currentStage}`)}</p>
          </div>
        </div>
      </div>

      {/* Lab + timeline info grid */}
      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Building2 className="size-3.5 text-primary" aria-hidden />
            <span>{t("widget.labHeading")}</span>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            {t("widget.labBody")}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Calendar className="size-3.5 text-primary" aria-hidden />
            <span>{t("widget.keyDates")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div>
              <span className="block text-[0.65rem] text-muted-foreground">
                {t("widget.submittedDate")}
              </span>
              <span className="font-mono text-xs font-semibold">
                {record.submittedAt.split("T")[0]}
              </span>
            </div>
            <div>
              <span className="block text-[0.65rem] text-muted-foreground">
                {t("widget.estCompletion")}
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {record.estimatedCompletionDate.split("T")[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Summary (illustrative, not an official document) */}
      {isTerminal && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4",
            isPassed
              ? "border-emerald-300 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-950/20"
              : "border-destructive/30 bg-destructive/10",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-lg p-2",
                isPassed
                  ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                  : "bg-destructive/20 text-destructive",
              )}
            >
              <FileText className="size-5" aria-hidden />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">
                {t("widget.summaryHeading")}
              </span>
              <span className="text-[0.68rem] text-muted-foreground">
                {t("widget.summaryNote")}
              </span>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleDownloadSummary}
            className="gap-1.5"
          >
            <Download className="size-3.5" aria-hidden />
            {t("widget.downloadSummary")}
          </Button>
        </div>
      )}

      {/* Document Cortex quick-link */}
      <Link
        to="/document-cortex"
        className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-muted/50"
      >
        <Beaker className="size-3.5 shrink-0" aria-hidden />
        {t("widget.viewDocumentCortex")}
      </Link>

      {/* Parameter breakdown */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("widget.parametersHeading")}
          </h4>
          {compact && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowParameters(!showParameters)}
              className="text-xs text-primary"
            >
              {showParameters
                ? t("widget.hideBreakdown")
                : t("widget.viewBreakdown")}
            </Button>
          )}
        </div>

        {showParameters && (
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-16">{t("widget.clause")}</TableHead>
                  <TableHead>{t("widget.parameter")}</TableHead>
                  <TableHead>{t("widget.requiredLimit")}</TableHead>
                  <TableHead>{t("widget.observed")}</TableHead>
                  <TableHead className="text-right">
                    {t("widget.status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.parameters.map((param) => (
                  <TableRow key={param.key} className="text-xs">
                    <TableCell className="font-mono font-semibold">
                      {param.clause ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {param.label}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {param.requiredValue ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-mono font-semibold",
                        param.status === "failed" && "text-destructive",
                        param.status === "warning" &&
                          "text-amber-700 dark:text-amber-400",
                        param.status === "passed" &&
                          "text-emerald-700 dark:text-emerald-400",
                        param.status === "in_progress" &&
                          "text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {param.observedValue ??
                        (param.status === "in_progress"
                          ? t("widget.observedInProgress")
                          : t("widget.observedPending"))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-mono text-[0.65rem] uppercase",
                          PARAMETER_BADGE_STYLES[param.status],
                        )}
                      >
                        {t(`widget.parameterStatus.${param.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
