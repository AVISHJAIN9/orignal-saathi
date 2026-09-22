import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/dashboard/empty-state";
import { getRecentActivity, type ActivityDatum } from "@/lib/mock-dashboard";
import type { Role } from "@/lib/role";

interface ProfileActivitySectionProps {
  role: Role | null;
}

/** Reuses S2's exact `getRecentActivity` mock — the same real,
 * mock-authoritative feed the dashboard's Recent Activity card already
 * shows — rather than inventing a third parallel activity source (the
 * reference's "Recent Queries"/"Saved Standards"/"Vault" content has no
 * real backing anywhere in this repo). */
export function ProfileActivitySection({ role }: ProfileActivitySectionProps) {
  const { t, i18n } = useTranslation("profile");
  const [activity, setActivity] = useState<ActivityDatum[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRecentActivity(role).then((items) => {
      if (!cancelled) setActivity(items);
    });
    return () => {
      cancelled = true;
    };
  }, [role]);

  return (
    <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Activity className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("activity.heading")}
        </h2>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("activity.body")}
      </p>

      {activity === null ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-muted/40"
            />
          ))}
        </div>
      ) : activity.length === 0 ? (
        <EmptyState
          icon={Activity}
          heading={t("activity.empty")}
          body=""
          compact
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {[...activity]
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .map((item) => (
              <li
                key={item.key}
                className="flex flex-col gap-0.5 border-b border-border/60 pb-2.5 last:border-0 last:pb-0"
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
      )}
    </div>
  );
}
