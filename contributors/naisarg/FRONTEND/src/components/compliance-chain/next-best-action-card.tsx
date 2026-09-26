import { useTranslation } from "react-i18next";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { NextBestActionInfo, ComplianceChainStep } from "@/lib/compliance-chain-api";

interface NextBestActionCardProps {
  nextBestAction?: NextBestActionInfo;
  steps: ComplianceChainStep[];
}

export function NextBestActionCard({
  nextBestAction,
  steps,
}: NextBestActionCardProps) {
  const { t } = useTranslation(["chain"]);

  // Fallback to active blocked or action_required step if nextBestAction is not provided by backend
  const activeStep = steps.find(
    (s) => s.state === "ACTION_REQUIRED" || s.state === "BLOCKED"
  ) || steps.find((s) => s.state === "NOT_STARTED");

  const title = nextBestAction?.title || activeStep?.title || "Complete mandatory requirements";
  const description =
    nextBestAction?.description ||
    activeStep?.subtitle ||
    "Execute the next required compliance step to keep your BIS certification process moving forward.";
  const fallbackLink =
    activeStep?.id === "documents" &&
    (activeStep?.state === "ACTION_REQUIRED" || activeStep?.state === "BLOCKED")
      ? "/document-corrections"
      : "/registration/new";
  const targetLink = nextBestAction?.deepLink || activeStep?.deepLink || fallbackLink;
  const actionLabel = nextBestAction?.actionLabel || activeStep?.actionLabel || t("chain:nextBestAction.takeAction");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-5 shadow-lg backdrop-blur-xl sm:p-6">
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl" />
      
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-2xs font-bold tracking-widest text-primary uppercase">
              {t("chain:nextBestAction.title")}
            </span>
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              {title}
            </h3>
            <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <Link to={targetLink}>
            <Button size="lg" className="w-full gap-2 rounded-xl px-5 font-semibold shadow-md md:w-auto">
              {actionLabel}
              <ArrowUpRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
