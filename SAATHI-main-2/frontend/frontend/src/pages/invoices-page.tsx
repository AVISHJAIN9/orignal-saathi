import { useTranslation } from "react-i18next";
import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { InvoiceListView } from "@/components/invoices/invoice-list-view";
import { useRole } from "@/lib/role";

export function InvoicesPage() {
  const { t } = useTranslation(["invoices", "admin"]);
  const { role, ready } = useRole();

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("invoices:heading")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background pb-16">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
              {t("invoices:eyebrow")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              {t("invoices:heading")}
            </h1>
            <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              {t("invoices:subheading")}
            </p>
          </div>
        </div>

        {/* Main S24 Invoices View */}
        <InvoiceListView />
      </div>
    </div>
  );
}
