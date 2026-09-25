"use client";

import { motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

const STAGGER = 0.035;

/**
 * TextRoll — per-character rolling hover animation.
 *
 * On hover every letter scrolls upward out of view while an identical
 * letter scrolls in from below, with a stagger delay that radiates
 * outward from the centre of the string (when `center` is true) or
 * left-to-right (when `center` is false).
 *
 * Adapted from the user-provided Skiper58 sample, ported to
 * `motion/react` and the project's design-token palette.
 */
export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = true }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative inline-block overflow-hidden", className)}
      style={{ lineHeight: 0.85 }}
    >
      {/* Primary characters — slide UP on hover */}
      <span className="inline-flex" aria-hidden="true">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </span>

      {/* Duplicate characters — slide IN from below on hover */}
      <span className="absolute inset-0 inline-flex" aria-hidden="true">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
};
