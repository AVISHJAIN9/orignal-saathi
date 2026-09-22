import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

import { BisSeal } from "@/components/bis-marks";
import { setPendingAuthRedirect, useAuth } from "@/lib/auth";

/**
 * Gates a route on authentication only — never on Role. Authorization
 * (which persona/role can see this page) stays exactly where it already
 * lived, inside each page component (see conformity-check-page.tsx's
 * `role !== "industry" && role !== "admin"` check) — ProtectedRoute wraps
 * outside that, deciding only "is anyone signed in at all", so the two
 * checks layer rather than duplicate: this one gate replaces the ad hoc
 * `if (!role) return <Navigate>` that used to live directly in App.tsx,
 * centralizing it instead of repeating it per page.
 *
 * Never flashes protected content: while the initial session check is
 * unresolved (`isLoading`), a loading state renders instead of children
 * or a redirect. Once resolved, an unauthenticated visitor's current path
 * is stashed (see setPendingAuthRedirect) and they're sent to sign in;
 * successful login returns them here instead of always landing on /chat.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    setPendingAuthRedirect(router.state.location.href);
    void router.navigate({ to: "/", replace: true });
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <BisSeal className="size-8 animate-pulse text-primary" aria-hidden />
      </div>
    );
  }

  return <>{children}</>;
}
