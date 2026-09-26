import { CheckCircle2, Globe, Languages, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import {
  SHOWCASE_LANGUAGES,
  type ShowcaseLanguage,
} from "@/components/landing/language-showcase-data";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

export { SHOWCASE_LANGUAGES };
export type { ShowcaseLanguage };

export function BilingualSection() {
  const { t, i18n } = useTranslation("landing");
  const prefersReduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through languages slowly every 4 seconds unless hovered or reduced-motion
  const nextLanguage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SHOWCASE_LANGUAGES.length);
  }, []);

  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const interval = setInterval(nextLanguage, 4000);
    return () => clearInterval(interval);
  }, [nextLanguage, prefersReduced, isPaused]);

  const activeLang = SHOWCASE_LANGUAGES[activeIndex] || SHOWCASE_LANGUAGES[0];

  const handleSelectLanguage = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  const handleSwitchUi = (code: string) => {
    if (code === "hi" || code === "en") {
      i18n.changeLanguage(code);
    }
  };

  return (
    <section
      id="languages"
      className="relative px-6 py-20 sm:px-10 sm:py-28 bg-transparent"
    >
      {/* Subtle institutional ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--plate-accent)]/4 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 sm:gap-14">
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--plate-line)] bg-[var(--plate-ground)] px-3 py-1 font-mono text-[0.68rem] font-semibold tracking-wider text-[var(--plate-accent-deep)] uppercase">
                <Globe className="size-3 text-[var(--plate-accent-deep)]" aria-hidden />
                22 Scheduled Indian Languages
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--plate-ink)] sm:text-4xl">
              Ask SAATHI in your language.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
              {t("bilingual.body")}
            </p>
          </Reveal>

          <div className="flex items-center gap-3 pt-2 md:pt-0">
            <span className="font-mono text-xs font-medium text-[var(--plate-muted)]">
              App Language:
            </span>
            <LandingLanguageToggle />
          </div>
        </div>

        {/* Showcase Grid: Spotlight Card + Interactive Language Matrix */}
        <div
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Column: Active Language Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--plate-line)] bg-[var(--plate-ground)] p-6 shadow-sm transition-all duration-300 sm:p-8">
              {/* Subtle accent backdrop */}
              <div className="pointer-events-none absolute top-0 right-0 size-48 rounded-full bg-gradient-to-br from-[var(--plate-accent)]/10 via-transparent to-transparent blur-2xl" />

              <div className="relative z-10 flex min-h-[360px] flex-col justify-between gap-6">
                {/* Spotlight Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[var(--plate-line)]/70 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--plate-accent)]/12 px-3 py-1 font-mono text-xs font-bold text-[var(--plate-accent-deep)]">
                    <Sparkles className="size-3" aria-hidden />
                    {activeLang.greeting} • {activeLang.englishName}
                  </span>
                  <span className="rounded border border-[var(--plate-line)] bg-[var(--plate-surface)] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-[var(--plate-muted)]">
                    {activeLang.script} Script
                  </span>
                </div>

                {/* Animated Language Presentation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLang.code}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight text-[var(--plate-ink)] sm:text-4xl">
                        {activeLang.nativeName}
                      </h3>
                      <p className="mt-1 font-sans text-sm font-medium text-[var(--plate-accent-deep)] sm:text-base">
                        {activeLang.prompt}
                      </p>
                    </div>

                    {/* Simulated Query Showcase */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--plate-line)] bg-[var(--plate-surface)]/70 p-4">
                      <span className="font-mono text-[0.65rem] font-bold tracking-widest text-[var(--plate-muted)] uppercase">
                        Real-World Query Simulation
                      </span>
                      <blockquote
                        className="text-sm leading-relaxed font-medium text-[var(--plate-ink)]"
                        dir={activeLang.dir}
                      >
                        “{activeLang.sampleQuery}”
                      </blockquote>
                      <div className="flex items-center gap-1.5 border-t border-[var(--plate-line)]/60 pt-2.5 font-mono text-[0.68rem] text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{activeLang.standardClause}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Spotlight Footer Controls */}
                <div className="flex items-center justify-between border-t border-[var(--plate-line)]/70 pt-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        isPaused
                          ? "bg-amber-500"
                          : "bg-emerald-500 animate-pulse",
                      )}
                      aria-hidden
                    />
                    <span className="font-mono text-[0.68rem] text-[var(--plate-muted)]">
                      {isPaused
                        ? "Interactive preview (paused)"
                        : "Cycling all 22 languages"}
                    </span>
                  </div>

                  {(activeLang.code === "hi" || activeLang.code === "en") && (
                    <button
                      type="button"
                      onClick={() => handleSwitchUi(activeLang.code)}
                      className="cursor-pointer font-mono text-xs font-bold text-[var(--plate-accent-deep)] underline decoration-[var(--plate-accent-deep)]/40 underline-offset-4 hover:decoration-[var(--plate-accent-deep)]"
                    >
                      Use {activeLang.nativeName} in UI
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 22-Language Interactive Matrix */}
          <div className="flex flex-col gap-3 lg:col-span-7">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--plate-muted)] uppercase">
                Select a language to inspect ({SHOWCASE_LANGUAGES.length} Total)
              </span>
              <span className="font-mono text-xs text-[var(--plate-accent-deep)]">
                Active: {activeLang.englishName}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Supported Indian Languages"
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4"
            >
              {SHOWCASE_LANGUAGES.map((lang, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    tabIndex={0}
                    onClick={() => handleSelectLanguage(index)}
                    onFocus={() => handleSelectLanguage(index)}
                    className={cn(
                      "group relative flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer select-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plate-accent)]",
                      isActive
                        ? "border-[var(--plate-accent)] bg-[var(--plate-accent)]/12 shadow-xs ring-1 ring-[var(--plate-accent)]"
                        : "border-[var(--plate-line)] bg-[var(--plate-ground)] hover:border-[var(--plate-accent-line)] hover:bg-[var(--plate-surface)]/60",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span
                        className={cn(
                          "truncate text-sm font-bold tracking-tight transition-colors",
                          isActive
                            ? "text-[var(--plate-accent-deep)] dark:text-[var(--plate-accent)]"
                            : "text-[var(--plate-ink)] group-hover:text-[var(--plate-accent-deep)]",
                        )}
                        dir={lang.dir}
                      >
                        {lang.nativeName}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="active-lang-dot"
                          className="size-1.5 shrink-0 rounded-full bg-[var(--plate-accent-deep)] dark:bg-[var(--plate-accent)]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </div>
                    <span className="mt-1 font-mono text-[0.68rem] text-[var(--plate-muted)]">
                      {lang.englishName}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-2 px-1 text-xs text-[var(--plate-muted)]">
              All 22 languages recognized under the Eighth Schedule of the Constitution of India are natively mapped to authentic BIS standard clauses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
