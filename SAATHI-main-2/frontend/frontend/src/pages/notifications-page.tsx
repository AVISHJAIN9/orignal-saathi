import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-notifications";

type FilterTab = "all" | "unread";

export function NotificationsPage() {
  const { t } = useTranslation("notifications");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [tab, setTab] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible =
    tab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  function handleMarkRead(key: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.key === key ? { ...n, read: true } : n)),
    );
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            {t("pageTitle")}
          </h1>
          <Link
            to="/chat"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            {t("backToChat")}
          </Link>
        </div>

        <Tabs value={tab} onValueChange={(value) => setTab(value as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            <TabsTrigger value="unread">
              {t("tabs.unread")}
              {unreadCount > 0 ? ` (${unreadCount})` : ""}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {visible.map((notification, index) => (
              <NotificationItem
                key={notification.key}
                notification={notification}
                index={index}
                onMarkRead={handleMarkRead}
              />
            ))}
          </AnimatePresence>
          {visible.length === 0 && (
            <p className="py-14 text-center text-sm text-muted-foreground">
              {t("emptyState")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
