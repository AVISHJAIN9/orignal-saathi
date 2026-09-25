import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { RenewalTimelineView } from "@/components/renewals/renewal-timeline-view";
import { useRole } from "@/lib/role";

export function RenewalsPage({
  focusApplicationId,
}: {
  focusApplicationId?: string;
} = {}) {
  const { t } = useTranslation(["renewals", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("renewals:heading")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background pb-16">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
              {t("renewals:eyebrow")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              {t("renewals:heading")}
            </h1>
            <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              {t("renewals:subheading")}
            </p>
          </div>
        </div>

        {/* Main S11 Renewal Timeline View */}
        <RenewalTimelineView focusApplicationId={focusApplicationId} />
      </div>
    </div>
  );
}
