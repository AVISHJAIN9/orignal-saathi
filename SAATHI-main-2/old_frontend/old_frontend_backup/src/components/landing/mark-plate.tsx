import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

// viewBox matches the rendered 16:13 box exactly, so the rounded rect corners
// stay circular instead of stretching into ellipses.
const VIEW_W = 160;
const VIEW_H = 130;
const OUTER = { x: 5, y: 4, width: 150, height: 122, rx: 6 };
const INSET = { x: 12, y: 10, width: 136, height: 110, rx: 5 };

// Four stylized stamp impressions, one per BIS certification scheme — each
// simplified for this plate's material system but shaped and detailed after
// the REAL mark's verified visual character (researched, not guessed), not
// an arbitrary abstract primitive. Which one is struck depends on the
// citation's actual scheme, never a fixed default.
//
// ISI: the real ISI mark is a rectangular tag (4:3 ratio) whose single most
// identifying feature is the literal "ISI" lettering inside it — that's
// three letters of an initialism, not a graphic logo, so setting the actual
// text is what makes this read as the real mark rather than a placeholder.
const ISI_TAG = { x: 66, y: 14, width: 28, height: 21, rx: 1 };
// Hallmark: the BIS Hallmark's own triangular logo, which genuinely carries
// a tick mark inside it — struck above the purity grade the way a real
// hallmark sequence leads with the BIS mark.
const HALLMARK_OUTER = "80,18 71,33 89,33";
const HALLMARK_TICK = "M75,28 L78.5,31.5 L86,22";
// CRS: no independent pictorial mark exists — it reuses the same Standard
// Mark tag as ISI, distinguished only by carrying an "R" registration number
// instead of a CM/L licence number. Rounded corners keep it visually
// distinct from ISI's sharp-cornered tag at a glance.
const CRS_TAG = { x: 66, y: 14, width: 28, height: 21, rx: 6 };
// CoC: placeholder octagon pending real content — flagged to the user rather
// than presented as verified, since research turned up no distinct BIS
// pictorial mark for this scheme (toy safety, for example, uses the ISI mark).
const COC_OCTAGON = "76,16 84,16 89,21 89,29 84,34 76,34 71,29 71,21";

export type MarkType = "isi" | "hallmark" | "crs" | "coc";

interface MarkPlateProps {
  variant: "cited" | "declined";
  /** Which BIS scheme this citation actually belongs to. Required when cited — ignored when declined, since nothing was verified. */
  markType?: MarkType;
  label: string;
  standard?: string;
  className?: string;
}

/**
 * The certification-plate motif: a punch-tag standing in for a BIS
 * certification mark struck into a product — stamped with a verified
 * standard number, or left blank when SAATHI has nothing verified to cite.
 * Which glyph is struck (tag/triangle+tick/rounded-tag/octagon) is driven by
 * the citation's own scheme, never a fixed default; a declined citation gets
 * no glyph at all, since no scheme applies to something unverified. The
 * inner rim is shaded dark top-left / light bottom-right — the standard
 * convention for a pressed-in (not raised) plate.
 */
export function MarkPlate({ variant, markType, label, standard, className }: MarkPlateProps) {
  const isCited = variant === "cited";
  const uid = useId().replace(/:/g, "");
  const metalId = `metal-${uid}`;
  const brushId = `brush-${uid}`;
  const bevelDarkId = `bevel-dark-${uid}`;
  const bevelLightId = `bevel-light-${uid}`;

  // Real 3D tilt, not a CSS illusion: the plate already fakes an embossed
  // metal surface with 2D bevel gradients, so letting it actually rotate in
  // perspective toward the cursor — like tilting a physical stamped plate
  // to catch the light — is what makes that illusion pay off, rather than
  // being 3D for its own sake. Springs keep it feeling weighted, not
  // twitchy. Disabled outright under reduced motion, matching every other
  // motion component in this app.
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    const MAX_TILT_DEG = 9;
    setTilt({ x: py * -MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 });
  }

  function handlePointerLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <motion.div
      initial={{ scale: 1.16, opacity: 0, y: -8 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 320, damping: 20, mass: 0.7 }}
      className={cn("relative aspect-[16/13] w-full", className)}
      data-plate={variant}
      data-mark={markType}
    >
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative h-full w-full"
      >
        <div
          style={{
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
            transformStyle: "preserve-3d",
          }}
          className="relative h-full w-full"
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              {/* Brushed-metal base: banded diagonal sheen rather than a flat fill. */}
              <linearGradient id={metalId} x1="8%" y1="0%" x2="92%" y2="100%">
                {isCited ? (
                  <>
                    <stop offset="0%" stopColor="var(--plate-ground)" />
                    <stop offset="28%" stopColor="var(--plate-ground-deep)" />
                    <stop offset="52%" stopColor="var(--plate-ground)" />
                    <stop offset="78%" stopColor="var(--plate-ground-deep)" />
                    <stop offset="100%" stopColor="var(--plate-ground)" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="var(--plate-ground-deep)" />
                    <stop offset="50%" stopColor="var(--plate-surface)" />
                    <stop offset="100%" stopColor="var(--plate-ground-deep)" />
                  </>
                )}
              </linearGradient>

              {/* Fine diagonal brush-marks over the metal base. */}
              <pattern
                id={brushId}
                width="3.5"
                height="3.5"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(112)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="3.5"
                  stroke="var(--plate-ink)"
                  strokeWidth="0.5"
                  strokeOpacity={isCited ? 0.055 : 0.035}
                />
              </pattern>

              {/* Deboss rim: dark fades in from the top-left corner... */}
              <linearGradient id={bevelDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--plate-ink)" stopOpacity="0.55" />
                <stop offset="42%" stopColor="var(--plate-ink)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--plate-ink)" stopOpacity="0" />
              </linearGradient>
              {/* ...light fades in from the bottom-right corner (warm cream, never pure white). */}
              <linearGradient id={bevelLightId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--plate-ground)" stopOpacity="0" />
                <stop offset="58%" stopColor="var(--plate-ground)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--plate-ground)" stopOpacity="1" />
              </linearGradient>
            </defs>

            <rect {...OUTER} fill={`url(#${metalId})`} />
            <rect {...OUTER} fill={`url(#${brushId})`} />

            <rect
              {...INSET}
              fill="none"
              stroke={`url(#${bevelDarkId})`}
              strokeWidth="5"
              style={{ filter: "blur(1.1px)" }}
            />
            <rect
              {...INSET}
              fill="none"
              stroke={`url(#${bevelLightId})`}
              strokeWidth="3.2"
              style={{ filter: "blur(0.8px)" }}
            />

            <rect
              {...OUTER}
              fill="none"
              stroke={isCited ? "var(--plate-accent)" : "var(--plate-line)"}
              strokeWidth={isCited ? 1.6 : 1.4}
              strokeDasharray={isCited ? undefined : "4.5 3.5"}
            />

            {/* Marks are printed/engraved line art on the plate's own surface —
            outline only, never a solid colour-washed silhouette. */}
            {isCited && markType === "isi" && (
              <>
                <rect
                  {...ISI_TAG}
                  fill="none"
                  stroke="var(--plate-accent-deep)"
                  strokeWidth={1.8}
                />
                <text
                  x={ISI_TAG.x + ISI_TAG.width / 2}
                  y={ISI_TAG.y + ISI_TAG.height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={800}
                  fill="var(--plate-accent-deep)"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.03em" }}
                >
                  ISI
                </text>
              </>
            )}
            {isCited && markType === "hallmark" && (
              <>
                <polygon
                  points={HALLMARK_OUTER}
                  fill="none"
                  stroke="var(--plate-accent-deep)"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                <path
                  d={HALLMARK_TICK}
                  fill="none"
                  stroke="var(--plate-accent-deep)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
            {isCited && markType === "crs" && (
              <>
                <rect
                  {...CRS_TAG}
                  fill="none"
                  stroke="var(--plate-accent-deep)"
                  strokeWidth={1.8}
                />
                <text
                  x={CRS_TAG.x + CRS_TAG.width / 2}
                  y={CRS_TAG.y + CRS_TAG.height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontWeight={800}
                  fill="var(--plate-accent-deep)"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  R
                </text>
              </>
            )}
            {isCited && markType === "coc" && (
              <polygon
                points={COC_OCTAGON}
                fill="none"
                stroke="var(--plate-accent-deep)"
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
            )}
          </svg>
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 px-8 pt-6 text-center">
            <span
              className={cn(
                "font-mono text-[0.6rem] font-medium tracking-[0.22em] uppercase",
                isCited ? "text-[var(--plate-accent-deep)]" : "text-[var(--plate-muted)]",
              )}
              style={{
                textShadow:
                  "0.75px 0.75px 0.5px var(--plate-shadow-light), -0.75px -0.75px 0.5px var(--plate-shadow-dark)",
              }}
            >
              {label}
            </span>
            {isCited ? (
              <span
                className="font-mono text-2xl font-bold tracking-tight text-[var(--plate-accent)] sm:text-3xl"
                style={{
                  textShadow:
                    "1px 1px 0.5px var(--plate-shadow-light), -1px -1px 1px var(--plate-shadow-dark)",
                }}
              >
                {standard}
              </span>
            ) : (
              <span
                className="text-xl font-light text-[var(--plate-muted)] sm:text-2xl"
                style={{
                  textShadow:
                    "0.75px 0.75px 0.5px var(--plate-shadow-light), -0.75px -0.75px 0.5px var(--plate-shadow-dark)",
                }}
              >
                —
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
