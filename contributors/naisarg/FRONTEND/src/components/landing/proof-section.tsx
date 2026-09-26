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
    <section className="bg-[var(--plate-surface)] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 sm:gap-16">
        <Reveal>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-[var(--plate-ink)] sm:text-5xl lg:text-[3.25rem]">
            {t("proof.heading")}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-12 xl:gap-14">
          {items.map((item, i) => (
            <Reveal
              key={item.standard}
              delay={i * 0.1}
              className="flex flex-col gap-6 sm:gap-7"
            >
              <MarkPlate
                variant="cited"
                markType={item.markType}
                label={t("hero.demo.citedLabel")}
                standard={item.standard}
              />
              <div className="flex flex-col gap-3 sm:gap-3.5">
                <h3 className="text-xl font-bold tracking-tight text-[var(--plate-ink)] sm:text-2xl lg:text-[1.75rem] lg:leading-[1.3]">
                  {item.question}
                </h3>
                <p className="text-base font-normal leading-relaxed text-[var(--plate-muted)] sm:text-lg lg:text-xl lg:leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
