import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  BookOpenCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Filter,
  Library,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { LandingNav } from "@/components/landing/landing-nav";
import { LoginDialog } from "@/components/landing/login-dialog";
import { LoginGateContext } from "@/components/landing/login-gate-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setPendingAuthRedirect, useAuth } from "@/lib/auth";
import { registerAllStandards } from "@/lib/mock-standards";
import { isStandardSaved, toggleStandardSaved } from "@/lib/mock-vault";
import {
  ACTIVE_STANDARDS_COUNT,
  INITIAL_STANDARDS_SAMPLE,
  TOTAL_STANDARDS_COUNT,
  type FullStandardItem,
} from "@/lib/seed-standards-data";
import { cn } from "@/lib/utils";

// StandardsBrowser uses the .saathi-landing "plate" theme (--plate-* tokens)
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
  food: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25",
  production: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/25",
  chemicals: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25",
  electrotechnical: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/25",
  electronics: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25",
  medical: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25",
  textiles: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25",
  civil: "bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/25",
  mechanical: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25",
  metallurgy: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border border-zinc-500/25",
  petroleum: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/25",
  transport: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/25",
  management: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/25",
  "water-res": "bg-blue-600/15 text-blue-800 dark:text-blue-300 border border-blue-600/25",
  ayush: "bg-lime-500/15 text-lime-700 dark:text-lime-300 border border-lime-500/25",
  services: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/25",
  environment: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-600/25",
  general: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/25",
};
const CATEGORY_FALLBACK = "bg-[var(--plate-ink)]/8 text-[var(--plate-muted)]";

interface CategoryOptionItem {
  value: string;
  label: string;
  dotColor: string;
}

const CONSUMER_CATEGORIES: CategoryOptionItem[] = [
  { value: "helmets", label: "Helmets", dotColor: "bg-amber-500" },
  { value: "appliances", label: "Appliances", dotColor: "bg-sky-500" },
  { value: "gold", label: "Gold Jewellery", dotColor: "bg-yellow-500" },
  { value: "water", label: "Packaged Water", dotColor: "bg-blue-500" },
  { value: "cookers", label: "Pressure Cookers", dotColor: "bg-emerald-500" },
  { value: "toys", label: "Toys", dotColor: "bg-purple-500" },
];

const TECHNICAL_CATEGORIES: CategoryOptionItem[] = [
  { value: "food", label: "Food & Agriculture", dotColor: "bg-emerald-500" },
  { value: "production", label: "Production & General Eng.", dotColor: "bg-blue-600" },
  { value: "chemicals", label: "Chemicals", dotColor: "bg-amber-600" },
  { value: "electrotechnical", label: "Electrotechnical", dotColor: "bg-yellow-600" },
  { value: "electronics", label: "Electronics & IT", dotColor: "bg-cyan-500" },
  { value: "medical", label: "Medical Equipment", dotColor: "bg-rose-500" },
  { value: "textiles", label: "Textiles", dotColor: "bg-purple-600" },
  { value: "civil", label: "Civil Engineering", dotColor: "bg-stone-500" },
  { value: "mechanical", label: "Mechanical Eng.", dotColor: "bg-indigo-500" },
  { value: "metallurgy", label: "Metallurgy", dotColor: "bg-zinc-500" },
  { value: "petroleum", label: "Petroleum & Coal", dotColor: "bg-orange-500" },
  { value: "transport", label: "Transport Eng.", dotColor: "bg-sky-600" },
  { value: "management", label: "Management Systems", dotColor: "bg-teal-500" },
  { value: "water-res", label: "Water Resources", dotColor: "bg-blue-700" },
  { value: "ayush", label: "Ayush", dotColor: "bg-lime-500" },
  { value: "services", label: "Service Sector", dotColor: "bg-violet-500" },
  { value: "environment", label: "Environment", dotColor: "bg-emerald-600" },
];

const ALL_CATEGORY_OPTIONS = [
  { value: "all", label: "All Standards", dotColor: "bg-primary" },
  ...CONSUMER_CATEGORIES,
  ...TECHNICAL_CATEGORIES,
];

type SortMode = "default" | "is-number" | "alpha-asc" | "alpha-desc";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "default", label: "Default (Relevance)" },
  { value: "is-number", label: "IS Number (Ascending)" },
  { value: "alpha-asc", label: "Title: A → Z" },
  { value: "alpha-desc", label: "Title: Z → A" },
];

const PAGE_SIZE = 24;

function parseIsNumberForSort(standardNumber: string): number {
  const match = standardNumber.match(/\bIS\s+(\d+)/i) || standardNumber.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 9999999;
}

export function StandardsBrowser() {
  const { t } = useTranslation(["standards", "admin", "landing"]);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [loginOpen, setLoginOpen] = useState(false);
  const [allStandards, setAllStandards] = useState<FullStandardItem[]>(INITIAL_STANDARDS_SAMPLE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");
  const gridTopRef = useRef<HTMLDivElement>(null);
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>(null);

  const handleToggleExpand = useCallback((key: string) => {
    setExpandedCardKey((prev) => (prev === key ? null : key));
  }, []);

  // Asynchronously fetch full 35k dataset from compact JSON
  useEffect(() => {
    let cancelled = false;
    fetch("/data/standards.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data && Array.isArray(data.rows)) {
          const unpacked: FullStandardItem[] = data.rows.map((r: any[]) => ({
            id: r[0],
            key: r[1],
            standardNumber: r[2],
            title: r[3],
            description: r[4],
            categoryKey: r[5],
            categoryLabel: r[6],
            status: r[7],
            department: r[8],
            committee: r[9],
            aspect: r[10],
            revisions: r[11],
            amendments: r[12],
            reaffirmationYear: r[13],
            gazetteCount: r[14],
            licenseCount: r[15],
            detailUrl: r[16],
          }));
          setAllStandards(unpacked);
          registerAllStandards(unpacked);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.warn("Could not load full standards dataset:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Reset page and collapse any expanded card when search, category, or sort changes
  useEffect(() => {
    setCurrentPage(1);
    setExpandedCardKey(null);
  }, [deferredQuery, category, sortMode]);

  // Compute live count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allStandards.length };
    for (const s of allStandards) {
      counts[s.categoryKey] = (counts[s.categoryKey] || 0) + 1;
    }
    return counts;
  }, [allStandards]);

  // Currently active category display label
  const activeCategoryMeta = useMemo(() => {
    const found = ALL_CATEGORY_OPTIONS.find((opt) => opt.value === category);
    return found || { value: category, label: "All Standards", dotColor: "bg-primary" };
  }, [category]);

  // Filter and sort standards based on query, category, and sortMode
  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const result = allStandards.filter((card) => {
      const matchesCategory =
        category === "all" || card.categoryKey === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        card.standardNumber.toLowerCase().includes(q) ||
        card.title.toLowerCase().includes(q) ||
        (card.description && card.description.toLowerCase().includes(q)) ||
        (card.categoryLabel && card.categoryLabel.toLowerCase().includes(q))
      );
    });

    if (sortMode === "is-number") {
      return [...result].sort((a, b) => {
        const numA = parseIsNumberForSort(a.standardNumber);
        const numB = parseIsNumberForSort(b.standardNumber);
        return numA - numB;
      });
    }

    if (sortMode === "alpha-asc") {
      return [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortMode === "alpha-desc") {
      return [...result].sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [allStandards, deferredQuery, category, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Current page cards
  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    setExpandedCardKey(null);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput.trim(), 10);
    if (!isNaN(p)) {
      handlePageChange(p);
      setJumpPageInput("");
    }
  };

  // Generate pagination page numbers
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <LoginGateContext.Provider value={() => setLoginOpen(true)}>
      <div className="saathi-landing relative min-h-dvh w-full max-w-full overflow-x-clip bg-[var(--plate-surface)] font-sans text-[var(--plate-ink)]">
        <AmbientBackground />
        <div className="relative z-10 flex min-h-dvh w-full max-w-full flex-col justify-between overflow-x-clip">
          <div>
            <LandingNav hideTagline replaceToolsWithHamburger />
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-24 pt-8 sm:px-10 sm:pt-10">
              {/* Hero Section */}
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
                      {t("standards:eyebrow", "KNOWLEDGE BASE · DIRECTORY")}
                    </span>
                    <h1 className="max-w-3xl font-serif text-4xl leading-[1.04] font-semibold tracking-tight text-[var(--plate-accent-deep)] sm:text-5xl lg:text-6xl">
                      {t("standards:heading", "Explore Indian Standards")}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg">
                      {t(
                        "standards:subheading",
                        "Browse the standards currently available in the SAATHI prototype knowledge base.",
                      )}
                    </p>
                  </div>
                  <div className="flex w-full shrink-0 flex-col items-center gap-2 sm:flex-row sm:items-center lg:w-80 lg:flex-col lg:items-stretch">
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
                    {/* Live standards count from BIS Master Database */}
                    <div className="flex w-full shrink-0 items-center justify-between gap-3 rounded-2xl border border-[var(--plate-ground)]/65 bg-[var(--plate-ground)]/30 px-4 py-3 font-mono text-xs shadow-[inset_0_1px_0_var(--plate-line)] sm:flex-1 lg:flex-none">
                      <div className="flex items-center gap-2.5">
                        <BookOpenCheck
                          className="size-4 shrink-0 text-[var(--plate-accent-deep)]"
                          aria-hidden
                        />
                        <span>
                          <strong className="text-[var(--plate-accent-deep)] font-bold">
                            {ACTIVE_STANDARDS_COUNT.toLocaleString()}
                          </strong>{" "}
                          Active Standards
                        </span>
                      </div>
                      <span className="rounded-full bg-[var(--plate-ground)]/60 px-2 py-0.5 text-[0.68rem] text-[var(--plate-muted)]">
                        {TOTAL_STANDARDS_COUNT.toLocaleString()} total
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Filter and Search Section */}
              <section ref={gridTopRef} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-3xl">
                    <Search
                      className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[var(--plate-muted)]"
                      aria-hidden
                    />
                    <input
                      id="standards-search-input"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t(
                        "standards:searchPlaceholder",
                        "Search standards by number, title, or keywords...",
                      )}
                      aria-label={t("standards:searchAriaLabel", "Search standards")}
                      className="h-14 w-full rounded-2xl border border-[var(--plate-ground)]/75 bg-[var(--plate-ground)]/45 py-0 pl-13 pr-5 text-base text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line),0_12px_24px_rgba(48,58,64,0.07)] backdrop-blur-xl outline-none transition-[background-color,box-shadow,border-color] duration-200 placeholder:text-[var(--plate-muted)] focus:border-primary/50 focus:bg-[var(--plate-ground)]/65 focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent),0_12px_24px_rgba(48,58,64,0.08)]"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search input"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--plate-muted)] hover:text-[var(--plate-ink)]"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                  <Link
                    to="/vault"
                    title="Open Compliance Vault to view your saved standards"
                    className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[var(--plate-ground)]/75 bg-[var(--plate-ground)]/45 px-5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--plate-accent-deep)] shadow-[inset_0_1px_0_var(--plate-line),0_12px_24px_rgba(48,58,64,0.07)] backdrop-blur-xl transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-[var(--plate-ground)]/70"
                  >
                    <Bookmark className="size-4 fill-current text-[var(--plate-accent-deep)]" aria-hidden />
                    <span>Saved Standards</span>
                  </Link>
                </div>

                {/* Filter and Sort Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Filter Icon Label */}
                    <div className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[var(--plate-muted)]">
                      <Filter className="size-3.5" aria-hidden />
                      <span>Filter</span>
                    </div>

                    {/* All Standards Quick Pill */}
                    <button
                      type="button"
                      onClick={() => setCategory("all")}
                      className={cn(
                        "rounded-xl border px-3.5 py-2 text-xs font-semibold font-mono uppercase tracking-wide transition-all duration-200 cursor-pointer",
                        category === "all"
                          ? "border-primary/80 bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_14px_rgba(12,50,86,0.14)]"
                          : "border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/35 text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line)] hover:border-primary/45 hover:bg-[var(--plate-ground)]/60",
                      )}
                    >
                      All ({allStandards.length.toLocaleString()})
                    </button>

                    {/* Category Filter Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Filter standards by category dropdown"
                          className={cn(
                            "group inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 backdrop-blur-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer",
                            category !== "all"
                              ? "border-primary/80 bg-primary/10 text-primary font-semibold shadow-[0_4px_12px_rgba(12,50,86,0.08)] ring-1 ring-primary/30"
                              : "border-[var(--plate-ground)]/75 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line)] hover:border-primary/45 hover:bg-[var(--plate-ground)]/70",
                          )}
                        >
                          <span className="font-mono text-xs text-[var(--plate-muted)] group-hover:text-[var(--plate-ink)] transition-colors">
                            Category:
                          </span>
                          <span className="font-medium text-[var(--plate-ink)]">
                            {activeCategoryMeta.label}
                          </span>
                          {category !== "all" && (
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[0.68rem] text-primary">
                              {filtered.length.toLocaleString()}
                            </span>
                          )}
                          <ChevronDown className="size-4 opacity-60 text-[var(--plate-muted)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-80 max-h-[26rem] overflow-y-auto rounded-2xl border border-[var(--plate-ground)]/80 bg-[var(--plate-surface)]/95 p-2 shadow-2xl backdrop-blur-2xl"
                      >
                        <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                          <DropdownMenuRadioItem
                            value="all"
                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--plate-ground)]/60 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold"
                          >
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-primary" />
                              <span>All Standards</span>
                            </div>
                            <span className="font-mono text-xs text-[var(--plate-muted)]">
                              {allStandards.length.toLocaleString()}
                            </span>
                          </DropdownMenuRadioItem>

                          <DropdownMenuSeparator className="my-1.5 bg-[var(--plate-line)]/50" />

                          <DropdownMenuLabel className="px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--plate-muted)]">
                            Popular Consumer Sectors
                          </DropdownMenuLabel>
                          {CONSUMER_CATEGORIES.map((opt) => (
                            <DropdownMenuRadioItem
                              key={opt.value}
                              value={opt.value}
                              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--plate-ground)]/60 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold"
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn("size-2 rounded-full", opt.dotColor)} />
                                <span>{opt.label}</span>
                              </div>
                              <span className="font-mono text-xs text-[var(--plate-muted)]">
                                {categoryCounts[opt.value]?.toLocaleString() ?? 0}
                              </span>
                            </DropdownMenuRadioItem>
                          ))}

                          <DropdownMenuSeparator className="my-1.5 bg-[var(--plate-line)]/50" />

                          <DropdownMenuLabel className="px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--plate-muted)]">
                            BIS Technical Divisions
                          </DropdownMenuLabel>
                          {TECHNICAL_CATEGORIES.map((opt) => (
                            <DropdownMenuRadioItem
                              key={opt.value}
                              value={opt.value}
                              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--plate-ground)]/60 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold"
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn("size-2 rounded-full", opt.dotColor)} />
                                <span>{opt.label}</span>
                              </div>
                              <span className="font-mono text-xs text-[var(--plate-muted)]">
                                {categoryCounts[opt.value]?.toLocaleString() ?? 0}
                              </span>
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sorting Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Sort standards dropdown"
                          className={cn(
                            "group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-200 backdrop-blur-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer",
                            sortMode !== "default"
                              ? "border-primary/80 bg-primary/10 text-primary font-semibold shadow-[0_4px_12px_rgba(12,50,86,0.08)] ring-1 ring-primary/30"
                              : "border-[var(--plate-ground)]/75 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] shadow-[inset_0_1px_0_var(--plate-line)] hover:border-primary/45 hover:bg-[var(--plate-ground)]/70",
                          )}
                        >
                          <ArrowUpDown className="size-3.5 text-[var(--plate-muted)] group-hover:text-[var(--plate-ink)] transition-colors" />
                          <span className="font-mono text-xs text-[var(--plate-muted)]">Sort:</span>
                          <span className="font-medium text-[var(--plate-ink)]">
                            {SORT_OPTIONS.find((s) => s.value === sortMode)?.label}
                          </span>
                          <ChevronDown className="size-4 opacity-60 text-[var(--plate-muted)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-56 rounded-2xl border border-[var(--plate-ground)]/80 bg-[var(--plate-surface)]/95 p-1.5 shadow-2xl backdrop-blur-2xl"
                      >
                        <DropdownMenuRadioGroup value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                          {SORT_OPTIONS.map((opt) => (
                            <DropdownMenuRadioItem
                              key={opt.value}
                              value={opt.value}
                              className="cursor-pointer rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--plate-ground)]/60 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold"
                            >
                              {opt.label}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Reset button when filtered or sorted */}
                    {(category !== "all" || sortMode !== "default" || query) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCategory("all");
                          setSortMode("default");
                          setQuery("");
                        }}
                        title="Clear all filters and reset sorting"
                        className="inline-flex items-center gap-1 rounded-xl border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/30 px-2.5 py-1.5 font-mono text-xs text-[var(--plate-muted)] transition-colors hover:bg-[var(--plate-ground)]/60 hover:text-[var(--plate-ink)] cursor-pointer"
                      >
                        <X className="size-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Result count */}
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--plate-muted)]">
                    {!isLoaded && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--plate-accent-deep)]/80">
                        <Loader2 className="size-3 animate-spin" />
                        Loading 35k database...
                      </span>
                    )}
                    <span>
                      {filtered.length.toLocaleString()} standard
                      {filtered.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Standards Card Grid */}
              <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {paginatedCards.map((card, index) => (
                    <StandardCard
                      key={card.key || `std-${card.id}`}
                      card={card}
                      index={index}
                      isExpanded={expandedCardKey === (card.key || `std-${card.id}`)}
                      onToggleExpand={handleToggleExpand}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--plate-ground)]/60 bg-[var(--plate-ground)]/25 py-16 text-center backdrop-blur-md">
                  <p className="font-serif text-lg font-semibold text-[var(--plate-ink)]">
                    {t("standards:emptyResults", "No standards match your search.")}
                  </p>
                  <p className="max-w-md text-sm text-[var(--plate-muted)]">
                    Try searching for another IS number (e.g. "IS 4151", "IS 302"), standard title, or reset your category filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                      setSortMode("default");
                    }}
                    className="mt-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs font-semibold text-primary hover:bg-primary/20 cursor-pointer"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav
                  aria-label="Standards pagination"
                  className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/35 p-4 shadow-[inset_0_1px_0_var(--plate-line)] backdrop-blur-xl sm:flex-row"
                >
                  <div className="font-mono text-xs text-[var(--plate-muted)]">
                    Showing{" "}
                    <strong className="text-[var(--plate-ink)]">
                      {(currentPage - 1) * PAGE_SIZE + 1}
                    </strong>{" "}
                    –{" "}
                    <strong className="text-[var(--plate-ink)]">
                      {Math.min(currentPage * PAGE_SIZE, filtered.length).toLocaleString()}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-[var(--plate-ink)]">
                      {filtered.length.toLocaleString()}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* First page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      aria-label="First page"
                      className="flex size-8 items-center justify-center rounded-lg border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] transition-colors hover:bg-[var(--plate-ground)]/80 disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronsLeft className="size-4" />
                    </button>

                    {/* Previous page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="flex size-8 items-center justify-center rounded-lg border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] transition-colors hover:bg-[var(--plate-ground)]/80 disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                    </button>

                    {/* Page numbers */}
                    {pageNumbers.map((p, idx) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-1.5 font-mono text-xs text-[var(--plate-muted)]"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={`page-${p}`}
                          type="button"
                          onClick={() => handlePageChange(p as number)}
                          aria-current={currentPage === p ? "page" : undefined}
                          className={cn(
                            "min-w-8 h-8 rounded-lg px-2 font-mono text-xs font-semibold transition-all cursor-pointer",
                            currentPage === p
                              ? "border border-primary/80 bg-primary text-primary-foreground shadow-sm"
                              : "border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] hover:bg-[var(--plate-ground)]/80",
                          )}
                        >
                          {p}
                        </button>
                      ),
                    )}

                    {/* Next page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="flex size-8 items-center justify-center rounded-lg border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] transition-colors hover:bg-[var(--plate-ground)]/80 disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="size-4" />
                    </button>

                    {/* Last page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      aria-label="Last page"
                      className="flex size-8 items-center justify-center rounded-lg border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 text-[var(--plate-ink)] transition-colors hover:bg-[var(--plate-ground)]/80 disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronsRight className="size-4" />
                    </button>
                  </div>

                  {/* Jump to page */}
                  <form
                    onSubmit={handleJumpSubmit}
                    className="flex items-center gap-1.5 font-mono text-xs"
                  >
                    <span className="text-[var(--plate-muted)]">Jump to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={jumpPageInput}
                      onChange={(e) => setJumpPageInput(e.target.value)}
                      placeholder={String(currentPage)}
                      className="h-8 w-14 rounded-lg border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 px-2 text-center text-xs text-[var(--plate-ink)] outline-none focus:border-primary/50"
                    />
                    <button
                      type="submit"
                      className="h-8 rounded-lg border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/45 px-2.5 font-semibold text-[var(--plate-accent-deep)] hover:bg-[var(--plate-ground)]/80 cursor-pointer"
                    >
                      Go
                    </button>
                  </form>
                </nav>
              )}
            </main>
          </div>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
    </LoginGateContext.Provider>
  );
}

/**
 * Parse the description field to extract document type and technical committee.
 */
function parseDescription(description: string): {
  docType: string | null;
  committee: string | null;
  cleanDescription: string;
} {
  if (!description) return { docType: null, committee: null, cleanDescription: "" };

  const separators = [" · ", " \u00b7 ", " A\u0300\u0082 "];
  let docType: string | null = null;
  let committee: string | null = null;
  let cleanDescription = description;

  for (const sep of separators) {
    const idx = description.indexOf(sep);
    if (idx !== -1) {
      const left = description.substring(0, idx).trim();
      const right = description.substring(idx + sep.length).trim();

      if (left && left !== "N/A") {
        docType = left;
      }
      if (right) {
        const statusIdx = right.indexOf(sep);
        committee = statusIdx !== -1 ? right.substring(0, statusIdx).trim() : right;
      }
      cleanDescription = docType || "";
      break;
    }
  }

  return { docType, committee, cleanDescription };
}

/**
 * Extract a publication year from the standardNumber field.
 */
function extractYear(standardNumber: string): string | null {
  const match = standardNumber.match(/:(\d{4})(?:\s|$|[A-Z])/);
  if (match) return match[1];
  const fallback = standardNumber.match(/(\d{4})(?=[^0-9]*$)/);
  return fallback ? fallback[1] : null;
}

function StandardCard({
  card,
  index,
  isExpanded,
  onToggleExpand,
}: {
  card: FullStandardItem;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (key: string) => void;
}) {
  const { t } = useTranslation(["standards", "vault"]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardKey = card.key || `std-${card.id}`;

  useEffect(() => {
    setSaved(isStandardSaved(card.key));
  }, [card.key]);

  // Parse metadata from description
  const parsed = useMemo(() => parseDescription(card.description), [card.description]);
  const year = useMemo(() => extractYear(card.standardNumber), [card.standardNumber]);

  function handleToggleBookmark(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setPendingAuthRedirect("/standards");
      navigate("/");
      return;
    }
    void toggleStandardSaved(card.key).then(setSaved);
  }

  // Desktop hover handlers with a small delay before collapsing to prevent flicker
  const handleMouseEnter = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    if (!isExpanded) {
      onToggleExpand(cardKey);
    }
  }, [isExpanded, onToggleExpand, cardKey]);

  const handleMouseLeave = useCallback(() => {
    collapseTimerRef.current = setTimeout(() => {
      if (isExpanded) {
        onToggleExpand(cardKey);
      }
    }, 150);
  }, [isExpanded, onToggleExpand, cardKey]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  // Mobile tap handler for the expand/collapse button
  function handleTapToggle(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onToggleExpand(cardKey);
  }

  // Keyboard focus handler — expand on focus for accessibility
  const handleFocus = useCallback(() => {
    if (!isExpanded) {
      onToggleExpand(cardKey);
    }
  }, [isExpanded, onToggleExpand, cardKey]);

  // Gather available metadata fields
  const metaFields: { label: string; value: string }[] = [];
  if (card.status) {
    metaFields.push({ label: "Status", value: card.status });
  }
  const committeeVal = card.committee || parsed.committee;
  if (committeeVal) {
    metaFields.push({ label: "Technical Committee", value: committeeVal });
  }
  if (card.department) {
    metaFields.push({ label: "Department", value: card.department });
  }
  const aspectVal = card.aspect || parsed.docType;
  if (aspectVal) {
    metaFields.push({ label: "Aspect", value: aspectVal });
  }
  if (card.revisions) {
    metaFields.push({ label: "Revisions", value: card.revisions });
  }
  if (card.amendments && card.amendments !== "No amendment issued") {
    metaFields.push({ label: "Amendments", value: card.amendments });
  }
  if (card.reaffirmationYear) {
    metaFields.push({ label: "Reaffirmed", value: card.reaffirmationYear });
  } else if (year) {
    metaFields.push({ label: "Year", value: year });
  }
  if (card.categoryLabel) {
    metaFields.push({ label: "Category", value: card.categoryLabel });
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
        delay: Math.min(index * 0.03, 0.3),
        layout: { type: "spring", stiffness: 400, damping: 30 },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      className="group/card relative flex flex-col overflow-hidden rounded-[1.5rem]"
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
        className="absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/55 text-[var(--plate-accent-deep)] shadow-[inset_0_1px_0_var(--plate-line)] backdrop-blur-xl transition-colors hover:bg-[var(--plate-ground)]/80 cursor-pointer"
      >
        <Bookmark
          className={cn("size-4", saved && "fill-current")}
          aria-hidden
        />
      </button>

      <Link
        to={`/standards/${card.key}`}
        className={cn(
          "relative flex flex-col gap-4 overflow-hidden rounded-[1.5rem] border p-6 backdrop-blur-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          isExpanded
            ? "border-[var(--plate-accent)]/50 bg-[var(--plate-ground)]/50 shadow-[inset_0_1px_0_var(--plate-line),0_24px_42px_rgba(49,59,66,0.16)]"
            : "border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/38 shadow-[inset_0_1px_0_var(--plate-line),0_16px_30px_rgba(49,59,66,0.09)] hover:shadow-[inset_0_1px_0_var(--plate-line),0_24px_42px_rgba(49,59,66,0.14)]",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[var(--plate-ground)]/35 blur-2xl transition-transform duration-700 group-hover/card:scale-150"
        />

        {/* Top line: standard badge & number, category label */}
        <div className="relative flex items-start justify-between gap-3 pr-9">
          <div className="flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--plate-accent)]/35 bg-[var(--plate-accent)]/10 text-[var(--plate-accent-deep)] shadow-[inset_0_1px_0_var(--plate-line)]">
              <BadgeCheck className="size-4" aria-hidden />
            </span>
            <span className="font-mono text-sm font-bold tracking-tight text-[var(--plate-accent-deep)] line-clamp-1">
              {card.standardNumber}
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-[0.68rem] font-semibold truncate max-w-[130px]",
              CATEGORY_STYLES[card.categoryKey] ?? CATEGORY_FALLBACK,
            )}
            title={card.categoryLabel}
          >
            {card.categoryLabel}
          </span>
        </div>

        {/* Decorative divider */}
        <div className="relative h-px w-full bg-gradient-to-r from-[var(--plate-accent)]/40 via-[var(--plate-line)] to-transparent" />

        {/* Title */}
        <h2
          className="relative text-lg leading-snug font-semibold text-[var(--plate-ink)] line-clamp-2"
          title={card.title}
        >
          {card.title}
        </h2>

        {/* Description */}
        <p className="relative text-sm leading-relaxed text-[var(--plate-muted)] line-clamp-3">
          {card.description}
        </p>

        {/* ── Expanded metadata section in normal document flow ── */}
        <AnimatePresence initial={false}>
          {isExpanded && metaFields.length > 0 && (
            <motion.div
              key="expanded-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: "spring", stiffness: 400, damping: 30 },
                opacity: { duration: 0.2, ease: "easeOut" },
              }}
              className="relative overflow-hidden"
            >
              <div className="mb-3 h-px w-full bg-gradient-to-r from-[var(--plate-accent)]/30 via-[var(--plate-line)]/60 to-transparent" />

              <div className="mb-2.5 flex items-center gap-1.5">
                <FileText
                  className="size-3 text-[var(--plate-accent-deep)]/70"
                  aria-hidden
                />
                <span className="font-mono text-[0.6rem] font-bold tracking-[0.16em] text-[var(--plate-muted)] uppercase">
                  Standard Details
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {metaFields.map((field) => (
                  <div key={field.label} className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.58rem] font-semibold tracking-[0.12em] text-[var(--plate-muted)]/70 uppercase">
                      {field.label}
                    </span>
                    <span className="text-xs font-medium leading-snug text-[var(--plate-ink)]">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer link */}
        <div className="relative mt-auto flex items-center justify-between pt-1">
          <div className={cn(
            "flex items-center gap-2 font-mono text-[0.62rem] font-semibold tracking-[0.12em] uppercase transition-opacity",
            isExpanded
              ? "text-[var(--plate-accent-deep)] opacity-100"
              : "text-[var(--plate-accent-deep)] opacity-75 group-hover/card:opacity-100 dark:opacity-100",
          )}>
            <span>{isExpanded ? "View full details" : "View details"}</span>
            <ArrowUpRight
              className="size-3.5 transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
              aria-hidden
            />
          </div>
          <div className="flex items-center gap-2">
            {card.status === "Withdrawn" && (
              <span className="font-mono text-[0.62rem] font-semibold uppercase text-amber-600/80 dark:text-amber-400/80">
                Withdrawn
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Mobile expand/collapse toggle */}
      <button
        type="button"
        onClick={handleTapToggle}
        aria-label={isExpanded ? "Collapse standard details" : "Expand standard details"}
        aria-expanded={isExpanded}
        className="absolute bottom-4 right-4 z-20 flex size-7 items-center justify-center rounded-full border border-[var(--plate-ground)]/70 bg-[var(--plate-ground)]/55 text-[var(--plate-accent-deep)] shadow-[inset_0_1px_0_var(--plate-line)] backdrop-blur-xl transition-all hover:bg-[var(--plate-ground)]/80 sm:hidden cursor-pointer"
      >
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-300",
            isExpanded && "rotate-180",
          )}
          aria-hidden
        />
      </button>
    </motion.article>
  );
}
