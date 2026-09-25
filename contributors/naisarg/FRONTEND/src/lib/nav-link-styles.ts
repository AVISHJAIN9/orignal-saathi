import { cn } from "@/lib/utils";

/**
 * The one hover/active treatment for every top-level nav link and nav
 * button in both persistent headers (AppHeader and LandingNav) — color
 * transition plus a primary underline that sweeps in on hover. Both headers
 * build their link classes from here so the two can't drift apart again.
 *
 * `tone` only swaps the color tokens: LandingNav sits inside
 * `.saathi-landing`, where the `--plate-*` tokens are defined for both
 * themes; AppHeader renders outside that scope, so it uses the app's
 * standard foreground/muted tokens instead.
 */
type NavTone = "plate" | "app";

const TONE_CLASSES: Record<NavTone, { active: string; idle: string }> = {
  plate: {
    active: "text-[var(--plate-ink)]",
    idle: "text-[var(--plate-muted)] hover:text-[var(--plate-ink)]",
  },
  app: {
    active: "text-foreground",
    idle: "text-muted-foreground hover:text-foreground",
  },
};

export function navLinkClassName({
  active = false,
  tone,
  className,
}: {
  active?: boolean;
  tone: NavTone;
  className?: string;
}) {
  const colors = TONE_CLASSES[tone];
  return cn(
    "group relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 xl:px-3.5",
    active ? colors.active : colors.idle,
    className,
  );
}

/** Hover underline for a link styled with navLinkClassName — render as
 * `<span aria-hidden className={NAV_LINK_UNDERLINE_CLASS} />`, the link's
 * last child. */
export const NAV_LINK_UNDERLINE_CLASS =
  "pointer-events-none absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 ease-out group-hover:scale-x-100 rtl:origin-right";
