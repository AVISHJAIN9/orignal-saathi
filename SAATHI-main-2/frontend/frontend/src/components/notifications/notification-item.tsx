import {
  ClipboardCheck,
  FileSearch,
  Gavel,
  Hourglass,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { RequirementUpdateCard } from "@/components/notifications/requirement-update-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  NotificationDatum,
  NotificationType,
} from "@/lib/mock-notifications";
import { cn } from "@/lib/utils";

// "requirement_update" is deliberately excluded here — it never reaches
// this lookup (see the early delegation to RequirementUpdateCard below),
// which has its own severity-based icon/style instead of a single fixed
// per-type one.
type SimpleNotificationType = Exclude<NotificationType, "requirement_update">;

const TYPE_ICONS: Record<SimpleNotificationType, typeof Gavel> = {
  regulatory: Gavel,
  analysis: FileSearch,
  deadline: Hourglass,
  system: RefreshCw,
  conformity: ClipboardCheck,
  payment: Receipt,
};

// Same navy-accent family as CATEGORY_STYLES in standards-browser.tsx, one
// tint per notification type so the icon chip reads as a category at a
// glance without needing a legend.
const TYPE_STYLES: Record<SimpleNotificationType, string> = {
  regulatory: "bg-[var(--chart-2)]/20 text-[oklch(0.4_0.1_250)]",
  analysis: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  deadline: "bg-destructive/10 text-destructive",
  system: "bg-muted text-muted-foreground",
  conformity: "bg-secondary text-secondary-foreground",
  payment: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

interface NotificationItemProps {
  notification: NotificationDatum;
  index: number;
  onMarkRead: (key: string) => void;
}

/** One row in the notifications list — reuses Card/Badge/Button from
 * src/components/ui/ rather than introducing bespoke list-row markup. */
export function NotificationItem({
  notification,
  index,
  onMarkRead,
}: NotificationItemProps) {
  const { t } = useTranslation("notifications");

  // S4: delegate this one richer type to its own row rather than growing
  // this component's simple layout with conditionals for it.
  if (notification.type === "requirement_update") {
    return (
      <RequirementUpdateCard
        notification={notification}
        index={index}
        onMarkRead={onMarkRead}
      />
    );
  }

  const Icon = TYPE_ICONS[notification.type];

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
      <Card
        className={cn(
          "elevation-1 elevation-transition border-border py-0 transition-colors",
          !notification.read && "border-primary/25 bg-primary/[0.03]",
        )}
      >
        <CardContent className="flex items-start gap-3 p-4">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              TYPE_STYLES[notification.type],
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">
                {t(`items.${notification.key}.title`)}
              </p>
              {!notification.read && (
                <span
                  className="size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                  title={t("tabs.unread")}
                />
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(`items.${notification.key}.description`)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-transparent bg-muted text-muted-foreground"
              >
                {t(`types.${notification.type}`)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t(`items.${notification.key}.timestamp`)}
              </span>
            </div>
          </div>

          {!notification.read && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onMarkRead(notification.key)}
              className="shrink-0"
            >
              {t("markRead")}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
