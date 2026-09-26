import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * A lightweight scroll-reveal: fades + lifts its children into place the first
 * time they enter the viewport, giving the landing page the "sections rise in
 * as you scroll" rhythm that makes institutional pages (e.g. itaipu.energy)
 * feel considered — without a photo-heavy reskin. `once` so sections don't
 * re-animate on scroll-back; reduced-motion is honoured globally by the
 * landing page's MotionConfig, so no per-component guard is needed here.
 *
 * `delay` lets a caller stagger a few reveals in sequence (heading, then body,
 * then a row) for a gentler cascade than everything arriving at once.
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
