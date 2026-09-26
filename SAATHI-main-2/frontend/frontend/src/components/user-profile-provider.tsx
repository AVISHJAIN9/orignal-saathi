import { useEffect, useState, type ReactNode } from "react";

import {
  DEFAULT_USER_PROFILE,
  isUserProfile,
  USER_PROFILE_STORAGE_KEY,
  UserProfileContext,
  type UserProfile,
} from "@/lib/profile";

/**
 * Structurally mirrors AuthProvider/RoleProvider: state is read after
 * mount (not in the initializer) to avoid an SSR/hydration mismatch, and
 * `ready` gates the persistence effect the same way those providers gate
 * their own first render.
 *
 * Mounted once in routes/__root.tsx, above both the chat page's sidebar
 * and the /profile route, so a tone or photo change is visible everywhere
 * immediately — no reload, no waiting for the next mount to re-read
 * localStorage.
 */
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(USER_PROFILE_STORAGE_KEY) ?? "null",
      );
      if (isUserProfile(stored)) setProfile(stored);
    } catch {
      // Ignore malformed local preferences and keep the default profile.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setSaveError(null);
    } catch {
      // Most commonly a quota-exceeded error right after an avatar photo
      // was added — surfaced via context so the avatar upload dialog can
      // show a friendly message instead of silently losing the change.
      setSaveError(
        "Your browser's storage is full, so this couldn't be saved on this device.",
      );
    }
  }, [ready, profile]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile,
        ready,
        saveError,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
