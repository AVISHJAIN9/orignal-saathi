import { Bell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "@/components/notifications/notification-item";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-notifications";

// MOCK_NOTIFICATIONS is already newest-first (see mock-notifications.ts), so
// the first few entries are exactly "most recent" without re-sorting.
const PREVIEW_COUNT = 4;

/** Header bell — reuses NotificationItem (the same row the full /notifications
 * page renders) for its preview list, so the two surfaces never drift apart. */
export function NotificationBell() {
  const { t } = useTranslation("notifications");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const preview = notifications.slice(0, PREVIEW_COUNT);

  function handleMarkRead(key: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.key === key ? { ...n, read: true } : n)),
    );
  }

  const ariaLabel =
    unreadCount > 0
      ? `${t("bell.ariaLabel")} — ${unreadCount} ${t("tabs.unread").toLowerCase()}`
      : t("bell.ariaLabel");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="relative border-[var(--card)]/70 bg-[var(--card)]/35 text-muted-foreground shadow-[inset_0_1px_0_var(--border)] hover:bg-[var(--card)]/60"
          aria-label={ariaLabel}
          title={ariaLabel}
        >
          <Bell aria-hidden />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full p-0 text-[0.6rem] leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border-border p-2 shadow-[0_18px_42px_rgba(12,50,86,0.16)] backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-2 pb-1 pt-1 font-mono text-[0.58rem] tracking-[0.16em] text-muted-foreground uppercase">
          {t("pageTitle")}
        </DropdownMenuLabel>
        <div className="custom-scrollbar flex max-h-80 flex-col gap-2 overflow-y-auto px-1 py-1">
          {preview.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("emptyState")}
            </p>
          ) : (
            preview.map((notification, index) => (
              <NotificationItem
                key={notification.key}
                notification={notification}
                index={index}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </div>
        <DropdownMenuSeparator className="bg-border/60" />
        <Link
          to="/notifications"
          className="block rounded-xl px-2 py-2 text-center text-sm font-medium text-primary hover:bg-muted"
        >
          {t("bell.viewAll")}
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
