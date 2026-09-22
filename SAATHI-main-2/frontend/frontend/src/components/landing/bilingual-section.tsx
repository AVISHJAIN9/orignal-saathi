import { useTranslation } from "react-i18next";

import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import { Reveal } from "@/components/landing/reveal";

export function BilingualSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-start gap-6 border-l-2 border-[var(--plate-accent)] pl-6 sm:pl-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-3xl">
          {t("bilingual.heading")}
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
          {t("bilingual.body")}
        </p>
        <LandingLanguageToggle />
      </Reveal>
    </section>
  );
}
