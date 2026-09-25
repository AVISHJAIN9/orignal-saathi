import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { ComplianceChainView } from "@/components/compliance-chain/compliance-chain-view";
import { useRole } from "@/lib/role";

export function ComplianceChainPage() {
  const { t } = useTranslation(["chain", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("chain:heading")} allowed={false} />;
  }

  // Parse optional product parameter from query string if passed from another tool
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const initialProductId = urlParams?.get("product") || urlParams?.get("id") || undefined;

  return (
    <div className="relative min-h-dvh bg-background pb-12">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        {/* Top bar header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("chain:eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("chain:heading")}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("chain:subheading")}
            </p>
          </div>
        </div>

        {/* Main C6 Orchestration View */}
        <ComplianceChainView initialProductId={initialProductId} />
      </div>
    </div>
  );
}
