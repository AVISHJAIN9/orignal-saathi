import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { OfficerVisitsView } from "@/components/officer-visits/officer-visits-view";
import { useRole } from "@/lib/role";

export function OfficerVisitsPage() {
  const { t } = useTranslation(["visits", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("visits:heading")} allowed={false} />;
  }

  // Parse optional application parameter from query string if passed from registration/dashboard
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const initialApplicationId =
    urlParams?.get("applicationId") || urlParams?.get("app") || undefined;

  return (
    <div className="relative min-h-dvh bg-background pb-12">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        {/* Top bar header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
              {t("visits:eyebrow")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("visits:heading")}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("visits:subheading")}
            </p>
          </div>
        </div>

        {/* Main S6 Government Officer Visits View */}
        <OfficerVisitsView initialApplicationId={initialApplicationId} />
      </div>
    </div>
  );
}
