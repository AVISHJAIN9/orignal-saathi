import {
  AlertCircle,
  AlertTriangle,
  Bot,
  Database,
  FileCheck2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

export function AiDisclaimer() {
  const { t } = useTranslation("legal");

  const pointIcons = [Bot, AlertCircle, FileCheck2, Database, Sparkles];

  const points =
    (t("disclaimer.points", { returnObjects: true }) as Array<{
      title: string;
      desc: string;
    }>) || [];

  return (
    <section
      id="ai-disclaimer"
      className="scroll-mt-32 px-6 py-12 sm:px-10 sm:py-16"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="rounded-3xl border-2 border-amber-600/30 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm backdrop-blur-xs sm:p-10">
            <div className="flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/15 px-3.5 py-1 font-mono text-[0.68rem] font-semibold tracking-[0.2em] text-amber-900 uppercase">
                <AlertTriangle
                  className="size-3.5 text-amber-700"
                  aria-hidden
                />
                {t("disclaimer.eyebrow")}
              </span>

              <h2 className="text-2xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-3xl lg:text-4xl">
                {t("disclaimer.heading")}
              </h2>

              <p className="text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("disclaimer.subheading")}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-600/40 bg-amber-500/20 p-5 text-sm font-medium leading-relaxed text-amber-950 sm:p-6 sm:text-base">
              <div className="flex items-start gap-3.5">
                <AlertTriangle
                  className="mt-0.5 size-5 shrink-0 text-amber-700"
                  aria-hidden
                />
                <p>{t("disclaimer.banner")}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {points.map((pt, idx) => {
                const Icon = pointIcons[idx % pointIcons.length] || HelpCircle;
                const isFull =
                  idx === points.length - 1 && points.length % 2 !== 0;

                return (
                  <div
                    key={pt.title}
                    className={`flex flex-col justify-between rounded-2xl border border-amber-600/20 bg-white/60 p-5 shadow-xs transition-colors hover:bg-white/80 ${
                      isFull ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div>
                      <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800">
                        <Icon className="size-4.5" />
                      </div>
                      <h3 className="mt-3.5 text-base font-semibold text-[var(--plate-ink)]">
                        {pt.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                        {pt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
