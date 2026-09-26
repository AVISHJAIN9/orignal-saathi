import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  MinusCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { ComplianceChainStep, ChainStepState } from "@/lib/compliance-chain-api";

interface ComplianceChainStepCardProps {
  step: ComplianceChainStep;
  index: number;
  isLast: boolean;
}

export function ComplianceChainStepCard({
  step,
  isLast,
}: ComplianceChainStepCardProps) {
  const { t } = useTranslation(["chain"]);

  const getStateVisuals = (state: ChainStepState) => {
    switch (state) {
      case "COMPLETED":
        return {
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
          bgColor: "bg-emerald-500/10 border-emerald-500/30",
          badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
          label: t("chain:states.completed"),
          symbol: "✓",
        };
      case "ACTION_REQUIRED":
        return {
          icon: AlertTriangle,
          iconColor: "text-amber-500",
          bgColor: "bg-amber-500/10 border-amber-500/30",
          badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
          label: t("chain:states.actionRequired"),
          symbol: "⚠",
        };
      case "BLOCKED":
        return {
          icon: XCircle,
          iconColor: "text-red-500",
          bgColor: "bg-red-500/10 border-red-500/30",
          badgeClass: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
          label: t("chain:states.blocked"),
          symbol: "❌",
        };
      case "NOT_STARTED":
        return {
          icon: HelpCircle,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted border-border",
          badgeClass: "bg-muted text-foreground border-border",
          label: t("chain:states.notStarted"),
          symbol: "?",
        };
      case "NOT_APPLICABLE":
        return {
          icon: MinusCircle,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted border-border",
          badgeClass: "bg-muted text-foreground border-border",
          label: t("chain:states.notApplicable"),
          symbol: "—",
        };
      default:
        return {
          icon: HelpCircle,
          iconColor: "text-purple-500",
          bgColor: "bg-purple-500/10 border-purple-500/30",
          badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
          label: t("chain:states.unavailable"),
          symbol: "?",
        };
    }
  };

  const visuals = getStateVisuals(step.state);
  const IconComponent = visuals.icon;
  const effectiveDeepLink =
    step.deepLink ||
    (step.id === "documents" && (step.state === "ACTION_REQUIRED" || step.state === "BLOCKED")
      ? "/document-corrections"
      : step.id === "appeal" || step.id === "dispute" || step.id === "appeals"
        ? "/appeals"
        : step.id === "certification" || step.id === "certificate" || step.id === "certificates"
          ? "/certificates"
          : undefined);

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Vertical Timeline connector line */}
      {!isLast && (
        <div className="absolute left-5 top-10 -bottom-6 w-0.5 bg-gradient-to-b from-border via-border/80 to-transparent sm:left-6" />
      )}

      {/* State Icon / Badge Node */}
      <div
        className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-2xl border ${visuals.bgColor} shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-105 sm:size-12`}
      >
        <IconComponent className={`size-5 sm:size-6 ${visuals.iconColor}`} />
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-6">
        <div className="rounded-2xl border border-border/50 bg-card/90 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-primary/30 hover:shadow-md dark:border-border/50 dark:bg-card/75 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold text-foreground">
                {step.title}
              </h4>
              <Badge className={`px-2.5 py-0.5 text-2xs font-semibold ${visuals.badgeClass}`}>
                {visuals.symbol} {visuals.label}
              </Badge>
            </div>

            {effectiveDeepLink && (
              <Link to={effectiveDeepLink} className="self-start sm:self-auto">
                <Button variant="ghost" size="sm" className="h-8 gap-1 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10">
                  {step.actionLabel || t("chain:chainJourney.viewStep")}
                  <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            )}
          </div>

          {step.subtitle && (
            <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
              {step.subtitle}
            </p>
          )}

          {/* Document Summary Section */}
          {step.documents && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-muted/40 p-2.5 dark:border-border/50 dark:bg-muted/20">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <FileCheck2 className="size-4 text-primary" />
                {t("chain:chainJourney.documentsCount", {
                  available: step.documents.availableCount ?? 0,
                  required: step.documents.requiredCount ?? 0,
                  missing: step.documents.missingCount ?? 0,
                })}
              </div>

              {step.documents.cortexVerified && (
                <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-2xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  {t("chain:chainJourney.evidenceVerified")}
                </Badge>
              )}
            </div>
          )}

          {/* Official Source Link (Direct from backend, never constructed) */}
          {step.source && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-mono text-2xs font-medium uppercase">
                {t("chain:chainJourney.sourceLabel")}
              </span>
              {step.source.url ? (
                <a
                  href={step.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  <span>{step.source.title}</span>
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <span>{step.source.title}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
