"use client";

import { motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

const STAGGER = 0.035;

/**
 * Detects whether the string contains non-Latin scripts (Indic, Arabic, Perso-Arabic,
 * Ol Chiki, Meitei, etc.) or Unicode combining marks that require complex OpenType shaping.
 * Splitting such strings into individual character spans detaches vowel marks (matras),
 * viramas, and nuktas, causing browsers to render fallback dotted circles (U+25CC).
 */
const hasComplexScript = (str: string): boolean => {
  return (
    /[\p{M}\u0600-\u0DFF\u1C50-\u1C7F\uA800-\uA82F]/u.test(str) ||
    !/^[\p{Script=Latin}\p{P}\p{N}\p{Z}\p{S}]*$/u.test(str)
  );
};

/**
 * TextRoll — per-character rolling hover animation for Latin text,
 * and seamless word-level rolling animation for complex Indic/non-Latin scripts.
 *
 * For Latin text, every letter scrolls upward out of view while an identical
 * letter scrolls in from below, with a stagger delay.
 * For complex scripts (Hindi, Bengali, Telugu, Tamil, etc.), character-level
 * splitting is avoided to keep all aksharas, matras, and ligatures intact.
 */
export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = true }) => {
  const isComplex = hasComplexScript(children);

  if (isComplex) {
    return (
      <motion.span
        initial="initial"
        whileHover="hovered"
        className={cn("relative inline-block overflow-hidden", className)}
        style={{ lineHeight: 1.35 }}
      >
        {/* Primary token — slide UP on hover */}
        <motion.span
          variants={{
            initial: { y: 0 },
            hovered: { y: "-100%" },
          }}
          transition={{ ease: "easeInOut", duration: 0.28 }}
          className="inline-block"
          aria-hidden="true"
        >
          {children}
        </motion.span>

        {/* Duplicate token — slide IN from below on hover */}
        <motion.span
          variants={{
            initial: { y: "100%" },
            hovered: { y: 0 },
          }}
          transition={{ ease: "easeInOut", duration: 0.28 }}
          className="absolute inset-0 inline-block"
          aria-hidden="true"
        >
          {children}
        </motion.span>
      </motion.span>
    );
  }

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
