import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Repeat,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/lib/router-compat";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const LIGHT_TOTAL_FRAMES = 240;
const DARK_TOTAL_FRAMES = 240;

function getFrameUrl(index: number, isDark: boolean): string {
  const num = String(index + 1).padStart(3, "0");
  return isDark
    ? `/opening-sequence-dark/frame-${num}.webp`
    : `/opening-sequence/frame-${num}.webp`;
}

interface StoryStage {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
}

const STORY_STAGES: StoryStage[] = [
  {
    tag: "STAGE 01 // THE CRUMPLED MANDATE",
    tagColor: "text-primary dark:text-cyan-400",
    title: "Complexity, unflattened.",
    description:
      "Hundreds of pages of technical specifications, gazette orders, and chemical test limits begin as an entangled puzzle for manufacturers.",
  },
  {
    tag: "STAGE 02 // AI CLAUSE EXTRACTION",
    tagColor: "text-amber-600 dark:text-cyan-400",
    title: "Decoding unorganized mandates.",
    description:
      "SAATHI parses Quality Control Orders (QCOs) and Indian Standards (IS Codes), extracting regulatory parameters automatically.",
  },
  {
    tag: "STAGE 03 // RIGOROUS FLATTENING",
    tagColor: "text-cyan-700 dark:text-cyan-400",
    title: "The sheet smooths into law.",
    description:
      "Chemical purity thresholds, mechanical tolerances, and NABL laboratory testing protocols align with mathematical precision.",
  },
  {
    tag: "STAGE 04 // THE DESCENT OF AUTHORITY",
    tagColor: "text-indigo-700 dark:text-teal-400",
    title: "The wooden BIS stamp descends.",
    description:
      "The Bureau of Indian Standards seal descends into frame to certify nationwide compliance and statutory legitimacy.",
  },
  {
    tag: "STAGE 05 // HIGH-PRESSURE IMPRESSION",
    tagColor: "text-rose-700 dark:text-cyan-400",
    title: "Affixing the national standard.",
    description:
      "The physical seal presses deep into the grain, bonding statutory requirements directly to the material specifications.",
  },
  {
    tag: "STAGE 06 // SEAL REVEALED",
    tagColor: "text-teal-700 dark:text-teal-300",
    title: "The official red roundel emerges.",
    description:
      "The wooden stamp lifts away, revealing the crisp, official BIS mark with 100% clause traceability and tamper-proof verification.",
  },
  {
    tag: "STAGE 07 // CERTIFIED BY LAW",
    tagColor: "text-emerald-700 dark:text-cyan-300",
    title: "The Stamp of Trust Affixed.",
    description:
      "Bureau of Indian Standards compliance locked. Official red roundel sealed with complete 100% clause traceability.",
  },
];

export function PaperStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  const { resolvedTheme } = useTheme();
  // This app renders on the server (TanStack Start), which has no document
  // or localStorage — the reference this was ported from is a client-only
  // SPA, where reading localStorage directly in this initializer let the
  // very first render pick the right 240-frame sequence, before any effect
  // (including ThemeProvider's) had run. Here that same read would make the
  // client's first hydration pass diverge from what the server rendered
  // (which always assumes light), throwing a hydration mismatch — so this
  // must default to false just like ThemeProvider's own `resolvedTheme`
  // does, for the same reason. The effect below (MutationObserver +
  // resolvedTheme) corrects it immediately post-mount; the cost is a
  // possible one-tick flash to the wrong sequence instead of guaranteed
  // first-paint correctness, which is the trade SSR forces here.
  const [domIsDark, setDomIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setDomIsDark(hasDarkClass || resolvedTheme === "dark");
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [resolvedTheme]);

  const isDark = domIsDark || resolvedTheme === "dark";

  const totalFrames = isDark ? DARK_TOTAL_FRAMES : LIGHT_TOTAL_FRAMES;

  const [isPreloaded, setIsPreloaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPastSection, setIsPastSection] = useState(false);

  const lightFramesRef = useRef<(HTMLImageElement | null)[]>([]);
  const darkFramesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);

  const isPinned = !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Cover-crop drawing on high-DPI canvas
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth || window.innerWidth || 1280;
    const ch = canvas.clientHeight || window.innerHeight || 800;

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
    const scale = Math.max(cw / imgW, ch / imgH);
    const sw = imgW * scale;
    const sh = imgH * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();
  }, []);

  // Preload frame sequences: prioritizes current theme, preloads inactive theme in background
  useEffect(() => {
    let isCancelled = false;
    const activeTargetFrames = isDark ? DARK_TOTAL_FRAMES : LIGHT_TOTAL_FRAMES;
    const activeRef = isDark ? darkFramesRef : lightFramesRef;

    if (!activeRef.current || activeRef.current.length !== activeTargetFrames) {
      activeRef.current = new Array(activeTargetFrames).fill(null);
    }

    let loadedCount = 0;

    // Load active theme frames
    for (let i = 0; i < activeTargetFrames; i++) {
      const existing = activeRef.current[i];
      if (existing && existing.complete) {
        loadedCount++;
        continue;
      }

      const img = new Image();
      img.src = getFrameUrl(i, isDark);
      img.onload = () => {
        if (isCancelled) return;
        activeRef.current[i] = img;
        loadedCount++;
        setLoadProgress(loadedCount / activeTargetFrames);
        if (loadedCount >= activeTargetFrames) {
          setIsPreloaded(true);
        }
        if (i === currentFrameRef.current) {
          drawFrame(img);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / activeTargetFrames);
        if (loadedCount >= activeTargetFrames) {
          setIsPreloaded(true);
        }
      };
    }

    if (loadedCount >= activeTargetFrames) {
      setIsPreloaded(true);
      const currentImg = activeRef.current[currentFrameRef.current];
      if (currentImg && currentImg.complete) {
        drawFrame(currentImg);
      }
    }

    // Lazy preload inactive theme in background so toggling is instant
    const inactiveTheme = !isDark;
    const inactiveTargetFrames = inactiveTheme
      ? DARK_TOTAL_FRAMES
      : LIGHT_TOTAL_FRAMES;
    const inactiveRef = inactiveTheme ? darkFramesRef : lightFramesRef;

    const idleTimer = setTimeout(() => {
      if (isCancelled) return;
      if (
        !inactiveRef.current ||
        inactiveRef.current.length !== inactiveTargetFrames
      ) {
        inactiveRef.current = new Array(inactiveTargetFrames).fill(null);
      }
      for (let j = 0; j < inactiveTargetFrames; j++) {
        if (inactiveRef.current[j]) continue;
        const imgInactive = new Image();
        imgInactive.src = getFrameUrl(j, inactiveTheme);
        imgInactive.onload = () => {
          if (isCancelled) return;
          inactiveRef.current[j] = imgInactive;
        };
      }
    }, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(idleTimer);
    };
  }, [isDark, drawFrame]);

  // If theme switches mid-animation or in view, immediately re-paint at equivalent progress
  useEffect(() => {
    const activeRef = isDark ? darkFramesRef : lightFramesRef;
    const activeTotal = isDark ? DARK_TOTAL_FRAMES : LIGHT_TOTAL_FRAMES;
    const frameIdx = Math.min(
      activeTotal - 1,
      Math.max(0, Math.floor(displayProgress * (activeTotal - 1))),
    );
    currentFrameRef.current = frameIdx;
    const img = activeRef.current[frameIdx];
    if (img && img.complete) {
      drawFrame(img);
    } else {
      const fallbackImg = new Image();
      fallbackImg.src = getFrameUrl(frameIdx, isDark);
      fallbackImg.onload = () => {
        activeRef.current[frameIdx] = fallbackImg;
        if (currentFrameRef.current === frameIdx) {
          drawFrame(fallbackImg);
        }
      };
    }
  }, [isDark, displayProgress, drawFrame]);

  // Initial draw once preloaded
  useEffect(() => {
    const activeRef = isDark ? darkFramesRef : lightFramesRef;
    const activeTotal = isDark ? DARK_TOTAL_FRAMES : LIGHT_TOTAL_FRAMES;
    const initialFrame = prefersReduced
      ? activeRef.current[activeTotal - 1]
      : activeRef.current[0];
    if (initialFrame && initialFrame.complete) {
      drawFrame(initialFrame);
    }
  }, [isPreloaded, isDark, prefersReduced, drawFrame]);

  // Live scroll-scrubbing connected directly and monotonically to scrollYProgress
  useEffect(() => {
    if (prefersReduced) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const p = Math.min(1, Math.max(0, latest));
      setDisplayProgress(p);
      setIsCompleted(p >= 0.98);

      const activeTotal = isDark ? DARK_TOTAL_FRAMES : LIGHT_TOTAL_FRAMES;
      const frameIdx = Math.min(
        activeTotal - 1,
        Math.max(0, Math.floor(p * (activeTotal - 1))),
      );

      if (frameIdx !== currentFrameRef.current) {
        currentFrameRef.current = frameIdx;
        const activeRef = isDark ? darkFramesRef : lightFramesRef;
        const img = activeRef.current[frameIdx];
        if (img && img.complete) {
          drawFrame(img);
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, isDark, prefersReduced, drawFrame]);

  // Redraw on window resize and check section boundary
  useEffect(() => {
    const checkPast = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Section is truly past only when its bottom has completely scrolled above the viewport
      setIsPastSection(rect.bottom <= 0);
    };

    const handleResize = () => {
      const activeRef = isDark ? darkFramesRef : lightFramesRef;
      const img = activeRef.current[currentFrameRef.current];
      if (img && img.complete) {
        drawFrame(img);
      }
      checkPast();
    };

    checkPast();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", checkPast, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", checkPast);
    };
  }, [isDark, drawFrame]);

  // Repaint canvas whenever isPastSection reverts from true to false (e.g. scrolling back up)
  useEffect(() => {
    if (!isPastSection) {
      const activeRef = isDark ? darkFramesRef : lightFramesRef;
      const img = activeRef.current[currentFrameRef.current];
      if (img && img.complete) {
        drawFrame(img);
      }
    }
  }, [isPastSection, isDark, drawFrame]);

  const handleSkip = useCallback(() => {
    setDisplayProgress(1);
    setIsCompleted(true);
    const activeTotal = isDark ? DARK_TOTAL_FRAMES : LIGHT_TOTAL_FRAMES;
    currentFrameRef.current = activeTotal - 1;
    const activeRef = isDark ? darkFramesRef : lightFramesRef;
    const lastFrame = activeRef.current[activeTotal - 1];
    if (lastFrame) drawFrame(lastFrame);

    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const docTop = window.scrollY + rect.top;
      const targetScroll =
        docTop + sectionRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [isDark, drawFrame]);

  const handleReplay = useCallback(() => {
    setDisplayProgress(0);
    setIsCompleted(false);
    currentFrameRef.current = 0;
    const activeRef = isDark ? darkFramesRef : lightFramesRef;
    const firstFrame = activeRef.current[0];
    if (firstFrame) drawFrame(firstFrame);

    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const docTop = window.scrollY + rect.top;
      window.scrollTo({ top: docTop, behavior: "smooth" });
    }
  }, [isDark, drawFrame]);

  // Determine which of the 7 stages is active based on progress
  const stageIndex = Math.min(
    STORY_STAGES.length - 1,
    Math.floor(displayProgress * STORY_STAGES.length),
  );
  const currentStage = STORY_STAGES[stageIndex];

  const percentInt = Math.round(displayProgress * 100);
  const frameNumber = Math.min(
    totalFrames,
    Math.floor(displayProgress * (totalFrames - 1)) + 1,
  );

  return (
    <section
      id="paper-story"
      ref={sectionRef}
      className={`relative w-full bg-[#ebe8df] dark:bg-[#0e1821] text-slate-900 dark:text-slate-100 transition-colors duration-300 ${
        isPinned ? "h-[250vh]" : "h-screen overflow-hidden"
      }`}
    >
      <div
        className={
          isPinned
            ? cn(
                "sticky top-0 h-screen w-full overflow-hidden transition-opacity duration-150",
                isPastSection && "pointer-events-none hidden",
              )
            : "relative h-full w-full overflow-hidden"
        }
      >
        {/* Fullscreen Canvas with Zero Gaps */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />

        {/* Minimal Preloader */}
        {!isPreloaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#ebe8df] px-6 text-center dark:bg-[#0e1821]">
            <Shield className="size-10 animate-pulse text-primary dark:text-cyan-400" />
            <span className="mt-4 font-mono text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Decoding Paper Mandate ({Math.round(loadProgress * 100)}%)
            </span>
          </div>
        )}

        {/* Top Filmic Badges */}
        <div className="relative z-20 flex select-none items-center justify-between p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#0e1821]/80 dark:text-slate-100">
            <Shield className="size-3.5 text-primary dark:text-cyan-400" />
            <span>SAATHI // BIS VERIFICATION SEQUENCE</span>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted && (
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-3 py-1 font-mono text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md transition-all hover:bg-white dark:border-white/15 dark:bg-[#0e1821]/85 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Repeat className="size-3 text-primary dark:text-cyan-400" />
                <span>Replay Sequence</span>
              </button>
            )}

            {!isCompleted && (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-3 py-1 font-mono text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md transition-all hover:bg-white dark:border-white/15 dark:bg-[#0e1821]/85 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Skip to End</span>
                <ArrowRight className="size-3 text-slate-600 dark:text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Right Corner Storytelling Card */}
        <div className="pointer-events-auto absolute right-6 bottom-6 z-20 w-full max-w-sm sm:right-10 sm:bottom-10 sm:max-w-md lg:right-12 lg:bottom-12">
          <motion.div
            key={currentStage.tag}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2.5 rounded-2xl border border-black/10 bg-white/92 p-5 text-left shadow-2xl backdrop-blur-xl sm:p-6 dark:border-cyan-500/20 dark:bg-[#0c1520]/92 dark:shadow-[0_0_35px_-5px_rgba(6,182,212,0.2)]"
          >
            {/* Stage Header Tag & Progress */}
            <div className="flex items-center justify-between">
              <div
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider uppercase ${currentStage.tagColor}`}
              >
                <Sparkles className="size-3" />
                <span>{currentStage.tag}</span>
              </div>

              <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 dark:text-cyan-300">
                <span>{percentInt}%</span>
                {percentInt >= 100 && (
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-cyan-400" />
                )}
              </div>
            </div>

            {/* Stage Title */}
            <h3 className="text-xl leading-tight font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {currentStage.title}
            </h3>

            {/* Stage Description */}
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              {currentStage.description}
            </p>

            {/* Progress bar */}
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-primary transition-all duration-75 ease-out dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-400"
                style={{ width: `${percentInt}%` }}
              />
            </div>

            {/* Footer Actions or Scroll Prompt */}
            {displayProgress >= 0.85 ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-2 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 font-mono text-xs font-bold text-primary-foreground uppercase shadow-sm transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    <span>Launch SAATHI</span>
                    <ArrowRight className="size-3" />
                  </Link>
                  <Link
                    to="/standards"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 transition-all hover:bg-slate-50 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span>Standards</span>
                  </Link>
                </div>

                <span className="font-mono text-[10px] font-semibold text-emerald-700 dark:text-cyan-400">
                  Scroll down to explore ↓
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between border-t border-black/5 pt-2 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-primary dark:text-cyan-400">
                  <ChevronDown className="size-3.5 animate-bounce" />
                  <span>SCROLL DOWN TO UNFOLD</span>
                </span>
                <span>
                  FRAME {frameNumber} / {totalFrames}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
