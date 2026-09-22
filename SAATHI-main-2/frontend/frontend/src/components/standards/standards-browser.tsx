import {
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  BookOpenCheck,
  Library,
  Search,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { FilterPills } from "@/components/filter-pills";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";
import { setPendingAuthRedirect, useAuth } from "@/lib/auth";
import { MOCK_STANDARDS } from "@/lib/mock-standards";
import { isStandardSaved, toggleStandardSaved } from "@/lib/mock-vault";
import { cn } from "@/lib/utils";

// StandardsBrowser is the only place outside landing-page.tsx/legal-page.tsx
// that uses the .saathi-landing "plate" theme (--plate-* tokens, including
// the dark-mode category palette below) — without this import those tokens
// are undefined here and every var(--plate-*) usage on this page silently
// falls back to the inherited app foreground/transparent instead.
import "@/pages/landing-page.css";

const CATEGORY_STYLES: Record<string, string> = {
  helmets:
    "bg-[var(--plate-cat-helmets-bg)] text-[var(--plate-cat-helmets-fg)]",
  appliances:
    "bg-[var(--plate-cat-appliances-bg)] text-[var(--plate-cat-appliances-fg)]",
  gold: "bg-[var(--plate-cat-gold-bg)] text-[var(--plate-cat-gold-fg)]",
  water: "bg-[var(--plate-cat-water-bg)] text-[var(--plate-cat-water-fg)]",
  cookers:
    "bg-[var(--plate-cat-cookers-bg)] text-[var(--plate-cat-cookers-fg)]",
  toys: "bg-[var(--plate-cat-toys-bg)] text-[var(--plate-cat-toys-fg)]",
};
const CATEGORY_FALLBACK = "bg-[var(--plate-ink)]/8 text-[var(--plate-muted)]";

type NavItem = { label: string; href: string };

export function StandardsBrowser() {
  const { t } = useTranslation(["standards", "admin", "landing"]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const cards = useMemo(
    () =>
      MOCK_STANDARDS.map((standard) => ({
        ...standard,
        title: t(`standards:list.${standard.key}`),
        description: t(`standards:descriptions.${standard.key}`),
        categoryLabel: t(`admin:topics.${standard.categoryKey}`),
      })),
    [t],
  );

  const categoryKeys = useMemo(
    () =>
      MOCK_STANDARDS.map((s) => s.categoryKey).filter(
        (key, i, keys) => keys.indexOf(key) === i,
      ),
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: t("standards:allCategories") },
      ...categoryKeys.map((key) => ({
        value: key,
        label: t(`admin:topics.${key}`),
      })),
    ],
    [categoryKeys, t],
  );

  const filtered = cards.filter((card) => {
    const q = query.trim().toLowerCase();
    return (
      (q === "" ||
        card.standardNumber.toLowerCase().includes(q) ||
        card.title.toLowerCase().includes(q)) &&
      (category === "all" || card.categoryKey === category)
    );
  });

  const navItems: NavItem[] = [
    { label: t("standards:backHome"), href: "/" },
    { label: t("standards:backToChat"), href: "/chat" },
  ];

  return (
    <div className="saathi-landing relative min-h-dvh overflow-hidden bg-[var(--plate-surface)] font-sans text-[var(--plate-ink)]">
      <AmbientBackground />
      <div className="relative z-10">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center justify-center gap-2 bg-[var(--plate-accent-ground)] px-6 py-2 text-center font-mono text-[0.68rem] font-semibold tracking-[0.18em] text-[var(--plate-ground)]/85 uppercase"
        >
          <ShieldCheck
            className="size-3.5 text-[var(--plate-ground)]/70"
            aria-hidden
          />
          {t("landing:nav.tagline")}
        </motion.div>

        <motion.header
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          className="sticky top-0 z-30 border-b border-[var(--plate-ground)]/55 bg-[var(--plate-ground)]/70 shadow-[0_12px_30px_rgba(44,53,59,0.07)] backdrop-blur-2xl"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3.5 sm:px-10">
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2.5 font-mono text-sm font-bold tracking-[0.28em] text-[var(--plate-ink)] uppercase"
            >
              <BrandMark
                size="sm"
                className="rounded-lg transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105"
              />
              <span className="transition-colors duration-200 group-hover:text-primary">
                SAATHI
              </span>
            </Link>
            <nav
              className="hidden flex-1 items-center justify-center gap-1 lg:flex"
              aria-label="Standards navigation"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group relative rounded-sm px-3.5 py-2 text-sm font-medium text-[var(--plate-muted)] transition-colors duration-200 hover:text-[var(--plate-ink)]"
                >
                  {item.label}
                  <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
              <span className="relative rounded-sm border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 px-3.5 py-2 text-sm font-medium text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line)]">
                {t("standards:title")}
                <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#d6a24b] shadow-[0_0_0_4px_rgba(214,162,75,0.16)]" />
              </span>
            </nav>
            <div className="ml-auto flex items-center gap-2.5">
              <LandingLanguageToggle />
              <Link
                to="/chat"
                className="hidden items-center gap-2 rounded-xl border border-primary/70 bg-primary px-4 py-2 font-mono text-xs font-semibold tracking-[0.12em] text-primary-foreground uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_9px_18px_rgba(12,50,86,0.16)] transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex"
              >
                {t("standards:openAssistant")}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-24 pt-12 sm:px-10 sm:pt-16">
          <section className="relative overflow-hidden rounded-[2rem] border border-[var(--plate-ground)]/65 bg-[var(--plate-ground)]/25 px-6 py-8 shadow-[inset_0_1px_0_var(--plate-line),0_24px_55px_rgba(55,64,69,0.08)] backdrop-blur-xl sm:px-10 sm:py-11">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#b9cedb]/35 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 left-[38%] size-72 rounded-full bg-[#d9c6a3]/25 blur-3xl"
            />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex items-center gap-2 rounded-sm border-l-2 border-[var(--plate-accent)] bg-[var(--plate-ground)]/35 px-3.5 py-1.5 font-mono text-[0.64rem] font-semibold tracking-[0.17em] text-[var(--plate-accent-deep)] uppercase shadow-[inset_0_1px_0_var(--plate-line)]">
                  <Library className="size-3.5" aria-hidden />
                  {t("standards:eyebrow")}
                </span>
                <h1 className="max-w-3xl font-serif text-4xl leading-[1.04] font-semibold tracking-tight text-[var(--plate-accent-deep)] sm:text-5xl lg:text-6xl">
                  {t("standards:heading")}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg">
                  {t("standards:subheading")}
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col items-center gap-1 sm:flex-row sm:items-center lg:w-80 lg:flex-col lg:items-stretch">
                <div className="standards-motion-stage relative w-full max-w-[17rem] sm:max-w-[18.5rem] lg:max-w-[20rem]">
                  <video
                    className="standards-motion-video relative z-10 block aspect-square w-full object-contain transition-transform duration-700 hover:scale-[1.015]"
                    src="/animo-orbit-globe-720p.webm"
                    poster="/animo-orbit-globe-poster.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-label="Animated collage of Indian standards and certification marks"
                  />
                </div>
                <div className="flex w-full shrink-0 items-center gap-3 rounded-2xl border border-[var(--plate-ground)]/65 bg-[var(--plate-ground)]/30 px-4 py-3 font-mono text-xs shadow-[inset_0_1px_0_var(--plate-line)] sm:flex-1 lg:flex-none">
                  <BookOpenCheck
                    className="size-4 text-[var(--plate-accent-deep)]"
                    aria-hidden
                  />
                  <span>
                    <strong className="text-[var(--plate-accent-deep)]">
                      {MOCK_STANDARDS.length}
                    </strong>{" "}
                    {t("standards:liveStat", { count: "" })
                      .replace(String(MOCK_STANDARDS.length), "")
                      .trim()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="relative max-w-3xl">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[var(--plate-muted)]"
                aria-hidden
              />
              <input
                id="standards-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("standards:searchPlaceholder")}
                aria-label={t("standards:searchAriaLabel")}
                className="h-14 w-full rounded-2xl border border-[var(--plate-ground)]/75 bg-[var(--plate-ground)]/45 py-0 pl-13 pr-5 text-base text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line),0_12px_24px_rgba(48,58,64,0.07)] backdrop-blur-xl outline-none transition-[background-color,box-shadow,border-color] duration-200 placeholder:text-[var(--plate-muted)] focus:border-primary/50 focus:bg-[var(--plate-ground)]/65 focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent),0_12px_24px_rgba(48,58,64,0.08)]"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <FilterPills
                variant="glass"
                showLabel
                options={categoryOptions}
                active={category}
                onChange={setCategory}
              />
              <span className="font-mono text-xs text-[var(--plate-muted)]">
                {t("standards:resultCount", { count: filtered.length })}
              </span>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((card, index) => (
                <StandardCard key={card.key} card={card} index={index} />
              ))}
            </AnimatePresence>
          </div>
          {filtered.length === 0 && (
            <p className="rounded-2xl border border-[var(--plate-ground)]/60 bg-[var(--plate-ground)]/25 py-14 text-center text-[var(--plate-muted)] backdrop-blur-md">
              {t("standards:emptyResults")}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

interface StandardCardData {
  key: string;
  standardNumber: string;
  categoryKey: string;
  title: string;
  description: string;
  categoryLabel: string;
}

function StandardCard({
  card,
  index,
}: {
  card: StandardCardData;
  index: number;
}) {
  const { t } = useTranslation(["standards", "vault"]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  // Read-after-mount, same pattern as use-user-profile.ts — this page has
  // no ssr:false, so localStorage isn't readable on the first (server)
  // render and reading it synchronously here would cause a hydration
  // mismatch.
  useEffect(() => {
    setSaved(isStandardSaved(card.key));
  }, [card.key]);

  function handleToggleBookmark(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      // Standards Browser is deliberately public (no login gate) — a
      // signed-out visitor's click stashes the intent to return here and
      // sends them to sign in, same mechanism ProtectedRoute already uses
      // for every gated page. They land back on /standards afterward but
      // need to click the bookmark again — this only remembers the path,
      // not the in-flight action.
      setPendingAuthRedirect("/standards");
      navigate("/");
      return;
    }
    void toggleStandardSaved(card.key).then(setSaved);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.045,
      }}
      whileHover={{ y: -5 }}
      className="group relative h-full"
    >
      <button
        type="button"
        onClick={handleToggleBookmark}
        aria-label={
          saved
            ? t("vault:actions.savedAriaLabel", { title: card.title })
            : t("vault:actions.saveAriaLabel", { title: card.title })
        }
        title={saved ? t("vault:actions.saved") : t("vault:actions.save")}
        className="absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/55 text-[var(--plate-accent-deep)] shadow-[inset_0_1px_0_var(--plate-line)] backdrop-blur-xl transition-colors hover:bg-[var(--plate-ground)]/80"
      >
        <Bookmark
          className={cn("size-4", saved && "fill-current")}
          aria-hidden
        />
      </button>
      <Link
        to={`/standards/${card.key}`}
        className="flex h-full flex-col gap-4 overflow-hidden rounded-[1.5rem] border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/38 p-6 shadow-[inset_0_1px_0_var(--plate-line),0_16px_30px_rgba(49,59,66,0.09)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[inset_0_1px_0_var(--plate-line),0_24px_42px_rgba(49,59,66,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[var(--plate-ground)]/35 blur-2xl transition-transform duration-700 group-hover:scale-150"
        />
        <div className="relative flex items-start justify-between gap-3 pr-9">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl border border-[var(--plate-accent)]/35 bg-[var(--plate-accent)]/10 text-[var(--plate-accent-deep)] shadow-[inset_0_1px_0_var(--plate-line)]">
              <BadgeCheck className="size-4" aria-hidden />
            </span>
            <span className="font-mono text-sm font-bold tracking-tight text-[var(--plate-accent-deep)]">
              {card.standardNumber}
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-[0.68rem] font-semibold",
              CATEGORY_STYLES[card.categoryKey] ?? CATEGORY_FALLBACK,
            )}
          >
            {card.categoryLabel}
          </span>
        </div>
        <div className="relative h-px w-full bg-gradient-to-r from-[var(--plate-accent)]/40 via-[var(--plate-line)] to-transparent" />
        <h2 className="relative text-lg leading-snug font-semibold text-[var(--plate-ink)]">
          {card.title}
        </h2>
        <p className="relative flex-1 text-sm leading-relaxed text-[var(--plate-muted)]">
          {card.description}
        </p>
        <div className="relative flex items-center gap-2 pt-1 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-[var(--plate-accent-deep)] uppercase opacity-75 transition-opacity group-hover:opacity-100 dark:opacity-100">
          <span>View details</span>
          <ArrowUpRight
            className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </Link>
    </motion.article>
  );
}
