import { useTranslation } from "react-i18next";

import { HeroDemo } from "@/components/landing/hero-demo";
import { HeroSheen } from "@/components/landing/hero-sheen";
import { StartChattingCta } from "@/components/landing/start-chatting-cta";
import { TextRoll } from "@/components/landing/text-roll";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { t, i18n } = useTranslation("landing");
  const { resolvedTheme } = useTheme();

  const isEnglish = i18n.language === "en";

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
        <p
          className={cn(
            "text-xs font-medium text-[var(--plate-muted)]",
            isEnglish
              ? "flex flex-wrap gap-x-[0.35em] font-mono tracking-[0.18em] uppercase"
              : "font-sans leading-relaxed tracking-normal normal-case sm:text-sm"
          )}
        >
          {isEnglish ? (
            kickerWords.map((word, i) => (
              <TextRoll key={i} center className="cursor-pointer">
                {word}
              </TextRoll>
            ))
          ) : (
            kickerText
          )}
        </p>
        <h1
          className={cn(
            "flex flex-wrap gap-x-[0.3em] font-semibold text-[var(--plate-ink)] sm:text-5xl lg:text-[3.25rem]",
            isEnglish
              ? "text-4xl leading-[1.05] tracking-tight"
              : "text-3xl leading-[1.25] tracking-normal font-bold"
          )}
        >
          {headingWords.map((word, i) => (
            <TextRoll key={i} center className="cursor-pointer">
              {word}
            </TextRoll>
          ))}
        </h1>
        <p
          className={cn(
            "max-w-md text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg",
            isEnglish ? "flex flex-wrap gap-x-[0.3em]" : "block"
          )}
        >
          {isEnglish ? (
            subheadingWords.map((word, i) => (
              <TextRoll key={i} center className="cursor-pointer">
                {word}
              </TextRoll>
            ))
          ) : (
            subheadingText
          )}
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
