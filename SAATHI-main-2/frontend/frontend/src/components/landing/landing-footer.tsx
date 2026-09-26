import { FolderGit2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BrandMark } from "@/components/brand-mark";
import { CursorDrivenParticleTypography } from "@/components/landing/cursor-driven-particle-typography";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";

import "@/pages/landing-page.css";

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
  { labelKey: "WhatsApp Bot [T1-27]", href: "/whatsapp" },
  { labelKey: "chat:nav.conformityCheck", href: "/conformity" },
  { labelKey: "chat:nav.documentCortex", href: "/document-cortex" },
  { labelKey: "chat:nav.regulatoryRadar", href: "/regulatory-radar" },
  { labelKey: "chat:nav.intelFeed", href: "/intel-feed" },
  { labelKey: "landing:footer.legalLink", href: "/legal" },
  { labelKey: "chat:nav.grievance", href: "/grievance" },
] as const;

export function LandingFooter() {
  const { t } = useTranslation(["landing", "chat"]);
  const { resolvedTheme } = useTheme();
  const email = t("landing:footer.teamEmail");

  return (
    <footer className="saathi-landing border-t border-[var(--plate-footer-border)] bg-[var(--plate-footer-bg)] px-6 py-10 text-[var(--plate-footer-muted)] transition-colors duration-200 sm:px-10 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + team contact */}
          <div className="flex flex-col gap-4 md:col-span-5">
            <Link
              to="/"
              aria-label="SAATHI Homepage"
              className="inline-flex w-fit items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <BrandMark />
              <span className="font-mono text-sm font-bold tracking-[0.3em] text-[var(--plate-footer-fg)] uppercase">
                {t("landing:nav.brand")}
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-[var(--plate-footer-muted)]">
              {t("landing:nav.tagline")}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[var(--plate-footer-faint)] uppercase">
                {t("landing:footer.contactHeading")}
              </h3>
              <p className="max-w-md text-xs leading-relaxed text-[var(--plate-footer-muted)]">
                {t("landing:footer.contactBody")}
              </p>
              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 font-mono text-sm text-[var(--plate-footer-fg)] underline decoration-[var(--plate-footer-link-underline)] underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {email}
                </a>
                <a
                  href="https://github.com/NaisargPurohit/SIH26107-BIS-Navigator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--plate-footer-muted)] transition-colors hover:text-[var(--plate-footer-fg)]"
                >
                  <FolderGit2 className="size-4 shrink-0" aria-hidden />
                  {t("landing:footer.github")}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[var(--plate-footer-faint)] uppercase">
              {t("landing:footer.quickNavHeading")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              {QUICK_NAV_LINKS.map((link) =>
                link.href.startsWith("#") ? (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      className="text-[var(--plate-footer-muted)] transition-colors hover:text-[var(--plate-footer-fg)]"
                    >
                      {t(`landing:nav.${link.key}`)}
                    </a>
                  </li>
                ) : (
                  <li key={link.key}>
                    <Link
                      to={link.href}
                      className="text-[var(--plate-footer-muted)] transition-colors hover:text-[var(--plate-footer-fg)]"
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
              <h3 className="mb-3 font-mono text-xs font-bold tracking-widest text-[var(--plate-footer-faint)] uppercase">
                {t("landing:footer.modulesHeading")}
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium">
                {MODULE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[var(--plate-footer-muted)] transition-colors hover:text-[var(--plate-footer-fg)]"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[var(--plate-footer-border)] pt-3">
              <span className="font-mono text-[0.7rem] font-semibold tracking-wider text-[var(--plate-footer-faint)] uppercase">
                {t("landing:footer.languageHeading")}
              </span>
              <div className="flex items-center gap-2">
                <LandingLanguageToggle className="border-[var(--plate-footer-border)] text-[var(--plate-footer-fg)] hover:bg-white/5" />
                <ThemeToggle
                  variant="outline"
                  size="icon"
                  className="border-[var(--plate-footer-border)] bg-transparent text-[var(--plate-footer-fg)] hover:bg-white/5 hover:text-[var(--plate-footer-fg)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive pixel drift particle typography: SAATHI */}
        <div className="relative">
          <CursorDrivenParticleTypography
            text="SAATHI"
            color={resolvedTheme === "dark" ? "rgba(224, 238, 255, 0.78)" : "rgba(250, 248, 245, 0.85)"}
            fontSize={160}
            fontFamily="Geist, Inter, system-ui, sans-serif"
            particleSize={1.6}
            particleDensity={5}
            dispersionStrength={16}
            returnSpeed={0.08}
            className="h-36 w-full sm:h-44"
          />
        </div>
      </div>
    </footer>
  );
}
