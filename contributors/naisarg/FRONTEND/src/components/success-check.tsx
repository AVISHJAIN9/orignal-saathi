import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface SuccessCheckProps {
  className?: string;
  size?: "sm" | "md";
}

/**
 * The one shared "this completed successfully" mark — draws in the same
 * ring + checkmark geometry as BisSeal (see bis-marks.tsx) via an animated
 * stroke (pathLength 0→1) rather than popping in as a static icon. Reused
 * everywhere a completion moment needs it (draft saved, document uploaded,
 * application submitted, chat send confirmed) so the app has one success
 * animation, not five different checkmarks.
 *
 * Deliberately NOT used on legal/consent pages (e.g. DPDP consent
 * acceptance) — those stay fully static per the neutral-tone guardrail;
 * this is a restrained confirmation, not a celebration, but the guardrail
 * calls for zero motion there, not just zero color.
 */
export function SuccessCheck({ className, size = "md" }: SuccessCheckProps) {
  const prefersReducedMotion = useReducedMotion();
  const dimension = size === "sm" ? "size-8" : "size-14";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(dimension, "text-primary", className)}
      aria-hidden="true"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M8.5 12 L11 14.5 L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
          delay: prefersReducedMotion ? 0 : 0.35,
        }}
      />
    </svg>
  );
}
