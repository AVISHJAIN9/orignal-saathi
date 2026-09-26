import { motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { AboutSection } from "@/components/landing/about-section";
import { AmbientBackground } from "@/components/ambient-background";
import { AudienceSection } from "@/components/landing/audience-section";
import { BilingualSection } from "@/components/landing/bilingual-section";
import { ClosingSection } from "@/components/landing/closing-section";
import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingNav } from "@/components/landing/landing-nav";
import { LoginDialog } from "@/components/landing/login-dialog";
import { LoginGateContext } from "@/components/landing/login-gate-context";
import { PaperStorySection } from "@/components/landing/paper-story-section";
import { ProofSection } from "@/components/landing/proof-section";
import { ScrollUnfoldSequence } from "@/components/landing/scroll-unfold-sequence";
import { StatsSection } from "@/components/landing/stats-section";
import { TrustSection } from "@/components/landing/trust-section";
import { peekPendingAuthRedirect } from "@/lib/auth";

import "./landing-page.css";

const INTRO_SEEN_KEY = "saathi:introSeen";

export function LandingPage() {
  // Owns the one login dialog instance so every entry point (the "Login"
  // button, every "Start chatting" CTA) can open the same dialog via
  // LoginGateContext instead of each having its own.
  const [loginOpen, setLoginOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const pendingScrollAdjustRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_SEEN_KEY) !== "true") {
        setShowIntro(true);
      }
    } catch {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    } catch {
      // Storage unavailable — the sequence will simply replay next visit.
    }

    const introEl = document.getElementById("chakra-intro");
    if (introEl) {
      const introHeight = Math.max(0, introEl.offsetHeight - window.innerHeight);
      pendingScrollAdjustRef.current = Math.max(0, window.scrollY - introHeight);
    } else {
      pendingScrollAdjustRef.current = 0;
    }

    setShowIntro(false);
  }, []);

  useLayoutEffect(() => {
    if (!showIntro && pendingScrollAdjustRef.current !== null) {
      const targetScroll = pendingScrollAdjustRef.current;
      pendingScrollAdjustRef.current = null;
      window.scrollTo({ top: targetScroll, left: 0, behavior: "instant" });
    }
  }, [showIntro]);

  const handleReplayIntro = useCallback(() => {
    try {
      sessionStorage.removeItem(INTRO_SEEN_KEY);
    } catch {
      // Storage unavailable — no-op.
    }
    setShowIntro(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }, []);

  // ProtectedRoute sends a signed-out visitor here and stashes the page
  // they were trying to reach (see setPendingAuthRedirect) — surface the
  // login dialog immediately instead of making them find the button
  // themselves. Only peeked, not consumed: the dialog's own submit reads
  // and clears it so a cancelled attempt doesn't lose the destination.
  useEffect(() => {
    if (peekPendingAuthRedirect()) setLoginOpen(true);
  }, []);

  // Smooth scroll to section if arriving from another page with a hash anchor (e.g. /#why)
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="saathi-landing relative min-h-dvh bg-[var(--plate-ground)] font-sans text-[var(--plate-ink)]">
        <AmbientBackground />

        {/* Pinned scroll-driven Ashok Chakra entrance — gated behind a
            sessionStorage flag so returning visitors within the same
            session aren't replayed the intro on every navigation. */}
        {showIntro && <ScrollUnfoldSequence onComplete={handleIntroComplete} />}

        <LoginGateContext.Provider value={() => setLoginOpen(true)}>
          <div className="relative z-10">
            <LandingNav onReplayIntro={handleReplayIntro} replaceToolsWithHamburger />
            <HeroSection />
            <TrustSection />
            <PaperStorySection />
            <StatsSection />
            <AudienceSection />
            <ProofSection />
            <BilingualSection />
            <AboutSection />
            <ContactSection />
            <ClosingSection />
          </div>
        </LoginGateContext.Provider>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
    </MotionConfig>
  );
}
