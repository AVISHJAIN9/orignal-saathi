import {
  AlertOctagon,
  Building,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

export function TermsSection() {
  const { t } = useTranslation("legal");

  const rawAcceptableUseItems = t("terms.sections.acceptableUse.items", {
    returnObjects: true,
  });
  const acceptableUseItems = Array.isArray(rawAcceptableUseItems)
    ? (rawAcceptableUseItems as string[])
    : [];

  const rawAccuracyItems = t("terms.sections.accuracy.items", {
    returnObjects: true,
  });
  const accuracyItems = Array.isArray(rawAccuracyItems)
    ? (rawAccuracyItems as string[])
    : [];

  return (
    <section id="terms" className="scroll-mt-32 px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="flex flex-col items-start gap-3 border-b border-[var(--plate-line)]/70 pb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--plate-line)] bg-card/70 px-3.5 py-1 font-mono text-2xs font-semibold tracking-[0.2em] text-[var(--plate-accent-deep)] uppercase">
              <FileText
                className="size-3.5 text-[var(--plate-accent-deep)]"
                aria-hidden
              />
              {t("terms.eyebrow")}
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-3xl lg:text-4xl">
              {t("terms.heading")}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
              {t("terms.intro")}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-10">
            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <Compass className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("terms.sections.purpose.title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("terms.sections.purpose.content")}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <ShieldCheck className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("terms.sections.acceptableUse.title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("terms.sections.acceptableUse.content")}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {acceptableUseItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--plate-ink)]/90 sm:text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--plate-accent-deep)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <AlertOctagon className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("terms.sections.accuracy.title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("terms.sections.accuracy.content")}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {accuracyItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--plate-ink)]/90 sm:text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--plate-accent-deep)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="size-4.5 text-[var(--plate-accent-deep)]" />
                    <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                      {t("terms.sections.officialSources.title")}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("terms.sections.officialSources.content")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="size-4.5 text-[var(--plate-accent-deep)]" />
                    <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                      {t("terms.sections.ip.title")}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("terms.sections.ip.content")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <Scale className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("terms.sections.limitation.title")}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("terms.sections.limitation.content")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="size-4.5 text-[var(--plate-accent-deep)]" />
                    <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                      {t("terms.sections.changesService.title")}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("terms.sections.changesService.content")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4.5 text-[var(--plate-accent-deep)]" />
                    <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                      {t("terms.sections.changesTerms.title")}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("terms.sections.changesTerms.content")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
