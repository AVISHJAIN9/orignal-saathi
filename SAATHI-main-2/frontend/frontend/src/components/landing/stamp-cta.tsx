import { motion } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { Link } from "@/lib/router-compat";

import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

interface StampCtaProps {
  to: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "inverse";
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * The page's one CTA vocabulary: a press-then-settle "stamp" on tap, reused
 * for every call to action. The tap adds a slight forward rotateX on top of
 * the existing scale-down — real perspective tilt, not just a flat shrink —
 * so it reads as the button physically pressing down into the page, the
 * same tactile idea as MarkPlate's cursor-tracked tilt elsewhere on this
 * page. Kept small (6deg) since this fires on every click; a subtler nudge
 * reads as "pressed" without calling attention to itself.
 */
export function StampCta({
  to,
  children,
  variant = "solid",
  className,
  onClick,
}: StampCtaProps) {
  return (
    <MotionLink
      to={to}
      onClick={onClick}
      whileTap={{ scale: 0.94, rotateX: 6, y: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      style={{ transformPerspective: 400 }}
      className={cn(
        "elevation-1 elevation-lift inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-xs font-semibold tracking-[0.15em] uppercase transition-all sm:text-sm",
        variant === "solid" &&
          "[box-shadow:inset_0_1px_0_var(--plate-shadow-light),inset_0_-2px_4px_var(--plate-shadow-dark),var(--shadow-elevation-1)] hover:[box-shadow:inset_0_1px_0_var(--plate-shadow-light),inset_0_-2px_4px_var(--plate-shadow-dark),var(--shadow-elevation-1-hover)] bg-[var(--plate-accent-deep)] text-[var(--plate-on-accent)] hover:bg-[var(--plate-accent-ground)]",
        variant === "outline" &&
          "border border-[var(--plate-ink)]/25 text-[var(--plate-ink)] hover:bg-[var(--plate-ink)]/5",
        variant === "inverse" &&
          "[box-shadow:inset_0_1px_0_var(--plate-shadow-light),inset_0_-2px_4px_var(--plate-shadow-dark),var(--shadow-elevation-1)] hover:[box-shadow:inset_0_1px_0_var(--plate-shadow-light),inset_0_-2px_4px_var(--plate-shadow-dark),var(--shadow-elevation-1-hover)] bg-[var(--plate-ground)] text-[var(--plate-accent-deep)] hover:bg-[var(--plate-ground-deep)]",
        className,
      )}
    >
      {children}
    </MotionLink>
  );
}
