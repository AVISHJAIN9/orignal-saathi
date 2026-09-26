import { useEffect, useState, type ReactNode } from "react";

import { AuthContext, type AuthUser } from "@/lib/auth";
import { onUnauthorized } from "@/lib/api-client";
import { mockFetchCurrentUser, mockLogin, mockLogout } from "@/lib/mock-auth";

// Never shown to the user directly — mockLogin here never actually
// rejects, but a real backend's login call can, and this is the copy
// that failure should surface as (see Step 4 of the S1 task: never show
// raw API errors like "AxiosError" or a status code).
const GENERIC_LOGIN_ERROR = "We couldn't sign you in. Please try again.";

/**
 * AuthProvider owns *identity* (is anyone signed in, and who) — a
 * deliberately separate concern from RoleProvider's `Role`
 * (public/industry/admin), which previews role-gated navigation and has
 * existed since before any auth concept did. Keeping them apart means:
 *   - swapping this file's mock (mock-auth.ts) for a real backend later
 *     never touches RoleProvider, and vice versa;
 *   - a real backend's user response could someday carry a role, but
 *     until then two independent stored values is more honest than
 *     forcing a fake merge — see LogoutButton, which clears both
 *     together as one user-facing "log out" action without either
 *     provider needing to know the other exists.
 *
 * Structurally mirrors RoleProvider: state is read after mount (not in
 * the initializer) to avoid an SSR/hydration mismatch, and `isLoading`
 * gates rendering exactly like RoleProvider's `ready` does — no
 * authenticated (or unauthenticated-redirect) UI is shown before the
 * initial session check resolves.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    mockFetchCurrentUser().then((user) => {
      if (!cancelled) {
        setCurrentUser(user);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // One central place a real API client's 401 response reaches —
    // AuthProvider is the only subscriber, so no page ever handles this
    // itself. Nothing in this mock ever actually triggers it yet (see
    // api-client.ts's header).
    return onUnauthorized(() => {
      setCurrentUser(null);
      setAuthError("Your session has expired. Please sign in again.");
    });
  }, []);

  async function login(input: { name: string; email: string }) {
    setAuthError(null);
    try {
      const user = await mockLogin(input);
      setCurrentUser(user);
    } catch {
      setAuthError(GENERIC_LOGIN_ERROR);
      throw new Error(GENERIC_LOGIN_ERROR);
    }
  }

  async function logout() {
    await mockLogout();
    setCurrentUser(null);
    setAuthError(null);
  }

  async function refreshUser() {
    const user = await mockFetchCurrentUser();
    setCurrentUser(user);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        authError,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
