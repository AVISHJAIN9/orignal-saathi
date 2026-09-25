import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";

import { UserAvatar } from "@/components/user-avatar";
import type { AuthUser } from "@/lib/auth";
import type { Role } from "@/lib/role";

interface ProfileHeaderProps {
  currentUser: AuthUser;
  role: Role | null;
  /** Opens the Avatar section on the Preferences tab. */
  onEditAvatar: () => void;
}

/** Summary card at the top of /profile — every field here is real: the
 * avatar initials/photo and status come from S1's `currentUser` and the
 * shared UserProfile store, the role badge from RoleProvider. No
 * profile-completion percentage or fabricated "Verified" claim, unlike the
 * reference this was built from. The avatar is a shortcut to the Avatar
 * section on the Preferences tab, the one place avatar choices are made
 * and saved. */
export function ProfileHeader({
  currentUser,
  role,
  onEditAvatar,
}: ProfileHeaderProps) {
  const { t } = useTranslation(["auth", "profile", "chat"]);

  return (
    <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onEditAvatar}
          aria-label={t("chat:profile.avatar.editAvatar", "Change avatar")}
          className="group relative size-16 shrink-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <UserAvatar size="lg" className="size-16 rounded-2xl text-xl" />
          <span className="absolute -end-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-110">
            <Camera className="size-3" aria-hidden />
          </span>
        </button>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {currentUser.name}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {currentUser.email}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {role && (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-2xs font-semibold text-primary uppercase">
                {t("profile:account.roleLabel")}:{" "}
                {t(`auth:accountType.${role}`)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
              {t(`auth:profile.status.${currentUser.status}`, {
                defaultValue: currentUser.status,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
