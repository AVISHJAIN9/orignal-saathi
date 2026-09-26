import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarCharacter } from "@/lib/avatar-characters";
import { useAuth } from "@/lib/auth";
import {
  initialsFor,
  PROFILE_TONE_CLASSES,
  useUserProfile,
  type ProfileTone,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-xl",
} as const;

interface UserAvatarProps {
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
  /** Overrides the name used for initials; defaults to the shared
   * profile's displayName, falling back to the signed-in user's name. */
  name?: string;
  /** Overrides the tone/photo/character shown instead of reading the saved
   * profile — used for the live preview in the Preferences form, where the
   * picker should reflect the in-progress draft, not the last saved value. */
  tone?: ProfileTone;
  avatarDataUrl?: string | null;
  /** Id into lib/avatar-characters.ts; see the override note above. */
  avatarCharacter?: string | null;
}

/**
 * The one place initials, tone colour, uploaded photo, and preset
 * character are resolved and rendered — replaces three copies of this same
 * logic that used to live in profile-header.tsx, profile-settings.tsx, and
 * account-menu.tsx (each with its own toneClasses map and its own idea of
 * which name to take initials from). Priority order: uploaded photo, then
 * a chosen preset character, then initials on the tone colour.
 */
export function UserAvatar({
  size = "md",
  className,
  name,
  tone,
  avatarDataUrl,
  avatarCharacter,
}: UserAvatarProps) {
  const { profile } = useUserProfile();
  const { currentUser } = useAuth();

  const resolvedName = name ?? profile.displayName ?? currentUser?.name ?? "";
  const resolvedTone = tone ?? profile.tone;
  const resolvedPhoto =
    avatarDataUrl !== undefined ? avatarDataUrl : profile.avatarDataUrl;
  const resolvedCharacterId =
    avatarCharacter !== undefined ? avatarCharacter : profile.avatarCharacter;
  const character = resolvedPhoto
    ? undefined
    : getAvatarCharacter(resolvedCharacterId ?? undefined);
  const initials = initialsFor(resolvedName);

  return (
    <Avatar className={cn(SIZE_CLASSES[size], className)}>
      {resolvedPhoto && (
        <AvatarImage
          src={resolvedPhoto}
          alt={
            resolvedName ? `${resolvedName}'s profile photo` : "Profile photo"
          }
        />
      )}
      <AvatarFallback
        className={cn(
          "font-bold",
          character
            ? cn(character.bgClassName, "text-foreground")
            : PROFILE_TONE_CLASSES[resolvedTone],
        )}
      >
        {character ? (
          <character.icon className="size-1/2" aria-hidden />
        ) : (
          initials
        )}
      </AvatarFallback>
    </Avatar>
  );
}
