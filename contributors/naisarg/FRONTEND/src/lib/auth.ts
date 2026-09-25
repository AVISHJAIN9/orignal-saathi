import { createContext, useContext } from "react";

// The identity contract this app is built against. No real backend exists
// yet (see mock-auth.ts's header comment) — this shape is what a real
// current-user/login response would need to provide; mock-auth.ts is the
// one file that would be replaced with a real API client once a backend
// exists, everything else (AuthProvider, ProtectedRoute, the login form,
// Profile) is written against this contract and wouldn't need to change.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  // A real backend might report "pending_verification", "suspended", etc.
  // — kept as an open string rather than a fixed union so the mock doesn't
  // imply it knows the full set of real states.
  status: string;
}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  // True until the initial "is there already a session?" check has
  // resolved — guards against ever flashing authenticated (or
  // unauthenticated-redirect) UI before that's known, the same role
  // `ready` plays in RoleProvider/useRole.
  isLoading: boolean;
  // A safe-to-display message only ("We couldn't sign you in...") — never
  // a raw error/status code. See mock-auth.ts and auth-provider.tsx.
  authError: string | null;
  login: (input: { name: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// --- Redirect-after-login -----------------------------------------------
//
// ProtectedRoute stashes the path a signed-out visitor was trying to reach
// here (sessionStorage — a one-shot intent for this tab, not a durable
// preference) before sending them to sign in; whoever completes the login
// (today: LoginDialog) reads and clears it to land the user back where
// they started instead of always dropping them at /chat.
const AUTH_REDIRECT_STORAGE_KEY = "saathi:authRedirect";

export function setPendingAuthRedirect(path: string) {
  try {
    sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, path);
  } catch {
    // Storage unavailable — the user will just land on the default
    // post-login destination instead of back where they started.
  }
}

// Read-only — used by LandingPage to decide whether to auto-open the
// login dialog on arrival, without clearing the stored intent (only a
// completed login should clear it; see consumePendingAuthRedirect).
export function peekPendingAuthRedirect(): string | null {
  try {
    return sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function consumePendingAuthRedirect(): string | null {
  try {
    const path = sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
    return path;
  } catch {
    return null;
  }
}
