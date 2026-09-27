import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MarkPlate, type MarkType } from "@/components/landing/mark-plate";

const HOLD_MS = 4200;

interface HeroExample {
  kind: "cited" | "declined";
  question: string;
  answer: string;
  standard?: string;
  markType?: MarkType;
}

/**
 * Live-resolving demo cycling through every real seed example — proving
 * SAATHI's citation-required mechanism across the schemes it actually
 * covers (ISI, Hallmark, ...) before any copy explains it, plus one real
 * declined question resolving into an honestly empty plate.
 *
 * Each cycle plays as a physical "stamp impact": the card tilts back in 3D
 * as if lifted off the page, then slams down flat with a spring overshoot,
 * landing right as an impact ring pulses outward from the plate — but only
 * for a verified (cited) result. A decline gets the same descent without
 * the ring: honesty about "no standard found" isn't something to
 * celebrate with a flourish, so it resolves quietly instead.
 */
export function HeroDemo() {
  const { t } = useTranslation("landing");
  const rawExamples = t("hero.example.examples", { returnObjects: true });
  const examples = (Array.isArray(rawExamples) ? rawExamples : []) as HeroExample[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (examples.length === 0) return;
    const timer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % examples.length);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [index, examples.length]);

  const current = examples[index] || {
    question: "",
    kind: "cited",
    plate: "",
  };
  const isCited = current.kind === "cited";

  return (
    <div className="flex w-full max-w-md flex-col gap-4" style={{ perspective: 1000 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, rotateX: -32, y: -28, scale: 0.9 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, rotateX: 16, y: -8, scale: 0.95, transition: { duration: 0.16 } }}
          transition={{ type: "spring", stiffness: 300, damping: 16, mass: 0.8 }}
          style={{ transformOrigin: "top center" }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-[var(--plate-muted)]">{current.question}</p>
          <div className="relative">
            {isCited && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0.4, scale: 0.75 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
                className="absolute inset-0 rounded-sm border-2 border-[var(--plate-accent)]"
              />
            )}
            <MarkPlate
              variant={current.kind}
              markType={current.markType}
              standard={current.standard}
              label={isCited ? t("hero.example.citedLabel") : t("hero.example.declinedLabel")}
            />
          </div>
          <p className="text-sm leading-relaxed text-[var(--plate-ink)]">{current.answer}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
