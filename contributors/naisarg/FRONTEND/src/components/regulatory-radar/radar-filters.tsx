import { useTranslation } from "react-i18next";

import { FilterPills } from "@/components/filter-pills";
import type { RegulatoryCategory } from "@/lib/mock-regulatory-events";

const CATEGORIES: RegulatoryCategory[] = [
  "bis",
  "standards",
  "certification",
  "international",
  "upcoming",
];

export type CategoryFilter = RegulatoryCategory | "all";

interface RadarFiltersProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
}

/** Category filter pills, built on the shared FilterPills widget
 * (src/components/filter-pills.tsx) with Regulatory Radar's own category
 * vocabulary and i18n labels. */
export function RadarFilters({ active, onChange, counts }: RadarFiltersProps) {
  const { t } = useTranslation("radar");

  const options = [
    { value: "all" as const, label: `${t("filterAll")} (${counts.all})` },
    ...CATEGORIES.map((category) => ({
      value: category,
      label: `${t(`categories.${category}`)} (${counts[category]})`,
    })),
  ];

  return <FilterPills options={options} active={active} onChange={onChange} />;
}
