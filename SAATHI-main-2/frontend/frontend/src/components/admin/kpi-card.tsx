import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { KpiTrend } from "@/lib/mock-analytics";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  trend?: KpiTrend;
  icon: LucideIcon;
  /** Small qualitative status pill (e.g. "Optimal", "Live") — optional. */
  status?: string;
  /** Tailwind color token driving the status pill + bottom accent bar. */
  accent?: "primary" | "emerald" | "amber";
}

const ACCENT_STYLES: Record<NonNullable<KpiCardProps["accent"]>, { bar: string; badge: string }> = {
  primary: { bar: "bg-primary", badge: "bg-primary/10 text-primary" },
  emerald: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  amber: { bar: "bg-amber-500", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
};

// The value arrives preformatted ("87%", "1,370", "13%"). Split it into the
// leading non-digit prefix, the number itself, and the trailing suffix so we
// can count the number up from 0 while keeping "%", thousands separators, and
// any currency symbol intact. Falls back to rendering the raw string if there
// is no parseable number.
function parseValue(value: string) {
  const match = value.match(/^(\D*)([\d,.]+)(\D*)$/);
  if (!match) return null;
  const [, prefix, numberPart, suffix] = match;
  const numeric = Number(numberPart.replace(/,/g, ""));
  if (Number.isNaN(numeric)) return null;
  const hasThousands = numberPart.includes(",");
  const decimals = numberPart.includes(".") ? numberPart.split(".")[1].length : 0;
  return { prefix, suffix, numeric, hasThousands, decimals };
}

function formatNumber(n: number, hasThousands: boolean, decimals: number) {
  const fixed = n.toFixed(decimals);
  if (!hasThousands) return fixed;
  return Number(fixed).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * The KPI's headline figure counts up from zero on mount — a small piece of
 * theatre for the analytics dashboard, where watching the numbers tick into
 * place makes the metrics feel live rather than static. Honest about the
 * data: it animates to exactly the given value, never past it, and snaps
 * straight to the final number under reduced motion.
 */
function AnimatedValue({ value }: { value: string }) {
  const parsed = parseValue(value);
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    // Start from 0 each time this effect runs. Under StrictMode the effect
    // runs twice in dev; the first run's cleanup stops its animation and the
    // second replays the full count-up, so it animates in dev and once in
    // prod — no persistent "has started" ref (which the throwaway mount would
    // trip, freezing the value at 0).
    setDisplay(`${parsed.prefix}0${parsed.suffix}`);
    const controls = animate(0, parsed.numeric, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(
          `${parsed.prefix}${formatNumber(latest, parsed.hasThousands, parsed.decimals)}${parsed.suffix}`,
        );
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  return <span className="text-3xl font-semibold text-foreground tabular-nums">{display}</span>;
}

export function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  status,
  accent = "primary",
}: KpiCardProps) {
  const { t } = useTranslation("admin");
  const isUp = (trend?.changePercent ?? 0) >= 0;
  const styles = ACCENT_STYLES[accent];

  return (
    <div className="elevation-2 elevation-lift elevation-transition relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span className="text-sm">{label}</span>
        </div>
        {status && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase",
              styles.badge,
            )}
          >
            {status}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <AnimatedValue value={value} />
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trend.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            )}
            aria-label={t(isUp ? "trendUpAriaLabel" : "trendDownAriaLabel", {
              value: Math.abs(trend.changePercent),
            })}
          >
            {isUp ? (
              <ArrowUp className="size-3" aria-hidden />
            ) : (
              <ArrowDown className="size-3" aria-hidden />
            )}
            {Math.abs(trend.changePercent)}%
          </span>
        )}
      </div>
      {/* Command-center accent bar — a thin colour-coded strip along the
          bottom edge, borrowed from the glass dashboard reference and
          translated to the app's own palette rather than its dark theme. */}
      <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-[3px]", styles.bar)} />
    </div>
  );
}
