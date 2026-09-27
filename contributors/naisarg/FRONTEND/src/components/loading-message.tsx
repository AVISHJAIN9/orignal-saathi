import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingMessageProps {
  messages: string[];
  className?: string;
  intervalMs?: number;
}

/**
 * Rotating short loading copy for lighter waits (page loads, draft resume,
 * calendar export). NEVER use this on a compliance-verdict computation —
 * QCO applicability, Compliance Gap, Readiness, or Revision results — those
 * stay neutral and static per the guardrail; this is for mundane data
 * fetches where a little warmth is welcome (see sample-tracker-page.tsx's
 * application list load, the one current usage).
 */
export function LoadingMessage({
  messages,
  className,
  intervalMs = 1800,
}: LoadingMessageProps) {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (safeMessages.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeMessages.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [safeMessages.length, intervalMs]);

  if (safeMessages.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
        className={className}
      >
        {safeMessages[index] || ""}
      </motion.p>
    </AnimatePresence>
  );
}
