import { FolderGit2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BrandMark } from "@/components/brand-mark";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

// Anchors/routes reused as-is from LandingNav's own NAV_ITEMS — this list
// intentionally doesn't duplicate that file's array (different shape,
// different translation lookups already in place there), but every href
// here points at the same real destinations.
const QUICK_NAV_LINKS = [
  { key: "whySaathi", href: "#why" },
  { key: "whoFor", href: "#who" },
  { key: "standards", href: "/standards" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

// Real, existing routes only — the teammate reference's footer also linked
// to "/knowledge-nexus" and "/cortex", neither of which exists in this
// repo (this app's document-analysis module lives at /document-cortex).
// Labels reuse the exact same chat:nav.* strings the in-app sidebar
// already shows for these routes, rather than re-authoring new copy.
const MODULE_LINKS = [
  { labelKey: "chat:nav.standardsBrowser", href: "/standards" },
  { labelKey: "chat:nav.conformityCheck", href: "/conformity" },
  { labelKey: "chat:nav.documentCortex", href: "/document-cortex" },
  { labelKey: "chat:nav.regulatoryRadar", href: "/regulatory-radar" },
  { labelKey: "chat:nav.intelFeed", href: "/intel-feed" },
  { labelKey: "landing:footer.legalLink", href: "/legal" },
  { labelKey: "chat:nav.grievance", href: "/grievance" },
] as const;

export function LandingFooter() {
  const { t } = useTranslation(["landing", "chat"]);
  const email = t("landing:footer.teamEmail");

  return (
    <footer className="bg-[var(--plate-ink)] px-6 py-14 text-[var(--plate-ground)]/70 sm:px-10 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid grid-cols-1 gap-10 border-b border-[var(--plate-ground)]/15 pb-10 md:grid-cols-12 md:gap-8">
          {/* Brand + team contact */}
          <div className="flex flex-col gap-4 md:col-span-5">
            <Link
              to="/"
              aria-label="SAATHI Homepage"
              className="inline-flex w-fit items-center gap-2.5"
            >
              <BrandMark />
              <span className="font-mono text-sm font-bold tracking-[0.3em] text-[var(--plate-ground)] uppercase">
                {t("landing:nav.brand")}
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-[var(--plate-ground)]/60">
              {t("landing:nav.tagline")}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[var(--plate-ground)]/50 uppercase">
                {t("landing:footer.contactHeading")}
              </h3>
              <p className="max-w-md text-xs leading-relaxed text-[var(--plate-ground)]/60">
                {t("landing:footer.contactBody")}
              </p>
              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 font-mono text-sm text-[var(--plate-ground)] underline decoration-[var(--plate-ground)]/30 underline-offset-4 transition-colors hover:decoration-[var(--plate-ground)]"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {email}
                </a>
                <a
                  href="https://github.com/NaisargPurohit/SIH26107-BIS-Navigator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--plate-ground)]/70 transition-colors hover:text-[var(--plate-ground)]"
                >
                  <FolderGit2 className="size-4 shrink-0" aria-hidden />
                  {t("landing:footer.github")}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[var(--plate-ground)]/50 uppercase">
              {t("landing:footer.quickNavHeading")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              {QUICK_NAV_LINKS.map((link) =>
                link.href.startsWith("#") ? (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      className="text-[var(--plate-ground)]/70 transition-colors hover:text-[var(--plate-ground)]"
                    >
                      {t(`landing:nav.${link.key}`)}
                    </a>
                  </li>
                ) : (
                  <li key={link.key}>
                    <Link
                      to={link.href}
                      className="text-[var(--plate-ground)]/70 transition-colors hover:text-[var(--plate-ground)]"
                    >
                      {t(`landing:nav.${link.key}`)}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Assistant Modules + language shortcut */}
          <div className="flex flex-col gap-4 md:col-span-4">
            <div>
              <h3 className="mb-3 font-mono text-xs font-bold tracking-widest text-[var(--plate-ground)]/50 uppercase">
                {t("landing:footer.modulesHeading")}
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium">
                {MODULE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[var(--plate-ground)]/70 transition-colors hover:text-[var(--plate-ground)]"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[var(--plate-ground)]/15 pt-3">
              <span className="font-mono text-[0.7rem] font-semibold tracking-wider text-[var(--plate-ground)]/50 uppercase">
                {t("landing:footer.languageHeading")}
              </span>
              <div className="flex items-center gap-2">
                <LandingLanguageToggle className="border-[var(--plate-ground)]/25 text-[var(--plate-ground)]" />
                <ThemeToggle variant="outline" size="icon" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono tracking-wide">
            {t("landing:footer.credit")}
          </p>
          <p className="max-w-md text-[var(--plate-ground)]/50">
            {t("landing:footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
