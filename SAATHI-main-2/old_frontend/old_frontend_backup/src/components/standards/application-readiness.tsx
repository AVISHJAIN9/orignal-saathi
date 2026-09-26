import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  CircleHelp,
  FileText,
  FlaskConical,
  Gauge,
  ListChecks,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { BisSeal } from "@/components/bis-marks";
import { BrandMark } from "@/components/brand-mark";
import { GapStatusBadge } from "@/components/standards/gap-status-badge";
import { Progress } from "@/components/ui/progress";
import {
  runReadinessCheck,
  type ReadinessReport,
  type ReadinessStatus,
} from "@/lib/mock-readiness";
import type { RequirementGap } from "@/lib/mock-compliance-gaps";
import { cn } from "@/lib/utils";

type Stage = "idle" | "loading" | "result" | "error";

// Only the three verdicts ReadinessResult itself ever renders —
// "insufficient_evidence" gets its own dedicated, honestly-worded empty
// state (InsufficientEvidenceResult) rather than a badge color, since it
// is not a positive or negative determination at all.
type ResolvedReadinessStatus = Exclude<
  ReadinessStatus,
  "insufficient_evidence"
>;

const READINESS_STATUS_ICONS: Record<
  ResolvedReadinessStatus,
  typeof CheckCircle2
> = {
  ready: CheckCircle2,
  ready_with_non_blocking: AlertTriangle,
  not_ready: ShieldAlert,
};

const READINESS_CONTAINER_STYLES: Record<ResolvedReadinessStatus, string> = {
  ready:
    "border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
  ready_with_non_blocking:
    "border-amber-300 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
  not_ready:
    "border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
};

const READINESS_ICON_STYLES: Record<ResolvedReadinessStatus, string> = {
  ready: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  ready_with_non_blocking: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  not_ready: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const READINESS_BADGE_STYLES: Record<ResolvedReadinessStatus, string> = {
  ready: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  ready_with_non_blocking: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  not_ready: "bg-red-500/15 text-red-700 dark:text-red-400",
};

interface ApplicationReadinessProps {
  standardNumber: string;
  onOpenComplianceGaps?: () => void;
}

/**
 * The Readiness tab: idle (pick documents via the shared DocumentDropzone,
 * same as ComplianceGapAnalyzer) -> loading -> result -> (reset to idle),
 * with a real error branch.
 *
 * This is purely an aggregation layer over `runReadinessCheck`
 * (mock-readiness.ts), which itself only re-derives a verdict from C3's
 * `runGapAnalysis` output — this component never computes pass/fail/score
 * logic itself, it only renders whatever mock-readiness.ts already
 * decided. The one rule that matters most: the status badge (READY /
 * READY WITH NON-BLOCKING ITEMS / NOT READY) is always rendered ABOVE and
 * larger than the numeric score, so a high score can never visually read
 * as "fine" while a NOT READY verdict sits above it.
 */
export function ApplicationReadiness({
  standardNumber,
  onOpenComplianceGaps,
}: ApplicationReadinessProps) {
  const { t } = useTranslation("standards");
  const [stage, setStage] = useState<Stage>("idle");
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleFilesAdded(files: FileList) {
    setDocumentNames((prev) => [
      ...prev,
      ...Array.from(files).map((file) => file.name),
    ]);
  }

  async function runCheck() {
    setStage("loading");
    try {
      const result = await runReadinessCheck(standardNumber, documentNames);
      setReport(result);
      setStage("result");
    } catch {
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setReport(null);
    setDocumentNames([]);
  }

  // Distinct from `reset`: keeps whatever documents are already queued
  // (and the existing report, for when the user comes back) and just
  // brings the shared DocumentDropzone back into view so the user can add
  // the documents "Blocking Issues" says are missing, rather than
  // building a separate missing-documents widget.
  function viewRequiredDocuments() {
    setStage("idle");
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
                <Gauge className="size-5" aria-hidden />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("detail.readiness.idleBody", { standard: standardNumber })}
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
              onClick={runCheck}
              className="elevation-1 elevation-lift inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.readiness.checkButton")}
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
              {t("detail.readiness.checking")}
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
              {t("detail.readiness.error.heading")}
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("detail.readiness.error.body")}
            </p>
            <button
              type="button"
              onClick={runCheck}
              className="elevation-1 elevation-lift mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.readiness.error.retry")}
            </button>
          </motion.div>
        )}

        {stage === "result" && report && (
          <motion.div
            key="result"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex flex-col gap-4"
          >
            {report.status === "insufficient_evidence" ? (
              <InsufficientEvidenceResult standardNumber={standardNumber} />
            ) : (
              <ReadinessResult
                report={report}
                onOpenComplianceGaps={onOpenComplianceGaps}
                onViewRequiredDocuments={viewRequiredDocuments}
              />
            )}

            <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              <BrandMark size="sm" />
              <span className="pt-0.5">{t("detail.readiness.demoNotice")}</span>
            </div>

            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("detail.readiness.tryAgain")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsufficientEvidenceResult({
  standardNumber,
}: {
  standardNumber: string;
}) {
  const { t } = useTranslation("standards");
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <CircleHelp className="size-5" aria-hidden />
      </div>
      <span className="w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase">
        {t("detail.readiness.insufficientEvidence.badge")}
      </span>
      <h2 className="text-lg font-semibold text-foreground">
        {t("detail.readiness.insufficientEvidence.heading")}
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("detail.readiness.insufficientEvidence.body", {
          standard: standardNumber,
        })}
      </p>
    </div>
  );
}

function CategoryStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ListChecks;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ReadinessResult({
  report,
  onOpenComplianceGaps,
  onViewRequiredDocuments,
}: {
  report: ReadinessReport;
  onOpenComplianceGaps?: () => void;
  onViewRequiredDocuments: () => void;
}) {
  const { t } = useTranslation("standards");
  const status = report.status as ResolvedReadinessStatus;
  const Icon = READINESS_STATUS_ICONS[status];

  const categories = useMemo(
    () => computeCategories(report.requirements),
    [report.requirements],
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "elevation-1 flex flex-col gap-4 rounded-2xl border p-6",
          READINESS_CONTAINER_STYLES[status],
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full",
              READINESS_ICON_STYLES[status],
            )}
          >
            <Icon className="size-6" aria-hidden />
          </div>
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                READINESS_BADGE_STYLES[status],
              )}
            >
              {t(`detail.readiness.status.${status}`)}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {t(`detail.readiness.statusHeading.${status}`)}
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              {t(`detail.readiness.statusDescription.${status}`)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              {t("detail.readiness.scoreLabel")}
            </span>
            <span className="font-mono font-semibold text-foreground">
              {report.readinessScore}%
            </span>
          </div>
          <Progress value={report.readinessScore} />
          <span className="text-xs text-muted-foreground">
            {t("detail.readiness.scoreCaption", {
              completed: report.completed,
              total: report.totalRequirements,
            })}
          </span>
        </div>
      </div>

      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">
          {t("detail.readiness.categories.heading")}
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CategoryStat
            icon={ListChecks}
            label={t("detail.readiness.categories.mandatory")}
            value={`${categories.mandatory.done}/${categories.mandatory.total}`}
          />
          <CategoryStat
            icon={FileText}
            label={t("detail.readiness.categories.documents")}
            value={`${categories.documents.done}/${categories.documents.total}`}
          />
          <CategoryStat
            icon={FlaskConical}
            label={t("detail.readiness.categories.testing")}
            value={`${categories.testing.done}/${categories.testing.total}`}
          />
          <CategoryStat
            icon={BadgeCheck}
            label={t("detail.readiness.categories.certification")}
            value={
              categories.certification.total === 0
                ? "—"
                : categories.certification.done ===
                    categories.certification.total
                  ? t("detail.readiness.categories.done")
                  : t("detail.readiness.categories.notDone")
            }
          />
        </div>
      </div>

      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">
          {t("detail.readiness.blockingIssues.heading")}
        </h3>
        {report.blockers.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {report.blockers.map((blocker) => (
              <BlockerCard key={blocker.key} blocker={blocker} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("detail.readiness.blockingIssues.empty")}
          </p>
        )}
      </div>

      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">
          {t("detail.readiness.nextActions.heading")}
        </h3>
        {report.nextActions.length > 0 ? (
          <ol className="flex flex-col gap-2">
            {report.nextActions.map((action, index) => (
              <li
                key={`${index}-${action}`}
                className="flex items-start gap-2.5 text-sm text-foreground"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("detail.readiness.nextActions.empty")}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {onOpenComplianceGaps && (
          <button
            type="button"
            onClick={onOpenComplianceGaps}
            className="elevation-1 elevation-lift inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {t("detail.readiness.viewComplianceGaps")}
          </button>
        )}
        <button
          type="button"
          onClick={onViewRequiredDocuments}
          className="elevation-1 elevation-lift inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t("detail.readiness.viewRequiredDocuments")}
        </button>
      </div>
    </div>
  );
}

function BlockerCard({ blocker }: { blocker: RequirementGap }) {
  const { t } = useTranslation("standards");
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <GapStatusBadge status={blocker.status} />
        <span className="text-sm font-medium text-foreground">
          {blocker.requirement}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">
        {blocker.status === "missing_evidence"
          ? t("detail.readiness.missingEvidencePrefix", {
              reason: blocker.reason,
            })
          : blocker.reason}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {blocker.recommendedAction}
      </p>
    </li>
  );
}

interface CategoryCount {
  done: number;
  total: number;
}

function computeCategories(requirements: RequirementGap[]): {
  mandatory: CategoryCount;
  documents: CategoryCount;
  testing: CategoryCount;
  certification: CategoryCount;
} {
  function count(predicate: (r: RequirementGap) => boolean): CategoryCount {
    const matching = requirements.filter(predicate);
    return {
      done: matching.filter((r) => r.status === "pass").length,
      total: matching.length,
    };
  }

  return {
    mandatory: count((r) => r.mandatory),
    documents: count((r) => r.source.type === "documentation_requirement"),
    testing: count((r) => r.source.type === "testing_requirement"),
    certification: count((r) => r.source.type === "qco_requirement"),
  };
}
