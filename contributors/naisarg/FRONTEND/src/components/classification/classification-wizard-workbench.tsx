import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  CookingPot,
  Droplet,
  Gem,
  HardHat,
  Loader2,
  Plane,
  RefreshCw,
  ShieldCheck,
  ToyBrick,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createClassificationSession,
  submitClassificationAnswer,
  type ClassificationResult,
  type ClassificationStep,
  type ClassificationStepId,
} from "@/lib/mock-classification";
import { getStandardByKey } from "@/lib/mock-standards";
import { cn } from "@/lib/utils";

type Stage = "loading" | "step" | "submitting" | "result" | "error";

const STEP_ORDER: ClassificationStepId[] = [
  "category",
  "applicantType",
  "description",
  "safetyCritical",
];

// Icon per option key, across both the category and applicant-type
// option-grids — same "one icon per option" pattern
// product-classification-wizard.tsx already uses for this exact category
// set, kept visually consistent with that lighter, separate entry point.
const OPTION_ICONS: Record<string, LucideIcon> = {
  helmets: HardHat,
  appliances: Zap,
  gold: Gem,
  water: Droplet,
  cookers: CookingPot,
  toys: ToyBrick,
  manufacturer: Building2,
  importer: Plane,
  dealer: Building2,
  individual: User,
};

/**
 * The full session/step/option-grid/free-text/result state machine —
 * ported from the teammate reference's ClassificationWizardWorkbench
 * architecture, backed by mock-classification.ts instead of a live D9
 * backend. Every matched standard traces back to the real MOCK_STANDARDS
 * catalogue; nothing here fabricates a new one.
 */
export function ClassificationWizardWorkbench() {
  const { t } = useTranslation(["classification", "admin", "registration"]);
  const prefersReducedMotion = useReducedMotion();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<ClassificationStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [selectedOption, setSelectedOption] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startSession() {
    setStage("loading");
    setError(null);
    setResult(null);
    setStepIndex(0);
    setSelectedOption("");
    setTextAnswer("");
    try {
      const state = await createClassificationSession();
      setSessionId(state.sessionId);
      setStep(state.step);
      setStage("step");
    } catch {
      setError(t("classification:errors.backendUnavailableBody"));
      setStage("error");
    }
  }

  async function handleSubmit() {
    if (!sessionId || !step) return;
    const value =
      step.inputType === "text" ? textAnswer.trim() : selectedOption;
    if (!value) return;

    setStage("submitting");
    setError(null);
    try {
      const state = await submitClassificationAnswer(sessionId, step.id, value);
      if (state.isComplete) {
        setResult(state.result);
        setStep(null);
        setStage("result");
      } else {
        setStep(state.step);
        setStepIndex((i) => i + 1);
        setSelectedOption("");
        setTextAnswer("");
        setStage("step");
      }
    } catch {
      setError(t("classification:errors.submitFailed"));
      setStage("step");
    }
  }

  const isValueSelected =
    step?.inputType === "text"
      ? textAnswer.trim().length > 0
      : Boolean(selectedOption);

  function optionLabel(step: ClassificationStep, key: string): string {
    if (step.id === "category") return t(`admin:topics.${key}`);
    if (step.id === "applicantType")
      return t(`registration:applicant.types.${key}`);
    return t(`classification:steps.safetyCritical.${key}`);
  }

  return (
    <div className="flex flex-col gap-6">
      {stage === "loading" && (
        <div className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
          <BrandMark className="size-8 animate-pulse" aria-hidden />
          <p className="text-sm text-muted-foreground">
            {t("classification:loading")}
          </p>
        </div>
      )}

      {stage === "error" && (
        <div className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertTriangle className="size-6 text-destructive" aria-hidden />
          <h2 className="text-lg font-semibold text-foreground">
            {t("classification:errors.backendUnavailableHeading")}
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
          <Button type="button" onClick={startSession}>
            {t("classification:errors.retry")}
          </Button>
        </div>
      )}

      {(stage === "step" || stage === "submitting") && step && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs font-semibold text-primary uppercase">
              {t("classification:stepOf", {
                current: stepIndex + 1,
                total: STEP_ORDER.length,
              })}
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{
                  width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%`,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground">
                {t(`classification:steps.${step.id}.question`)}
              </h2>
              {step.id === "description" && (
                <p className="-mt-3 text-xs text-muted-foreground">
                  {t("classification:steps.description.helpText")}
                </p>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                  <AlertTriangle className="size-4 shrink-0" aria-hidden />
                  {error}
                </div>
              )}

              {step.inputType === "options" && step.optionKeys && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {step.optionKeys.map((key) => {
                    const Icon = OPTION_ICONS[key];
                    const isSelected = selectedOption === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedOption(key)}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-xl border p-4 text-left transition-all active:scale-[0.98]",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/30 hover:bg-muted/60",
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          {Icon && (
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                isSelected
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                              aria-hidden
                            />
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {optionLabel(step, key)}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30 bg-background",
                          )}
                        >
                          {isSelected && (
                            <Check className="size-3" aria-hidden />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step.inputType === "text" && (
                <Textarea
                  rows={4}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder={t(
                    "classification:steps.description.placeholder",
                  )}
                />
              )}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span />
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isValueSelected || stage === "submitting"}
                  className="gap-2"
                >
                  {stage === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      {t("classification:submitting")}
                    </>
                  ) : (
                    <>
                      {t("classification:continue")}
                      <ArrowRight className="size-4" aria-hidden />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {stage === "result" && result && (
        <ClassificationResultCard result={result} onRestart={startSession} />
      )}
    </div>
  );
}

const RISK_STYLES: Record<ClassificationResult["riskTier"], string> = {
  standard: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  safety_critical: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const RISK_ICONS: Record<ClassificationResult["riskTier"], LucideIcon> = {
  standard: CheckCircle2,
  safety_critical: AlertTriangle,
};

function ClassificationResultCard({
  result,
  onRestart,
}: {
  result: ClassificationResult;
  onRestart: () => void;
}) {
  const { t } = useTranslation(["classification", "admin", "registration"]);
  const standard = getStandardByKey(result.standardKey);
  const RiskIcon = RISK_ICONS[result.riskTier];
  const isSafetyCritical = result.riskTier === "safety_critical";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-semibold text-primary uppercase">
              {t("classification:result.heading")}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {standard?.standardNumber ?? result.standardNumber}
            </h2>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase",
              RISK_STYLES[result.riskTier],
            )}
          >
            <RiskIcon className="size-3.5" aria-hidden />
            {t(`classification:result.riskTier.${result.riskTier}`)}
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">
              {t("classification:result.categoryLabel")}
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {t(`admin:topics.${result.categoryKey}`)}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">
              {t("classification:result.applicantTypeLabel")}
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {t(`registration:applicant.types.${result.applicantType}`)}
            </dd>
          </div>
          <div className="col-span-full flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">
              {t("classification:result.descriptionLabel")}
            </dt>
            <dd className="text-sm text-foreground">
              {result.productDescription}
            </dd>
          </div>
        </dl>

        {isSafetyCritical && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{t("classification:result.safetyCriticalNote")}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {standard && (
            <Link
              to={`/standards/${standard.key}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              {t("classification:result.viewStandard")}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
          {standard && (
            <Link
              to={`/standards/${standard.key}`}
              search={{ tab: "complianceGaps" }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t("classification:result.checkComplianceGaps")}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
          {standard && isSafetyCritical && (
            <Link
              to={`/standards/${standard.key}`}
              search={{ tab: "readiness" }}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
            >
              <ShieldCheck className="size-4" aria-hidden />
              {t("classification:result.reviewTestingRequirements")}
            </Link>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onRestart}
        className="w-fit gap-2"
      >
        <RefreshCw className="size-4" aria-hidden />
        {t("classification:restart")}
      </Button>
    </motion.div>
  );
}
