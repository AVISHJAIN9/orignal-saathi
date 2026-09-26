import { motion, MotionConfig } from "motion/react";

/**
 * A layered diagonal sheen that sweeps across a section on a continuous loop —
 * confined to whichever section renders it. The rest of the app keeps the
 * near-invisible AmbientBackground guilloché texture (see
 * src/components/ambient-background.tsx); this is deliberately louder, because
 * the hero/closing bands are marketing space where motion earns its keep.
 *
 * Rather than one solid band, several parallel bands of varying width and
 * strength travel together at the same angle and speed — like light glinting
 * across brushed metal, catching the surface in overlapping streaks instead of
 * a single flat wipe. Each is a hard-edged rotated rectangle (no gradient
 * blur) so the streaks stay crisp; a small per-band x-offset and a shared
 * loop keep them locked in formation as they cross.
 *
 * `tone` picks the band colour for the surface it sits on: 'light' for the
 * cream hero (cooler tints of the ground), 'dark' for the navy closing band
 * (lighter lifts of the accent-ground, so the sweep reads as a sheen catching
 * the deep-blue surface rather than holes punched in it).
 *
 * The formation is tight (bands clustered within roughly a third of the
 * travel range), so a single copy sweeps across in well under the full cycle
 * and then leaves a long empty gap before re-entering — which reads as the
 * motion visibly stopping and re-starting, not flowing continuously. Fixed
 * the same way a marquee/ticker is: run a SECOND copy of the whole formation
 * on the same loop, phase-offset by half the cycle (a negative delay), so
 * while one copy is in its empty gap the other is mid-sweep — there's always
 * something moving on screen.
 */

interface Band {
  /** width of this streak, as a % of the container */
  width: number;
  /** horizontal offset from the lead band, in % of container width */
  offset: number;
  /** 0..1 strength of the colour mix for this streak */
  strength: number;
}

// A tight formation of streaks: one broad primary sweep, a couple of thinner
// brighter glints just ahead/behind it, and a faint wide trailing wash. Offsets
// are spaced so they read as a related cluster, not evenly-striped wallpaper.
// A loose formation of soft-edged streaks: one broad primary sweep with a
// couple of thinner brighter glints ahead/behind it and a faint wide trailing
// wash. Widths are generous and edges are feathered, so they read as light
// grazing the surface rather than hard stripes.
const BANDS: Band[] = [
  { width: 30, offset: 0, strength: 1 },
  { width: 12, offset: 26, strength: 1.3 },
  { width: 8, offset: 40, strength: 0.75 },
  { width: 22, offset: -30, strength: 0.6 },
  { width: 6, offset: -46, strength: 0.9 },
];

const CYCLE_SECONDS = 14;
// How steeply the formation is tilted, and how far it drifts vertically over a
// cycle — together these make the travel path itself diagonal (down-left to
// up-right), instead of a tilted band sliding straight sideways.
const TILT_DEG = -58;
const VERTICAL_TRAVEL = 55;

export function HeroSheen({ tone = "light" }: { tone?: "light" | "dark" }) {
  // Base mix amount per tone; each band scales this by its own strength.
  const mix = (strength: number) => {
    const pct = tone === "dark" ? 9 * strength : 10 * strength;
    const clamped = Math.min(pct, 22);
    const color =
      tone === "dark"
        ? `color-mix(in oklch, white ${clamped}%, var(--plate-accent-ground))`
        : `color-mix(in oklch, var(--plate-accent) ${clamped}%, var(--plate-ground-deep))`;
    // Feathered along the band's width so each streak fades in and out at its
    // edges — the soft graze of light, not a hard-edged rectangle.
    return `linear-gradient(90deg, transparent 0%, ${color} 45%, ${color} 55%, transparent 100%)`;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[0, -CYCLE_SECONDS / 2].map((phaseDelay) =>
          BANDS.map((band, i) => (
            <motion.div
              key={`${phaseDelay}-${i}`}
              className="absolute h-[320%]"
              style={{
                width: `${band.width}%`,
                background: mix(band.strength),
                rotate: `${TILT_DEG}deg`,
              }}
              // `left`/`top` are % of the PARENT (unlike `x`/`y` transforms,
              // which are % of the element's own size) — so every band,
              // regardless of width, starts and ends the same safe distance
              // off-screen, and the pair of axes gives a diagonal travel path.
              initial={{ left: `${-150 + band.offset}%`, top: `${-110 - VERTICAL_TRAVEL / 2}%` }}
              animate={{ left: `${170 + band.offset}%`, top: `${-110 + VERTICAL_TRAVEL / 2}%` }}
              transition={{
                duration: CYCLE_SECONDS,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
                delay: phaseDelay,
              }}
            />
          )),
        )}
      </div>
    </MotionConfig>
  );
}
