import {
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Gavel,
  Globe,
  Rss,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IntelCategory, IntelItemDatum } from "@/lib/mock-intel-items";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<IntelCategory, typeof Gavel> = {
  bis: Gavel,
  standards: BookOpenCheck,
  certification: BadgeCheck,
  international: Globe,
  industry: Building2,
};

// Same tint family as CATEGORY_STYLES in radar-timeline.tsx, so a category
// reads the same way on both pages.
const CATEGORY_STYLES: Record<IntelCategory, string> = {
  bis: "bg-primary/10 text-primary",
  standards: "bg-secondary text-secondary-foreground",
  certification: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  international: "bg-[var(--chart-2)]/25 text-[oklch(0.4_0.1_250)]",
  industry: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

interface IntelFeedItemProps {
  item: IntelItemDatum;
  index: number;
}

/** One card in the intel feed — reuses Card/Badge from src/components/ui/.
 * Animates in with the same on-load stagger as NotificationItem/StandardCard
 * (mount-triggered, not scroll-triggered like Reveal). */
export function IntelFeedItem({ item, index }: IntelFeedItemProps) {
  const { t } = useTranslation("intel");
  const Icon = CATEGORY_ICONS[item.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.06,
      }}
    >
      <Card className="elevation-1 elevation-transition border-border py-0 transition-colors">
        <CardContent className="flex items-start gap-3 p-4">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              CATEGORY_STYLES[item.category],
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border-transparent",
                  CATEGORY_STYLES[item.category],
                )}
              >
                {t(`categories.${item.category}`)}
              </Badge>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Rss className="size-3" aria-hidden />
                {item.source}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {t(`items.${item.key}.timestamp`)}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {t(`items.${item.key}.headline`)}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(`items.${item.key}.summary`)}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
