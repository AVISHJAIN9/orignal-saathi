import { BadgeCheck, SearchX } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

/**
 * Slide-in character-by-character animation modified from the user's sample code.
 *
 * Enhancements:
 * 1. Groups characters into words with `inline-block whitespace-nowrap` so words
 *    wrap cleanly across lines without breaking mid-word on responsive viewports.
 * 2. Uses `whileInView` with `viewport: { once: false }` so the animation
 *    re-triggers whenever scrolled past, both top-to-bottom and bottom-to-top.
 * 3. Uses instant reset on exit so it is immediately prepared to replay.
 * 4. Supports `useReducedMotion()` for accessibility.
 * 5. Preserves exact typography, serif font styling, and dark theme colors.
 */
function SlideInHeading({
  text,
  className = "",
  delayOffset = 0.1,
  charDelay = 0.022,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
  charDelay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return <h2 className={className}>{text}</h2>;
  }

  let charIndex = 0;

  return (
    <h2 className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="inline"
      >
        {words.map((word, wordIdx) => {
          const chars = word.split("");
          return (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {chars.map((char) => {
                const i = charIndex++;
                return (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: {
                        x: -35,
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0 },
                      },
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          delay: delayOffset + i * charDelay,
                          duration: 0.38,
                          ease: "easeOut",
                        },
                      },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordIdx < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
      </motion.span>
    </h2>
  );
}

/**
 * Slide-in word-by-word animation for paragraphs, maintaining readable flow.
 * Re-triggers on bidirectional scroll (`once: false`).
 */
function SlideInWords({
  text,
  className = "",
  delayOffset = 0.32,
  wordDelay = 0.016,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
  wordDelay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: {
              x: -20,
              opacity: 0,
              transition: { duration: 0.15, delay: 0 },
            },
            visible: {
              x: 0,
              opacity: 1,
              transition: {
                delay: delayOffset + i * wordDelay,
                duration: 0.35,
                ease: "easeOut",
              },
            },
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function TrustSection() {
  const { t } = useTranslation("landing");
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="why"
      className="bg-[var(--plate-accent-ground)] px-6 py-20 text-[var(--plate-on-accent)] sm:px-10 sm:py-28"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-5">
          {/* Eyebrow badge */}
          <motion.div
            initial={prefersReduced ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {
                x: -30,
                opacity: 0,
                transition: { duration: 0.15 },
              },
              visible: {
                x: 0,
                opacity: 1,
                transition: { duration: 0.45, ease: "easeOut" },
              },
            }}
          >
            <span className="inline-flex w-fit items-center rounded-full border border-[var(--plate-on-accent)]/25 px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide text-[var(--plate-on-accent)]/70 uppercase">
              {t("trust.eyebrow")}
            </span>
          </motion.div>

          {/* Heading with character-by-character slide-in */}
          <SlideInHeading
            text={t("trust.heading")}
            className="font-serif text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl text-[var(--plate-on-accent)]"
            delayOffset={0.12}
            charDelay={0.022}
          />
        </div>

        {/* Body text with word-by-word slide-in */}
        <SlideInWords
          text={t("trust.body")}
          className="max-w-2xl text-base leading-relaxed text-[var(--plate-on-accent)]/85 sm:text-lg"
          delayOffset={0.35}
          wordDelay={0.015}
        />

        {/* Divider and two comparison columns */}
        <motion.div
          initial={prefersReduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {
              opacity: 0,
              y: 16,
              transition: { duration: 0.15 },
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.5, ease: "easeOut" },
            },
          }}
          className="mt-4 border-t border-[var(--plate-on-accent)]/15 pt-8"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Left Column: Verified */}
            <motion.div
              initial={prefersReduced ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: {
                  x: -25,
                  opacity: 0,
                  transition: { duration: 0.15 },
                },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.6, ease: "easeOut" },
                },
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <BadgeCheck
                  className="size-4 shrink-0 text-[var(--plate-on-accent)]/70"
                  aria-hidden
                />
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[var(--plate-on-accent)]/70 uppercase">
                  {t("hero.demo.citedLabel")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--plate-on-accent)]/85">
                {t("trust.citedPoint")}
              </p>
            </motion.div>

            {/* Right Column: No Standard Found */}
            <motion.div
              initial={prefersReduced ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: {
                  x: -25,
                  opacity: 0,
                  transition: { duration: 0.15 },
                },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.72, ease: "easeOut" },
                },
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <SearchX
                  className="size-4 shrink-0 text-[var(--plate-on-accent)]/70"
                  aria-hidden
                />
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[var(--plate-on-accent)]/70 uppercase">
                  {t("hero.demo.declinedLabel")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--plate-on-accent)]/85">
                {t("trust.declinedPoint")}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
