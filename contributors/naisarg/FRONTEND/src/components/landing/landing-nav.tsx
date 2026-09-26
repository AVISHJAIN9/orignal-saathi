import {
  Repeat,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouterState } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { useAuth, setPendingAuthRedirect } from "@/lib/auth";

import { AccountMenu } from "@/components/account-menu";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import { useLoginGate } from "@/components/landing/login-gate-context";
import { StartChattingCta } from "@/components/landing/start-chatting-cta";
import {
  NavDrawer,
  type NavDrawerSection,
} from "@/components/nav-drawer";
import {
  NAV_LINK_UNDERLINE_CLASS,
  navLinkClassName,
} from "@/lib/nav-link-styles";
import { SaathiLogo } from "@/components/saathi-logo";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FEATURE_NAV_SECTIONS } from "@/lib/feature-nav-entries";

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
  hideTagline?: boolean;
  replaceToolsWithHamburger?: boolean;
}

export function LandingNav({
  onReplayIntro,
  hideTagline = false,
  replaceToolsWithHamburger = true,
}: LandingNavProps = {}) {
  const { t } = useTranslation(["landing", "auth", "chat"]);
  const openLogin = useLoginGate();
  const { currentUser } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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

  function scrollToAnchor(href: string) {
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  }

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    if (pathname !== "/") {
      return;
    }
    e.preventDefault();
    scrollToAnchor(href);
  }

  // Signed-out visitors are sent through the login dialog first, then on
  // to the feature they picked — same gate as the desktop dropdown below.
  function gateFeatureLink(e: React.MouseEvent<HTMLAnchorElement>, to: string) {
    if (!currentUser && to !== "/standards") {
      e.preventDefault();
      setPendingAuthRedirect(to);
      openLogin();
    }
  }

  // Below `lg` the inline nav row is hidden; the same items (plus the
  // "Tools & Services" features) move into the shared hamburger drawer.
  const drawerSections: NavDrawerSection[] = [
    {
      id: "landing",
      items: NAV_ITEMS.map((item) => ({
        id: item.key,
        label: t(`landing:nav.${item.key}`),
        href: pathname === "/" ? item.href : (item.external ? item.href : `/${item.href}`),
        kind: item.external || pathname !== "/" ? "route" : "anchor",
        active: item.external
          ? pathname === item.href
          : (pathname === "/" && activeAnchor === item.href.slice(1)),
        onSelect: item.external || pathname !== "/"
          ? undefined
          : (e) => {
              e.preventDefault();
              // Let the drawer release its scroll lock before scrolling.
              window.setTimeout(() => scrollToAnchor(item.href), 0);
            },
      })),
    },
    ...FEATURE_NAV_SECTIONS.map((section) => ({
      id: section.headingKey,
      heading: t(`chat:${section.headingKey}`),
      items: section.entries.map((entry) => ({
        id: entry.to,
        label: t(`chat:${entry.labelKey}`),
        href: entry.to,
        icon: entry.icon,
        badge: entry.signInRequired ? t("landing:nav.signInRequired") : undefined,
        onSelect: (e: React.MouseEvent<HTMLAnchorElement>) =>
          gateFeatureLink(e, entry.to),
      })),
    })),
  ];

  return (
    <>
      {!hideTagline && (
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center justify-center gap-2 bg-[var(--plate-accent-ground)] px-6 py-2 text-center font-mono text-2xs font-semibold tracking-[0.18em] text-[var(--plate-on-accent)]/85 uppercase"
        >
          <ShieldCheck
            className="size-3.5 shrink-0 text-[var(--plate-on-accent)]/70"
            aria-hidden
          />
          {t("landing:nav.tagline")}
        </motion.div>
      )}

      <motion.header
        initial={{ y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.28, ease: [0.23, 1, 0.32, 1] }}
        style={{ boxShadow: headerShadow }}
        className={`sticky top-0 z-30 overflow-x-hidden border-b border-[var(--plate-line)]/70 transition-[background-color,backdrop-filter,padding] duration-300 ${
          scrolled
            ? "bg-[var(--plate-ground)]/72 py-0 backdrop-blur-2xl"
            : "bg-[var(--plate-ground)]/85 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:gap-2 xl:gap-3 xl:px-10 2xl:max-w-[96rem] 2xl:gap-6">
          <SaathiLogo wordmarkClassName="text-[var(--plate-ink)]" />

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center-safe gap-0 lg:flex 2xl:gap-1"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item, index) => {
              const isCurrentRoute =
                item.href === pathname ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const isActive =
                (!item.external && pathname === "/" && activeAnchor === item.href.slice(1)) ||
                isCurrentRoute;
              const label = t(`landing:nav.${item.key}`);
              const commonClass = navLinkClassName({
                active: isActive,
                tone: "plate",
                className: "xl:px-2.5 2xl:px-3.5",
              });

              const content = (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-[var(--plate-line)] bg-[color-mix(in_oklch,var(--plate-surface)_85%,var(--plate-accent)_15%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),var(--shadow-elevation-2)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                  <span aria-hidden className={NAV_LINK_UNDERLINE_CLASS} />
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
                    href={pathname === "/" ? item.href : `/${item.href}`}
                    onClick={(e) => handleAnchor(e, item.href)}
                    className={commonClass}
                  >
                    {content}
                  </a>
                </motion.div>
              );
            })}

            {/* Direct Feature Dropdown Menu OR Hamburger Drawer Button */}
            {replaceToolsWithHamburger ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + NAV_ITEMS.length * 0.05 }}
                className="flex items-center pl-1"
              >
                <NavDrawer
                  sections={drawerSections}
                  title={t("chat:nav.menuTitle", "SAATHI Navigation")}
                  triggerLabel={t("chat:nav.openMenu", "Open navigation menu")}
                  triggerClassName="size-9 rounded-xl border border-transparent text-[var(--plate-ink)] transition-colors hover:border-[var(--plate-line)] hover:bg-[var(--plate-ground)]/80 hover:text-[var(--plate-accent-deep)]"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + NAV_ITEMS.length * 0.05 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={navLinkClassName({
                      tone: "plate",
                      className: "xl:px-2.5 2xl:px-3.5",
                    })}
                  >
                    <span>{t("landing:nav.toolsServices")}</span>
                    <ChevronDown className="size-3 opacity-50 group-hover:opacity-100 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    <span aria-hidden className={NAV_LINK_UNDERLINE_CLASS} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass w-64 p-1.5">
                    {FEATURE_NAV_SECTIONS.map((section) => (
                      <DropdownMenuSub key={section.headingKey}>
                        <DropdownMenuSubTrigger className="rounded-md px-2 py-2">
                          <span className="font-mono text-2xs font-semibold tracking-wider text-foreground uppercase">
                            {t(`chat:${section.headingKey}`)}
                          </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="glass w-72 p-1.5">
                          {section.entries.map((entry) => (
                            <DropdownMenuItem key={entry.to} asChild className="p-0">
                              <Link
                                to={entry.to}
                                onClick={(e) => gateFeatureLink(e, entry.to)}
                                className="group/item relative flex items-center gap-3 overflow-hidden rounded-md p-2 transition-all duration-300 hover:bg-accent"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
                                <div className="relative flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-primary shadow-xs transition-transform duration-300 group-hover/item:scale-105 group-hover/item:shadow-sm">
                                  <entry.icon className="size-4" />
                                </div>
                                <div className="relative flex-1 text-xs font-semibold text-foreground transition-colors duration-200 group-hover/item:text-primary">
                                  {t(`chat:${entry.labelKey}`)}
                                </div>
                                {entry.signInRequired && (
                                  <span className="relative shrink-0 rounded-full bg-muted/80 px-2 py-0.5 font-mono text-[9px] font-medium tracking-wide text-muted-foreground uppercase transition-colors duration-200 group-hover/item:bg-primary/10 group-hover/item:text-primary">
                                    {t("landing:nav.signInRequired")}
                                  </span>
                                )}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 2xl:gap-2.5">
            <NavDrawer
              sections={drawerSections}
              title={t("chat:nav.menuTitle")}
              triggerLabel={t("chat:nav.openMenu")}
              triggerClassName="lg:hidden"
            />
            <LandingLanguageToggle />
            <ThemeTogglerButton variant="ghost" size="icon" />
            {onReplayIntro && (
              <motion.button
                type="button"
                onClick={onReplayIntro}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                title="Replay BIS Unfolding Animation"
                aria-label="Replay BIS Unfolding Animation"
                className="elevation-lift hidden h-8 items-center gap-1.5 rounded-full border whitespace-nowrap border-[var(--plate-line)] bg-background/80 px-2.5 py-1 font-mono text-2xs text-[var(--plate-muted)] transition-colors duration-200 hover:text-[var(--plate-ink)] sm:inline-flex lg:hidden 2xl:inline-flex"
              >
                <Repeat className="size-3 text-primary" />
                <span className="hidden 2xl:inline">{t("landing:nav.replayIntro")}</span>
              </motion.button>
            )}
            <AccountMenu
              onSignInClick={openLogin}
              signInLabel={t("auth:loginCta")}
              className="elevation-1 elevation-lift inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--plate-ink)]/25 px-3 py-2 font-mono whitespace-nowrap xl:px-4 text-xs font-semibold tracking-[0.15em] text-[var(--plate-ink)] uppercase transition-colors duration-200 hover:bg-[var(--plate-ink)]/5"
            />
            {/* Hidden between lg and xl, where the inline nav row needs the room;
                every section still links to chat below the fold. */}
            <StartChattingCta className="hidden px-4 py-2 text-xs whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex lg:hidden xl:inline-flex">
              {t("landing:nav.openChat")}
            </StartChattingCta>
          </div>
        </div>
      </motion.header>
    </>
  );
}
