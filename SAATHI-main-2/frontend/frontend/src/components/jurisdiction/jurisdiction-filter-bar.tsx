import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FilterPills } from "@/components/filter-pills";
import { Input } from "@/components/ui/input";
import type { JurisdictionFilter } from "@/lib/mock-jurisdictions";

const CATEGORIES: Exclude<JurisdictionFilter, "all">[] = [
  "high_relevance",
  "active_changes",
  "bis_related",
  "international",
];

interface JurisdictionFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: JurisdictionFilter;
  onFilterChange: (filter: JurisdictionFilter) => void;
  filterCounts: Record<JurisdictionFilter, number>;
}

/** Search input + the shared FilterPills widget (src/components/filter-pills.tsx)
 * with Jurisdiction's own category vocabulary — same pattern as Regulatory
 * Radar's RadarFilters, instead of a one-off pill implementation. */
export function JurisdictionFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filterCounts,
}: JurisdictionFilterBarProps) {
  const { t } = useTranslation("jurisdiction");

  const options = [
    { value: "all" as const, label: `${t("filterAll")} (${filterCounts.all})` },
    ...CATEGORIES.map((category) => ({
      value: category,
      label: `${t(`categories.${category}`)} (${filterCounts[category]})`,
    })),
  ];

  return (
    <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-10 bg-background/80 pl-10 text-sm"
        />
      </div>

      <FilterPills
        options={options}
        active={activeFilter}
        onChange={onFilterChange}
      />
    </div>
  );
}
