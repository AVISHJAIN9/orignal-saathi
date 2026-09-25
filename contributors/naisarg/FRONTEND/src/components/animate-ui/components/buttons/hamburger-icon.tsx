import { motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

// Port of Codrops' "Elastic Hamburger #5": the top and bottom strokes are
// 40-unit dashes that slide along paths which curl back on themselves, so
// shortening them to 14 units and shifting them 72 units along the path
// folds each into one arm of an X, while the whole icon turns 180°. The
// middle bar never changes. All values are in the 100×100 viewBox.
const TOP_PATH =
  "m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429";
const MIDDLE_PATH = "m 70,50 h -40";
const BOTTOM_PATH =
  "m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429";

const CLOSED = { strokeDasharray: "40 82", strokeDashoffset: 0 };
const OPEN = { strokeDasharray: "14 82", strokeDashoffset: -72 };

// The original's 400ms, eased rather than sprung — a precise fold, not a
// bounce.
const FOLD_TRANSITION: Transition = { duration: 0.4, ease: [0.4, 0, 0.2, 1] };

interface HamburgerIconProps {
  open: boolean;
  className?: string;
  /** Start from the closed (hamburger) state on mount and fold into
   * `open`, instead of rendering straight into it — for a close button
   * that mounts already open. */
  animateOnMount?: boolean;
}

/**
 * Controlled hamburger ⇄ X icon. `open` comes from the caller's own state;
 * the icon has none. Strokes use currentColor, so it follows the text
 * color of whatever button it sits in, in both themes.
 */
export function HamburgerIcon({
  open,
  className,
  animateOnMount = false,
}: HamburgerIconProps) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : FOLD_TRANSITION;
  const lineProps = {
    initial: animateOnMount ? CLOSED : false,
    animate: open ? OPEN : CLOSED,
    transition,
  } as const;

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      className={cn("size-7 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      initial={animateOnMount ? { rotate: 0 } : false}
      animate={{ rotate: open ? 180 : 0 }}
      transition={transition}
    >
      <motion.path d={TOP_PATH} {...lineProps} />
      <path d={MIDDLE_PATH} />
      <motion.path d={BOTTOM_PATH} {...lineProps} />
    </motion.svg>
  );
}
