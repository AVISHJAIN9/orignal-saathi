import { Palette, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProfileTone, UserProfile } from "@/lib/profile";

interface CosmeticPreferencesFormProps {
  draft: UserProfile;
  onChange: (next: UserProfile) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
  className?: string;
}

const toneClasses: Record<ProfileTone, string> = {
  navy: "bg-foreground text-background shadow-[0_5px_12px_rgba(12,50,86,0.25)]",
  sage: "bg-[#78958c] text-white shadow-[0_5px_12px_rgba(86,117,108,0.25)]",
  clay: "bg-[#a66f5d] text-white shadow-[0_5px_12px_rgba(130,78,62,0.25)]",
};

/**
 * The cosmetic preference fields (chat nickname, focus label, avatar
 * tone, sound effects) as one reusable, purely controlled form — no
 * draft state or save button of its own. Both profile-settings.tsx's
 * dialog and the /profile page's Preferences tab render this exact
 * component with their own draft state + save affordance around it, so
 * the fields exist in one place rather than being hand-copied twice.
 */
export function CosmeticPreferencesForm({
  draft,
  onChange,
  soundEnabled,
  onSoundEnabledChange,
  className,
}: CosmeticPreferencesFormProps) {
  const { t } = useTranslation("chat");

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label className="block space-y-1.5">
        <span className="font-mono text-[0.58rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {t("profile.nameLabel")}
        </span>
        <Input
          value={draft.displayName}
          onChange={(event) =>
            onChange({ ...draft, displayName: event.target.value })
          }
          maxLength={32}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[0.58rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {t("profile.focusLabel")}
        </span>
        <Input
          value={draft.focus}
          onChange={(event) =>
            onChange({ ...draft, focus: event.target.value })
          }
          maxLength={32}
        />
      </label>

      <div className="space-y-2">
        <span className="flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          <Palette className="size-3" aria-hidden />
          {t("profile.toneLabel")}
        </span>
        <div className="flex gap-2">
          {(["navy", "sage", "clay"] as ProfileTone[]).map((tone) => (
            <button
              key={tone}
              type="button"
              className={cn(
                "flex size-9 items-center justify-center rounded-xl border-2 border-transparent font-mono text-[0.58rem] font-semibold uppercase transition-transform hover:-translate-y-0.5",
                toneClasses[tone],
                draft.tone === tone && "ring-2 ring-primary/35 ring-offset-2",
              )}
              onClick={() => onChange({ ...draft, tone })}
              aria-label={t(`profile.tones.${tone}`)}
              aria-pressed={draft.tone === tone}
            >
              {tone[0]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-3 py-3">
        <span className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
            {soundEnabled ? (
              <Volume2 className="size-4" aria-hidden />
            ) : (
              <VolumeX className="size-4" aria-hidden />
            )}
          </span>
          <span>
            <span className="block text-sm font-medium text-foreground">
              {t("profile.soundLabel")}
            </span>
            <span className="block text-xs text-muted-foreground">
              {t("profile.soundDescription")}
            </span>
          </span>
        </span>
        <input
          type="checkbox"
          checked={soundEnabled}
          onChange={(event) => onSoundEnabledChange(event.target.checked)}
          className="size-4 accent-primary"
        />
      </label>
    </div>
  );
}
