import { useTranslation } from "react-i18next";
import { CheckCircle2, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { CurrentPositionInfo, ComplianceChainStep } from "@/lib/compliance-chain-api";

interface CurrentPositionCardProps {
  currentPosition?: CurrentPositionInfo;
  steps: ComplianceChainStep[];
}

export function CurrentPositionCard({
  currentPosition,
  steps,
}: CurrentPositionCardProps) {
  const { t } = useTranslation(["chain"]);

  // Calculate completed steps list from backend position or steps
  const completedStepTitles =
    currentPosition?.completedSteps ||
    steps.filter((s) => s.state === "COMPLETED").map((s) => s.title);

  const nextActionText =
    currentPosition?.nextRequiredAction ||
    steps.find((s) => s.state === "ACTION_REQUIRED" || s.state === "BLOCKED")?.title ||
    "Proceed with application submission";

  // Deep link for the first uncompleted or active step
  const activeStep = steps.find(
    (s) => s.state === "ACTION_REQUIRED" || s.state === "BLOCKED" || s.state === "NOT_STARTED"
  );
  const targetLink = activeStep?.deepLink || "/registration/new";

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm backdrop-blur-xl dark:border-primary/30 sm:p-6">
      <div className="flex items-center gap-2.5 text-primary">
        <Compass className="size-5 shrink-0" />
        <h3 className="font-mono text-xs font-bold tracking-widest uppercase">
          {t("chain:currentPosition.title")}
        </h3>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card/70 p-4 dark:border-border/50 dark:bg-card/50">
          <span className="text-xs font-semibold text-muted-foreground">
            {t("chain:currentPosition.completedHeading")}
          </span>
          {completedStepTitles.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {completedStepTitles.map((title, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                >
                  <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                  {title}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              {t("chain:currentPosition.noCompletedYet")}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 dark:border-amber-500/20">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {t("chain:currentPosition.nextRequiredHeading")}
            </span>
            <p className="text-sm font-bold text-foreground">
              {nextActionText}
            </p>
          </div>

          <Link to={targetLink} className="self-start">
            <Button size="sm" className="gap-1.5 rounded-lg text-xs font-semibold shadow-sm">
              {t("chain:currentPosition.continueAction")}
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
