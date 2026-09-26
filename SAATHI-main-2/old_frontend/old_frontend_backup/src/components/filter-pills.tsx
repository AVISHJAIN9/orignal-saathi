import { Filter } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FilterPillOption<T extends string> {
  value: T;
  label: ReactNode;
}

type FilterPillsVariant = "solid" | "glass";

interface FilterPillsProps<T extends string> {
  options: FilterPillOption<T>[];
  active: T;
  onChange: (value: T) => void;
  /** "solid" (default) is the opaque app-token look used by Regulatory Radar
   * and Intel Feed; "glass" is the translucent frosted look used by the
   * standards browser, which sits on the same glass card grid. */
  variant?: FilterPillsVariant;
  /** Shows a "Filter" text label next to the icon instead of the icon alone
   * (the standards browser wants the label; Radar/Intel Feed don't). */
  showLabel?: boolean;
}

const LABEL_STYLES: Record<FilterPillsVariant, string> = {
  solid: "text-muted-foreground",
  glass: "text-[var(--plate-muted)]",
};

const PILL_STYLES: Record<
  FilterPillsVariant,
  { base: string; active: string; inactive: string }
> = {
  solid: {
    base: "elevation-1 elevation-lift rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
    active: "border-primary/80 bg-primary text-primary-foreground",
    inactive: "border-border bg-background text-foreground hover:bg-muted",
  },
  glass: {
    base: "rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200",
    active:
      "border-primary/80 bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_16px_rgba(12,50,86,0.12)]",
    inactive:
      "border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/35 text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line)] hover:-translate-y-0.5 hover:border-primary/45 hover:bg-[var(--plate-ground)]/60",
  },
};

/** Generic active/inactive filter-pill row — the same active/inactive logic
 * and reusable API for both visual worlds the app runs; only the className
 * output changes per `variant`. Shared by any internal-app page with a
 * category filter (Regulatory Radar, Intel Feed, the standards browser, …)
 * instead of each page re-implementing its own pills. */
export function FilterPills<T extends string>({
  options,
  active,
  onChange,
  variant = "solid",
  showLabel = false,
}: FilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className={cn(
          "mr-1 inline-flex items-center font-mono text-[0.62rem] font-semibold tracking-[0.16em] uppercase",
          showLabel ? "gap-2" : "gap-1.5",
          LABEL_STYLES[variant],
        )}
      >
        <Filter className="size-3.5" aria-hidden />
        {showLabel && "Filter"}
      </div>
      {options.map((option) => (
        <FilterPill
          key={option.value}
          active={active === option.value}
          onClick={() => onChange(option.value)}
          variant={variant}
        >
          {option.label}
        </FilterPill>
      ))}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  variant,
  children,
}: {
  active: boolean;
  onClick: () => void;
  variant: FilterPillsVariant;
  children: ReactNode;
}) {
  const styles = PILL_STYLES[variant];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      className={cn(styles.base, active ? styles.active : styles.inactive)}
    >
      {children}
    </motion.button>
  );
}
