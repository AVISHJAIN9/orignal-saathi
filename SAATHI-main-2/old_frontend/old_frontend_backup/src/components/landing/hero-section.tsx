import { useTranslation } from "react-i18next";

import { HeroDemo } from "@/components/landing/hero-demo";
import { HeroSheen } from "@/components/landing/hero-sheen";
import { StartChattingCta } from "@/components/landing/start-chatting-cta";

export function HeroSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="relative grid grid-cols-1 items-center gap-12 overflow-hidden px-6 pt-6 pb-20 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:pt-12 lg:pb-32">
      <HeroSheen />
      <div className="relative z-10 flex flex-col gap-6">
        <p className="font-mono text-xs font-medium tracking-[0.18em] text-[var(--plate-muted)] uppercase">
          {t("hero.kicker")}
        </p>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-[var(--plate-ink)] sm:text-5xl lg:text-[3.25rem]">
          {t("hero.heading")}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg">
          {t("hero.subheading")}
        </p>
        <div>
          <StartChattingCta className="mt-2">{t("hero.cta")}</StartChattingCta>
        </div>
      </div>
      <div className="relative z-10 flex justify-center lg:justify-end">
        <HeroDemo />
      </div>
    </section>
  );
}
