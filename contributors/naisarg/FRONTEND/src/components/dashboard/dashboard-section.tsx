import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface DashboardSectionProps {
  title: string;
  failed: boolean;
  onRetry: () => void;
  children: ReactNode;
  className?: string;
}

/** Wraps one dashboard card with its title and, when this section's own
 * fetch failed, a "⚠ <Section> unavailable — Retry" banner in place of its
 * content — so one failed piece never blanks the whole page (see the S2
 * task's section-level partial-failure requirement). */
export function DashboardSection({
  title,
  failed,
  onRetry,
  children,
  className,
}: DashboardSectionProps) {
  const { t } = useTranslation("dashboard");

  return (
    <section
      className={
        "elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5" +
        (className ? ` ${className}` : "")
      }
    >
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {failed ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          <span className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            {t("sectionError.unavailable", { section: title })}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            {t("sectionError.retry")}
          </Button>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
