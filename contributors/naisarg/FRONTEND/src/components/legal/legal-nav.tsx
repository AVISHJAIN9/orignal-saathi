import { AlertTriangle, FileText, Lock, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface SectionItem {
  id: string;
  labelKey: string;
  icon: typeof Lock;
}

const SECTIONS: SectionItem[] = [
  { id: "ai-disclaimer", labelKey: "nav.disclaimer", icon: AlertTriangle },
  { id: "privacy", labelKey: "nav.privacy", icon: Lock },
  { id: "terms", labelKey: "nav.terms", icon: FileText },
  { id: "authority", labelKey: "nav.authority", icon: ShieldAlert },
];

/**
 * LandingNav's own height varies (responsive padding, the tagline strip
 * scrolling away while the header row stays pinned), so this measures the
 * live `<header>` it renders instead of hardcoding a pixel guess that would
 * drift the moment that component's layout changes. Falls back to a
 * reasonable estimate before the first measurement lands.
 */
function useLandingHeaderHeight() {
  const [height, setHeight] = useState(64);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => setHeight(header.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return height;
}

export function LegalNav() {
  const { t } = useTranslation("legal");
  const [activeSection, setActiveSection] = useState<string>("ai-disclaimer");
  const navRef = useRef<HTMLDivElement>(null);
  const headerHeight = useLandingHeaderHeight();
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => setNavHeight(nav.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // How far a section's top sits below the viewport top once it's "current" —
  // both sticky bars (this one included) plus a little breathing room.
  const scrollOffset = headerHeight + navHeight + 16;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + scrollOffset + 40;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          return;
        }
      }
      setActiveSection(SECTIONS[0].id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollOffset]);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: offsetPosition,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <div
      ref={navRef}
      style={{ top: headerHeight }}
      className="sticky z-20 w-full border-y border-[var(--plate-line)]/80 bg-[var(--plate-ground)]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-start overflow-x-auto px-6 py-3 sm:justify-center sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav
          className="flex items-center gap-1.5 sm:gap-2"
          aria-label="Legal document section navigation"
        >
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm",
                  isActive
                    ? "bg-[var(--plate-accent-deep)] text-foreground shadow-sm"
                    : "text-[var(--plate-muted)] hover:bg-[var(--plate-ink)]/5 hover:text-[var(--plate-ink)]",
                )}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
                <span>{t(sec.labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
