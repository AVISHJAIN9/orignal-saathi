import { createContext, useContext } from "react";

// Lets any landing-page entry point (the "Login" button, every "Start
// chatting" CTA) open the same login dialog instance owned by LandingPage,
// without prop-drilling a callback through every intermediate section.
export const LoginGateContext = createContext<(() => void) | null>(null);

export function useLoginGate() {
  const ctx = useContext(LoginGateContext);
  if (!ctx) throw new Error("useLoginGate must be used within LandingPage");
  return ctx;
}
