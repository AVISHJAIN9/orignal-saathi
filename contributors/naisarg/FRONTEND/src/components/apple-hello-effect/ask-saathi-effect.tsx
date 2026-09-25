"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import type { TargetAndTransition } from "motion/react"
import { motion, useInView } from "motion/react"

import { cn } from "@/lib/utils"

const initialProps: TargetAndTransition = {
  pathLength: 0,
  opacity: 0,
}

const animateProps: TargetAndTransition = {
  pathLength: 1,
  opacity: 1,
}

export type AskSaathiEffectProps = Omit<
  ComponentProps<typeof motion.svg>,
  "durationScale" | "onAnimationComplete"
> & {
  /**
   * Scales the duration and delay of the handwriting animation.
   * Values below 1 speed up, values above 1 slow down.
   * @defaultValue 0.85
   */
  durationScale?: number
  /** Called when the full handwriting animation completes. */
  onAnimationComplete?: () => void
  /** If true, continuously replays the handwriting effect after a pause while in view. */
  loop?: boolean
  /** Pause duration in ms before looping if loop is enabled. @defaultValue 3500 */
  loopDelay?: number
  /** Re-trigger the animation every time the element scrolls into view (from top or bottom). @defaultValue true */
  triggerOnScroll?: boolean
}

export function AskSaathiEffect({
  className,
  durationScale = 0.85,
  onAnimationComplete,
  loop = false,
  loopDelay = 3500,
  triggerOnScroll = true,
  ...props
}: AskSaathiEffectProps) {
  const calc = (x: number) => x * durationScale
  const svgRef = useRef<SVGSVGElement>(null)
  const isInView = useInView(svgRef, { amount: 0.25 })
  const [playCount, setPlayCount] = useState(0)

  useEffect(() => {
    if (triggerOnScroll && isInView) {
      setPlayCount((prev) => prev + 1)
    }
  }, [isInView, triggerOnScroll])

  const handleLastStrokeComplete = () => {
    onAnimationComplete?.()
    if (loop && isInView && !onAnimationComplete) {
      setTimeout(() => {
        setPlayCount((prev) => prev + 1)
      }, loopDelay)
    }
  }

  // If triggerOnScroll is active and it has never entered view yet, don't show completed strokes
  const shouldAnimate = !triggerOnScroll || playCount > 0

  return (
    <motion.svg
      ref={svgRef}
      className={cn("h-16 sm:h-20 md:h-24 w-auto max-w-full select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 780 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="9.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      <title>Ask SAATHI.</title>

      {shouldAnimate && (
        <g key={playCount}>
          {/* 'A' stem: entry swoosh and apex down to baseline */}
          <motion.path
            d="M 45 130 C 55 125, 75 90, 95 45 C 105 25, 112 25, 118 35 L 136 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.55),
              ease: [0.45, 0.05, 0.55, 0.95],
              opacity: { duration: 0.15 },
            }}
          />

          {/* 'A' crossbar connecting forward */}
          <motion.path
            d="M 80 88 C 100 84, 122 84, 144 88"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.35),
              ease: "easeInOut",
              delay: calc(0.45),
              opacity: { duration: 0.15, delay: calc(0.45) },
            }}
          />

          {/* 's' cursive: rise, top curve, right belly, tuck base, connecting tail */}
          <motion.path
            d="M 144 95 C 155 90, 168 76, 178 65 C 184 59, 192 60, 191 70 C 188 84, 206 96, 205 112 C 204 124, 186 130, 175 125 C 168 122, 178 116, 195 110 C 205 106, 215 102, 224 96"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.55),
              ease: [0.45, 0.05, 0.55, 0.95],
              delay: calc(0.75),
              opacity: { duration: 0.15, delay: calc(0.75) },
            }}
          />

          {/* 'k' ascender loop: up, loop left, straight down */}
          <motion.path
            d="M 224 96 C 238 88, 252 50, 258 26 C 261 16, 255 14, 248 22 C 238 32, 234 60, 234 95 L 234 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.55),
              ease: [0.45, 0.05, 0.55, 0.95],
              delay: calc(1.25),
              opacity: { duration: 0.15, delay: calc(1.25) },
            }}
          />

          {/* 'k' belly and kick-out swash */}
          <motion.path
            d="M 234 92 C 248 76, 268 74, 272 84 C 276 94, 264 104, 250 106 C 262 116, 276 130, 292 132 C 302 133, 312 128, 322 120"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.45),
              ease: "easeInOut",
              delay: calc(1.7),
              opacity: { duration: 0.15, delay: calc(1.7) },
            }}
          />

          {/* 'S' in SAATHI */}
          <motion.path
            d="M 412 36 C 398 24, 375 25, 368 40 C 360 55, 370 70, 390 80 C 412 92, 422 106, 420 120 C 418 134, 400 142, 380 140 C 365 138, 355 128, 350 118"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.65),
              ease: [0.45, 0.05, 0.55, 0.95],
              delay: calc(2.1),
              opacity: { duration: 0.15, delay: calc(2.1) },
            }}
          />

          {/* 'A' 1 in SAATHI */}
          <motion.path
            d="M 436 130 L 465 28 L 494 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.45),
              ease: "easeInOut",
              delay: calc(2.65),
              opacity: { duration: 0.15, delay: calc(2.65) },
            }}
          />
          <motion.path
            d="M 448 92 L 482 92"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.2),
              ease: "easeInOut",
              delay: calc(3.0),
              opacity: { duration: 0.1, delay: calc(3.0) },
            }}
          />

          {/* 'A' 2 in SAATHI */}
          <motion.path
            d="M 506 130 L 535 28 L 564 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.45),
              ease: "easeInOut",
              delay: calc(3.15),
              opacity: { duration: 0.15, delay: calc(3.15) },
            }}
          />
          <motion.path
            d="M 518 92 L 552 92"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.2),
              ease: "easeInOut",
              delay: calc(3.5),
              opacity: { duration: 0.1, delay: calc(3.5) },
            }}
          />

          {/* 'T' in SAATHI */}
          <motion.path
            d="M 578 30 L 634 30"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.25),
              ease: "easeInOut",
              delay: calc(3.65),
              opacity: { duration: 0.1, delay: calc(3.65) },
            }}
          />
          <motion.path
            d="M 606 30 L 606 124 C 606 128, 610 131, 616 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.35),
              ease: "easeInOut",
              delay: calc(3.85),
              opacity: { duration: 0.1, delay: calc(3.85) },
            }}
          />

          {/* 'H' in SAATHI */}
          <motion.path
            d="M 648 28 L 648 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.3),
              ease: "easeInOut",
              delay: calc(4.15),
              opacity: { duration: 0.1, delay: calc(4.15) },
            }}
          />
          <motion.path
            d="M 692 28 L 692 130"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.3),
              ease: "easeInOut",
              delay: calc(4.4),
              opacity: { duration: 0.1, delay: calc(4.4) },
            }}
          />
          <motion.path
            d="M 648 80 L 692 80"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.2),
              ease: "easeInOut",
              delay: calc(4.65),
              opacity: { duration: 0.1, delay: calc(4.65) },
            }}
          />

          {/* 'I' in SAATHI */}
          <motion.path
            d="M 710 30 L 736 30"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.2),
              ease: "easeInOut",
              delay: calc(4.8),
              opacity: { duration: 0.1, delay: calc(4.8) },
            }}
          />
          <motion.path
            d="M 723 30 L 723 128"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.3),
              ease: "easeInOut",
              delay: calc(4.95),
              opacity: { duration: 0.1, delay: calc(4.95) },
            }}
          />
          <motion.path
            d="M 710 128 L 736 128"
            initial={initialProps}
            animate={animateProps}
            transition={{
              duration: calc(0.2),
              ease: "easeInOut",
              delay: calc(5.2),
              opacity: { duration: 0.1, delay: calc(5.2) },
            }}
          />

          {/* Period '.' */}
          <motion.circle
            cx="756"
            cy="125"
            r="5"
            fill="currentColor"
            stroke="none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: calc(0.3),
              delay: calc(5.4),
              ease: [0.175, 0.885, 0.32, 1.275],
            }}
            onAnimationComplete={handleLastStrokeComplete}
          />
        </g>
      )}
    </motion.svg>
  )
}
