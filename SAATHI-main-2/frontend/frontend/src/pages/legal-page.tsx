import { MotionConfig } from "motion/react";
import { useState } from "react";

import { AmbientBackground } from "@/components/ambient-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { LoginDialog } from "@/components/landing/login-dialog";
import { LoginGateContext } from "@/components/landing/login-gate-context";
import { AiDisclaimer } from "@/components/legal/ai-disclaimer";
import { AuthorityNotice } from "@/components/legal/authority-notice";
import { LegalHero } from "@/components/legal/legal-hero";
import { LegalNav } from "@/components/legal/legal-nav";
import { PrivacySection } from "@/components/legal/privacy-section";
import { TermsSection } from "@/components/legal/terms-section";

import "./landing-page.css";

export function LegalPage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="saathi-landing relative min-h-dvh bg-[var(--plate-ground)] font-sans text-[var(--plate-ink)]">
        <AmbientBackground />
        <LoginGateContext.Provider value={() => setLoginOpen(true)}>
          <div className="relative z-10">
            <LandingNav />
            <main className="pb-16 sm:pb-24">
              <LegalHero />
              <LegalNav />
              <AiDisclaimer />
              <PrivacySection />
              <TermsSection />
              <AuthorityNotice />
            </main>
            <LandingFooter />
          </div>
        </LoginGateContext.Provider>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
    </MotionConfig>
  );
}
