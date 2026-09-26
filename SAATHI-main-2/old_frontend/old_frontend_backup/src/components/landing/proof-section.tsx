import { useTranslation } from "react-i18next";

import { MarkPlate, type MarkType } from "@/components/landing/mark-plate";
import { Reveal } from "@/components/landing/reveal";

interface ProofItem {
  question: string;
  answer: string;
  standard: string;
  markType: MarkType;
}

export function ProofSection() {
  const { t } = useTranslation("landing");
  const items = t("proof.items", { returnObjects: true }) as ProofItem[];

  return (
    <section className="bg-[var(--plate-surface)] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-4xl">
            {t("proof.heading")}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {items.map((item, i) => (
            <Reveal key={item.standard} delay={i * 0.1} className="flex flex-col gap-4">
              <MarkPlate
                variant="cited"
                markType={item.markType}
                label={t("hero.demo.citedLabel")}
                standard={item.standard}
              />
              <p className="text-sm font-medium text-[var(--plate-ink)]">{item.question}</p>
              <p className="text-sm leading-relaxed text-[var(--plate-muted)]">{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
