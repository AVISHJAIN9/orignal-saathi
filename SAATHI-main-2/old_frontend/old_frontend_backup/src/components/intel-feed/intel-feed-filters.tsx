import { useTranslation } from "react-i18next";

import { FilterPills } from "@/components/filter-pills";
import type { IntelCategory } from "@/lib/mock-intel-items";

const CATEGORIES: IntelCategory[] = [
  "bis",
  "standards",
  "certification",
  "international",
  "industry",
];

export type IntelCategoryFilter = IntelCategory | "all";

interface IntelFeedFiltersProps {
  active: IntelCategoryFilter;
  onChange: (category: IntelCategoryFilter) => void;
  counts: Record<IntelCategoryFilter, number>;
}

/** Category filter pills, built on the shared FilterPills widget
 * (src/components/filter-pills.tsx) with the Intel Feed's own category
 * vocabulary and i18n labels — same pattern as RadarFilters. */
export function IntelFeedFilters({
  active,
  onChange,
  counts,
}: IntelFeedFiltersProps) {
  const { t } = useTranslation("intel");

  const options = [
    { value: "all" as const, label: `${t("filterAll")} (${counts.all})` },
    ...CATEGORIES.map((category) => ({
      value: category,
      label: `${t(`categories.${category}`)} (${counts[category]})`,
    })),
  ];

  return <FilterPills options={options} active={active} onChange={onChange} />;
}
