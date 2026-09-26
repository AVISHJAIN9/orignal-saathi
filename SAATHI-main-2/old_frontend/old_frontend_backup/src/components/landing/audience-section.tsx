import {
  CheckCircle2,
  Factory,
  FileSearch,
  HelpCircle,
  ScanSearch,
  Sparkles,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/landing/reveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";
import { cn } from "@/lib/utils";

const TOTAL_ISI_FRAMES = 300;

function getIsiFrameUrl(index: number): string {
  const num = String(index + 1).padStart(3, "0");
  return `/isi-frames/frame-${num}.webp`;
}

interface AudienceCardColors {
  iconWrap: string;
  badge: string;
  chatBorder: string;
  chatQuestionIcon: string;
  chatAnswerIcon: string;
  statValue: string;
  hoverBorder: string;
}

// Emerald and purple have no semantic-token equivalent in this app (no
// --success or comparable accent), same gap that justifies raw Tailwind +
// dark: on DocumentStatusBadge elsewhere — kept as the established
// exception. Blue reuses --secondary (already this app's pale blue) instead
// of raw sky/blue, same fix applied to Jurisdiction's and Developers' status
// colors earlier.
const CARD_COLORS: Record<
  "consumer" | "business" | "auditor",
  AudienceCardColors
> = {
  consumer: {
    iconWrap: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    chatBorder: "border-emerald-500/20",
    chatQuestionIcon: "text-emerald-600 dark:text-emerald-400",
    chatAnswerIcon: "text-emerald-500",
    statValue: "text-emerald-600 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/40",
  },
  business: {
    iconWrap: "bg-secondary text-secondary-foreground",
    badge: "bg-secondary text-secondary-foreground",
    chatBorder: "border-border",
    chatQuestionIcon: "text-secondary-foreground",
    chatAnswerIcon: "text-secondary-foreground/80",
    statValue: "text-secondary-foreground",
    hoverBorder: "hover:border-secondary",
  },
  auditor: {
    iconWrap: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    chatBorder: "border-purple-500/20",
    chatQuestionIcon: "text-purple-600 dark:text-purple-400",
    chatAnswerIcon: "text-purple-500",
    statValue: "text-purple-600 dark:text-purple-400",
    hoverBorder: "hover:border-purple-500/40",
  },
};

interface AudienceCardProps {
  cardKey: "consumer" | "business" | "auditor";
  icon: LucideIcon;
  badgeNumber: string;
  widthClassName?: string;
}

function AudienceCard({
  cardKey,
  icon: Icon,
  badgeNumber,
  widthClassName,
}: AudienceCardProps) {
  const { t } = useTranslation("landing");
  const colors = CARD_COLORS[cardKey];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className={cn(widthClassName)}
    >
      <div
        className={cn(
          "elevation-1 flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors duration-200",
          colors.hoverBorder,
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-xl",
                colors.iconWrap,
              )}
            >
              <Icon className="size-6" aria-hidden />
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-[0.65rem] font-bold tracking-wide uppercase",
                colors.badge,
              )}
            >
              {badgeNumber} • {t(`audience.${cardKey}.badgeLabel`)}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t(`audience.${cardKey}.title`)}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(`audience.${cardKey}.subtitle`)}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {t(`audience.${cardKey}.body`)}
          </p>

          <div
            className={cn(
              "flex flex-col gap-2 rounded-xl border bg-muted/40 p-3.5 font-mono text-xs",
              colors.chatBorder,
            )}
          >
            <div className="flex items-start gap-2 font-sans text-foreground">
              <HelpCircle
                className={cn(
                  "mt-0.5 size-3.5 shrink-0",
                  colors.chatQuestionIcon,
                )}
                aria-hidden
              />
              <span className="text-[0.72rem] font-medium">
                {t(`audience.${cardKey}.chat.question`)}
              </span>
            </div>
            <div className="flex items-start gap-2 border-t border-border/50 pt-2 font-sans text-muted-foreground">
              <CheckCircle2
                className={cn(
                  "mt-0.5 size-3.5 shrink-0",
                  colors.chatAnswerIcon,
                )}
                aria-hidden
              />
              <span className="text-[0.72rem]">
                {t(`audience.${cardKey}.chat.answer`)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 font-mono text-xs">
          <span className="text-muted-foreground">
            {t(`audience.${cardKey}.stat.label`)}
          </span>
          <span className={cn("font-bold", colors.statValue)}>
            {t(`audience.${cardKey}.stat.value`)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function AudienceSection() {
  const { t } = useTranslation("landing");
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const isPinnedScroll = !isMobile && !prefersReduced;

  const [greetingIndex, setGreetingIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isiCanvasRef = useRef<HTMLCanvasElement>(null);
  const isiFramesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Phase 1 (0.05→0.42): cards glide left and fade out.
  const horizontalOffset = useTransform(
    scrollYProgress,
    [0.05, 0.42],
    ["0%", "-160%"],
  );
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.35, 0.42],
    [1, 1, 0],
  );
  const cardsDisplay = useTransform(scrollYProgress, (v) =>
    v >= 0.43 ? "none" : "flex",
  );

  // Phase 2 (0.43→0.96): ISI mark draws in, strictly absent until phase 1 finishes.
  const isiDisplay = useTransform(scrollYProgress, (v) =>
    v >= 0.43 ? "flex" : "none",
  );
  const isiOpacity = useTransform(scrollYProgress, [0.43, 0.47], [0, 1]);

  const drawIsiFrame = useCallback((img: HTMLImageElement) => {
    const canvas = isiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth || 800;
    const ch = canvas.clientHeight || 450;

    const targetW = Math.round(cw * dpr);
    const targetH = Math.round(ch * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgW = img.naturalWidth || 1280;
    const imgH = img.naturalHeight || 720;
    const scale = Math.min(cw / imgW, ch / imgH);
    const sw = imgW * scale;
    const sh = imgH * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();
  }, []);

  // Preloading, scroll-scrubbing, and resize-redraw only matter when the
  // pinned sequence can actually show — skips 300 unnecessary image
  // requests for reduced-motion/mobile visitors who only ever see the
  // static grid.
  useEffect(() => {
    if (!isPinnedScroll) return;

    const images: (HTMLImageElement | null)[] = new Array(
      TOTAL_ISI_FRAMES,
    ).fill(null);
    isiFramesRef.current = images;
    let isCancelled = false;

    for (let i = 0; i < TOTAL_ISI_FRAMES; i++) {
      const img = new Image();
      img.src = getIsiFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        images[i] = img;
        if (i === currentFrameRef.current) {
          drawIsiFrame(img);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        images[i] = null;
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [isPinnedScroll, drawIsiFrame]);

  useEffect(() => {
    if (!isPinnedScroll) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.43) {
        currentFrameRef.current = 0;
        const frame0 = isiFramesRef.current[0];
        if (frame0 && frame0.complete) {
          drawIsiFrame(frame0);
        }
        return;
      }

      const p = Math.min(1, Math.max(0, (latest - 0.45) / (0.94 - 0.45)));
      const frameIndex = Math.min(
        TOTAL_ISI_FRAMES - 1,
        Math.max(0, Math.floor(p * (TOTAL_ISI_FRAMES - 1))),
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        const img = isiFramesRef.current[frameIndex];
        if (img && img.complete) {
          drawIsiFrame(img);
        }
      }
    });

    return () => unsubscribe();
  }, [isPinnedScroll, scrollYProgress, drawIsiFrame]);

  useEffect(() => {
    if (!isPinnedScroll) return;

    const handleResize = () => {
      const img = isiFramesRef.current[currentFrameRef.current];
      if (img && img.complete) {
        drawIsiFrame(img);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPinnedScroll, drawIsiFrame]);

  // Cycle the cultural greeting every 2.8s.
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES[greetingIndex];

  const cardsContent = (
    <>
      <AudienceCard
        cardKey="consumer"
        icon={ScanSearch}
        badgeNumber="01"
        widthClassName={
          isPinnedScroll
            ? "w-[85vw] shrink-0 sm:w-[24rem] lg:w-[26rem]"
            : undefined
        }
      />
      <AudienceCard
        cardKey="business"
        icon={Factory}
        badgeNumber="02"
        widthClassName={
          isPinnedScroll
            ? "w-[85vw] shrink-0 sm:w-[24rem] lg:w-[26rem]"
            : undefined
        }
      />
      <AudienceCard
        cardKey="auditor"
        icon={FileSearch}
        badgeNumber="03"
        widthClassName={
          isPinnedScroll
            ? "w-[85vw] shrink-0 sm:w-[24rem] lg:w-[26rem]"
            : undefined
        }
      />
    </>
  );

  return (
    <section
      id="who"
      ref={sectionRef}
      className={cn(
        "relative scroll-mt-24",
        isPinnedScroll
          ? "h-[210vh]"
          : "overflow-hidden px-6 py-24 sm:px-10 sm:py-32",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div
        className={
          isPinnedScroll
            ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 sm:px-10"
            : "relative mx-auto flex max-w-6xl flex-col gap-14"
        }
      >
        <div className="relative mx-auto mb-6 flex w-full max-w-6xl flex-col gap-8">
          <Reveal>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                  <UserCheck className="size-3.5" aria-hidden />
                  {t("audience.eyebrow")}
                </span>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentLang.code}
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary"
                    title={t("audience.ticker.eyebrow")}
                  >
                    <Sparkles className="size-3 text-primary" aria-hidden />
                    <span>{currentLang.greeting}</span>
                    <span className="text-[0.65rem] opacity-75">
                      ({currentLang.nativeName})
                    </span>
                  </motion.span>
                </AnimatePresence>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t("audience.heading")}
              </h2>
            </div>
          </Reveal>
        </div>

        {isPinnedScroll ? (
          <div className="relative mx-auto flex min-h-[480px] w-full max-w-6xl items-center justify-center overflow-visible">
            <motion.div
              style={{
                x: horizontalOffset,
                opacity: cardsOpacity,
                display: cardsDisplay,
              }}
              className="flex w-full gap-8 will-change-transform"
            >
              {cardsContent}
            </motion.div>

            <motion.div
              style={{ display: isiDisplay, opacity: isiOpacity }}
              className="pointer-events-none absolute inset-0 flex size-full items-center justify-center"
            >
              <canvas
                ref={isiCanvasRef}
                className="h-full max-h-[460px] w-full max-w-4xl object-contain dark:invert"
              />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {cardsContent}
          </div>
        )}
      </div>
    </section>
  );
}
