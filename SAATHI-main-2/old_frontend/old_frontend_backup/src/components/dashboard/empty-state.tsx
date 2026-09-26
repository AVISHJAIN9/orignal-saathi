import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
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
