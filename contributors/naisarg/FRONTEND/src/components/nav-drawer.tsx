import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import { HamburgerIcon } from "@/components/animate-ui/components/buttons/hamburger-icon";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

export interface NavDrawerItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  active?: boolean;
  /** "anchor" renders a plain <a> (in-page #hash links on the landing
   * page); everything else is a router <Link>. */
  kind?: "route" | "anchor";
  badge?: string;
  /** Runs after the drawer has started closing; call preventDefault() on
   * the event to take over navigation (e.g. smooth-scrolling an anchor). */
  onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface NavDrawerSection {
  id: string;
  heading?: string;
  items: NavDrawerItem[];
}

interface NavDrawerProps {
  sections: NavDrawerSection[];
  title: string;
  triggerLabel: string;
  triggerClassName?: string;
}

/**
 * Hamburger button + slide-out navigation panel shared by AppHeader (its
 * only section nav, at every width) and LandingNav (the below-`lg` fallback
 * for its in-page links) so the two headers use one interaction pattern
 * instead of two hand-rolled menus.
 *
 * Portaled to <body> so it escapes the headers' `overflow-x-hidden` and
 * sticky stacking context. Because that puts it outside `.saathi-landing`,
 * it styles itself with the app's standard tokens (bg-background,
 * text-foreground, …), never the landing-scoped `--plate-*` ones.
 */
export function NavDrawer({
  sections,
  title,
  triggerLabel,
  triggerClassName,
}: NavDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  // Circle geometry for the open reveal, in the panel's own coordinates:
  // centred on the trigger, radius reaching the panel's farthest corner.
  const [reveal, setReveal] = useState({ x: 0, y: 0, r: 0 });
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    setIsRtl(document.documentElement.dir === "rtl");
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  function openDrawer() {
    const rtl = document.documentElement.dir === "rtl";
    const rect = triggerRef.current?.getBoundingClientRect();
    // Mirrors the panel's w-[min(86vw,22rem)] anchored to the end edge.
    const width = Math.min(window.innerWidth * 0.86, 22 * 16);
    const left = rtl ? 0 : window.innerWidth - width;
    const x = rect ? rect.left + rect.width / 2 - left : width / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const r = Math.hypot(
      Math.max(x, width - x),
      Math.max(y, window.innerHeight - y),
    );
    setIsRtl(rtl);
    setReveal({ x, y, r });
    setOpen(true);
  }

  const circle = (radius: number) =>
    `circle(${radius}px at ${reveal.x}px ${reveal.y}px)`;

  // Running index across all sections, so the stagger flows top-to-bottom
  // through the whole list rather than restarting per section.
  const itemIndex = new Map(
    sections.flatMap((section) => section.items).map((item, i) => [item.id, i]),
  );

  const panel = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: prefersReducedMotion ? 0.12 : 0.18 },
            }}
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.35,
              ease: REVEAL_EASE,
            }}
            onClick={() => setOpen(false)}
          />
          <motion.nav
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="glass absolute inset-y-0 end-0 flex w-[min(86vw,22rem)] flex-col border-s border-border/70 bg-background/95 text-foreground shadow-[var(--shadow-elevation-2)]"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { clipPath: circle(0), opacity: 1 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { clipPath: circle(reveal.r), opacity: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    x: isRtl ? -16 : 16,
                    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.12 }
                : { duration: 0.45, ease: REVEAL_EASE }
            }
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 px-4">
              <span className="text-sm font-semibold text-foreground">
                {title}
              </span>
              <Button
                ref={closeRef}
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
              >
                {/* Same icon as the trigger, morphing bars → X as the panel
                    slides in (the panel covers the trigger itself while
                    open, so this is where the open morph is visible). */}
                <HamburgerIcon open animateOnMount />
              </Button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3">
              {sections.map((section) => (
                <div key={section.id} className="mb-3 last:mb-0">
                  {section.heading && (
                    <p className="px-2 pt-2 pb-1.5 text-xs font-semibold text-muted-foreground">
                      {section.heading}
                    </p>
                  )}
                  <ul className="flex flex-col gap-0.5">
                    {section.items.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: -6 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: itemDelay(itemIndex.get(item.id) ?? 0),
                        }}
                      >
                        <DrawerLink
                          item={item}
                          onNavigate={() => setOpen(false)}
                        />
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={openDrawer}
        className={cn("shrink-0", triggerClassName)}
      >
        <HamburgerIcon open={open} />
      </Button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}

// LandingNav's entrance curve, shared with the header's own motion.
const REVEAL_EASE = [0.23, 1, 0.32, 1] as const;

// LandingNav's per-item entrance (opacity 0, y -6, 0.05s steps), with a
// shorter lead-in timed to the panel's slide and a tighter step capped a
// dozen items in, so a long drawer never takes over a second to fill.
function itemDelay(index: number) {
  return 0.12 + Math.min(index, 12) * 0.03;
}

function DrawerLink({
  item,
  onNavigate,
}: {
  item: NavDrawerItem;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const className = cn(
    "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors duration-200",
    item.active
      ? "bg-primary/10 font-semibold text-primary"
      : "text-foreground hover:bg-muted",
  );
  const content = (
    <>
      {item.active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-primary"
        />
      )}
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0",
            item.active
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-2xs font-medium text-muted-foreground">
          {item.badge}
        </span>
      )}
    </>
  );
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate();
    item.onSelect?.(event);
  };
  const ariaCurrent = item.active ? ("page" as const) : undefined;

  return item.kind === "anchor" ? (
    <a
      href={item.href}
      onClick={handleClick}
      aria-current={ariaCurrent}
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link
      to={item.href}
      onClick={handleClick}
      aria-current={ariaCurrent}
      className={className}
    >
      {content}
    </Link>
  );
}
