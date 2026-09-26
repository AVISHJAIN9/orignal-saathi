import { ArrowUpRight, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

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
import { CosmeticPreferencesForm } from "@/components/profile/cosmetic-preferences-form";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  DEFAULT_USER_PROFILE,
  type ProfileTone,
  type UserProfile,
} from "@/lib/profile";

interface ProfileSettingsProps {
  profile: UserProfile;
  soundEnabled: boolean;
  onSave: (profile: UserProfile) => void;
  onSoundEnabledChange: (enabled: boolean) => void;
  compact?: boolean;
  className?: string;
}

const toneClasses: Record<ProfileTone, string> = {
  navy: "bg-foreground text-background shadow-[0_5px_12px_rgba(12,50,86,0.25)]",
  sage: "bg-[#78958c] text-white shadow-[0_5px_12px_rgba(86,117,108,0.25)]",
  clay: "bg-[#a66f5d] text-white shadow-[0_5px_12px_rgba(130,78,62,0.25)]",
};

export function ProfileSettings({
  profile,
  soundEnabled,
  onSave,
  onSoundEnabledChange,
  compact = false,
  className,
}: ProfileSettingsProps) {
  const { t } = useTranslation("chat");
  const { t: tAuth } = useTranslation("auth");
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  const initials =
    draft.displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S";

  function handleSave() {
    const nextProfile = {
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
                    "group/profile flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/75 bg-white/45 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_20px_rgba(12,50,86,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                    compact ? "w-full px-3 py-2.5" : "px-3.5 py-3",
                  )}
                />
              }
              aria-label={t("profile.open")}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-[0.65rem] font-semibold tracking-[0.08em]",
                  toneClasses[profile.tone],
                )}
              >
                {initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-primary">
                  {profile.displayName}
                </span>
                <span className="block truncate font-mono text-[0.54rem] tracking-[0.1em] text-muted-foreground uppercase">
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

      <DialogContent className="rounded-2xl border-white/75 shadow-[0_24px_60px_rgba(12,50,86,0.18)] backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-tight text-primary">
            {t("profile.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("profile.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {currentUser && (
            <div className="space-y-2 rounded-xl border border-white/75 bg-white/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <span className="font-mono text-[0.58rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {tAuth("profile.accountHeading")}
              </span>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xs text-muted-foreground">
                    {tAuth("profile.nameLabel")}
                  </dt>
                  <dd className="truncate font-medium text-foreground">
                    {currentUser.name}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xs text-muted-foreground">
                    {tAuth("profile.emailLabel")}
                  </dt>
                  <dd className="truncate font-medium text-foreground">
                    {currentUser.email}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xs text-muted-foreground">
                    {tAuth("profile.accountIdLabel")}
                  </dt>
                  <dd className="truncate font-mono text-xs text-foreground">
                    {currentUser.id}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xs text-muted-foreground">
                    {tAuth("profile.statusLabel")}
                  </dt>
                  <dd>
                    <span className="inline-flex w-fit rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {tAuth(`profile.status.${currentUser.status}`, {
                        defaultValue: currentUser.status,
                      })}
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {tAuth("profile.nicknameNote")}
              </p>
            </div>
          )}

          <CosmeticPreferencesForm
            draft={draft}
            onChange={setDraft}
            soundEnabled={soundEnabled}
            onSoundEnabledChange={onSoundEnabledChange}
          />

          {currentUser && (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/75 bg-white/45 px-3.5 py-2.5 text-sm font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors hover:bg-white/70"
            >
              {tAuth("profile.viewFullProfile")}
              <ArrowUpRight
                className="size-4 shrink-0 text-primary"
                aria-hidden
              />
            </Link>
          )}
        </div>

        <DialogFooter className="border-white/60 bg-white/25">
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
