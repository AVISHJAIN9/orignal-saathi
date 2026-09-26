import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface BrandMarkProps extends ComponentProps<"span"> {
  size?: "sm" | "md";
  /** The decorative rivet dot. Off where it could be misread as a
   * presence/"online" indicator (the header logo, the chat empty state). */
  punchDot?: boolean;
}

/**
 * The SAATHI mark: a serif "S" set in a rounded plate with a hairline inner
 * rim and a single punch-dot — a stamped-certification-plate motif (see the
 * BIS-mark plates on the landing page, src/components/landing/mark-plate.tsx)
 * rendered in Fraunces (font-serif) rather than the UI's default Geist, so
 * the mark reads as an engraved seal, not a generic app icon. Sizes are kept
 * in one place so the sidebar, chat header, and bot-message avatar all stamp
 * the same mark at different scales.
 *
 * Props extend a plain <span>, not just {className, size} — callers already
 * pass span attributes straight through (e.g. classification-wizard-workbench.tsx's
 * `aria-hidden` on its loading-state mark), so this must accept and forward
 * them rather than silently dropping anything beyond className/size.
 * `--primary`/`--primary-foreground` are theme tokens (see src/styles.css),
 * so the plate and its rim/dot invert correctly in dark mode with no
 * separate dark-mode styling needed here.
 */
export function BrandMark({
  className,
  size = "md",
  punchDot = true,
  ...props
}: BrandMarkProps) {
  return (
    <span
      aria-hidden
      {...props}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-lg bg-primary font-serif font-semibold text-primary-foreground ring-1 ring-inset ring-primary-foreground/25 shadow-[var(--shadow-elevation-1)]",
        size === "sm" ? "size-6 text-xs" : "size-8 text-base",
        className,
      )}
    >
      S
      {/* The "punch-dot" — a single small rivet mark, echoing the corner
          punch on a physical stamped certification plate. */}
      {punchDot && (
        <span
          aria-hidden
          className="absolute end-[16%] top-[16%] size-[11%] rounded-full bg-primary-foreground/70"
        />
      )}
    </span>
  );
}
