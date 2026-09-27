import {
  CheckCircle2,
  Database,
  FileText,
  Lock,
  Server,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";

export function PrivacySection() {
  const { t } = useTranslation("legal");

  const rawCollection = t("privacy.sections.collection.items", {
    returnObjects: true,
  });
  const collectionItems: string[] = Array.isArray(rawCollection)
    ? (rawCollection as string[])
    : [];

  const rawUsage = t("privacy.sections.usage.items", { returnObjects: true });
  const usageItems: string[] = Array.isArray(rawUsage)
    ? (rawUsage as string[])
    : [];

  return (
    <section id="privacy" className="scroll-mt-32 px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="flex flex-col items-start gap-3 border-b border-[var(--plate-line)]/70 pb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--plate-line)] bg-card/70 px-3.5 py-1 font-mono text-2xs font-semibold tracking-[0.2em] text-[var(--plate-accent-deep)] uppercase">
              <Lock
                className="size-3.5 text-[var(--plate-accent-deep)]"
                aria-hidden
              />
              {t("privacy.eyebrow")}
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-3xl lg:text-4xl">
              {t("privacy.heading")}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
              {t("privacy.intro")}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-10">
            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <Database className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("privacy.sections.collection.title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("privacy.sections.collection.content")}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {collectionItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--plate-ink)]/90 sm:text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--plate-accent-deep)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-[var(--plate-line)] bg-card/70 p-4 font-mono text-xs leading-relaxed text-[var(--plate-muted)]">
                {t("privacy.sections.collection.note")}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <FileText className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("privacy.sections.usage.title")}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("privacy.sections.usage.content")}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {usageItems.map((item, idx) => (
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
                  <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                    {t("privacy.sections.documents.title")}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("privacy.sections.documents.content")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                    {t("privacy.sections.retention.title")}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("privacy.sections.retention.content")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4.5 text-[var(--plate-accent-deep)]" />
                    <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                      {t("privacy.sections.security.title")}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("privacy.sections.security.content")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Server className="size-4.5 text-[var(--plate-accent-deep)]" />
                    <h3 className="text-base font-semibold text-[var(--plate-ink)] sm:text-lg">
                      {t("privacy.sections.thirdParty.title")}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                    {t("privacy.sections.thirdParty.content")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--plate-line)]/80 bg-card/70 p-6 backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--plate-accent-deep)]/10 text-[var(--plate-accent-deep)]">
                  <UserCheck className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--plate-ink)] sm:text-xl">
                  {t("privacy.sections.rights.title")}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("privacy.sections.rights.content")}
              </p>

              <div className="mt-6 border-t border-[var(--plate-line)]/60 pt-5">
                <h4 className="text-sm font-semibold text-[var(--plate-ink)] sm:text-base">
                  {t("privacy.sections.contact.title")}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[var(--plate-muted)] sm:text-sm">
                  {t("privacy.sections.contact.content")}{" "}
                  {/* Repointed to the landing page's own contact section
                      (LandingFooter renders id="contact") — this app has no
                      standalone /contact route. */}
                  <a
                    href="/#contact"
                    className="font-medium text-[var(--plate-accent-deep)] underline decoration-[var(--plate-accent-deep)]/40 underline-offset-4 hover:decoration-[var(--plate-accent-deep)]"
                  >
                    {t("privacy.sections.contact.linkText")}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
