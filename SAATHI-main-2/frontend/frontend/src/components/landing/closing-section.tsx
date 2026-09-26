import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { AskSaathiEffect } from "@/components/apple-hello-effect";
import { HeroSheen } from "@/components/landing/hero-sheen";
import { StartChattingCta } from "@/components/landing/start-chatting-cta";

export function ClosingSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="relative overflow-hidden bg-[var(--plate-accent-ground)] px-6 py-24 text-center text-[var(--plate-on-accent)] sm:px-10 sm:py-32">
      <HeroSheen tone="dark" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-8"
      >
        <h2 className="sr-only">
          {t("closing.heading")}
        </h2>
        <div aria-hidden="true" className="w-full flex items-center justify-center text-[var(--plate-on-accent)] min-h-[4rem] sm:min-h-[5rem]">
          <AskSaathiEffect className="h-14 sm:h-20 md:h-24 w-auto max-w-full" />
        </div>
        <StartChattingCta variant="inverse">
          {t("closing.cta")}
        </StartChattingCta>
      </motion.div>
    </section>
  );
}
