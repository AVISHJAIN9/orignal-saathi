import { useTranslation } from "react-i18next";

import { AvatarSection } from "@/components/profile/avatar-section";
import { Input } from "@/components/ui/input";
import { type UserProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";

interface CosmeticPreferencesFormProps {
  draft: UserProfile;
  onChange: (next: UserProfile) => void;
  className?: string;
}

/**
 * The cosmetic preference fields (avatar, chat nickname, focus label) as
 * one reusable, purely controlled form with no save button of its own.
 * Both profile-settings.tsx's dialog and the /profile page's Preferences
 * tab render this exact component with their own draft state + save
 * affordance around it, so the fields exist in one place rather than
 * being hand-copied twice. Every avatar choice (initials colour,
 * character, photo) lives in AvatarSection and, like the text fields,
 * only edits `draft` until the host saves.
 */
export function CosmeticPreferencesForm({
  draft,
  onChange,
  className,
}: CosmeticPreferencesFormProps) {
  const { t } = useTranslation("chat");

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <AvatarSection draft={draft} onChange={onChange} />

      <label className="block space-y-1.5">
        <span className="font-mono text-2xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
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
        <span className="font-mono text-2xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
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
    </div>
  );
}
