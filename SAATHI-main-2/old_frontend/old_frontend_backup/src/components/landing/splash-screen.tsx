import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SESSION_KEY = "saathi:splash-seen";
const AUTO_DISMISS_MS = 2600;

/**
 * A short, once-per-session brand reveal before the landing page.
 * The mark is presented as a translucent glass object over a softly lit field,
 * then the veil fades to reveal the page underneath.
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadySeen || prefersReducedMotion) {
      onDone();
      return;
    }

    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    // onDone fires here — the moment dismissal starts — rather than after the
    // exit animation finishes, so the landing content underneath can start
    // fading in while this veil is still fading out. That overlap is what
    // makes the handoff read as one continuous reveal instead of "splash
    // disappears, then content pops in" a beat later.
    window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, AUTO_DISMISS_MS);
    // Deliberately keep this timer alive through StrictMode's development pass.
    // The splash is session-scoped and the exit callback safely handles cleanup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function skip() {
    setVisible(false);
    onDone();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Skip intro"
          onClick={skip}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") skip();
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden bg-[#ebe8df]/90 px-6 backdrop-blur-2xl"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute left-[15%] top-[18%] size-64 rounded-full bg-[#d5dce2]/55 blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 1.6, delay: 0.15, ease: "easeOut" }}
              className="absolute bottom-[12%] right-[12%] size-80 rounded-full bg-[#d6c4b3]/45 blur-3xl"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.52),transparent_48%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="absolute -inset-20 rounded-[3rem] bg-white/25 blur-2xl" />
            <div className="relative flex size-64 items-center justify-center rounded-[3rem] border border-white/70 bg-white/25 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_-1px_-1px_0_rgba(142,132,116,0.12),0_30px_80px_rgba(96,88,75,0.18)] backdrop-blur-xl sm:size-72">
              <div className="absolute inset-3 rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-white/35 via-white/10 to-transparent" />
              <div className="absolute inset-8 rounded-[2rem] border border-white/30 bg-[#f8f6f0]/20 shadow-[inset_0_0_35px_rgba(255,255,255,0.45)]" />

              <motion.div
                initial={{ rotateX: -42, rotateZ: -5, y: -14, scale: 0.78 }}
                animate={{ rotateX: 0, rotateZ: 0, y: 0, scale: 1 }}
                transition={{
                  duration: 0.95,
                  delay: 0.25,
                  type: "spring",
                  stiffness: 170,
                  damping: 15,
                }}
                style={{ transformPerspective: 700, transformOrigin: "center center" }}
                className="relative flex size-28 items-center justify-center rounded-[2rem] border border-white/55 bg-primary/90 font-mono text-6xl font-semibold text-primary-foreground shadow-[inset_1px_1px_0_rgba(255,255,255,0.55),inset_-8px_-10px_18px_rgba(49,55,62,0.18),0_18px_32px_rgba(57,62,68,0.22)] backdrop-blur-md sm:size-32 sm:text-7xl"
              >
                <span className="absolute left-4 top-3 h-8 w-14 rotate-[-22deg] rounded-full bg-white/25 blur-md" />
                <span className="relative">S</span>
              </motion.div>

              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.55, 1.05, 1.45] }}
                transition={{ duration: 1.2, delay: 0.95, times: [0, 0.18, 1], ease: "easeOut" }}
                className="absolute size-32 rounded-[2rem] border border-primary/70 sm:size-36"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.5, ease: "easeOut" }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <span className="font-mono text-[11px] font-medium tracking-[0.42em] text-primary uppercase">
                SAATHI
              </span>
              <span className="h-px w-10 bg-primary/30" />
              <span className="text-[10px] tracking-[0.18em] text-[var(--plate-muted)] uppercase">
                Trust, made visible
              </span>
            </motion.div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="absolute bottom-8 font-mono text-[9px] tracking-[0.22em] text-[var(--plate-muted)]/80 uppercase"
          >
            Tap to continue
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
