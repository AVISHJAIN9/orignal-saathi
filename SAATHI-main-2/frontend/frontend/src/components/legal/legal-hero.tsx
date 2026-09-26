import { Clock, Info, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

export function LegalHero() {
  const { t } = useTranslation("legal");

  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-12 sm:px-10 sm:pb-16 sm:pt-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--plate-line)] bg-card/70 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <Scale
              className="size-3.5 text-[var(--plate-accent-deep)]"
              aria-hidden
            />
            <span className="font-mono text-2xs font-semibold tracking-[0.2em] text-[var(--plate-accent-deep)] uppercase">
              {t("hero.eyebrow")}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {t("hero.heading")}
          </h1>
        </Reveal>

        <Reveal delay={0.16} className="mt-5 max-w-2xl">
          <p className="text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg">
            {t("hero.subheading")}
          </p>
        </Reveal>

        <Reveal
          delay={0.24}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-2xs font-medium tracking-wide text-amber-800">
            <Info className="size-3.5 shrink-0 text-amber-600" aria-hidden />
            {t("hero.prototypeBadge")}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--plate-line)]/70 bg-card/70 px-3.5 py-1.5 font-mono text-2xs font-medium tracking-wide text-[var(--plate-muted)] backdrop-blur-xs">
            <Clock
              className="size-3.5 shrink-0 text-[var(--plate-muted)]"
              aria-hidden
            />
            {t("hero.lastUpdated")}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
