import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { complianceChainApi, type ComplianceChainResult } from "@/lib/compliance-chain-api";
import { ComplianceChainHeader } from "./compliance-chain-header";
import { CurrentPositionCard } from "./current-position-card";
import { NextBestActionCard } from "./next-best-action-card";
import { ComplianceChainStepCard } from "./compliance-chain-step-card";
import { RegulatoryOverviewCard } from "./regulatory-overview-card";

interface ComplianceChainViewProps {
  initialProductId?: string;
}

export function ComplianceChainView({ initialProductId }: ComplianceChainViewProps) {
  const { t } = useTranslation(["chain"]);
  const [data, setData] = useState<ComplianceChainResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChain = useCallback(async (productId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await complianceChainApi.getComplianceChain(productId);
      setData(result);
    } catch (err) {
      console.error("Compliance Chain API fetch error:", err);
      setError(err instanceof Error ? err.message : t("chain:errors.description"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const queryProduct = useCallback(async (productName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await complianceChainApi.queryComplianceChain({ productName });
      setData(result);
    } catch (err) {
      console.error("Compliance Chain query error:", err);
      setError(err instanceof Error ? err.message : t("chain:errors.description"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchChain(initialProductId);
  }, [fetchChain, initialProductId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    const isNetworkOrFetchError =
      !error ||
      error.toLowerCase().includes("failed to fetch") ||
      error.toLowerCase().includes("networkerror") ||
      error.toLowerCase().includes("http");

    const displayMessage = isNetworkOrFetchError
      ? t("chain:errors.description")
      : error;

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-xl sm:p-12">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="size-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          {t("chain:errors.title")}
        </h3>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
          {displayMessage}
        </p>
        <Button
          onClick={() => fetchChain(initialProductId)}
          className="mt-6 gap-2 rounded-xl px-5 font-semibold"
        >
          <RefreshCw className="size-4" />
          {t("chain:errors.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Product Header */}
      <ComplianceChainHeader
        data={data}
        onQueryProduct={queryProduct}
        isLoading={isLoading}
      />

      {/* Current Position */}
      <CurrentPositionCard
        currentPosition={data.currentPosition}
        steps={data.steps || []}
      />

      {/* Next Best Action */}
      <NextBestActionCard
        nextBestAction={data.nextBestAction}
        steps={data.steps || []}
      />

      {/* Main Compliance Chain Journey */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Layers className="size-5 shrink-0" />
          <div className="flex flex-col">
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase">
              {t("chain:chainJourney.title")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("chain:chainJourney.subtitle")}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-col pt-2">
          {data.steps && data.steps.length > 0 ? (
            data.steps.map((step, idx) => (
              <ComplianceChainStepCard
                key={step.id || idx}
                step={step}
                index={idx}
                isLast={idx === data.steps.length - 1}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-muted p-6 text-center text-xs text-muted-foreground">
              {t("chain:errors.emptyTitle")}
            </div>
          )}
        </div>
      </div>

      {/* Regulatory Overview */}
      {data.regulatoryOverview && (
        <RegulatoryOverviewCard overview={data.regulatoryOverview} />
      )}
    </div>
  );
}
