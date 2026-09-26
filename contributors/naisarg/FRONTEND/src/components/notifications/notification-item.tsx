import {
  Award,
  CalendarCheck,
  ClipboardCheck,
  FileEdit,
  FileSearch,
  Gavel,
  Hourglass,
  RefreshCw,
  Scale,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { RequirementUpdateCard } from "@/components/notifications/requirement-update-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/router-compat";
import type {
  NotificationDatum,
  NotificationType,
} from "@/lib/mock-notifications";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<NotificationType, typeof Gavel> = {
  regulatory: Gavel,
  analysis: FileSearch,
  deadline: Hourglass,
  system: RefreshCw,
  conformity: ClipboardCheck,
  visit: CalendarCheck,
  correction: FileEdit,
  appeal: Scale,
  certificate: Award,
  requirement_update: Gavel,
  payment: Hourglass,
};

// Same navy-accent family as CATEGORY_STYLES in standards-browser.tsx, one
// tint per notification type so the icon chip reads as a category at a
// glance without needing a legend.
const TYPE_STYLES: Record<NotificationType, string> = {
  regulatory: "bg-[var(--chart-2)]/20 text-[oklch(0.4_0.1_250)]",
  analysis: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  deadline: "bg-destructive/10 text-destructive",
  system: "bg-muted text-muted-foreground",
  conformity: "bg-secondary text-secondary-foreground",
  visit: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  correction: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  appeal: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  certificate: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  requirement_update: "bg-[var(--chart-2)]/20 text-[oklch(0.4_0.1_250)]",
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

  // Requirement updates have their own richer row (severity, before/after
  // clause text, gap-analysis links) and a colon-joined key that the plain
  // `items.${key}` lookup below can't resolve — delegate before reaching it.
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
              {notification.type === "regulatory" && (
                <Link
                  to="/regulatory-alerts"
                  className="ml-auto inline-flex items-center text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {t("viewAlert")}
                </Link>
              )}
              {notification.type === "visit" && (
                <Link
                  to="/officer-visits"
                  className="ml-auto inline-flex items-center text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {t("viewVisit")}
                </Link>
              )}
              {notification.type === "correction" && (
                <Link
                  to="/document-corrections"
                  className="ml-auto inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 underline underline-offset-2 hover:text-amber-700"
                >
                  {t("viewCorrection")}
                </Link>
              )}
              {notification.type === "appeal" && (
                <Link
                  to="/appeals"
                  className="ml-auto inline-flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 underline underline-offset-2 hover:text-purple-700"
                >
                  {t("viewAppeal", { defaultValue: "View Appeal" })}
                </Link>
              )}
              {notification.type === "certificate" && (
                <Link
                  to="/certificates"
                  className="ml-auto inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-700"
                >
                  {t("viewCertificate", { defaultValue: "View Certificate" })}
                </Link>
              )}
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
