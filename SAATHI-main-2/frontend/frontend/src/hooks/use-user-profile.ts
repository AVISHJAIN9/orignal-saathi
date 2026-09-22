import { useEffect, useState } from "react";

import { DEFAULT_USER_PROFILE, type UserProfile } from "@/lib/profile";

const USER_PROFILE_KEY = "saathi:user-profile";
const SOUND_FEEDBACK_KEY = "saathi:sound-feedback";

function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<UserProfile>;
  return (
    typeof profile.displayName === "string" &&
    typeof profile.focus === "string" &&
    (profile.tone === "navy" ||
      profile.tone === "sage" ||
      profile.tone === "clay")
  );
}

/**
 * The cosmetic UserProfile (nickname/focus/tone) and sound-effect
 * preference — plain localStorage state, read only after mount to avoid
 * an SSR/hydration mismatch (same pattern RoleProvider/AuthProvider use).
 * Extracted out of App.tsx so both the chat page and the /profile page's
 * Preferences tab share one source of truth instead of each keeping its
 * own copy that could drift.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = JSON.parse(
        window.localStorage.getItem(USER_PROFILE_KEY) ?? "null",
      );
      if (isUserProfile(storedProfile)) setProfile(storedProfile);
    } catch {
      // Ignore malformed local preferences and keep the default profile.
    }
    setSoundEnabled(window.localStorage.getItem(SOUND_FEEDBACK_KEY) === "true");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    window.localStorage.setItem(SOUND_FEEDBACK_KEY, String(soundEnabled));
  }, [ready, profile, soundEnabled]);

  return { profile, setProfile, soundEnabled, setSoundEnabled };
}
