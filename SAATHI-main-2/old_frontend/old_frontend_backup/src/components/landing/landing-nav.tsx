import { Repeat, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AccountMenu } from "@/components/account-menu";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import { useLoginGate } from "@/components/landing/login-gate-context";
import { StartChattingCta } from "@/components/landing/start-chatting-cta";
import { ThemeToggle } from "@/components/theme-toggle";

// In-page anchors plus the standalone standards route.
type NavItem = { key: string; href: string; external?: boolean };
const NAV_ITEMS: NavItem[] = [
  { key: "whySaathi", href: "#why" },
  { key: "whoFor", href: "#who" },
  { key: "standards", href: "/standards", external: true },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

const ANCHOR_KEYS = NAV_ITEMS.filter((item) => !item.external).map((item) =>
  item.href.slice(1),
);

interface LandingNavProps {
  onReplayIntro?: () => void;
}

export function LandingNav({ onReplayIntro }: LandingNavProps = {}) {
  const { t } = useTranslation(["landing", "auth"]);
  const openLogin = useLoginGate();
  const { scrollY } = useScroll();
  const [activeAnchor, setActiveAnchor] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 1px 0 rgba(31,39,44,0.08)", "0 14px 36px rgba(31,39,44,0.11)"],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ANCHOR_KEYS.map((id) =>
      document.getElementById(id),
    ).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveAnchor(visible.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.05, 0.25, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  }

  return (
    <>
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center justify-center gap-2 bg-[var(--plate-accent-ground)] px-6 py-2 text-center font-mono text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--plate-on-accent)]/85 uppercase"
      >
        <ShieldCheck
          className="size-3.5 shrink-0 text-[var(--plate-on-accent)]/70"
          aria-hidden
        />
        {t("landing:nav.tagline")}
      </motion.div>

      <motion.header
        initial={{ y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.28, ease: [0.23, 1, 0.32, 1] }}
        style={{ boxShadow: headerShadow }}
        className={`sticky top-0 z-30 border-b border-[var(--plate-line)]/70 transition-[background-color,backdrop-filter,padding] duration-300 ${
          scrolled
            ? "bg-[var(--plate-ground)]/72 py-0 backdrop-blur-2xl"
            : "bg-[var(--plate-ground)]/85 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4 sm:px-10">
          <Link
            to="/"
            className="group relative shrink-0 font-mono text-sm font-bold tracking-[0.3em] text-[var(--plate-ink)] uppercase"
          >
            <span className="relative z-10 transition-colors duration-200 group-hover:text-primary">
              {t("landing:nav.brand")}
            </span>
            <span className="absolute -inset-x-2 -inset-y-1 -z-0 rounded-full bg-primary/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item, index) => {
              const isActive =
                !item.external && activeAnchor === item.href.slice(1);
              const label = t(`landing:nav.${item.key}`);
              const commonClass = `group relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[var(--plate-ink)]"
                  : "text-[var(--plate-muted)] hover:text-[var(--plate-ink)]"
              }`;

              const content = (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_5px_14px_rgba(56,64,69,0.08)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                  <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-primary/60 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </>
              );

              return item.external ? (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + index * 0.05 }}
                >
                  <Link to={item.href} className={commonClass}>
                    {content}
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + index * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleAnchor(e, item.href)}
                    className={commonClass}
                  >
                    {content}
                  </a>
                </motion.div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
            <LandingLanguageToggle />
            <ThemeToggle variant="ghost" size="icon" />
            {onReplayIntro && (
              <motion.button
                type="button"
                onClick={onReplayIntro}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                title="Replay BIS Unfolding Animation"
                aria-label="Replay BIS Unfolding Animation"
                className="elevation-lift hidden items-center gap-1.5 rounded-full border border-[var(--plate-line)] bg-background/80 px-2.5 py-1 font-mono text-[11px] text-[var(--plate-muted)] transition-colors duration-200 hover:text-[var(--plate-ink)] sm:inline-flex"
              >
                <Repeat className="size-3 text-primary" />
                <span className="hidden xl:inline">Replay Intro</span>
              </motion.button>
            )}
            <AccountMenu
              onSignInClick={openLogin}
              signInLabel={t("auth:loginCta")}
              className="elevation-1 elevation-lift inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--plate-ink)]/25 px-4 py-2 font-mono text-xs font-semibold tracking-[0.15em] text-[var(--plate-ink)] uppercase transition-colors duration-200 hover:bg-[var(--plate-ink)]/5"
            />
            <StartChattingCta className="hidden px-4 py-2 text-xs transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex">
              {t("landing:nav.openChat")}
            </StartChattingCta>
          </div>
        </div>
      </motion.header>
    </>
  );
}
