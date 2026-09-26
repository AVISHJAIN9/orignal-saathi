import { createContext, useContext } from "react";

// Local-state-only role for previewing role-based navigation. No auth exists
// yet — see RoleProvider in @/components/role-provider — swap this for a
// real session/claims-derived role once a backend is in place.
export type Role = "public" | "industry" | "admin";

const ROLES: Role[] = ["public", "industry", "admin"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

// Persisted across page refreshes (see RoleProvider) so logging in once is
// enough for a session, rather than resetting to logged-out on every reload.
export const ROLE_STORAGE_KEY = "saathi:role";

export interface RoleContextValue {
  // `null` means no one has logged in yet — distinct from the 'public'
  // role, which is a deliberate login choice. Routes/components that need
  // to know "is anyone logged in at all" check for `null`, not for
  // role === 'public'.
  role: Role | null;
  // False until the persisted role has been read on the client. Guards
  // against redirecting a logged-in user away during the first render,
  // when the app is server-rendered and storage isn't readable yet.
  ready: boolean;
  setRole: (role: Role | null) => void;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
