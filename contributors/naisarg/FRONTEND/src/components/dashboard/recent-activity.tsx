import { History } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/dashboard/empty-state";
import type { ActivityDatum } from "@/lib/mock-dashboard";

interface RecentActivityProps {
  activity: ActivityDatum[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
  const { t, i18n } = useTranslation("dashboard");

  if (activity.length === 0) {
    return (
      <EmptyState
        icon={History}
        heading={t("recentActivity.empty")}
        body=""
        compact
      />
    );
  }

  const sorted = [...activity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((item) => (
        <li
          key={item.key}
          className="flex flex-col gap-0.5 border-b border-border/60 pb-2 last:border-0 last:pb-0"
        >
          <p className="text-sm text-foreground">{item.message}</p>
          <span className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat(i18n.language, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(item.timestamp))}
          </span>
        </li>
      ))}
    </ul>
  );
}
