import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { useVault } from "@/hooks/use-vault";
import type { VaultItem } from "@/lib/mock-vault";
import { VaultEmptyState } from "./vault-empty-state";
import { VaultItemCard } from "./vault-item-card";
import { VaultItemDetail } from "./vault-item-detail";

type FilterKind = "all" | "standard" | "document";

const FILTERS: { id: FilterKind; labelKey: string }[] = [
  { id: "all", labelKey: "filters.all" },
  { id: "standard", labelKey: "filters.standards" },
  { id: "document", labelKey: "filters.documents" },
];

interface VaultWorkbenchProps {
  initialItemId?: string;
}

export function VaultWorkbench({ initialItemId }: VaultWorkbenchProps) {
  const { t } = useTranslation(["vault", "standards", "cortex"]);
  const { items, isLoading, remove } = useVault();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialItemId ?? null,
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const filtered = useMemo(() => {
    let result = items;
    if (activeFilter !== "all") {
      result = result.filter((item) => item.kind === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        const title =
          item.kind === "standard"
            ? t(`standards:list.${item.standard.key}`)
            : t(`cortex:results.${item.document.resultKey}.product`);
        const subtitle =
          item.kind === "standard"
            ? item.standard.standardNumber
            : item.document.fileName;
        return (
          title.toLowerCase().includes(q) || subtitle.toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [items, activeFilter, searchQuery, t]);

  function handleRemove(item: VaultItem) {
    if (selectedId === item.id) setSelectedId(null);
    void remove(item);
  }

  if (isLoading) return null;

  if (selectedItem) {
    return (
      <VaultItemDetail
        item={selectedItem}
        onBack={() => setSelectedId(null)}
        onRemove={handleRemove}
      />
    );
  }

  if (items.length === 0) {
    return <VaultEmptyState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 bg-background pl-10 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t(filter.labelKey)}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {t("resultCount", { count: filtered.length })}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            {t("empty.title")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <VaultItemCard
              key={item.id}
              item={item}
              onSelect={setSelectedId}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
