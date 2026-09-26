import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { BusinessAccountView } from "@/components/business-account/business-account-view";
import { useRole } from "@/lib/role";

export function BusinessAccountPage() {
  const { t } = useTranslation(["businessAccount", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("businessAccount:pageTitle")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background pb-12">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        {/* Top Breadcrumb & Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
              {t("businessAccount:badge")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("businessAccount:pageTitle")}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("businessAccount:pageSubtitle")}
            </p>
          </div>
        </div>

        {/* Main S9 Business Account View */}
        <BusinessAccountView />
      </div>
    </div>
  );
}
