import { AlertTriangle, ClipboardList, FileQuestion } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { BisSeal } from "@/components/bis-marks";
import { BrandMark } from "@/components/brand-mark";
import {
  GAP_STATUS_STYLES,
  GapStatusBadge,
} from "@/components/standards/gap-status-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  runGapAnalysis,
  type ComplianceGapReport,
  type GapAnalysisOutcome,
  type GapStatus,
  type RequirementGap,
} from "@/lib/mock-compliance-gaps";
import { cn } from "@/lib/utils";

type Stage = "idle" | "loading" | "result" | "error";

const GAP_STATUS_PRIORITY: Record<GapStatus, number> = {
  fail: 0,
  missing_evidence: 1,
  warning: 2,
  pass: 3,
};

function sortRequirements(requirements: RequirementGap[]): RequirementGap[] {
  return [...requirements].sort(
    (a, b) => GAP_STATUS_PRIORITY[a.status] - GAP_STATUS_PRIORITY[b.status],
  );
}

// Recommended Actions ordering: mandatory failures first, then mandatory
// missing evidence, then warnings, then everything else that still needs
// action (minor/documentation gaps) — passes never appear here at all.
function actionPriority(requirement: RequirementGap): number {
  if (requirement.status === "fail" && requirement.mandatory) return 0;
  if (requirement.status === "missing_evidence" && requirement.mandatory)
    return 1;
  if (requirement.status === "warning") return 2;
  return 3;
}

function sortRecommendedActions(
  requirements: RequirementGap[],
): RequirementGap[] {
  return requirements
    .filter((r) => r.status !== "pass")
    .sort((a, b) => actionPriority(a) - actionPriority(b));
}

interface ComplianceGapAnalyzerProps {
  standardNumber: string;
}

/**
 * The Compliance Gaps tab: idle (pick documents via the shared
 * DocumentDropzone) -> loading -> result -> (reset to idle), with a real
 * error branch — same idle/loading/result/demo-notice shape as
 * QcoApplicabilityCheck and RevisionCompare, reusing their exact BisSeal
 * loading animation.
 *
 * This is an orchestration/presentation layer over `runGapAnalysis`'s mock
 * data, not a second conformity engine: it never re-derives a status from
 * document content itself, it only renders whatever the mock module
 * already decided. See mock-compliance-gaps.ts for the four-status model
 * and why MISSING_EVIDENCE is never conflated with FAIL.
 */
export function ComplianceGapAnalyzer({
  standardNumber,
}: ComplianceGapAnalyzerProps) {
  const { t } = useTranslation("standards");
  const [stage, setStage] = useState<Stage>("idle");
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<GapAnalysisOutcome | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleFilesAdded(files: FileList) {
    setDocumentNames((prev) => [
      ...prev,
      ...Array.from(files).map((file) => file.name),
    ]);
  }

  async function runAnalysis() {
    setStage("loading");
    try {
      const result = await runGapAnalysis(standardNumber, documentNames);
      setOutcome(result);
      setStage("result");
    } catch {
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setOutcome(null);
    setDocumentNames([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-1">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ClipboardList className="size-5" aria-hidden />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("detail.complianceGaps.idleBody", {
                  standard: standardNumber,
                })}
              </p>
            </div>

            <DocumentDropzone onFilesAdded={handleFilesAdded} />

            {documentNames.length > 0 && (
              <ul className="flex flex-col gap-1">
                {documentNames.map((name, index) => (
                  <li
                    key={`${name}-${index}`}
                    className="truncate rounded-md bg-muted/40 px-3 py-1.5 font-mono text-xs text-muted-foreground"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={runAnalysis}
              className="elevation-1 elevation-lift inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.complianceGaps.analyzeButton")}
            </button>
          </motion.div>
        )}

        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center"
          >
            <div
              className="relative flex size-14 items-center justify-center"
              style={{ perspective: 200 }}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-primary/50"
                animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.3, 1.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.span
                aria-hidden
                className="relative flex items-center justify-center text-primary"
                animate={{ rotateX: [0, 32, 0], scale: [1, 0.88, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.4, 1],
                }}
              >
                <BisSeal className="size-7" aria-hidden />
              </motion.span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("detail.complianceGaps.checking")}
            </p>
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="size-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("detail.complianceGaps.error.heading")}
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("detail.complianceGaps.error.body")}
            </p>
            <button
              type="button"
              onClick={runAnalysis}
              className="elevation-1 elevation-lift mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.complianceGaps.error.retry")}
            </button>
          </motion.div>
        )}

        {stage === "result" && outcome && (
          <motion.div
            key="result"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex flex-col gap-4"
          >
            {outcome.status === "analyzed" ? (
              <AnalyzedResult report={outcome.report} />
            ) : (
              <NoRequirementsDataResult standardNumber={standardNumber} />
            )}

            <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              <BrandMark size="sm" />
              <span className="pt-0.5">
                {t("detail.complianceGaps.demoNotice")}
              </span>
            </div>

            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("detail.complianceGaps.tryAgain")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NoRequirementsDataResult({
  standardNumber,
}: {
  standardNumber: string;
}) {
  const { t } = useTranslation("standards");
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="size-5" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        {t("detail.complianceGaps.noRequirementsData.heading")}
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("detail.complianceGaps.noRequirementsData.body", {
          standard: standardNumber,
        })}
      </p>
    </div>
  );
}

function AnalyzedResult({ report }: { report: ComplianceGapReport }) {
  const { t } = useTranslation("standards");

  const counts = useMemo(() => {
    const result: Record<GapStatus, number> = {
      pass: 0,
      warning: 0,
      fail: 0,
      missing_evidence: 0,
    };
    for (const requirement of report.requirements) {
      result[requirement.status] += 1;
    }
    return result;
  }, [report.requirements]);

  const sortedRequirements = useMemo(
    () => sortRequirements(report.requirements),
    [report.requirements],
  );
  const recommendedActions = useMemo(
    () => sortRecommendedActions(report.requirements),
    [report.requirements],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase">
            {t(`detail.complianceGaps.qcoStatus.${report.qcoStatus}`)}
          </span>
          <h2 className="text-lg font-semibold text-foreground">
            {report.product}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            {report.standardNumber}
          </p>
        </div>

        {report.hasCriticalFailure && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{t("detail.complianceGaps.summary.criticalBanner")}</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {t("detail.complianceGaps.summary.readinessLabel")}
            </span>
            <span className="font-mono font-semibold text-foreground">
              {report.readinessPercent}%
            </span>
          </div>
          <Progress value={report.readinessPercent} />
        </div>

        <div className="flex flex-wrap gap-2">
          <SummaryChip
            className={GAP_STATUS_STYLES.pass}
            label={t("detail.complianceGaps.summary.counts.pass", {
              count: counts.pass,
            })}
          />
          <SummaryChip
            className={GAP_STATUS_STYLES.warning}
            label={t("detail.complianceGaps.summary.counts.warning", {
              count: counts.warning,
            })}
          />
          <SummaryChip
            className={GAP_STATUS_STYLES.fail}
            label={t("detail.complianceGaps.summary.counts.fail", {
              count: counts.fail,
            })}
          />
          <SummaryChip
            className={GAP_STATUS_STYLES.missing_evidence}
            label={t("detail.complianceGaps.summary.counts.missingEvidence", {
              count: counts.missing_evidence,
            })}
          />
        </div>
      </div>

      <Accordion type="multiple" className="flex flex-col gap-2">
        {sortedRequirements.map((requirement) => (
          <AccordionItem
            key={requirement.key}
            value={requirement.key}
            className="rounded-xl border border-border bg-background px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 flex-wrap items-center gap-2.5 pr-2 text-left">
                <GapStatusBadge status={requirement.status} />
                <span className="text-sm font-medium text-foreground">
                  {requirement.requirement}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <RequirementCardBody requirement={requirement} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">
          {t("detail.complianceGaps.recommendedActions.heading")}
        </h3>
        {recommendedActions.length > 0 ? (
          <ol className="flex flex-col gap-2">
            {recommendedActions.map((requirement, index) => (
              <li
                key={requirement.key}
                className="flex items-start gap-2.5 text-sm text-foreground"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="leading-relaxed">
                  {requirement.recommendedAction}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("detail.complianceGaps.recommendedActions.empty")}
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryChip({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

function RequirementCardBody({ requirement }: { requirement: RequirementGap }) {
  const { t } = useTranslation("standards");

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs text-muted-foreground">
        {t(`detail.complianceGaps.sourceType.${requirement.source.type}`)}
        {" · "}
        {requirement.source.standardNumber}
        {requirement.source.clause ? ` · ${requirement.source.clause}` : ""}
        {requirement.source.qcoId ? ` · ${requirement.source.qcoId}` : ""}
      </p>

      {(requirement.observedValue || requirement.requiredValue) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/30 p-3">
            <span className="text-xs text-muted-foreground">
              {t("detail.complianceGaps.card.observedLabel")}
            </span>
            <span className="font-mono text-sm text-foreground">
              {requirement.observedValue ?? "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/30 p-3">
            <span className="text-xs text-muted-foreground">
              {t("detail.complianceGaps.card.requiredLabel")}
            </span>
            <span className="font-mono text-sm text-foreground">
              {requirement.requiredValue ?? "—"}
            </span>
          </div>
        </div>
      )}

      {requirement.evidence && (
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3">
          <span className="text-xs text-muted-foreground">
            {t("detail.complianceGaps.card.evidenceLabel", {
              document: requirement.evidence.documentName,
              page: requirement.evidence.page,
            })}
          </span>
          <span className="text-sm text-foreground italic">
            “{requirement.evidence.snippet}”
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">
          {requirement.status === "missing_evidence"
            ? t("detail.complianceGaps.card.missingEvidenceLabel")
            : t("detail.complianceGaps.card.reasonLabel")}
        </h4>
        <p className="text-sm leading-relaxed text-foreground">
          {requirement.reason}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">
          {t("detail.complianceGaps.card.recommendedActionLabel")}
        </h4>
        <p className="text-sm leading-relaxed text-foreground">
          {requirement.recommendedAction}
        </p>
      </div>
    </div>
  );
}
