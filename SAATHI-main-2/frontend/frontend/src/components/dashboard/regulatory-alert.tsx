import { ArrowUpRight, Gavel } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import type { NotificationDatum } from "@/lib/mock-notifications";
import { getStandardByKey } from "@/lib/mock-standards";

interface RegulatoryAlertProps {
  items: NotificationDatum[];
}

/** Reuses `NotificationDatum`'s existing "regulatory" type as-is (see
 * mock-dashboard.ts's `getRegulatoryAlerts`). Links into the named
 * standard's Revision tab when a `standardKey` is present, or the general
 * Regulatory Radar otherwise — "as appropriate", per the S2 task, rather
 * than always guessing a standard. */
export function RegulatoryAlert({ items }: RegulatoryAlertProps) {
  const { t } = useTranslation(["dashboard", "notifications"]);

  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <EmptyState
        icon={Gavel}
        heading={t("regulatoryAlerts.empty")}
        body=""
        compact
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {safeItems.map((item) => {
        const standard = item.standardKey
          ? getStandardByKey(item.standardKey)
          : undefined;
        return (
          <li
            key={item.key}
            className="flex flex-col gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <p className="text-sm font-medium text-foreground">
              {t(`notifications:items.${item.key}.title`)}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t(`notifications:items.${item.key}.description`)}
            </p>
            <Link
              to={
                standard
                  ? `/standards/${item.standardKey}`
                  : "/regulatory-radar"
              }
              search={standard ? { tab: "revision" } : undefined}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary underline underline-offset-4"
            >
              {t("regulatoryAlerts.viewDetails")}
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
