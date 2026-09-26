import { useId } from "react";
import { motion, MotionConfig } from "motion/react";

// One period of a sine-like wave across the tile, built from two cubic
// Beziers (control points at ~1.3x amplitude approximate a sine curve
// closely enough for a faint decorative line). TILE must be an exact
// multiple of the wave's period so the pattern tiles seamlessly with no
// visible seam at tile edges.
const TILE = 64;
const AMPLITUDE = 3.5;
const LINE_COUNT = 8;
const LINE_SPACING = TILE / LINE_COUNT;

function wavePath(y: number, phase: number) {
  const half = TILE / 2;
  const quarter = TILE / 4;
  const a = AMPLITUDE * 1.3;
  return `M ${phase},${y} C ${phase + quarter},${y - a} ${phase + quarter},${y - a} ${phase + half},${y} C ${phase + half + quarter},${y + a} ${phase + half + quarter},${y + a} ${phase + TILE},${y}`;
}

// Consecutive lines alternate phase by half a period, so adjacent waves
// interleave into the crossing, woven look of engraved guilloché
// line-work (the fine pattern on certificates and banknotes) rather than
// plain parallel stripes.
const LINES = Array.from({ length: LINE_COUNT }, (_, i) => ({
  y: i * LINE_SPACING + LINE_SPACING / 2,
  phase: i % 2 === 0 ? 0 : TILE / 2,
}));

/**
 * Purely decorative atmosphere shared by every page (landing, chat,
 * analytics dashboard, standards browser): a faint engraved/guilloché
 * line-work texture — the fine interleaved engine-turned pattern found
 * on certificates and banknotes — echoing the product's verification
 * theme rather than being generic decoration. Drifts extremely slowly
 * (barely perceptible over ~100s) for quiet atmosphere, never motion
 * that competes with content.
 *
 * Fixed to the viewport (not the page) so it reads as ambient background
 * behind the scroll. Derives its color from the single `--ambient-accent`
 * token so the effect is byte-for-byte identical everywhere — each page
 * just points that token at its own accent color (see src/index.css and
 * src/pages/landing-page.css) rather than this component branching per
 * page, which is what keeps it reading as one consistent decision.
 */
export function AmbientBackground() {
  const uid = useId().replace(/:/g, "");
  const patternId = `guilloche-${uid}`;

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden
        className="app-paper-texture plate-texture pointer-events-none fixed inset-0 z-0"
      />
      <div
        aria-hidden
        className="ambient-texture pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.05]"
      >
        <svg className="h-full w-full">
          <defs>
            <pattern id={patternId} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
              {LINES.map((line, index) => (
                <path
                  key={index}
                  d={wavePath(line.y, line.phase)}
                  fill="none"
                  stroke="var(--ambient-accent)"
                  strokeWidth={0.6}
                />
              ))}
            </pattern>
          </defs>
          <motion.rect
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            fill={`url(#${patternId})`}
            animate={{ x: ["-5%", "-3%", "-5%"], y: ["-5%", "-7%", "-5%"] }}
            transition={{ duration: 100, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </MotionConfig>
  );
}
