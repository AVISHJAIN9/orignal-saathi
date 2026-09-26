import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { RenewalWizard } from "@/components/renewal/renewal-wizard";
import { useRole } from "@/lib/role";

interface RenewalPageProps {
  applicationId?: string;
}

export function RenewalPage({
  applicationId = "APP-DEMO-HELMET",
}: RenewalPageProps) {
  const { t } = useTranslation("renewal");
  const { role, ready } = useRole();
  const navigate = useNavigate();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("heading")} allowed={false} />;
  }

  const handleApplicationChange = (newAppId: string) => {
    navigate(`/renewals/${newAppId}/wizard`);
  };

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Page Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("heading")}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Application ID: {applicationId}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <Link
              to={`/renewals/${applicationId}`}
              className="text-xs font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {t("backToTimeline")}
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {t("backToDashboard")}
            </Link>
          </div>
        </div>

        {/* Master Renewal Wizard */}
        <RenewalWizard
          applicationId={applicationId}
          onApplicationChange={handleApplicationChange}
        />
      </div>
    </div>
  );
}
