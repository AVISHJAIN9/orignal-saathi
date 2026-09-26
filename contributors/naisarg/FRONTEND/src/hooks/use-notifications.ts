import { useCallback, useState } from "react";

import {
  listNotifications,
  markNotificationRead,
  type NotificationDatum,
} from "@/lib/mock-notifications";

/**
 * Shared by the header bell (NotificationBell) and the full /notifications
 * page — same read-after-mount pattern as useVault, so "mark read" in
 * either place is reflected by the other the next time it mounts, instead
 * of each holding its own unsynced copy of MOCK_NOTIFICATIONS.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationDatum[]>(() =>
    listNotifications(),
  );

  const markRead = useCallback((key: string) => {
    markNotificationRead(key);
    setNotifications(listNotifications());
  }, []);

  return { notifications, markRead };
}
