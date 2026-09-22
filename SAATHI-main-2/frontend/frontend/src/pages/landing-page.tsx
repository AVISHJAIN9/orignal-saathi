import { motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { AboutSection } from "@/components/landing/about-section";
import { AmbientBackground } from "@/components/ambient-background";
import { AudienceSection } from "@/components/landing/audience-section";
import { BilingualSection } from "@/components/landing/bilingual-section";
import { ClosingSection } from "@/components/landing/closing-section";
import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { LoginDialog } from "@/components/landing/login-dialog";
import { LoginGateContext } from "@/components/landing/login-gate-context";
import { PaperStorySection } from "@/components/landing/paper-story-section";
import { ProofSection } from "@/components/landing/proof-section";
import { ScrollUnfoldSequence } from "@/components/landing/scroll-unfold-sequence";
import { SplashScreen } from "@/components/landing/splash-screen";
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
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

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
  }, []);

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

  return (
    <MotionConfig reducedMotion="user">
      <SplashScreen onDone={() => setSplashDone(true)} />
      <motion.div
        className="saathi-landing relative min-h-dvh bg-[var(--plate-ground)] font-sans text-[var(--plate-ink)]"
        // Content is always mounted underneath (no layout shift when the
        // splash lifts) and stays invisible/non-interactive until it's done,
        // so nothing behind the frosted veil can be tabbed to or clicked.
        // The opacity animation (not just aria-hidden/inert) is what actually
        // keeps it out of view — SplashScreen now flips splashDone the moment
        // its own dismissal starts, so this fade-in overlaps the splash's
        // fade-out as one continuous reveal rather than a sequential snap.
        aria-hidden={!splashDone}
        inert={!splashDone ? true : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <AmbientBackground />

        {/* Pinned scroll-driven Ashok Chakra entrance — gated behind a
            sessionStorage flag so returning visitors within the same
            session aren't replayed the intro on every navigation. */}
        {showIntro && <ScrollUnfoldSequence onComplete={handleIntroComplete} />}

        <LoginGateContext.Provider value={() => setLoginOpen(true)}>
          <div className="relative z-10">
            <LandingNav onReplayIntro={handleReplayIntro} />
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
            <LandingFooter />
          </div>
        </LoginGateContext.Provider>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </motion.div>
    </MotionConfig>
  );
}
