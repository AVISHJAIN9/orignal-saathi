import { motion, useReducedMotion } from "motion/react";

import { BrandMark } from "@/components/brand-mark";
import { ENTRANCE_TRANSITION } from "@/lib/motion";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

const WORDMARK = "SAATHI";

interface SaathiLogoProps {
  className?: string;
  markSize?: "sm" | "md";
  markClassName?: string;
  /** Hide the wordmark at narrow widths by passing e.g. "hidden sm:inline-flex". */
  wordmarkClassName?: string;
  showWordmark?: boolean;
}

/**
 * The one mark+wordmark lockup for every persistent nav bar (global header,
 * landing nav, standards nav) — always a <Link to="/"> with the same
 * entrance/hover motion, so "go to home" is one consistent click target
 * instead of each nav hand-rolling its own BrandMark + "SAATHI" text pairing
 * (which is how the app ended up with three slightly different logo
 * treatments before this).
 *
 * Motion: the mark springs in and staggers the wordmark in letter-by-letter
 * using this app's one shared entrance curve (see src/lib/motion.ts) rather
 * than a new curve; hover tilts/scales the mark and sweeps a light sheen
 * across it; tap presses it down slightly. All of it is skipped under
 * prefers-reduced-motion, per useReducedMotion().
 */
export function SaathiLogo({
  className,
  markSize = "md",
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: SaathiLogoProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Link
      to="/"
      aria-label="SAATHI — go to home"
      className={cn(
        "group relative inline-flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      <motion.span
        className={cn(
          "relative inline-flex overflow-hidden rounded-lg",
          markClassName,
        )}
        initial={
          prefersReducedMotion
            ? undefined
            : { scale: 0.6, opacity: 0, rotate: -8 }
        }
        animate={
          prefersReducedMotion ? undefined : { scale: 1, opacity: 1, rotate: 0 }
        }
        transition={ENTRANCE_TRANSITION}
        whileHover={
          prefersReducedMotion ? undefined : { rotate: -6, scale: 1.06 }
        }
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      >
        <BrandMark size={markSize} punchDot={false} />
        {!prefersReducedMotion && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 w-1/3 -skew-x-[20deg] bg-primary-foreground/30"
            initial={{ x: "-150%" }}
            whileHover={{ x: "350%" }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </motion.span>

      {showWordmark && (
        <span
          dir="ltr"
          className={cn(
            "-me-[0.16em] font-serif text-[0.95rem] leading-none font-semibold tracking-[0.16em] text-foreground transition-colors duration-200 group-hover:text-primary",
            wordmarkClassName,
          )}
        >
          {WORDMARK.split("").map((letter, index) =>
            prefersReducedMotion ? (
              <span key={index}>{letter}</span>
            ) : (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ENTRANCE_TRANSITION, delay: index * 0.03 }}
              >
                {letter}
              </motion.span>
            ),
          )}
        </span>
      )}
    </Link>
  );
}
