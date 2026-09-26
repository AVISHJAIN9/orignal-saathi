import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { RegulatoryAlertsView } from "@/components/regulatory-alerts/regulatory-alerts-view";
import { useRole } from "@/lib/role";

export function RegulatoryAlertsPage() {
  const { t } = useTranslation(["alerts", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("alerts:title")} allowed={false} />;
  }

  // Parse optional product or standard parameter from query string if passed from another tool/link
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const initialProductId = urlParams?.get("product") || undefined;
  const initialStandardNumber = urlParams?.get("standard") || undefined;

  return (
    <div className="relative min-h-dvh bg-background pb-12">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        {/* Top bar header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-amber-600 dark:text-amber-400 uppercase">
              {t("alerts:eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("alerts:title")}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("alerts:subheading")}
            </p>
          </div>
        </div>

        {/* Main C8 Regulatory Change Alerts View */}
        <RegulatoryAlertsView
          initialProductId={initialProductId}
          initialStandardNumber={initialStandardNumber}
        />
      </div>
    </div>
  );
}
