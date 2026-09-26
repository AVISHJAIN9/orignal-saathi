import type { Transition } from "motion/react";

/**
 * The one entrance easing for content revealing into place (landing
 * sections, page mounts, list stagger) — originated in
 * src/components/landing/reveal.tsx. Import this instead of hand-typing a
 * new spring/duration per component, which is how the app ended up with a
 * different curve on nearly every page (stats-section's spring(120,18),
 * audience-card's cubic-bezier(.23,1,.32,1), renewal-wizard's easeOut@220ms,
 * etc.) instead of one shared identity.
 *
 * Chat's in-conversation bubbles (chat-bubble.tsx, thinking-indicator.tsx)
 * intentionally keep their own snappier spring(360,28) — a deliberate
 * "faster because it's mid-conversation, not a page reveal" variant, not an
 * oversight to migrate onto this constant.
 */
export const ENTRANCE_TRANSITION: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 18,
};

/** Default delay step between successive items in a staggered list/grid. */
export const STAGGER_STEP_SECONDS = 0.08;

/**
 * Entrance transition for the Nth item in a staggered list — same curve as
 * ENTRANCE_TRANSITION, offset by `index * step`.
 */
export function staggerTransition(
  index: number,
  step: number = STAGGER_STEP_SECONDS,
): Transition {
  return { ...ENTRANCE_TRANSITION, delay: index * step };
}
