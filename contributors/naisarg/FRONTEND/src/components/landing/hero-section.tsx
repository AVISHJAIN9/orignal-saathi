import { useTranslation } from "react-i18next";

import { HeroDemo } from "@/components/landing/hero-demo";
import { HeroSheen } from "@/components/landing/hero-sheen";
import { StartChattingCta } from "@/components/landing/start-chatting-cta";
import { TextRoll } from "@/components/landing/text-roll";
import { useTheme } from "@/components/theme-provider";

export function HeroSection() {
  const { t } = useTranslation("landing");
  const { resolvedTheme } = useTheme();

  const kickerText = t("hero.kicker");
  const headingText = t("hero.heading");
  const subheadingText = t("hero.subheading");

  const kickerWords = kickerText.split(" ");
  const headingWords = headingText.split(" ");
  const subheadingWords = subheadingText.split(" ");

  return (
    <section className="relative grid grid-cols-1 items-center gap-12 overflow-hidden px-6 pt-6 pb-20 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:pt-12 lg:pb-32">
      <HeroSheen tone={resolvedTheme === "dark" ? "dark" : "light"} />
      <div className="relative z-10 flex flex-col gap-6">
        <p className="flex flex-wrap gap-x-[0.35em] font-mono text-xs font-medium tracking-[0.18em] text-[var(--plate-muted)] uppercase">
          {kickerWords.map((word, i) => (
            <TextRoll key={i} center className="cursor-pointer">
              {word}
            </TextRoll>
          ))}
        </p>
        <h1 className="flex flex-wrap gap-x-[0.3em] text-4xl leading-[1.05] font-semibold tracking-tight text-[var(--plate-ink)] sm:text-5xl lg:text-[3.25rem]">
          {headingWords.map((word, i) => (
            <TextRoll key={i} center className="cursor-pointer">
              {word}
            </TextRoll>
          ))}
        </h1>
        <p className="flex max-w-md flex-wrap gap-x-[0.3em] text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg">
          {subheadingWords.map((word, i) => (
            <TextRoll key={i} center className="cursor-pointer">
              {word}
            </TextRoll>
          ))}
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
