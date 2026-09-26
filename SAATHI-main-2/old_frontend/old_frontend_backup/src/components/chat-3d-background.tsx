import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import type { ChatBackgroundMode } from "@/components/chat-background-settings";
import { useIsMobile } from "@/hooks/use-mobile";

interface Chat3DBackgroundProps {
  mode?: ChatBackgroundMode;
}

/**
 * Decorative depth layer for the chat canvas. It borrows the reference's
 * floating rounded slabs and glossy orb, but translates them into Saathi's
 * institutional navy, warm ivory, pale blue, and parchment palette.
 *
 * The continuous scene motion uses CSS transform keyframes so the browser can
 * keep it on the compositor. React only owns the low-frequency spring used for
 * desktop pointer tilt. Mobile renders two lightweight layers and never adds
 * a pointer listener.
 */
export function Chat3DBackground({ mode = "animated" }: Chat3DBackgroundProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerXSpring = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.6 });
  const pointerYSpring = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.6 });
  const pointerRotateX = useTransform(pointerYSpring, [-1, 1], [3.2, -3.2]);
  const pointerRotateY = useTransform(pointerXSpring, [-1, 1], [-4.5, 4.5]);
  const pointerShiftX = useTransform(pointerXSpring, [-1, 1], [-10, 10]);
  const pointerShiftY = useTransform(pointerYSpring, [-1, 1], [-12, 12]);
  const pointerFarX = useTransform(pointerXSpring, [-1, 1], [-18, 18]);
  const pointerFarY = useTransform(pointerYSpring, [-1, 1], [-12, 12]);
  const pointerMidX = useTransform(pointerXSpring, [-1, 1], [-30, 30]);
  const pointerMidY = useTransform(pointerYSpring, [-1, 1], [-20, 20]);
  const pointerFrontX = useTransform(pointerXSpring, [-1, 1], [-44, 44]);
  const pointerFrontY = useTransform(pointerYSpring, [-1, 1], [-28, 28]);
  const pointerOrbX = useTransform(pointerXSpring, [-1, 1], [-58, 58]);
  const pointerOrbY = useTransform(pointerYSpring, [-1, 1], [-42, 42]);
  const pointerGlowX = useTransform(pointerXSpring, [-1, 1], [-120, 120]);
  const pointerGlowY = useTransform(pointerYSpring, [-1, 1], [-90, 90]);
  const pointerRotateZ = useTransform(pointerXSpring, [-1, 1], [-1.8, 1.8]);
  const motionEnabled = mode === "animated";
  const pointerTrackingEnabled = motionEnabled && !isMobile && prefersReducedMotion !== true;

  useEffect(() => {
    if (!pointerTrackingEnabled) {
      pointerX.set(0);
      pointerY.set(0);
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2)));
      pointerY.set(Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2)));
    };
    const resetPointer = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
    };
  }, [pointerTrackingEnabled, pointerX, pointerY]);

  if (mode === "off") return null;

  const sceneClass = motionEnabled ? "chat-3d-animated" : "chat-3d-paused";
  const pointerStyle = {
    rotateX: pointerRotateX,
    rotateY: pointerRotateY,
    x: pointerShiftX,
    y: pointerShiftY,
    rotateZ: pointerRotateZ,
    willChange: motionEnabled && !isMobile ? "transform" : "auto",
  };

  return (
    <div
      aria-hidden
      className={`chat-3d-scene ${sceneClass} pointer-events-none absolute inset-0 z-[1] overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(198,216,226,0.26),transparent_31%),radial-gradient(circle_at_74%_82%,rgba(217,198,163,0.18),transparent_32%)]" />
      <motion.div
        style={{ x: pointerGlowX, y: pointerGlowY }}
        className="absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(198,216,226,0.08)_38%,transparent_72%)] blur-2xl"
      />

      {isMobile ? (
        <div className="absolute -right-24 top-12 h-[22rem] w-[24rem] [perspective:900px] sm:hidden">
          <motion.div
            style={pointerStyle}
            className="absolute inset-0 [transform-style:preserve-3d]"
          >
            <div className="chat-3d-mobile-card chat-3d-layer absolute left-4 top-14 h-40 w-[19rem] rounded-[2rem] border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(232,236,232,0.66)_58%,rgba(198,216,226,0.54))] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_24px_36px_rgba(12,50,86,0.13)] [transform-style:preserve-3d]">
              <div className="absolute inset-[0.4rem] rounded-[1.65rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(214,225,229,0.32))]" />
              <div className="absolute bottom-[-0.65rem] left-8 right-8 h-4 rounded-[50%] bg-[var(--plate-ink)]/15 blur-md" />
            </div>
            <div className="chat-3d-mobile-orb chat-3d-layer absolute left-[15rem] top-2 size-16 rounded-full border border-white/75 bg-[radial-gradient(circle_at_35%_27%,#f4efe3_0_14%,#c6d8e2_15%_28%,#0c3256_52%,#061b32_72%,#8ca9b5_86%,#eef1eb_100%)] shadow-[inset_-8px_-10px_13px_rgba(0,0,0,0.42),inset_6px_6px_8px_rgba(255,255,255,0.8),0_16px_22px_rgba(12,50,86,0.24)] [transform:translateZ(90px)]">
              <div className="absolute inset-4 flex items-center justify-center rounded-full border border-white/55 bg-[var(--plate-ink)]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]">
                <span className="font-mono text-[0.5rem] font-bold tracking-[0.14em] text-[var(--plate-ground)]">
                  S
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="absolute -right-24 top-2 hidden h-[44rem] w-[48rem] [perspective:1250px] 2xl:block 2xl:-right-8 2xl:top-8">
          <motion.div
            style={pointerStyle}
            className="absolute inset-0 [transform-style:preserve-3d]"
          >
            <div className="chat-3d-base chat-3d-layer absolute inset-0 [transform-style:preserve-3d]">
              <motion.div style={{ x: pointerFarX, y: pointerFarY }} className="absolute inset-0">
                <div className="chat-3d-back chat-3d-layer absolute left-24 top-10 h-56 w-[27rem] rounded-[2.25rem] border border-white/80 bg-white/24 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_32px_42px_rgba(12,50,86,0.13)] backdrop-blur-[2px]">
                  <div className="absolute inset-2 rounded-[1.8rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(198,216,226,0.14)_58%,rgba(12,50,86,0.08))]" />
                  <div className="absolute inset-x-10 top-7 h-px bg-white/75" />
                  <div className="absolute bottom-8 right-10 h-2 w-20 rounded-full bg-[var(--plate-accent)]/30 blur-[1px]" />
                </div>
              </motion.div>

              <motion.div style={{ x: pointerMidX, y: pointerMidY }} className="absolute inset-0">
                <div className="chat-3d-mid chat-3d-layer absolute left-2 top-40 h-52 w-[25rem] rounded-[2.2rem] border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.85),rgba(232,236,232,0.66)_58%,rgba(198,216,226,0.58))] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_36px_52px_rgba(12,50,86,0.17)]">
                  <div className="absolute inset-[0.45rem] rounded-[1.8rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(214,225,229,0.34))]" />
                  <div className="absolute bottom-[-0.8rem] left-8 right-8 h-5 rounded-[50%] bg-[var(--plate-ink)]/20 blur-md" />
                </div>
              </motion.div>

              <motion.div
                style={{ x: pointerFrontX, y: pointerFrontY }}
                className="absolute inset-0"
              >
                <div className="chat-3d-front chat-3d-layer absolute left-52 top-[21rem] h-44 w-[22rem] rounded-[2.15rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.76),rgba(244,239,227,0.72)_55%,rgba(198,216,226,0.52))] shadow-[inset_0_2px_0_rgba(255,255,255,0.9),0_28px_44px_rgba(12,50,86,0.14)]">
                  <div className="absolute inset-[0.45rem] rounded-[1.75rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(217,198,163,0.2))]" />
                  <div className="absolute bottom-6 left-14 right-14 h-8 rounded-full border border-white/85 bg-white/55 shadow-[inset_0_2px_4px_rgba(12,50,86,0.08),0_5px_14px_rgba(12,50,86,0.08)] backdrop-blur-sm" />
                  <div className="absolute bottom-[2.05rem] right-[4.5rem] size-4 rounded-full bg-[var(--plate-ink)] shadow-[0_2px_5px_rgba(12,50,86,0.22)]" />
                </div>
              </motion.div>

              <motion.div style={{ x: pointerOrbX, y: pointerOrbY }} className="absolute inset-0">
                <div className="chat-3d-orb chat-3d-layer absolute left-[18rem] top-3 size-[5.75rem] rounded-full border border-white/75 bg-[radial-gradient(circle_at_35%_27%,#f4efe3_0_14%,#c6d8e2_15%_28%,#0c3256_52%,#061b32_72%,#8ca9b5_86%,#eef1eb_100%)] shadow-[inset_-12px_-14px_18px_rgba(0,0,0,0.42),inset_8px_7px_10px_rgba(255,255,255,0.8),0_22px_28px_rgba(12,50,86,0.28)]">
                  <div className="absolute inset-[1.15rem] flex items-center justify-center rounded-full border border-white/55 bg-[var(--plate-ink)]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]">
                    <span className="font-mono text-[0.58rem] font-bold tracking-[0.14em] text-[var(--plate-ground)]">
                      S
                    </span>
                  </div>
                  <div className="absolute left-3 top-2 h-2 w-6 rounded-full bg-white/75 blur-[1px]" />
                </div>
              </motion.div>

              <div className="absolute left-24 top-[18rem] h-px w-44 rotate-[-6deg] bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
              <div className="absolute left-[22rem] top-[12rem] h-2 w-2 rounded-full bg-[var(--plate-accent)]/55 shadow-[0_0_16px_rgba(198,216,226,0.9)]" />
              <div className="absolute left-[7rem] top-[30rem] h-1.5 w-1.5 rounded-full bg-[var(--plate-ink)]/35 shadow-[0_0_12px_rgba(12,50,86,0.6)]" />
            </div>
          </motion.div>
        </div>
      )}

      <div className="absolute -bottom-24 -left-20 hidden h-72 w-72 rounded-full bg-[var(--plate-accent)]/10 blur-3xl sm:block sm:h-96 sm:w-96" />
      <div className="absolute right-[22%] top-[18%] hidden h-40 w-40 rounded-full bg-white/20 blur-3xl sm:block" />
    </div>
  );
}
