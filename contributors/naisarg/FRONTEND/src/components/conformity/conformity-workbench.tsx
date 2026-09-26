import { AlertTriangle, BadgeCheck, CircleAlert } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { BisSeal } from "@/components/bis-marks";
import {
  pickConformityResult,
  type ConformityResult,
} from "@/lib/mock-conformity";
import { cn } from "@/lib/utils";

type Stage = "idle" | "analyzing" | "result";

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const ANALYZE_MS = 1600;

/**
 * Industry-persona workbench: drop a spec file, see it checked against
 * active BIS standards. Structurally borrowed from a teammate-shared design
 * reference (an "Initialize Specification Upload" + "Compliance Gaps"
 * two-pane layout) but rebuilt on SAATHI's own component/token system rather
 * than imported wholesale, and — importantly — reworked to stay honest about
 * what it actually does.
 *
 * There is no real spec-parsing backend (see PRODUCT.md: the retrieval/LLM
 * pipeline is a separate workstream). Rather than pretend to analyze
 * whatever file someone drops, the result shown is explicitly labelled a
 * demo outcome (same honesty the landing page already applies to its example
 * Q&A), and it's picked deterministically from the filename — not random —
 * so testing the same file twice gives the same answer.
 */
export function ConformityWorkbench() {
  const { t } = useTranslation("conformity");
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<ConformityResult | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function runAnalysis(name: string) {
    setFileName(name);
    setStage("analyzing");
    window.setTimeout(
      () => {
        setResult(pickConformityResult(name));
        setStage("result");
      },
      prefersReducedMotion ? 200 : ANALYZE_MS,
    );
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    runAnalysis(file.name);
  }

  function reset() {
    setStage("idle");
    setResult(null);
    setFileName("");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Center: upload / analyzing / result */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DocumentDropzone
                onFilesAdded={handleFiles}
                multiple={false}
                accept={ACCEPTED_EXTENSIONS}
                title={t("dropzoneHeading")}
                hint={t("dropzoneSubheading")}
                className="elevation-1 gap-3 rounded-2xl bg-card p-12 [&>svg]:size-8 [&>svg]:text-primary"
              >
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("fileTypes")}
                </p>
                <p className="max-w-xs text-2xs text-muted-foreground/70">
                  {t("demoHint")}
                </p>
              </DocumentDropzone>
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center"
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
              <p className="max-w-xs text-sm font-medium text-foreground">
                {fileName}
              </p>
              <p className="text-sm text-muted-foreground">{t("analyzing")}</p>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex flex-col gap-4"
            >
              <div
                className={cn(
                  "elevation-1 relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-10 text-center",
                  result.passed
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                    : "border-border bg-card",
                )}
              >
                {result.passed ? (
                  <>
                    <motion.div
                      aria-hidden
                      initial={{ opacity: 0.5, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 1.6 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15,
                        ease: "easeOut",
                      }}
                      className="absolute flex size-14 items-center justify-center rounded-full border-2 border-emerald-500"
                    />
                    <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="size-7" aria-hidden />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {t("resultPassedHeading")}
                    </h2>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {t("resultPassedBody", {
                        standard: result.standardNumber,
                      })}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="size-7" aria-hidden />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {t("resultFailedHeading", {
                        standard: result.standardNumber,
                      })}
                    </h2>
                  </>
                )}
                <p className="font-mono text-xs text-muted-foreground">
                  {fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("passedChecks", { count: result.passedChecksCount })}
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                className="self-start text-sm font-medium text-primary underline underline-offset-4"
              >
                {t("tryAnother")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: compliance gaps panel */}
      <div className="elevation-1 flex h-fit flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            {t("gapsPanelTitle")}
          </h2>
          {stage === "result" && result && !result.passed && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              {t("gapsFound", { count: result.gaps.length })}
            </span>
          )}
        </div>

        {(stage === "idle" || stage === "analyzing") && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <CircleAlert
              className="size-6 text-muted-foreground/50"
              aria-hidden
            />
            <p className="max-w-[16rem] text-sm text-muted-foreground">
              {t("gapsEmpty")}
            </p>
          </div>
        )}

        {stage === "result" && result?.passed && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <BadgeCheck className="size-6 text-emerald-500/70" aria-hidden />
            <p className="max-w-[16rem] text-sm text-muted-foreground">
              {t("gapsNoneOnPass")}
            </p>
          </div>
        )}

        {stage === "result" && result && !result.passed && (
          <div className="flex flex-col gap-3">
            {result.gaps.map((gap) => (
              <div
                key={gap.key}
                className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-2xs font-semibold tracking-wide uppercase",
                      gap.severity === "critical"
                        ? "bg-red-500/15 text-red-700 dark:text-red-400"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                    )}
                  >
                    {gap.severity === "critical"
                      ? t("severityCritical")
                      : t("severityMinor")}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {gap.standardNumber}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t(gap.titleKey)}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t(gap.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
