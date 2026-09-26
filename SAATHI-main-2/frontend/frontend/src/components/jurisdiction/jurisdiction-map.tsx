import { X } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

import {
  INDIA_MAP_VIEWBOX,
  INDIA_OUTLINE_PATH,
  INDIA_STATE_PATHS,
} from "@/components/jurisdiction/india-state-paths";
import { BIS_HQ_ID, type JurisdictionData } from "@/lib/mock-jurisdictions";
import { ENTRANCE_TRANSITION } from "@/lib/motion";

interface JurisdictionMapProps {
  jurisdictions: JurisdictionData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const VB_W = INDIA_MAP_VIEWBOX.width;
const VB_H = INDIA_MAP_VIEWBOX.height;

// Motion timing. Markers stagger in 18ms apart; coverage lines follow once
// most markers have landed; each travelling pulse takes PULSE_SECONDS.
const MARKER_STAGGER = 0.018;
const LINES_DELAY = 0.6;
const PULSE_SECONDS = 2.8;

// Marker size and glow by office tier (colour coding stays as before).
type OfficeType = JurisdictionData["regionalOffice"]["type"];
// One hover/selection ring radius for every tier (clears HQ's scaled
// marker: 10 x 1.3).
const SELECTION_RING_R = 15;
const TIER: Record<
  OfficeType,
  { r: number; dot: number; dim: boolean; rank: number }
> = {
  Headquarters: { r: 10, dot: 4.5, dim: false, rank: 3 },
  "Regional Office": { r: 8.5, dot: 4, dim: false, rank: 2 },
  "Branch Office": { r: 7, dot: 3.2, dim: false, rank: 1 },
  "Liaison Coverage": { r: 5.5, dot: 2.6, dim: true, rank: 0 },
};

// ── Click-to-zoom ──────────────────────────────────────────────────────
// Clicking any marker selects it and zooms the map onto it at ZOOM_SCALE.
// Zoomed, the map may spill past the viewBox across the card's full width
// (the SVG is overflow-visible, the viewport clips), so the pan is clamped
// against what is actually visible and the map's real content bounds — the
// map never pans far enough to leave more than CONTENT_MARGIN units of
// empty canvas at an edge. Markers grow by sqrt(scale) — enough to read as
// part of the zoomed map without covering their neighbours; strokes keep
// their width (non-scaling-stroke).
const ZOOM_SCALE = 2.4;
const ZOOM_SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;
const CONTENT_MARGIN = 12;
type View = { x: number; y: number; scale: number };
const FULL_VIEW: View = { x: 0, y: 0, scale: 1 };

// Bounding box of everything drawn (the outline covers every state/UT).
const CONTENT_BOUNDS = (() => {
  const n = INDIA_OUTLINE_PATH.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return {
    x0: Math.min(...xs),
    x1: Math.max(...xs),
    y0: Math.min(...ys),
    y1: Math.max(...ys),
  };
})();

/** Pan for one axis: centre `p` in the visible span [v0, v1], clamped so
 * the content span [c0, c1] (scaled) keeps covering it. If the scaled
 * content is narrower than the visible span, centre the content instead. */
function panAxis(p: number, v0: number, v1: number, c0: number, c1: number) {
  const s = ZOOM_SCALE;
  const min = v1 - CONTENT_MARGIN - s * c1;
  const max = v0 + CONTENT_MARGIN - s * c0;
  if (min > max) return (v0 + v1) / 2 - (s * (c0 + c1)) / 2;
  return Math.min(max, Math.max(min, (v0 + v1) / 2 - s * p));
}

/** `bleed`: how far (viewBox units) the viewport extends past the viewBox
 * on each side horizontally. */
function viewCenteredOn(p: Point, bleed: number): View {
  const b = CONTENT_BOUNDS;
  return {
    scale: ZOOM_SCALE,
    x: panAxis(p.x, -bleed, VB_W + bleed, b.x0, b.x1),
    y: panAxis(p.y, 0, VB_H, b.y0, b.y1),
  };
}

// Labels are shown by density, not hand-placed: at the current zoom a
// label hides when a higher-ranked marker (HQ > Regional > Branch >
// Liaison, then data order) sits within LABEL_ROOM screen units, and comes
// back as soon as zooming in gives it room. Hovered/selected always show.
const LABEL_ROOM = 22;

type Point = { x: number; y: number };

/** A marker's position on screen: its map coordinates put through the
 * current view (translate + scale), and its own size scaled by
 * sqrt(scale). Origin pinned to the SVG origin so the marker scales about
 * its own centre (local 0,0). */
function ZoomPin({
  at,
  zx,
  zy,
  zs,
  children,
  ...handlers
}: {
  at: Point;
  zx: MotionValue<number>;
  zy: MotionValue<number>;
  zs: MotionValue<number>;
  children: ReactNode;
  onClick: (e: MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const x = useTransform(() => zx.get() + zs.get() * at.x);
  const y = useTransform(() => zy.get() + zs.get() * at.y);
  const scale = useTransform(() => Math.sqrt(zs.get()));
  return (
    <motion.g
      style={{
        x,
        y,
        scale,
        originX: 0,
        originY: 0,
        transformBox: "view-box",
      }}
      className="cursor-pointer"
      {...handlers}
    >
      {children}
    </motion.g>
  );
}

/** Quadratic curve HQ -> target, bowing out from the straight line so a
 * curve never appears to kink at a state it merely passes (Delhi -> Gujarat
 * past Rajasthan). The bow starts at 15% of the line's length and grows in
 * steps (up to 30%) only until the curve keeps CLEARANCE units off every
 * other marker's ring, on whichever side needs less; if no candidate
 * reaches that, the one with the most room wins. */
const CLEARANCE = 8;
function coveragePath(
  from: Point,
  to: Point,
  others: (Point & { r: number })[],
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  let fallback = { c: mid, clearance: -Infinity };
  for (const bowK of [0.15, 0.2, 0.25, 0.3]) {
    for (const side of [1, -1]) {
      const bow = len * bowK * side;
      const c = { x: mid.x + nx * bow, y: mid.y + ny * bow };
      let clearance = Infinity;
      for (let t = 0.1; t <= 0.92; t += 0.02) {
        const px = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * c.x + t * t * to.x;
        const py = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * c.y + t * t * to.y;
        for (const o of others) {
          clearance = Math.min(clearance, Math.hypot(px - o.x, py - o.y) - o.r);
        }
      }
      if (clearance >= CLEARANCE) {
        return `M ${from.x} ${from.y} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${to.x} ${to.y}`;
      }
      if (clearance > fallback.clearance) fallback = { c, clearance };
    }
  }
  return `M ${from.x} ${from.y} Q ${fallback.c.x.toFixed(1)} ${fallback.c.y.toFixed(1)} ${to.x} ${to.y}`;
}

export function JurisdictionMap({
  jurisdictions,
  selectedId,
  onSelect,
}: JurisdictionMapProps) {
  const { t } = useTranslation("jurisdiction");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Current view (target) and the three motion values that animate to it —
  // the map group and every marker pin read the same values, so markers
  // can never drift off the state they belong to.
  // The zoom target is kept as a map point and turned into a view against
  // the current viewport, so a resize while zoomed re-clamps correctly.
  const [focus, setFocus] = useState<Point | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [bleed, setBleed] = useState(0);
  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;
    const measure = () => {
      const w = canvas.clientWidth;
      if (w > 0) setBleed(((viewport.clientWidth - w) / 2) * (VB_W / w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);
  const view = useMemo(
    () => (focus ? viewCenteredOn(focus, bleed) : FULL_VIEW),
    [focus, bleed],
  );
  const zoomed = view.scale > 1;
  // Follow the shared selection wherever it changes (a list card as much
  // as a marker): zoom onto the newly selected state, or back out when the
  // selection clears. Adjusted during render, keyed on the id alone, so a
  // filter change never re-zooms a map the person has zoomed out of.
  const [followedId, setFollowedId] = useState(selectedId);
  if (selectedId !== followedId) {
    setFollowedId(selectedId);
    const selected = jurisdictions.find((j) => j.id === selectedId);
    setFocus(selected ? selected.coordinates : null);
  }
  const zx = useMotionValue(0);
  const zy = useMotionValue(0);
  const zs = useMotionValue(1);
  useEffect(() => {
    const opts = prefersReducedMotion ? { duration: 0 } : ZOOM_SPRING;
    const controls = [
      animate(zx, view.x, opts),
      animate(zy, view.y, opts),
      animate(zs, view.scale, opts),
    ];
    return () => controls.forEach((c) => c.stop());
  }, [view, prefersReducedMotion, zx, zy, zs]);
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);
  const zoomOut = () => {
    setHoveredId(null);
    setFocus(null);
  };
  const toCanvas = (p: Point) => ({
    x: view.x + view.scale * p.x,
    y: view.y + view.scale * p.y,
  });

  const hoveredJurisdiction = jurisdictions.find((j) => j.id === hoveredId);
  const hq = jurisdictions.find((j) => j.id === BIS_HQ_ID);
  const coverageStates = jurisdictions.filter(
    (j) => j.id !== BIS_HQ_ID && j.hasDedicatedOffice,
  );

  const coveragePaths = useMemo(() => {
    if (!hq) return new Map<string, string>();
    return new Map(
      coverageStates.map((j) => [
        j.id,
        coveragePath(
          hq.coordinates,
          j.coordinates,
          jurisdictions
            .filter((o) => o.id !== j.id && o.id !== BIS_HQ_ID)
            .map((o) => ({
              ...o.coordinates,
              r: TIER[o.regionalOffice.type].r,
            })),
        ),
      ]),
    );
  }, [hq, coverageStates, jurisdictions]);

  // On-screen distance between two markers at the current zoom.
  const screenGap = (a: JurisdictionData, b: JurisdictionData) =>
    Math.hypot(
      a.coordinates.x - b.coordinates.x,
      a.coordinates.y - b.coordinates.y,
    ) * view.scale;
  const labelVisible = (j: JurisdictionData, index: number) => {
    if (j.id === selectedId || j.id === hoveredId) return true;
    const rank = TIER[j.regionalOffice.type].rank;
    return !jurisdictions.some((o, oi) => {
      if (o.id === j.id || screenGap(o, j) >= LABEL_ROOM) return false;
      const oRank = TIER[o.regionalOffice.type].rank;
      return oRank > rank || (oRank === rank && oi < index);
    });
  };
  // A code label normally sits above its marker; where another marker sits
  // just above on screen, it goes below instead.
  const labelBelow = (j: JurisdictionData) =>
    jurisdictions.some(
      (o) =>
        o.id !== j.id &&
        Math.abs(o.coordinates.x - j.coordinates.x) * view.scale < 12 &&
        (j.coordinates.y - o.coordinates.y) * view.scale > 0 &&
        (j.coordinates.y - o.coordinates.y) * view.scale < 32,
    );

  const renderMarker = (j: JurisdictionData, index: number) => {
    const isSelected = selectedId === j.id;
    const isHovered = hoveredId === j.id;
    const isHq = j.id === BIS_HQ_ID;
    const tier = TIER[j.regionalOffice.type];
    const labelY = labelBelow(j) ? tier.r + 10 : -(tier.r + 3.5);
    const showLabel = labelVisible(j, index);

    return (
      <ZoomPin
        key={j.id}
        at={j.coordinates}
        zx={zx}
        zy={zy}
        zs={zs}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(j.id);
          setFocus(j.coordinates);
        }}
        onMouseEnter={() => setHoveredId(j.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Entrance: fade + scale in with the landing Reveal's spring,
            staggered through the data order (grouped by zone). */}
        <motion.g
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: tier.dim && !isSelected ? 0.72 : 1, scale: 1 }}
          transition={{
            ...ENTRANCE_TRANSITION,
            delay: 0.15 + index * MARKER_STAGGER,
          }}
        >
          {/* Active updates: a continuous amber ping, whatever the
              hover/selection state. */}
          {j.status === "active_changes" && (
            <circle
              r={tier.r + 3}
              className="fill-amber-500 opacity-30 motion-safe:animate-ping"
            />
          )}

          {/* BIS HQ: the strongest glow, a slow breathing pulse (static
              under reduced motion) at the centre of the network. */}
          {isHq && (
            <motion.circle
              r={tier.r + 4}
              className="fill-emerald-500"
              animate={
                prefersReducedMotion
                  ? { opacity: 0.22 }
                  : { opacity: [0.4, 0.1, 0.4], scale: [1, 1.6, 1] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 3.6, ease: "easeInOut", repeat: Infinity }
              }
            />
          )}
          {/* Regional Offices: a softer, static halo (hidden while
              hovered/selected so it never stacks into a triple ring). */}
          {j.regionalOffice.type === "Regional Office" &&
            !isSelected &&
            !isHovered && (
              <circle r={tier.r + 3.5} className="fill-primary/15" />
            )}

          {/* Hover / selection ring: the same size for every tier, crisp and
              unfilled, so it reads as "this one" — distinct from the filled,
              expanding amber ping of "active updates". */}
          {(isSelected || isHovered) && (
            <circle
              r={SELECTION_RING_R}
              fill="none"
              className={`stroke-primary transition-opacity duration-200 ${
                isSelected ? "opacity-80" : "opacity-45"
              }`}
              strokeWidth="1.5"
            />
          )}

          {/* Hover / selection: a springy 200ms scale-up. A CSS transform
              (SVG's default origin is this marker's centre) rather than a
              Motion value, which didn't re-animate here after hydration. */}
          <g
            style={{
              transform: `scale(${isSelected ? 1.3 : isHovered ? 1.18 : 1})`,
              transition: prefersReducedMotion
                ? undefined
                : "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <circle
              r={tier.r}
              className={`transition-[fill,stroke,stroke-width] duration-200 ease-out ${
                isSelected
                  ? "fill-primary/20 stroke-primary stroke-2"
                  : isHovered
                    ? "fill-primary/10 stroke-primary/80 stroke-[1.5]"
                    : tier.dim
                      ? "fill-card stroke-muted-foreground/60 stroke-1"
                      : "fill-card stroke-border stroke-1"
              }`}
            />
            <circle
              r={isSelected ? tier.dot + 1 : tier.dot}
              className={
                isSelected
                  ? "fill-primary"
                  : isHq
                    ? "fill-emerald-500"
                    : j.status === "active_changes"
                      ? "fill-amber-500"
                      : j.hasDedicatedOffice
                        ? "fill-primary/70"
                        : "fill-muted-foreground/70"
              }
            />
            <text
              x={0}
              y={labelY}
              textAnchor="middle"
              className={`font-mono text-[9px] font-bold transition-opacity duration-200 ${
                showLabel ? "opacity-100" : "opacity-0"
              } ${
                isSelected
                  ? "fill-primary font-extrabold"
                  : "fill-foreground/90"
              }`}
            >
              {j.code}
            </text>
          </g>
        </motion.g>
      </ZoomPin>
    );
  };

  const tooltipAt = hoveredJurisdiction
    ? toCanvas(hoveredJurisdiction.coordinates)
    : undefined;

  return (
    <div className="elevation-1 relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Map Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
            {t("map.gridLabel")}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-2xs text-muted-foreground">
          {/* Legend dots preview the motion on the map below. */}
          <span className="flex items-center gap-1">
            <span className="relative flex size-2">
              <motion.span
                className="absolute inset-0 rounded-full bg-emerald-500"
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.3 }
                    : { opacity: [0.5, 0, 0.5], scale: [1, 2.2, 1] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 3.6, ease: "easeInOut", repeat: Infinity }
                }
              />
              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>{" "}
            {t("map.headquarters")}
          </span>
          <span className="flex items-center gap-1">
            <span className="relative flex size-2 overflow-hidden rounded-full bg-primary/40">
              {!prefersReducedMotion && (
                <motion.span
                  className="absolute inset-y-0 w-1/2 rounded-full bg-primary"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: PULSE_SECONDS,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </span>{" "}
            {t("map.bisOffice")}
          </span>
          <span className="flex items-center gap-1">
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-amber-500 opacity-60 motion-safe:animate-ping" />
              <span className="relative size-2 rounded-full bg-amber-500" />
            </span>{" "}
            {t("map.activeUpdates")}
          </span>
        </div>
      </div>

      {/* SVG Interactive India Map */}
      <div className="bg-gradient-to-b from-card via-card/90 to-accent/20 p-2 sm:p-4">
        {/* The zoom viewport: the card's full width (bleeding through the
            padding), clipped here. Unzoomed, the map sits in the centred
            canvas; zoomed, it spills out of the canvas to fill this. */}
        <div
          ref={viewportRef}
          className={`relative -mx-2 overflow-hidden sm:-mx-4 ${zoomed ? "cursor-zoom-out" : ""}`}
          // Any click that isn't on a marker (markers stop propagation)
          // is "empty map space": zoom back out.
          onClick={zoomed ? zoomOut : undefined}
        >
          {/* Sized to the canvas's own aspect ratio (viewBox units map 1:1
            onto it horizontally and vertically). */}
          <div
            ref={canvasRef}
            className="relative mx-auto w-full max-w-xl"
            style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
          >
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              overflow="visible"
              className="h-full w-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="jurisdiction-grid"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border/40"
                  />
                </pattern>
              </defs>

              <rect
                x={-bleed}
                width={VB_W + 2 * bleed}
                height={VB_H}
                fill="url(#jurisdiction-grid)"
              />

              {/* Everything geographic scales with the view; strokes use
                non-scaling-stroke so borders and curves keep their width. */}
              <motion.g
                style={{
                  x: zx,
                  y: zy,
                  scale: zs,
                  originX: 0,
                  originY: 0,
                  transformBox: "view-box",
                }}
              >
                {/* National landmass, back to front: a soft primary glow
                  (stacked wide, faint strokes rather than a blur filter, so
                  with non-scaling-stroke it stays the same on screen at
                  every zoom), then a faint primary tint so India reads as
                  one shape before the eye finds any border. */}
                <g
                  className="pointer-events-none fill-none stroke-primary"
                  strokeLinejoin="round"
                >
                  <path
                    d={INDIA_OUTLINE_PATH}
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={10}
                    className="opacity-[0.06] dark:opacity-[0.1]"
                  />
                  <path
                    d={INDIA_OUTLINE_PATH}
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={5}
                    className="opacity-[0.12] dark:opacity-[0.2]"
                  />
                </g>
                <path
                  d={INDIA_OUTLINE_PATH}
                  className="pointer-events-none fill-primary/[0.07] dark:fill-primary/[0.09]"
                />

                {/* State & UT boundaries (DataMeet / Survey of India outline,
                  simplified — see india-state-paths.ts): the lightest line
                  on the map, so they divide the landmass without competing
                  with the markers and coverage curves above them. */}
                <g className="fill-muted/40 stroke-foreground/20 stroke-[0.6]">
                  {INDIA_STATE_PATHS.map((state) => (
                    <path
                      key={state.name}
                      d={state.d}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                {/* National border over the state lines: heavier and in the
                  primary glow colour, one continuous path so the coastline
                  and the land borders carry the same even stroke. */}
                <path
                  d={INDIA_OUTLINE_PATH}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  className="pointer-events-none fill-none stroke-primary/70 stroke-[1.3] dark:stroke-primary/85"
                />

                {/* Coverage curves from BIS HQ to every office state: a
                  dashed base curve plus a short bright pulse travelling
                  HQ -> office on a loop. pathLength="100" normalises every
                  curve, so the pulse is the same share of each whatever its
                  length; each loop is offset so they never pulse in sync. */}
                {hq &&
                  coverageStates.map((j, lineIndex) => {
                    const isActive = selectedId === j.id || hoveredId === j.id;
                    const d = coveragePaths.get(j.id);
                    if (!d) return null;
                    const gradientId = `jurisdiction-coverage-${j.id}`;
                    return (
                      <motion.g
                        key={`line-${j.id}`}
                        initial={prefersReducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: LINES_DELAY + lineIndex * 0.02,
                        }}
                      >
                        {/* Fades along the line itself (HQ -> office) and
                          only to ~half strength, so every curve visibly
                          reaches its destination. */}
                        <defs>
                          <linearGradient
                            id={gradientId}
                            gradientUnits="userSpaceOnUse"
                            x1={hq.coordinates.x}
                            y1={hq.coordinates.y}
                            x2={j.coordinates.x}
                            y2={j.coordinates.y}
                          >
                            <stop
                              offset="0%"
                              stopColor="#38bdf8"
                              stopOpacity="0.85"
                            />
                            <stop
                              offset="100%"
                              stopColor="#818cf8"
                              stopOpacity="0.5"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d={d}
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke={`url(#${gradientId})`}
                          strokeWidth={isActive ? "1.5" : "0.8"}
                          strokeDasharray={isActive ? "none" : "3,3"}
                          className={`transition-[opacity,stroke-width] duration-200 ease-out hover:opacity-100 ${
                            isActive ? "opacity-100" : "opacity-40"
                          }`}
                        />
                        {!prefersReducedMotion && (
                          <motion.path
                            d={d}
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                            pathLength={100}
                            stroke="#38bdf8"
                            strokeWidth={isActive ? 2 : 1.4}
                            strokeLinecap="round"
                            strokeDasharray="6 94"
                            className="pointer-events-none"
                            initial={{ strokeDashoffset: 100, opacity: 0 }}
                            animate={{
                              strokeDashoffset: [100, 0],
                              opacity: isActive ? 0.95 : 0.7,
                            }}
                            transition={{
                              strokeDashoffset: {
                                duration: PULSE_SECONDS,
                                ease: "linear",
                                repeat: Infinity,
                                // Spread start points across the loop.
                                delay:
                                  LINES_DELAY +
                                  ((lineIndex * 0.61) % PULSE_SECONDS),
                              },
                              opacity: { duration: 0.2 },
                            }}
                          />
                        )}
                      </motion.g>
                    );
                  })}
              </motion.g>

              {/* Markers: positioned through the view, sized by sqrt(zoom). */}
              {jurisdictions.map((j, index) => renderMarker(j, index))}
            </svg>
          </div>

          {/* Visible way back out (also: click empty map space, or Esc) */}
          {zoomed && (
            <button
              type="button"
              onClick={zoomOut}
              className="elevation-2 absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-md border border-border bg-card/95 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:bg-muted"
            >
              <X className="size-3.5" aria-hidden />
              {t("map.zoomOut")}
            </button>
          )}

          {/* Floating tooltip for the hovered marker */}
          {hoveredJurisdiction && tooltipAt && (
            <div
              className="elevation-3 pointer-events-none absolute z-20 flex flex-col gap-1 rounded-xl border border-border bg-card/95 p-3 backdrop-blur-md"
              style={{
                left: `clamp(10px, ${((tooltipAt.x + bleed) / (VB_W + 2 * bleed)) * 100}%, calc(100% - 220px))`,
                top: `clamp(10px, ${(tooltipAt.y / VB_H) * 100}%, calc(100% - 100px))`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-2xs font-bold text-primary">
                  {hoveredJurisdiction.code}
                </span>
                <span className="text-xs font-bold text-foreground">
                  {hoveredJurisdiction.name}
                </span>
              </div>
              <span className="max-w-[200px] truncate text-2xs text-muted-foreground">
                {hoveredJurisdiction.primaryAuthority}
              </span>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-1 font-mono text-2xs">
                <span className="font-semibold text-primary">
                  {t("drawer.coverageScore")}:{" "}
                  {hoveredJurisdiction.regionalOffice.coverageScore}%
                </span>
                <span className="text-muted-foreground">
                  {t(`zones.${hoveredJurisdiction.region}`)}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Discoverability: how zoom works */}
        <p className="mt-2 text-center text-2xs text-muted-foreground">
          {t("map.zoomHint")}
        </p>
      </div>
    </div>
  );
}
