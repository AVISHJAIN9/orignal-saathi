import { Check, FileBadge, Scan } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Pinned verification pipeline assembly scene, inside the About section.
 * As the user scrolls vertically through the track, the graphic constructs
 * itself piece by piece:
 * 1. Product icon gets scanned by a sweeping laser
 * 2. QCO compliance checklist items fly in and check off
 * 3. Official BIS ISI stamp descends from above with impact overshoot and ripple
 *
 * Scroll-progress thresholds and transform values are ported as-is from the
 * teammate reference this was built from, for an exact replica of the
 * motion. Falls back to a static, fully-assembled layout on mobile or
 * reduced motion — same pattern this repo's other pinned scroll scenes
 * (ScrollUnfoldSequence, PaperStorySection) already use: a global
 * MotionConfig can soften transition props, but it can't undo a
 * scroll-hijacking pinned track, so this checks `useReducedMotion()` itself
 * and swaps to an entirely different, non-pinned layout rather than relying
 * on that alone.
 */
export function ComplianceAssemblyScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Every input range below is explicitly padded out to 0 and 1 (holding
  // the nearest real keyframe's value at each end) even though useTransform
  // would clamp an unpadded range just fine for JS-driven updates. Chromium
  // promotes these scroll-linked MotionValues to native, hardware-accelerated
  // ScrollTimeline animations, and per the CSS Animations spec a keyframe
  // list with no explicit stop at offset 0 or 1 gets an implicit "neutral"
  // keyframe there instead — resolved from the element's underlying
  // (pre-animation) inline style, which Motion leaves at its very first
  // computed value. Without this padding, every one of these fades finishes
  // its rise correctly but then visibly decays back toward that stale
  // starting value for the remainder of the scroll, well before the track
  // ends.
  // Stage 1: Product Scan
  const scanLineY = useTransform(
    scrollYProgress,
    [0, 0.05, 0.3, 1],
    ["0%", "0%", "100%", "100%"],
  );
  const scanGlowOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.32, 1],
    [0, 0, 1, 0.2, 0.2],
  );

  // Stage 2: Checklist Items
  const phase2HeaderOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.25, 1],
    [0, 0, 1, 1],
  );
  const check1X = useTransform(
    scrollYProgress,
    [0, 0.25, 0.42, 1],
    [-40, -40, 0, 0],
  );
  const check1Opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.42, 1],
    [0, 0, 1, 1],
  );
  const check2X = useTransform(
    scrollYProgress,
    [0, 0.4, 0.58, 1],
    [-40, -40, 0, 0],
  );
  const check2Opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.58, 1],
    [0, 0, 1, 1],
  );
  const check3X = useTransform(
    scrollYProgress,
    [0, 0.55, 0.72, 1],
    [-40, -40, 0, 0],
  );
  const check3Opacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.72, 1],
    [0, 0, 1, 1],
  );

  // Stage 3: Stamp Descent & Shockwave
  const phase3HeaderOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.68, 1],
    [0, 0, 1, 1],
  );
  const stampScale = useTransform(
    scrollYProgress,
    [0, 0.68, 0.85, 0.95, 1],
    [1.8, 1.8, 0.95, 1.0, 1.0],
  );
  const stampOpacity = useTransform(
    scrollYProgress,
    [0, 0.68, 0.8, 1],
    [0, 0, 1, 1],
  );
  const stampRippleScale = useTransform(
    scrollYProgress,
    [0, 0.82, 0.98, 1],
    [0.8, 0.8, 1.45, 1.45],
  );
  const stampRippleOpacity = useTransform(
    scrollYProgress,
    [0, 0.82, 0.88, 0.98, 1],
    [0, 0, 0.7, 0, 0],
  );
  const certifiedValidOpacity = useTransform(
    scrollYProgress,
    [0, 0.85, 0.95, 1],
    [0, 0, 1, 1],
  );

  if (isMobile || prefersReduced) {
    // Static complete state for mobile or reduced motion
    return (
      <div className="relative mx-auto my-8 w-full max-w-4xl rounded-2xl border border-primary/25 bg-card/90 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              Verification Pipeline Assembly
            </span>
            <h4 className="text-xl font-bold text-foreground">
              Standardized Compliance In Motion
            </h4>
            <div className="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" /> 01 • Optical Specification Scan: IS
                4151
              </span>
              <span className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" /> 02 • Quality Control Order (QCO)
                Certified
              </span>
              <span className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" /> 03 • National NABL Lab Conformity
                Verified
              </span>
            </div>
          </div>
          <div className="flex size-24 items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 font-bold text-primary shadow-lg">
            <span className="text-center font-mono text-xs tracking-wider">
              ISI CERTIFIED
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[210vh] w-full">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-4">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-primary/25 bg-card/90 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          {/* Subtle grid background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_5%,transparent),transparent_70%)]" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left: Product Under Verification */}
            <div className="flex flex-col items-center lg:col-span-5">
              <div className="relative flex size-44 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 p-4 shadow-inner sm:size-52">
                {/* Laser scan line */}
                <motion.div
                  style={{ top: scanLineY, opacity: scanGlowOpacity }}
                  className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]"
                />

                {/* Central Product Icon */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <Scan className="size-14 animate-pulse text-primary" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    IS 4151:2015 Spec
                  </span>
                  <span className="text-2xs text-muted-foreground">
                    Two-Wheeler Safety Gear
                  </span>
                </div>

                {/* Status indicator */}
                <div className="absolute inset-x-4 bottom-2 flex items-center justify-between font-mono text-2xs text-muted-foreground">
                  <span>SPECTRUM: OPTICAL</span>
                  <span className="font-bold text-emerald-500">ANALYZING</span>
                </div>
              </div>
              <span className="mt-3 font-mono text-xs text-muted-foreground">
                Phase 1: Automated Specification Scan
              </span>
            </div>

            {/* Middle: Live QCO Checklist */}
            <div className="flex flex-col gap-3 lg:col-span-4">
              <motion.span
                style={{ opacity: phase2HeaderOpacity }}
                className="font-mono text-xs font-bold uppercase tracking-wider text-primary"
              >
                Phase 2: Regulatory Checklist
              </motion.span>

              {/* Item 1 */}
              <motion.div
                style={{ x: check1X, opacity: check1Opacity }}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground">
                    Mandatory QCO Check
                  </span>
                  <span className="font-mono text-2xs text-muted-foreground">
                    Gazette Order S.O. 2341(E)
                  </span>
                </div>
              </motion.div>

              {/* Item 2 */}
              <motion.div
                style={{ x: check2X, opacity: check2Opacity }}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground">
                    NABL Lab Rigor Scrutiny
                  </span>
                  <span className="font-mono text-2xs text-muted-foreground">
                    Shock Absorption: PASS
                  </span>
                </div>
              </motion.div>

              {/* Item 3 */}
              <motion.div
                style={{ x: check3X, opacity: check3Opacity }}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground">
                    STI Factory Scheme
                  </span>
                  <span className="font-mono text-2xs text-muted-foreground">
                    Batch Retention Verified
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right: Descending ISI Seal Stamp */}
            <div className="relative flex flex-col items-center justify-center lg:col-span-3">
              <motion.span
                style={{ opacity: phase3HeaderOpacity }}
                className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-primary"
              >
                Phase 3: Certification
              </motion.span>

              <div className="relative flex size-36 items-center justify-center">
                {/* Expanding shockwave ring */}
                <motion.div
                  style={{
                    scale: stampRippleScale,
                    opacity: stampRippleOpacity,
                  }}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_50%,transparent)]"
                />

                {/* Stamp Icon */}
                <motion.div
                  style={{ scale: stampScale, opacity: stampOpacity }}
                  className="flex size-28 flex-col items-center justify-center rounded-2xl border-2 border-primary bg-primary/15 p-3 text-primary shadow-xl backdrop-blur-md"
                >
                  <FileBadge className="mb-1 size-8" />
                  <span className="font-mono text-xs font-bold tracking-widest uppercase">
                    ISI MARK
                  </span>
                  <span className="font-mono text-2xs opacity-80">
                    VERIFIED
                  </span>
                </motion.div>
              </div>

              <motion.span
                style={{ opacity: certifiedValidOpacity }}
                className="mt-2 font-mono text-2xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                ✓ 100% Certified Valid
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
