import { ArrowUpRight, Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import type { NotificationDatum } from "@/lib/mock-notifications";

interface PaymentDueAlertCardProps {
  items: NotificationDatum[];
}

/** Reuses `NotificationDatum`'s "payment" type as-is (see
 * mock-dashboard.ts's `getPaymentAlerts`) — same shape and same
 * dashboard-card pattern as ActionRequiredCard/RegulatoryAlert, not a
 * fourth parallel one. Links into the named application's payment status
 * view via `applicationId` rather than a fabricated destination. */
export function PaymentDueAlertCard({ items }: PaymentDueAlertCardProps) {
  const { t } = useTranslation(["dashboard", "notifications"]);

  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        heading={t("paymentAlerts.empty")}
        body=""
        compact
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {safeItems.map((item) => (
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
          {item.applicationId && (
            <Link
              to={`/payments/${item.applicationId}`}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary underline underline-offset-4"
            >
              {t("paymentAlerts.viewPayment")}
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
