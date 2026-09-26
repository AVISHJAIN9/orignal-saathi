import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Circle,
  CircleHelp,
  ShieldQuestion,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BisSeal } from "@/components/bis-marks";
import { checkQcoApplicability, type QcoRecord } from "@/lib/mock-qco";

type Stage = "idle" | "loading" | "result" | "error";

interface QcoApplicabilityCheckProps {
  standardNumber: string;
}

/**
 * The QCO tab's check flow: idle -> loading -> result -> (reset to idle),
 * with a real error branch alongside it. Structurally the same
 * idle/analyzing/result/demo-notice shape as ConformityWorkbench, since
 * that's the one other place in the app doing a client-side "check against
 * a small mock dataset" flow — reused rather than re-invented.
 *
 * The result has three outcomes, deliberately built so none can be
 * mistaken for another: a distinct icon shape per outcome (a filled check,
 * an open circle, a question mark — the same ✓ / ○ / ? distinction the
 * spec itself uses), a distinct color per outcome (emerald / amber /
 * slate), and wording that never lets "unable to determine" read as a
 * confident "not applicable".
 */
export function QcoApplicabilityCheck({
  standardNumber,
}: QcoApplicabilityCheckProps) {
  const { t } = useTranslation("standards");
  const [stage, setStage] = useState<Stage>("idle");
  const [outcome, setOutcome] = useState<QcoRecord | null>(null);
  const prefersReducedMotion = useReducedMotion();

  async function runCheck() {
    setStage("loading");
    try {
      const result = await checkQcoApplicability(standardNumber);
      setOutcome(result);
      setStage("result");
    } catch {
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setOutcome(null);
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
            className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldQuestion className="size-6" aria-hidden />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("detail.qco.idleBody", { standard: standardNumber })}
            </p>
            <button
              type="button"
              onClick={runCheck}
              className="elevation-1 elevation-lift mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.qco.checkButton")}
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
              {t("detail.qco.checking")}
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
              {t("detail.qco.error.heading")}
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("detail.qco.error.body")}
            </p>
            <button
              type="button"
              onClick={runCheck}
              className="elevation-1 elevation-lift mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.qco.error.retry")}
            </button>
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex flex-col gap-4"
          >
            {outcome === null ? (
              <UnableToDetermineResult standardNumber={standardNumber} />
            ) : outcome.status === "applicable" ? (
              <ApplicableResult
                record={outcome}
                standardNumber={standardNumber}
              />
            ) : (
              <NotApplicableResult record={outcome} />
            )}


            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("detail.qco.tryAgain")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SourceLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="elevation-1 elevation-lift flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-shadow"
    >
      <span className="font-medium text-foreground">{label}</span>
      <ArrowUpRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </a>
  );
}

function ApplicableResult({
  record,
  standardNumber,
}: {
  record: QcoRecord;
  standardNumber: string;
}) {
  const { t, i18n } = useTranslation("standards");
  const effectiveDate = record.effectiveDate
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "long" }).format(
        new Date(record.effectiveDate),
      )
    : null;

  return (
    <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <BadgeCheck className="size-5" aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 uppercase dark:text-emerald-400">
            {t("detail.qco.applicable.badge")}
          </span>
          <h2 className="text-lg font-semibold text-foreground">
            {record.title}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-emerald-500/20 pt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
          {t("detail.qco.applicable.whyHeading")}
        </h3>
        <p className="text-sm leading-relaxed text-foreground">
          {t("detail.qco.applicable.why", {
            standard: standardNumber,
            product: record.product,
          })}
        </p>
      </div>

      {effectiveDate && (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            {t("detail.qco.applicable.effectiveDateLabel")}
          </span>
          <span className="text-sm font-medium text-foreground">
            {effectiveDate}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">
          {t("detail.qco.applicable.scopeLabel")}
        </span>
        <span className="text-sm text-foreground">{record.scope}</span>
      </div>

      {record.requirements.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">
            {t("detail.qco.applicable.requirementsLabel")}
          </span>
          <ul className="flex flex-col gap-1.5">
            {record.requirements.map((requirement) => (
              <li
                key={requirement}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span
                  aria-hidden
                  className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-600"
                />
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.exemptions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">
            {t("detail.qco.applicable.exemptionsLabel")}
          </span>
          <ul className="flex flex-col gap-1.5">
            {record.exemptions.map((exemption) => (
              <li key={exemption} className="text-sm text-muted-foreground">
                {exemption}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SourceLink
        url={record.sourceUrl}
        label={t(`detail.qco.sourceType.${record.sourceType}`)}
      />
    </div>
  );
}

function NotApplicableResult({ record }: { record: QcoRecord }) {
  const { t } = useTranslation("standards");
  return (
    <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Circle className="size-5" aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 uppercase dark:text-amber-400">
            {t("detail.qco.notApplicable.badge")}
          </span>
          <h2 className="text-lg font-semibold text-foreground">
            {t("detail.qco.notApplicable.heading")}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-amber-500/20 pt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
          {t("detail.qco.notApplicable.whyHeading")}
        </h3>
        <p className="text-sm leading-relaxed text-foreground">
          {record.scope}
        </p>
      </div>

      <SourceLink
        url={record.sourceUrl}
        label={t(`detail.qco.sourceType.${record.sourceType}`)}
      />
    </div>
  );
}

function UnableToDetermineResult({
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
        {t("detail.qco.unableToDetermine.badge")}
      </span>
      <h2 className="text-lg font-semibold text-foreground">
        {t("detail.qco.unableToDetermine.heading")}
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("detail.qco.unableToDetermine.body", { standard: standardNumber })}
      </p>
      <Link
        to="/chat"
        className="text-sm font-medium text-primary underline underline-offset-4"
      >
        {t("detail.qco.unableToDetermine.cta")}
      </Link>
    </div>
  );
}
