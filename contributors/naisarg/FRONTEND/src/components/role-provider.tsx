import { useEffect, useState, type ReactNode } from "react";

import { isRole, RoleContext, ROLE_STORAGE_KEY, type Role } from "@/lib/role";

function readStoredRole(): Role | null {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    return isRole(stored) ? stored : null;
  } catch {
    // Storage disabled/unavailable (private browsing, blocked cookies) —
    // fall back to session-only behavior instead of crashing.
    return null;
  }
}

export function RoleProvider({ children }: { children: ReactNode }) {
  // Read after mount, not in the initializer: the app is server-rendered, so
  // touching localStorage during the first render would hydration-mismatch.
  const [role, setRoleState] = useState<Role | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRoleState(readStoredRole());
    setReady(true);
  }, []);

  function setRole(nextRole: Role | null) {
    setRoleState(nextRole);
    try {
      if (nextRole) {
        localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
      }
    } catch {
      // Ignore — role still works for this session via React state.
    }
  }

  return <RoleContext.Provider value={{ role, ready, setRole }}>{children}</RoleContext.Provider>;
}
