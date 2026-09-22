import { motion, MotionConfig } from "motion/react";
import { Stamp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BrandMark } from "@/components/brand-mark";

/**
 * Shown in place of the bot's reply bubble while a mock/API reply is still
 * in flight. Uses the same "stamp" visual language as the landing page's
 * MarkPlate and stamp-impact demo — a small seal repeatedly pressing down,
 * with an impact ring pulsing outward on each press — so the wait state
 * reads as "verifying against a standard," not a generic loading spinner.
 * This is the one branded moment inside the actual product (not just
 * marketing) that most directly reinforces SAATHI's citation-required
 * premise, since it plays on every single query.
 *
 * The whole indicator (not just the internal pulse) is wrapped in
 * MotionConfig so its mount/unmount fade — matching ChatBubble's own
 * entrance — also honours prefers-reduced-motion; render it inside an
 * AnimatePresence at the call site so the exit transition actually plays.
 */
export function ThinkingIndicator() {
  const { t } = useTranslation("chat");

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className="flex max-w-[85%] items-end gap-2 self-start sm:max-w-[75%]"
      >
        <BrandMark size="sm" className="mb-0.5" />
        <div
          role="status"
          aria-label={t("thinking")}
          className="elevation-1 flex items-center gap-2.5 rounded-2xl rounded-bl-sm bg-card px-4 py-3"
        >
          <div
            className="relative flex size-5 shrink-0 items-center justify-center"
            style={{ perspective: 200 }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border-[1.5px] border-primary/50"
              animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.3, 1.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden
              className="relative flex items-center justify-center text-primary"
              style={{ transformOrigin: "center" }}
              animate={{ rotateX: [0, 32, 0], scale: [1, 0.88, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 1],
              }}
            >
              <Stamp className="size-4" />
            </motion.span>
          </div>
          <span className="text-sm text-muted-foreground">{t("thinking")}</span>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
