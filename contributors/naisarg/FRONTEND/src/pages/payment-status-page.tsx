import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { PaymentStatusView } from "@/components/payments/payment-status";
import { PlaceholderPage } from "@/components/placeholder-page";
import { useRole } from "@/lib/role";

interface PaymentStatusPageProps {
  applicationId: string;
}

// Role-gated the same way conformity-check-page.tsx is: ProtectedRoute
// (see routes/payments.$applicationId.tsx) only checks "is anyone signed
// in", authorization for which persona can see payment info stays here.
export function PaymentStatusPage({ applicationId }: PaymentStatusPageProps) {
  const { t } = useTranslation("payments");
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("heading")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("heading")}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              {applicationId}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="shrink-0 text-sm font-medium text-primary underline underline-offset-4"
          >
            {t("backToDashboard")}
          </Link>
        </div>

        <PaymentStatusView applicationId={applicationId} />
      </div>
    </div>
  );
}
