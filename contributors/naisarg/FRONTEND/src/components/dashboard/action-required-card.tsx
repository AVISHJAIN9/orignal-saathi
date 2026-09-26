import { ArrowUpRight, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import type { NotificationDatum } from "@/lib/mock-notifications";
import { getStandardByKey } from "@/lib/mock-standards";

interface ActionRequiredCardProps {
  items: NotificationDatum[];
}

/** Reuses `NotificationDatum`'s existing "deadline" type as-is (see
 * mock-dashboard.ts's `getActionRequiredItems`) — title/description
 * resolve through the same `notifications` i18n namespace the
 * Notifications page already uses, not a second copy of this content.
 * Each item deep-links into the named standard's Compliance Gaps tab when
 * it has a `standardKey`, falling back to the Standards Browser otherwise
 * — never a fabricated per-item destination. */
export function ActionRequiredCard({ items }: ActionRequiredCardProps) {
  const { t } = useTranslation(["dashboard", "notifications"]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        heading={t("actionRequired.empty")}
        body=""
        compact
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
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
              to={standard ? `/standards/${item.standardKey}` : "/standards"}
              search={standard ? { tab: "complianceGaps" } : undefined}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary underline underline-offset-4"
            >
              {t("actionRequired.open")}
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
