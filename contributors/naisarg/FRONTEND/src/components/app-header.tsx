import { useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Code2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquare,
  MessageSquareWarning,
  Network,
  Tags,
  User,
} from "lucide-react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountMenu } from "@/components/account-menu";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { LoginDialog } from "@/components/landing/login-dialog";
import { LanguageToggle } from "@/components/language-toggle";
import {
  NavDrawer,
  type NavDrawerItem,
  type NavDrawerSection,
} from "@/components/nav-drawer";
import {
  NAV_LINK_UNDERLINE_CLASS,
  navLinkClassName,
} from "@/lib/nav-link-styles";
import { NotificationBell } from "@/components/notification-bell";
import { SaathiLogo } from "@/components/saathi-logo";
import {
  ADMIN_ENTRIES,
  FEATURE_NAV_SECTIONS,
  type FeatureNavEntry,
} from "@/lib/feature-nav-entries";
import { BackendStatus } from "@/components/BackendStatus";
import { setPendingAuthRedirect } from "@/lib/auth";
import { useRole } from "@/lib/role";
import { Link } from "@/lib/router-compat";

// The app's anchor destinations, shown to every visitor regardless of role.
// The first three double as the inline links on md+ screens; the full list
// (plus the role-gated feature sections from feature-nav-entries.ts) lives
// in the hamburger drawer at every width.
const PRIMARY_ENTRIES: FeatureNavEntry[] = [
  { to: "/chat", labelKey: "nav.chatLink", icon: MessageSquare },
  { to: "/dashboard", labelKey: "nav.dashboardLink", icon: LayoutDashboard },
  { to: "/standards", labelKey: "nav.standardsBrowser", icon: BookOpen },
];

const MAIN_ENTRIES: FeatureNavEntry[] = [
  ...PRIMARY_ENTRIES,
  { to: "/registration/new", labelKey: "nav.newRegistration", icon: FileText },
  { to: "/knowledge-nexus", labelKey: "nav.knowledgeNexus", icon: Network },
  { to: "/classification", labelKey: "nav.classification", icon: Tags },
  { to: "/jurisdiction", labelKey: "nav.jurisdiction", icon: MapPin },
  { to: "/vault", labelKey: "nav.complianceVault", icon: Lock },
  { to: "/sample-tracker", labelKey: "nav.sampleTracker", icon: FlaskConical },
  {
    to: "/verify/certificate",
    labelKey: "nav.verifyCertificate",
    icon: BadgeCheck,
  },
  { to: "/developers", labelKey: "nav.developers", icon: Code2 },
  { to: "/grievance", labelKey: "nav.grievance", icon: MessageSquareWarning },
  { to: "/notifications", labelKey: "nav.notifications", icon: Bell },
  { to: "/profile", labelKey: "nav.profile", icon: User },
];

const MAIN_PATHS = new Set(MAIN_ENTRIES.map((entry) => entry.to));

/**
 * The header for every non-landing route — mounted once in __root.tsx (see
 * NO_APP_HEADER_PATHS there for the routes that render LandingNav instead).
 * Logo on the left is the one way "home"; section navigation lives in the
 * hamburger drawer (shared with LandingNav's mobile fallback), so pages no
 * longer carry their own "Back to chat" links.
 *
 * Deliberately a fixed `h-14`: App.tsx sizes the chat layout as
 * `h-[calc(100dvh-3.5rem)]` against this exact height, so it never grows a
 * second row at any breakpoint.
 */
export function AppHeader() {
  const { t } = useTranslation(["chat", "auth"]);
  const { role } = useRole();
  const prefersReducedMotion = useReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrollYProgress } = useScroll();
  const [loginOpen, setLoginOpen] = useState(false);

  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(`${to}/`);

  const toItems = (entries: FeatureNavEntry[]): NavDrawerItem[] =>
    entries.map((entry) => ({
      id: entry.to,
      href: entry.to,
      label: t(entry.labelKey),
      icon: entry.icon,
      active: isActive(entry.to),
    }));

  const showFeatureSections = role === "industry" || role === "admin";
  const sections: NavDrawerSection[] = [
    {
      id: "main",
      heading: t("nav.sectionMain"),
      items: toItems(MAIN_ENTRIES),
    },
    ...(showFeatureSections
      ? FEATURE_NAV_SECTIONS.map((section) => ({
          id: section.headingKey,
          heading: t(section.headingKey),
          items: toItems(
            section.entries.filter((entry) => !MAIN_PATHS.has(entry.to)),
          ),
        }))
      : []),
    ...(role === "admin"
      ? [
          {
            id: "admin",
            heading: t("nav.sectionAdmin"),
            items: toItems(ADMIN_ENTRIES),
          },
        ]
      : []),
  ];

  return (
    <>
      <motion.header
        initial={prefersReducedMotion ? undefined : { y: -18, opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="sticky top-0 z-30 h-14 shrink-0 overflow-x-hidden border-b border-border/70 bg-background/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
          <SaathiLogo wordmarkClassName="hidden sm:inline-flex" />

          <nav
            className="hidden min-w-0 flex-1 items-stretch justify-center gap-1 self-stretch lg:flex"
            aria-label="Primary navigation"
          >
            {PRIMARY_ENTRIES.map((entry) => {
              const active = isActive(entry.to);
              return (
                <Link
                  key={entry.to}
                  to={entry.to}
                  aria-current={active ? "page" : undefined}
                  // Full-height tabs: the active bar sits on the header's
                  // bottom edge, like a formal tab strip, instead of a
                  // filled pill around the label.
                  className={navLinkClassName({
                    active,
                    tone: "app",
                    className: "h-full rounded-none px-3.5 py-0 xl:px-4",
                  })}
                >
                  <span className="relative z-10">{t(entry.labelKey)}</span>
                  {active ? (
                    <motion.span
                      layoutId="app-header-active-underline"
                      aria-hidden
                      className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                    />
                  ) : (
                    <span aria-hidden className={NAV_LINK_UNDERLINE_CLASS} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-4">
            <NavDrawer
              sections={sections}
              title={t("nav.menuTitle")}
              triggerLabel={t("nav.openMenu")}
            />
            <div className="flex items-center gap-1.5">
              <BackendStatus />
              <LanguageToggle />
              <ThemeTogglerButton variant="ghost" size="icon" />
            </div>
            <div className="flex items-center gap-1.5">
              <NotificationBell />
              <AccountMenu
                onSignInClick={() => {
                  // Come back to this page after signing in rather than the
                  // login dialog's default of /chat.
                  setPendingAuthRedirect(pathname);
                  setLoginOpen(true);
                }}
                signInLabel={t("auth:loginCta")}
                className={navLinkClassName({
                  tone: "app",
                  className: "h-8 border border-border px-3 py-0 text-xs",
                })}
              />
            </div>
          </div>
        </div>

        {!prefersReducedMotion && (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
            style={{ scaleX: scrollYProgress }}
          />
        )}
      </motion.header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
