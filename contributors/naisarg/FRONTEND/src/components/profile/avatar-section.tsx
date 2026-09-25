import { Camera, CircleUserRound, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AvatarUploadDialog } from "@/components/profile/avatar-upload-dialog";
import { UserAvatar } from "@/components/user-avatar";
import { AVATAR_CHARACTERS } from "@/lib/avatar-characters";
import {
  activeAvatarMode,
  AVATAR_SECTION_ID,
  initialsFor,
  PROFILE_TONE_CLASSES,
  type AvatarMode,
  type ProfileTone,
  type UserProfile,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const MODES: AvatarMode[] = ["initials", "character", "photo"];
const TONES: ProfileTone[] = ["navy", "sage", "clay"];

interface AvatarSectionProps {
  draft: UserProfile;
  onChange: (next: UserProfile) => void;
}

/**
 * One place for every avatar choice — initials on a colour, a preset
 * character, or a photo — instead of a colour-tone row plus a character
 * picker hidden behind the avatar/"Change photo" dialog.
 *
 * The three modes are mutually exclusive on screen, so exactly one is
 * "current": the tab for it carries a dot, and only that tab marks a
 * selection. Choosing an option in another tab switches to that mode
 * (a colour swatch means "show my initials in this colour", so it clears
 * a character or photo). Like the rest of CosmeticPreferencesForm this only
 * edits `draft` — nothing is saved until the host form saves.
 */
export function AvatarSection({ draft, onChange }: AvatarSectionProps) {
  const { t } = useTranslation("chat");
  const active = activeAvatarMode(draft);
  const [view, setView] = useState<AvatarMode>(active);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  // Follow the selection when it changes from outside this component
  // (e.g. the host form resets its draft) — adjusted during render.
  const [followedActive, setFollowedActive] = useState(active);
  if (active !== followedActive) {
    setFollowedActive(active);
    setView(active);
  }

  const initials = initialsFor(draft.displayName);
  const modeLabel = (mode: AvatarMode) =>
    t(`profile.avatar.modes.${mode}`, mode);

  return (
    <section
      id={AVATAR_SECTION_ID}
      aria-labelledby={`${AVATAR_SECTION_ID}-label`}
      className="flex scroll-mt-24 flex-col gap-3"
    >
      <span
        id={`${AVATAR_SECTION_ID}-label`}
        className="flex items-center gap-1.5 font-mono text-2xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
      >
        <CircleUserRound className="size-3" aria-hidden />
        {t("profile.avatar.sectionLabel", "Avatar")}
      </span>

      <div className="flex items-start gap-4">
        <UserAvatar
          size="lg"
          name={draft.displayName}
          tone={draft.tone}
          avatarDataUrl={draft.avatarDataUrl ?? null}
          avatarCharacter={draft.avatarCharacter ?? null}
          className="shrink-0"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            role="tablist"
            aria-label={t("profile.avatar.modesLabel", "Avatar style")}
            className="inline-flex w-fit rounded-lg border border-border bg-muted/40 p-0.5"
          >
            {MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                id={`${AVATAR_SECTION_ID}-tab-${mode}`}
                aria-selected={view === mode}
                aria-controls={`${AVATAR_SECTION_ID}-panel`}
                onClick={() => setView(mode)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  view === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {modeLabel(mode)}
                {active === mode && (
                  <>
                    <span
                      className="size-1.5 rounded-full bg-primary"
                      aria-hidden
                    />
                    <span className="sr-only">
                      {t("profile.avatar.currentMode", "(current)")}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${AVATAR_SECTION_ID}-panel`}
            aria-labelledby={`${AVATAR_SECTION_ID}-tab-${view}`}
          >
            {view === "initials" && (
              <div className="flex flex-wrap gap-2">
                {TONES.map((tone) => {
                  const selected = active === "initials" && draft.tone === tone;
                  return (
                    <button
                      key={tone}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...draft,
                          tone,
                          avatarCharacter: undefined,
                          avatarDataUrl: undefined,
                        })
                      }
                      aria-label={t(`profile.tones.${tone}`)}
                      aria-pressed={selected}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl font-mono text-xs font-semibold transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/50",
                        PROFILE_TONE_CLASSES[tone],
                        selected && "ring-2 ring-primary/40 ring-offset-2",
                      )}
                    >
                      {initials}
                    </button>
                  );
                })}
              </div>
            )}

            {view === "character" && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {AVATAR_CHARACTERS.map((character) => {
                  const selected =
                    active === "character" &&
                    draft.avatarCharacter === character.id;
                  return (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...draft,
                          avatarCharacter: character.id,
                          avatarDataUrl: undefined,
                        })
                      }
                      aria-label={t(
                        "profile.avatar.characterLabel",
                        `${character.id} avatar`,
                        { character: character.id },
                      )}
                      aria-pressed={selected}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-xl text-white transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/50",
                        character.bgClassName,
                        selected && "ring-2 ring-primary/40 ring-offset-2",
                      )}
                    >
                      <character.icon className="size-1/2" aria-hidden />
                    </button>
                  );
                })}
              </div>
            )}

            {view === "photo" && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Camera className="size-3.5" aria-hidden />
                  {active === "photo"
                    ? t("profile.avatar.changePhoto", "Change photo")
                    : t("profile.avatar.addPhoto", "Add a photo")}
                </button>
                {active === "photo" && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...draft, avatarDataUrl: undefined })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    {t("profile.avatar.removePhoto", "Remove photo")}
                  </button>
                )}
                <AvatarUploadDialog
                  open={photoDialogOpen}
                  onOpenChange={setPhotoDialogOpen}
                  currentAvatarDataUrl={draft.avatarDataUrl}
                  tone={draft.tone}
                  name={draft.displayName}
                  showCharacterOption={false}
                  onSave={(selection) =>
                    onChange({
                      ...draft,
                      avatarDataUrl: selection.avatarDataUrl ?? undefined,
                      avatarCharacter: undefined,
                    })
                  }
                />
              </div>
            )}
          </div>

          <p className="text-2xs text-muted-foreground">
            {t(
              "profile.avatar.deviceOnlyNoticeAvatar",
              "Your avatar is stored only on this device — there is no account backup.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
