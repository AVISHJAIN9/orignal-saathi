import { AlertTriangle, CircleCheck, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPaymentStatus,
  RENEWAL_ELIGIBLE_APPLICATION_ID,
  type FeeLineItem,
  type PaymentStatus as PaymentLineStatus,
  type PaymentSummary,
} from "@/lib/mock-payments";
import { cn } from "@/lib/utils";

interface PaymentStatusProps {
  applicationId: string;
}

type LoadState = "loading" | "success" | "empty" | "error";

// en-IN, no decimals — matches how every seeded amount in mock-payments.ts
// is authored (whole rupees). Never pre-formatted in the data layer itself.
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Same toLocaleDateString shape src/components/vault/vault-item-card.tsx
// already uses, rather than a new date-formatting convention.
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_BADGE_STYLES: Record<PaymentLineStatus, string> = {
  paid: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  pending:
    "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  due: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  failed: "border-transparent bg-destructive/10 text-destructive",
  refunded: "border-transparent bg-secondary text-secondary-foreground",
  not_due: "border-transparent bg-muted text-muted-foreground",
};

function FeeStatusBadge({ status }: { status: PaymentLineStatus }) {
  const { t } = useTranslation("payments");
  return (
    <Badge variant="outline" className={STATUS_BADGE_STYLES[status]}>
      {t(`status.${status}`)}
    </Badge>
  );
}

/** One fee-breakdown/history row. `dueDate`/`paidDate`/`referenceId` render
 * exactly as the data layer provides them — a missing one shows the
 * honest "—" / "not available" copy rather than inventing a value, the
 * same "never fabricate missing fields" rule as S3's rejection reasons.
 *
 * The Annual Renewal Flow link deliberately targets
 * RENEWAL_ELIGIBLE_APPLICATION_ID rather than whichever application's
 * payment page happens to be open — see that constant's comment in
 * mock-payments.ts for why the ambient applicationId is never eligible. */
function FeeRow({ item }: { item: FeeLineItem }) {
  const { t } = useTranslation("payments");
  const date = item.dueDate ?? item.paidDate;
  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">
        {item.label}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {currencyFormatter.format(item.amount)}
      </TableCell>
      <TableCell>
        <FeeStatusBadge status={item.status} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {date ? formatDate(date) : t("noDate")}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {item.referenceId ? (
          item.referenceId
        ) : item.key === "annual_licence" ? (
          <Link
            to={`/renewals/${RENEWAL_ELIGIBLE_APPLICATION_ID}/wizard`}
            className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary hover:underline"
          >
            Annual Renewal Flow
          </Link>
        ) : (
          t("noReference")
        )}
      </TableCell>
    </TableRow>
  );
}

function nextDueDate(feeBreakdown: FeeLineItem[]): string | undefined {
  const due = feeBreakdown
    .filter(
      (item) =>
        item.dueDate && (item.status === "due" || item.status === "pending"),
    )
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    );
  return due[0]?.dueDate;
}

function OverallStatusCard({ summary }: { summary: PaymentSummary }) {
  const { t } = useTranslation("payments");
  const upToDate = summary.overallStatus === "up_to_date";
  const nextDue = nextDueDate(summary.feeBreakdown);

  return (
    <div
      className={cn(
        "elevation-1 flex flex-col gap-4 rounded-2xl border p-5",
        upToDate
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
          : "border-amber-300 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
      )}
    >
      <div className="flex items-center gap-2">
        {upToDate ? (
          <CircleCheck
            className="size-5 text-emerald-700 dark:text-emerald-400"
            aria-hidden
          />
        ) : (
          <AlertTriangle
            className="size-5 text-amber-700 dark:text-amber-400"
            aria-hidden
          />
        )}
        <span
          className={cn(
            "text-sm font-semibold",
            upToDate
              ? "text-emerald-900 dark:text-emerald-200"
              : "text-amber-900 dark:text-amber-200",
          )}
        >
          {upToDate ? t("overall.upToDate") : t("overall.paymentRequired")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            {t("overall.totalDue")}
          </span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {currencyFormatter.format(summary.totalDue)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            {t("overall.totalPaid")}
          </span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {currencyFormatter.format(summary.totalPaid)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            {t("overall.outstanding")}
          </span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {currencyFormatter.format(summary.outstanding)}
          </span>
        </div>
      </div>

      {!upToDate && nextDue && (
        <p className="text-xs text-amber-900 dark:text-amber-200">
          {t("overall.nextDue", { date: formatDate(nextDue) })}
        </p>
      )}
    </div>
  );
}

/**
 * Owns getPaymentStatus(applicationId) end to end and renders its four
 * states — loading, error, empty, success — as visibly distinct layouts,
 * the same discipline PersonalizedDashboard already applies to
 * useDashboard()'s five states.
 */
export function PaymentStatusView({ applicationId }: PaymentStatusProps) {
  const { t } = useTranslation("payments");
  const [state, setState] = useState<LoadState>("loading");
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    getPaymentStatus(applicationId)
      .then((result) => {
        if (cancelled) return;
        setSummary(result);
        setState(result ? "success" : "empty");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId, reloadKey]);

  if (state === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertTriangle className="size-6 text-destructive" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("error.heading")}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t("error.body")}
        </p>
        <Button type="button" onClick={() => setReloadKey((k) => k + 1)}>
          {t("error.retry")}
        </Button>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="flex flex-col gap-4">
        <EmptyState
          icon={Receipt}
          heading={t("empty.heading")}
          body={t("empty.body")}
        />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="flex flex-col gap-5">
      <OverallStatusCard summary={summary} />

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          {t("table.heading")}
        </h2>
        <div className="elevation-1 overflow-hidden rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.fee")}</TableHead>
                <TableHead>{t("table.amount")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.reference")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.feeBreakdown.map((item) => (
                <FeeRow key={item.key} item={item} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          {t("history.heading")}
        </h2>
        {summary.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("history.empty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {summary.history.map((item) => (
              <li
                key={item.key}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(item.paidDate ?? item.dueDate)
                      ? formatDate((item.paidDate ?? item.dueDate)!)
                      : t("noDate")}
                    {item.referenceId
                      ? ` · ${item.referenceId}`
                      : ` · ${t("noReference")}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {currencyFormatter.format(item.amount)}
                  </span>
                  <FeeStatusBadge status={item.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
