// MOCK: there is no real backend in this repo — no auth API, no user
// database, no session store (see Step 0 of the S1 task this file
// implements: no api/ or server/ directory, no .env with an API base URL,
// no OpenAPI spec, and src/lib/developer-data.ts's endpoints are
// explicitly illustrative marketing copy, not a live spec). This module
// stands in for a future
//   GET  /api/v1/auth/session   (mockFetchCurrentUser)
//   POST /api/v1/auth/login     (mockLogin)
//   POST /api/v1/auth/logout    (mockLogout)
// with the same async, request-shaped-in / response-shaped-out signatures
// those endpoints would have, so swapping this file for a real API client
// (see api-client.ts) is the only change AuthProvider and the rest of the
// app would need.
//
// Session persistence mirrors RoleProvider's role persistence
// (src/components/role-provider.tsx): a plain localStorage record, read
// only after mount to avoid SSR/hydration mismatches, default
// logged-out on first visit.
//
// This file must never let a filename, form field, or any other
// user-suppliable value silently grant identity/authorization — the mock
// session is only ever created by mockLogin's own explicit call, the same
// "don't let an unrelated signal masquerade as evidence/approval" rule
// mock-compliance-gaps.ts documents for its adversarial-filename case.

import type { AuthUser } from "@/lib/auth";

const MOCK_SESSION_STORAGE_KEY = "saathi:mockSession";
const MOCK_LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), MOCK_LATENCY_MS),
  );
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AuthUser>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.status === "string"
  );
}

function readStoredSession(): AuthUser | null {
  try {
    const stored = JSON.parse(
      localStorage.getItem(MOCK_SESSION_STORAGE_KEY) ?? "null",
    );
    return isAuthUser(stored) ? stored : null;
  } catch {
    // Storage disabled/unavailable, or corrupted JSON — fall back to
    // logged-out rather than crashing.
    return null;
  }
}

function writeStoredSession(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore — the session still works for this tab via React state.
  }
}

// A stable id derived from the mock login input, not a random one, so
// refreshing/re-reading the same persisted session always reports the
// same account id rather than minting a new identity on every check.
function mockAccountId(name: string, email: string): string {
  let hash = 0;
  const seed = `${name.trim().toLowerCase()}:${email.trim().toLowerCase()}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return `mock_${Math.abs(hash).toString(36)}`;
}

/** GET /api/v1/auth/session stand-in — checks for an existing session. */
export function mockFetchCurrentUser(): Promise<AuthUser | null> {
  return delay(readStoredSession());
}

/** POST /api/v1/auth/login stand-in. */
export function mockLogin(input: {
  name: string;
  email: string;
}): Promise<AuthUser> {
  const user: AuthUser = {
    id: mockAccountId(input.name, input.email),
    name: input.name.trim(),
    email: input.email.trim(),
    // Always "active" here because this mock never actually verifies
    // anything — a real backend could report "pending_verification" etc.
    status: "active",
  };
  writeStoredSession(user);
  return delay(user);
}

/** POST /api/v1/auth/logout stand-in. */
export function mockLogout(): Promise<void> {
  writeStoredSession(null);
  return delay(undefined);
}
