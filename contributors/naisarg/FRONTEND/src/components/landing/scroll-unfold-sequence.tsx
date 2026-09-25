import { ArrowRight, ChevronDown, Shield } from "lucide-react";
import { useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const TOTAL_FRAMES = 240; // total exported frames on disk (spin, then morphs into the tricolor flag)

// Play the full exported sequence through to the end: it spins as the pure
// chakra for the first ~80 frames, then morphs into the waving tricolor
// flag by frame 240. A previous pass cut this off at frame 75 so the flag
// never appeared — reverted, so the sequence plays through in full.
const CHAKRA_FRAME_COUNT = TOTAL_FRAMES;

function getFrameUrl(index: number): string {
  const num = String(index + 1).padStart(3, "0");
  return `/ashok-chakra/frame-${num}.webp`;
}

interface ScrollUnfoldSequenceProps {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

/**
 * Pinned Ashok Chakra Entrance Sequence:
 * - Plays all 240 exported frames: the spinning Ashok Chakra wheel morphs
 *   into a waving Indian tricolor flag by the final frames.
 * - Pinned scroll track (h-[250vh] with -mb-[100vh] and sticky top-0 h-screen w-full) using Motion's useScroll.
 * - Frame scrubbing is 100% captured by this section during playback and releases cleanly at 100% completion.
 * - Between progress 0.85 and 1.0, the container dissolves smoothly to reveal the website directly at the top of HeroSection.
 *   (This is scroll-progress-based, not frame-index-based, so it stays
 *   proportional automatically no matter how many frames are in play.)
 * - Once scrolled past, the sticky container is hidden (display: none) leaving zero ghost pinned elements.
 * - Replay smoothly scrolls back to top: 0 and re-engages the scroll lock.
 */
export function ScrollUnfoldSequence({
  onProgress,
  onComplete,
}: ScrollUnfoldSequenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  const [isPreloaded, setIsPreloaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isPastSection, setIsPastSection] = useState(false);

  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);

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

    // Fill white behind frame
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();
  }, []);

  // Preload all frames concurrently
  useEffect(() => {
    let loadedCount = 0;
    const images: (HTMLImageElement | null)[] = new Array(
      CHAKRA_FRAME_COUNT,
    ).fill(null);
    let isCancelled = false;

    for (let i = 0; i < CHAKRA_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        images[i] = img;
        loadedCount++;
        setLoadProgress(loadedCount / CHAKRA_FRAME_COUNT);
        if (loadedCount === CHAKRA_FRAME_COUNT) {
          framesRef.current = images;
          setIsPreloaded(true);
        }
        if (i === currentFrameRef.current) {
          drawFrame(img);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / CHAKRA_FRAME_COUNT);
        if (loadedCount === CHAKRA_FRAME_COUNT) {
          framesRef.current = images;
          setIsPreloaded(true);
        }
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // Draw initial frame once preloaded
  useEffect(() => {
    if (isPreloaded && framesRef.current.length > 0) {
      const initialImg =
        framesRef.current[currentFrameRef.current] || framesRef.current[0];
      if (initialImg && initialImg.complete) {
        drawFrame(initialImg);
      }
    }
  }, [isPreloaded, drawFrame]);

  // Live scroll-scrubbing connected directly and monotonically to scrollYProgress
  useEffect(() => {
    if (prefersReduced) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const p = Math.min(1, Math.max(0, latest));
      setDisplayProgress(p);
      onProgress?.(p);

      const frameIdx = Math.min(
        CHAKRA_FRAME_COUNT - 1,
        Math.max(0, Math.floor(p * (CHAKRA_FRAME_COUNT - 1))),
      );

      if (frameIdx !== currentFrameRef.current) {
        currentFrameRef.current = frameIdx;
        const img = framesRef.current[frameIdx];
        if (img && img.complete) {
          drawFrame(img);
        }
      }

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setIsPastSection(rect.bottom <= window.innerHeight - 50);
      }

      if (p >= 0.98) {
        onComplete?.();
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, prefersReduced, onProgress, onComplete, drawFrame]);

  // Redraw on window resize and check scroll position
  useEffect(() => {
    const checkPast = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setIsPastSection(rect.bottom <= window.innerHeight - 50);
    };

    const handleResize = () => {
      const img = framesRef.current[currentFrameRef.current];
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
  }, [drawFrame]);

  // Skip handler: immediately resolve to completion, draw final frame, and hand off to landing page unmount
  const handleSkip = useCallback(() => {
    setIsPastSection(true);
    setDisplayProgress(1);
    currentFrameRef.current = CHAKRA_FRAME_COUNT - 1;
    const lastFrame = framesRef.current[CHAKRA_FRAME_COUNT - 1];
    if (lastFrame) drawFrame(lastFrame);

    onProgress?.(1);
    onComplete?.();
  }, [drawFrame, onProgress, onComplete]);

  // Dissolve calculation between 0.85 and 1.0
  const fadeFactor = Math.max(0, (displayProgress - 0.85) / 0.15);
  const containerOpacity = Math.max(0, 1 - fadeFactor);

  const isDissolved = displayProgress >= 0.995 || isPastSection;

  return (
    <section
      id="chakra-intro"
      ref={sectionRef}
      className="relative h-[250vh] w-full -mb-[100vh] select-none bg-white"
    >
      <div
        className={cn(
          "sticky top-0 h-screen w-full select-none overflow-hidden bg-white transition-opacity duration-75",
          isDissolved ? "pointer-events-none hidden z-0" : "z-40",
        )}
        style={{
          opacity: containerOpacity,
        }}
      >
        {/* Pure Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />

        {/* Minimal Preloader */}
        {!isPreloaded && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white px-6 text-center">
            <Shield className="size-10 animate-pulse text-primary" />
            <span className="mt-4 font-mono text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Loading Ashok Chakra ({Math.round(loadProgress * 100)}%)
            </span>
          </div>
        )}

        {/* Top Brand Bar */}
        <div className="relative z-20 flex select-none items-center justify-between p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-card/70 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 shadow-xs backdrop-blur-md">
            <Shield className="size-3.5 text-primary" />
            <span>SAATHI // NATIONAL MOTIF SEQUENCE</span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 bg-card/70 px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-900 shadow-xs backdrop-blur-md transition-all hover:scale-105 hover:bg-white active:scale-95"
          >
            <span>Skip Intro</span>
            <ArrowRight className="size-3 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
}

