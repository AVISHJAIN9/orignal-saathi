import { useTranslation } from "react-i18next";

import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { SchemeSelector } from "@/components/scheme/scheme-selector";
import { useRole } from "@/lib/role";

export function SchemeSelectorPage() {
  const { t } = useTranslation(["scheme", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("scheme:title")} allowed={false} />;
  }

  // Support reading query string params if available
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialProduct = urlParams?.get("product") || "Submersible Water Pump";
  const initialStandard = urlParams?.get("standard") || "IS 10500";

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        <SchemeSelector
          initialProduct={initialProduct}
          initialStandard={initialStandard}
        />
      </div>
    </div>
  );
}
