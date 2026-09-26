import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

interface DashboardHeaderProps {
  name: string;
}

/** Greeting sourced from the S1 AuthProvider's `currentUser.name` — never
 * a hardcoded name (see personalized-dashboard.tsx, the only caller). */
export function DashboardHeader({ name }: DashboardHeaderProps) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
          {t("eyebrow")}
        </span>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          {t("greeting", { name })}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          {t("subheading")}
        </p>
      </div>
      <Link
        to="/chat"
        className="shrink-0 text-sm font-medium text-primary underline underline-offset-4"
      >
        {t("backToChat")}
      </Link>
    </div>
  );
}
