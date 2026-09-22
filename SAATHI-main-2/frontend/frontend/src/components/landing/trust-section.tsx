import { BadgeCheck, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

export function TrustSection() {
  const { t } = useTranslation("landing");

  return (
    <section
      id="why"
      className="bg-[var(--plate-accent-ground)] px-6 py-20 text-[var(--plate-on-accent)] sm:px-10 sm:py-28"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <Reveal className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center rounded-full border border-[var(--plate-on-accent)]/25 px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide text-[var(--plate-on-accent)]/70 uppercase">
            {t("trust.eyebrow")}
          </span>
          <h2 className="font-serif text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            {t("trust.heading")}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--plate-on-accent)]/85 sm:text-lg">
            {t("trust.body")}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-4 grid grid-cols-1 gap-6 border-t border-[var(--plate-accent-line)] pt-8 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <BadgeCheck
                  className="size-4 shrink-0 text-[var(--plate-on-accent)]/70"
                  aria-hidden
                />
                <span className="font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-[var(--plate-on-accent)]/70 uppercase">
                  {t("hero.demo.citedLabel")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--plate-on-accent)]/90">
                {t("trust.citedPoint")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <SearchX
                  className="size-4 shrink-0 text-[var(--plate-on-accent)]/70"
                  aria-hidden
                />
                <span className="font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-[var(--plate-on-accent)]/70 uppercase">
                  {t("hero.demo.declinedLabel")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--plate-on-accent)]/90">
                {t("trust.declinedPoint")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
