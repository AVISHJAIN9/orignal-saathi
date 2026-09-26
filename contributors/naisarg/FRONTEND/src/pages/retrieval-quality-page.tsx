import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { RetrievalQualityDashboard } from "@/components/admin/retrieval-quality/retrieval-quality-dashboard";
import { useRole } from "@/lib/role";

export function RetrievalQualityPage() {
  const { t } = useTranslation(["retrievalQuality", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  // STRICT RBAC: Internal operations/admin role only
  if (role !== "admin") {
    return <PlaceholderPage title={t("retrievalQuality:heading")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background pb-16">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-rose-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-rose-600 dark:text-rose-400 uppercase">
              {t("retrievalQuality:eyebrow")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              {t("retrievalQuality:heading")}
            </h1>
            <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              {t("retrievalQuality:subheading")}
            </p>
          </div>
          <Link
            to="/admin"
            className="shrink-0 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Back to Admin Panel
          </Link>
        </div>

        {/* Main S27 Retrieval Quality Dashboard */}
        <RetrievalQualityDashboard />
      </div>
    </div>
  );
}
