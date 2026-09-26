import { createContext, useContext } from "react";

export type ProfileTone = "navy" | "sage" | "clay";

export interface UserProfile {
  displayName: string;
  focus: string;
  tone: ProfileTone;
  /** A centre-cropped, downscaled (~256x256) JPEG data URL captured or
   * chosen by the user. Optional so profiles saved before this field
   * existed still validate — see isUserProfile below. There is no backend
   * in this prototype, so this is stored only in this browser's
   * localStorage, never uploaded anywhere. */
  avatarDataUrl?: string;
  /** Id into lib/avatar-characters.ts's preset list — an alternative to a
   * real photo for users who'd rather pick an illustrated character.
   * Mutually exclusive with avatarDataUrl: picking one clears the other
   * (see AvatarUploadDialog). */
  avatarCharacter?: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  displayName: "Standards explorer",
  focus: "BIS navigator",
  tone: "navy",
};

export const USER_PROFILE_STORAGE_KEY = "saathi:user-profile";

export function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<UserProfile>;
  return (
    typeof profile.displayName === "string" &&
    typeof profile.focus === "string" &&
    (profile.tone === "navy" ||
      profile.tone === "sage" ||
      profile.tone === "clay") &&
    (profile.avatarDataUrl === undefined ||
      typeof profile.avatarDataUrl === "string") &&
    (profile.avatarCharacter === undefined ||
      typeof profile.avatarCharacter === "string")
  );
}

// One shared tone→class map — used to live separately (and slightly
// duplicated) in profile-header.tsx, profile-settings.tsx, and
// cosmetic-preferences-form.tsx; centralized here so UserAvatar and the
// tone picker swatches can never drift apart.
export const PROFILE_TONE_CLASSES: Record<ProfileTone, string> = {
  navy: "bg-foreground text-background shadow-[0_5px_12px_rgba(12,50,86,0.25)]",
  sage: "bg-[#78958c] text-white shadow-[0_5px_12px_rgba(86,117,108,0.25)]",
  clay: "bg-[#a66f5d] text-white shadow-[0_5px_12px_rgba(130,78,62,0.25)]",
};

/** Up to two initials from a display name ("S" when there are none). */
export function initialsFor(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}

export type AvatarMode = "initials" | "character" | "photo";

/** The avatar style actually on screen — the same priority UserAvatar
 * renders in: photo, then character, then initials on the tone colour. */
export function activeAvatarMode(profile: UserProfile): AvatarMode {
  if (profile.avatarDataUrl) return "photo";
  if (profile.avatarCharacter) return "character";
  return "initials";
}

/** DOM id of the Preferences tab's Avatar section (the profile header's
 * avatar scrolls to it). */
export const AVATAR_SECTION_ID = "avatar-settings";

export interface UserProfileContextValue {
  profile: UserProfile;
  setProfile: (next: UserProfile) => void;
  ready: boolean;
  /** Set when the most recent localStorage write failed (e.g. quota
   * exceeded after an avatar photo was saved) — a safe-to-display message,
   * cleared automatically the next time a write succeeds. */
  saveError: string | null;
}

export const UserProfileContext = createContext<UserProfileContextValue | null>(
  null,
);

/**
 * The shared cosmetic-profile store (nickname/focus/tone/avatar photo).
 * Backed by one UserProfileProvider instance
 * mounted in routes/__root.tsx, so every reader — the chat sidebar, the
 * /profile page, AccountMenu — sees the same state and the same instant
 * updates, instead of each keeping its own useState copy that only
 * resynced on the next full mount.
 */
export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx)
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  return ctx;
}
