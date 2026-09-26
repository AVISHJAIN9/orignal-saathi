import { useTranslation } from "react-i18next";
import { Package, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, HelpCircle, MinusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ComplianceChainResult } from "@/lib/compliance-chain-api";
import { useState } from "react";

interface ComplianceChainHeaderProps {
  data: ComplianceChainResult;
  onQueryProduct?: (productName: string) => void;
  isLoading?: boolean;
}

export function ComplianceChainHeader({
  data,
  onQueryProduct,
  isLoading,
}: ComplianceChainHeaderProps) {
  const { t } = useTranslation(["chain"]);
  const [searchInput, setSearchInput] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
            <CheckCircle2 className="size-3.5" />
            {t("chain:states.completed")}
          </Badge>
        );
      case "ACTION_REQUIRED":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
            <AlertTriangle className="size-3.5" />
            {t("chain:states.actionRequired")}
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
            <XCircle className="size-3.5" />
            {t("chain:states.blocked")}
          </Badge>
        );
      case "NOT_STARTED":
        return (
          <Badge className="bg-muted text-foreground border-border gap-1.5 px-3 py-1 text-xs font-semibold">
            <HelpCircle className="size-3.5" />
            {t("chain:states.notStarted")}
          </Badge>
        );
      case "NOT_APPLICABLE":
        return (
          <Badge className="bg-muted text-foreground border-border gap-1.5 px-3 py-1 text-xs font-semibold">
            <MinusCircle className="size-3.5" />
            {t("chain:states.notApplicable")}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
            <ShieldAlert className="size-3.5" />
            {t("chain:states.unavailable")}
          </Badge>
        );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onQueryProduct) {
      onQueryProduct(searchInput.trim());
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-lg backdrop-blur-xl dark:border-border/50 dark:bg-card/95 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <Package className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {t("chain:productContext.product")}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-xs font-medium text-primary">
                ID: {data.productId || "session-active"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {data.productName}
            </h2>
            {data.standardNumber && (
              <p className="text-sm font-medium text-muted-foreground">
                {t("chain:productContext.standard")}:{" "}
                <span className="font-semibold text-foreground">
                  {data.standardNumber}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 md:items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t("chain:productContext.status")}:
            </span>
            {getStatusBadge(data.overallStatus)}
          </div>

          {onQueryProduct && (
            <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative flex-1 md:w-56">
                <Input
                  type="text"
                  placeholder={t("chain:productContext.customQuery")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-9 rounded-lg pl-3 pr-8 text-xs"
                />
              </div>
              <Button type="submit" size="sm" disabled={isLoading || !searchInput.trim()} className="h-9 gap-1.5 text-xs font-medium">
                <Search className="size-3.5" />
                Query
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
