import { useTranslation } from "react-i18next";

import { AmbientBackground } from "@/components/ambient-background";
import { ConformityWorkbench } from "@/components/conformity/conformity-workbench";
import { PlaceholderPage } from "@/components/placeholder-page";
import { useRole } from "@/lib/role";

export function ConformityCheckPage() {
  const { t } = useTranslation(["conformity", "admin"]);
  const { role, ready } = useRole();

  // Wait for the persisted role before deciding what to show, so the
  // server-rendered markup matches the first client render.
  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("conformity:title")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("conformity:eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("conformity:heading")}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">{t("conformity:subheading")}</p>
          </div>
        </div>

        <ConformityWorkbench />
      </div>
    </div>
  );
}
