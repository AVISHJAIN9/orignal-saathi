import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface StatItem {
  value: string;
  suffix?: string;
  label: string;
}

/**
 * A band of big impact numbers, the device that makes institutional landing
 * pages (e.g. itaipu.energy) feel substantial — translated here into SAATHI's
 * plate palette rather than a photographic corporate look, so it reinforces
 * the verification identity instead of diluting it. The figures are SAATHI's
 * actual promise made numeric (verified standards, 100% cited, 0 invented),
 * and each counts up from zero the first time the band scrolls into view,
 * reusing the same count-up idea as the admin KPI cards.
 */
export function StatsSection() {
  const { t } = useTranslation("landing");
  const items = t("stats.items", { returnObjects: true }) as StatItem[];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="border-y border-[var(--plate-line)] bg-[var(--plate-ground-deep)] px-6 py-20 sm:px-10 sm:py-28">
      <div ref={ref} className="mx-auto flex max-w-5xl flex-col gap-14">
        <h2 className="max-w-2xl font-serif text-3xl leading-tight font-semibold tracking-tight text-[var(--plate-accent-deep)] sm:text-4xl">
          {t("stats.heading")}
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.1 }}
              className="flex flex-col gap-3 border-l-2 border-[var(--plate-accent)]/30 pl-5"
            >
              <StatNumber value={item.value} suffix={item.suffix} play={inView} />
              <p className="text-sm leading-relaxed text-[var(--plate-muted)]">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatNumber({ value, suffix, play }: { value: string; suffix?: string; play: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const rawTarget = Number(value.replace(/,/g, ""));
  const parseable = !Number.isNaN(rawTarget);
  const hasComma = value.includes(",");
  const [display, setDisplay] = useState(parseable && !prefersReducedMotion ? "0" : value);

  useEffect(() => {
    if (!play || !parseable || prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, rawTarget, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        setDisplay(hasComma ? rounded.toLocaleString() : String(rounded));
      },
    });
    return () => controls.stop();
  }, [play, parseable, prefersReducedMotion, rawTarget, value, hasComma]);

  return (
    <span className="font-serif text-4xl font-semibold tracking-tight text-[var(--plate-ink)] tabular-nums sm:text-5xl lg:text-6xl">
      {display}
      {suffix}
    </span>
  );
}
