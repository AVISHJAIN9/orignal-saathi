import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  // Widened from lucide's own `LucideIcon` so callers can also pass a
  // brand mark (e.g. BisSeal from bis-marks.tsx) for the empty states
  // that want SAATHI's own visual identity rather than a generic icon —
  // both shapes accept the same `className` prop.
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  heading: string;
  body: string;
  action?: ReactNode;
  compact?: boolean;
}

/** Shared empty-state visual — used both for individual section cards
 * ("No upcoming deadlines") and, at full size, for the whole-dashboard
 * "You're all caught up" state. */
export function EmptyState({
  icon: Icon,
  heading,
  body,
  action,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center"
          : "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center"
      }
    >
      <div
        className={
          compact
            ? "flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
            : "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
        }
      >
        <Icon className={compact ? "size-4" : "size-6"} aria-hidden />
      </div>
      <h3
        className={
          compact
            ? "text-sm font-semibold text-foreground"
            : "text-lg font-semibold text-foreground"
        }
      >
        {heading}
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action}
    </div>
  );
}
