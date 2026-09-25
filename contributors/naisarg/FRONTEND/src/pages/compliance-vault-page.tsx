import { useTranslation } from "react-i18next";

import { AmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { VaultWorkbench } from "@/components/vault/vault-workbench";

interface ComplianceVaultPageProps {
  initialItemId?: string;
}

export function ComplianceVaultPage({
  initialItemId,
}: ComplianceVaultPageProps) {
  const { t } = useTranslation("vault");

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
            <p className="max-w-xl text-sm text-muted-foreground">
              {t("subheading")}
            </p>
          </div>
        </div>

        <VaultWorkbench initialItemId={initialItemId} />

        <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
          <BrandMark size="sm" />
          <span className="pt-0.5">{t("disclaimer")}</span>
        </div>
      </div>
    </div>
  );
}
