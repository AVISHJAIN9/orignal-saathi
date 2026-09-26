import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CosmeticPreferencesForm } from "@/components/profile/cosmetic-preferences-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { DEFAULT_USER_PROFILE, type UserProfile } from "@/lib/profile";

interface ProfileSettingsProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  compact?: boolean;
  className?: string;
}

/**
 * The chat sidebar's quick profile editor — renders the exact same
 * CosmeticPreferencesForm the /profile page's Preferences tab uses (avatar
 * photo, nickname, focus, tone), so a change made here or there is
 * the same one field, not two hand-copied forms that could drift.
 */
export function ProfileSettings({
  profile,
  onSave,
  compact = false,
  className,
}: ProfileSettingsProps) {
  const { t } = useTranslation("chat");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  function handleSave() {
    const nextProfile: UserProfile = {
      ...draft,
      displayName: draft.displayName.trim() || DEFAULT_USER_PROFILE.displayName,
      focus: draft.focus.trim() || DEFAULT_USER_PROFILE.focus,
    };
    onSave(nextProfile);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex min-w-0",
              compact && "w-full",
              className,
            )}
          >
            <DialogTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "group/profile flex min-w-0 items-center gap-2.5 rounded-md border border-sidebar-border bg-sidebar text-start transition-colors duration-200 hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                    compact ? "w-full px-3 py-2.5" : "px-3.5 py-3",
                  )}
                />
              }
              aria-label={t("profile.open")}
            >
              <UserAvatar
                size="sm"
                name={profile.displayName}
                tone={profile.tone}
                avatarDataUrl={profile.avatarDataUrl}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-sidebar-foreground">
                  {profile.displayName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {profile.focus}
                </span>
              </span>
              <Settings2
                className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/profile:rotate-45"
                aria-hidden
              />
            </DialogTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">{t("profile.editTooltip")}</TooltipContent>
      </Tooltip>

      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-tight text-primary">
            {t("profile.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("profile.description")}
          </DialogDescription>
        </DialogHeader>

        <CosmeticPreferencesForm
          draft={draft}
          onChange={setDraft}
          className="py-2"
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t("profile.cancel")}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t("profile.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
