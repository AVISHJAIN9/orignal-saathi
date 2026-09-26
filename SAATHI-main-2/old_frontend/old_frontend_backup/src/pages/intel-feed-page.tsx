import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import {
  IntelFeedFilters,
  type IntelCategoryFilter,
} from "@/components/intel-feed/intel-feed-filters";
import { IntelFeedItem } from "@/components/intel-feed/intel-feed-item";
import { MOCK_INTEL_ITEMS } from "@/lib/mock-intel-items";

export function IntelFeedPage() {
  const { t } = useTranslation("intel");
  const [category, setCategory] = useState<IntelCategoryFilter>("all");

  const counts = useMemo(() => {
    const base: Record<IntelCategoryFilter, number> = {
      all: MOCK_INTEL_ITEMS.length,
      bis: 0,
      standards: 0,
      certification: 0,
      international: 0,
      industry: 0,
    };
    for (const item of MOCK_INTEL_ITEMS) base[item.category] += 1;
    return base;
  }, []);

  const filtered =
    category === "all"
      ? MOCK_INTEL_ITEMS
      : MOCK_INTEL_ITEMS.filter((item) => item.category === category);

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {t("subheading")}
            </p>
          </div>
          <Link
            to="/chat"
            className="shrink-0 text-sm font-medium text-primary underline underline-offset-4"
          >
            {t("backToChat")}
          </Link>
        </div>

        <IntelFeedFilters
          active={category}
          onChange={setCategory}
          counts={counts}
        />

        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {filtered.map((item, index) => (
              <IntelFeedItem key={item.key} item={item} index={index} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="rounded-xl border border-border bg-card py-14 text-center text-sm text-muted-foreground">
              {t("emptyState")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
