import type { MouseEvent, ReactNode } from "react";

import { useLoginGate } from "@/components/landing/login-gate-context";
import { StampCta } from "@/components/landing/stamp-cta";
import { useRole } from "@/lib/role";

interface StartChattingCtaProps {
  variant?: "solid" | "outline" | "inverse";
  className?: string;
  children: ReactNode;
}

/**
 * The landing page's "enter chat" CTA. Gates on login: if no role is set
 * yet, clicking opens the login dialog instead of navigating; once a role
 * is set (logged in), it goes straight to /chat like a normal link.
 */
export function StartChattingCta({ variant, className, children }: StartChattingCtaProps) {
  const { role } = useRole();
  const openLogin = useLoginGate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!role) {
      event.preventDefault();
      openLogin();
    }
  }

  return (
    <StampCta to="/chat" variant={variant} className={className} onClick={handleClick}>
      {children}
    </StampCta>
  );
}
