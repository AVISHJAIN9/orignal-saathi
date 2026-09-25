import { ExternalLink, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

export function AuthorityNotice() {
  const { t } = useTranslation("legal");

  return (
    <section
      id="authority"
      className="scroll-mt-32 px-6 py-12 sm:px-10 sm:py-16"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="rounded-3xl border border-[var(--plate-line)] bg-gradient-to-r from-[var(--plate-accent-deep)]/10 via-white/50 to-[var(--plate-accent-deep)]/5 p-6 backdrop-blur-xs sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--plate-accent-deep)] text-foreground shadow-sm">
                <Landmark className="size-6" />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("authority.title")}
                </h3>

                <p className="text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                  {t("authority.content")}{" "}
                  <a
                    href="https://www.bis.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[var(--plate-accent-deep)] underline decoration-[var(--plate-accent-deep)]/40 underline-offset-4 hover:decoration-[var(--plate-accent-deep)]"
                  >
                    <span>{t("authority.portalName")}</span>
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                  .
                </p>

                <div className="mt-2 rounded-xl border border-[var(--plate-line)]/60 bg-card/70 p-3.5 font-mono text-xs leading-relaxed text-[var(--plate-muted)]">
                  {t("authority.context")}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
