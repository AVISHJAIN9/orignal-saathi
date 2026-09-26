import { useTranslation } from "react-i18next";

import { Bookmark } from "lucide-react";
import type { ForumCategory } from "@/lib/mock-forum";

interface NexusFiltersProps {
  activeCategory: ForumCategory;
  onCategoryChange: (category: ForumCategory) => void;
  categoryCounts: Record<ForumCategory, number>;
}

const CATEGORIES: { id: ForumCategory; labelKey: string; icon?: typeof Bookmark }[] = [
  { id: "all", labelKey: "filters.all" },
  { id: "saved", labelKey: "filters.saved", icon: Bookmark },
  { id: "standards", labelKey: "filters.standards" },
  { id: "conformity", labelKey: "filters.conformity" },
  { id: "testing", labelKey: "filters.testing" },
  { id: "certification", labelKey: "filters.certification" },
  { id: "regulatory", labelKey: "filters.regulatory" },
  { id: "implementation", labelKey: "filters.implementation" },
  { id: "open", labelKey: "filters.open" },
];

export function NexusFilters({
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: NexusFiltersProps) {
  const { t } = useTranslation("nexus");

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {Icon && <Icon className="size-3" />}
            <span>{t(cat.labelKey)}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 font-mono text-2xs ${
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
