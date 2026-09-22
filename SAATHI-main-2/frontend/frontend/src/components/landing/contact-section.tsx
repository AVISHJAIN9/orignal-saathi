import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

const CONTACT_ROWS = [
  { key: "helpline", href: "tel:18001140000" },
  { key: "website", href: "https://bis.gov.in" },
  { key: "email", href: "mailto:bis-hq@bis.gov.in" },
] as const;

/** Bureau of Indian Standards' own public contact channels — the same
 * "real BIS portal, never a fabricated per-document link" rule the rest
 * of this app follows (see standard-detail.tsx's Sources tab). This is
 * BIS's contact info, not SAATHI's — the note below says so. */
export function ContactSection() {
  const { t } = useTranslation("landing");

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-[var(--plate-surface)] px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-4xl">
            {t("contact.heading")}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="flex flex-col gap-6 border-t border-[var(--plate-line)] pt-8">
            {CONTACT_ROWS.map((row) => (
              <div
                key={row.key}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <dt className="w-40 shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-[var(--plate-muted)] uppercase">
                  {t(`contact.${row.key}Label`)}
                </dt>
                <dd>
                  <a
                    href={row.href}
                    className="text-base font-medium text-[var(--plate-accent)] underline-offset-4 transition-colors hover:text-[var(--plate-accent-deep)] hover:underline sm:text-lg"
                  >
                    {t(`contact.${row.key}Value`)}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="text-sm leading-relaxed text-[var(--plate-muted)]">
            {t("contact.note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
