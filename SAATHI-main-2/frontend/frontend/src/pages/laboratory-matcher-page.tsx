import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { LaboratoryMatcher } from "@/components/laboratory/laboratory-matcher";
import { useRole } from "@/lib/role";

export function LaboratoryMatcherPage() {
  const { t } = useTranslation(["laboratory", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  // Allow industry, admin, and public visitors to search and match laboratories


  // Support reading query string params if passed from C6/C5/C3/C4
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const initialProduct = urlParams?.get("product") || undefined;
  const initialStandard = urlParams?.get("standard") || undefined;
  const initialScheme = urlParams?.get("scheme") || undefined;

  return (
    <div className="relative min-h-dvh bg-background pb-12">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        {/* Top bar header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("laboratory:eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("laboratory:title")}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("laboratory:subtitle")}
            </p>
          </div>
        </div>

        {/* Main C7 Laboratory Matcher View */}
        <LaboratoryMatcher
          initialProduct={initialProduct}
          initialStandard={initialStandard}
          initialScheme={initialScheme}
        />
      </div>
    </div>
  );
}
