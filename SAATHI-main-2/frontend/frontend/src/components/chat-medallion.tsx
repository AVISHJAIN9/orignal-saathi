import { motion } from "motion/react";

/** A restrained ambient verification plate for wide chat layouts. */
export function ChatMedallion() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 10, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="hidden w-48 xl:block"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur-xl"
      >
        <div className="absolute -right-12 -top-12 size-28 rounded-full bg-[#c6d8e2]/40 blur-2xl" />
        <div className="relative flex items-center justify-between font-mono text-2xs font-semibold tracking-[0.15em] text-[var(--plate-muted)] uppercase">
          <span>Live check</span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <i className="size-1.5 rounded-full bg-emerald-500" />
            verified
          </span>
        </div>
        <div className="relative mt-4 rounded-xl border border-primary/35 bg-[var(--plate-ground)]/60 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border-2 border-primary font-mono text-sm font-bold text-primary">
              ISI
            </div>
            <div>
              <span className="block font-mono text-2xs font-bold tracking-[0.15em] text-primary">
                STANDARD
              </span>
              <span className="mt-1 block font-mono text-sm font-bold tracking-tight text-[var(--plate-ink)]">
                IS 4151
              </span>
            </div>
          </div>
          <motion.div
            animate={{ x: ["-10%", "110%"] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
            className="absolute bottom-2 left-0 h-px w-1/3 bg-primary/45 blur-[1px]"
          />
        </div>
        <div className="relative mt-3 flex items-center justify-between font-mono text-2xs tracking-[0.1em] text-[var(--plate-muted)] uppercase">
          <span>Clause matched</span>
          <span className="text-[var(--plate-accent-deep)]">01 / 01</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
