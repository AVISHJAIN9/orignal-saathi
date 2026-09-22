import { useTranslation } from "react-i18next";

import type { AuthUser } from "@/lib/auth";
import type { ProfileTone, UserProfile } from "@/lib/profile";
import type { Role } from "@/lib/role";
import { cn } from "@/lib/utils";

const toneClasses: Record<ProfileTone, string> = {
  navy: "bg-foreground text-background shadow-[0_5px_12px_rgba(12,50,86,0.25)]",
  sage: "bg-[#78958c] text-white shadow-[0_5px_12px_rgba(86,117,108,0.25)]",
  clay: "bg-[#a66f5d] text-white shadow-[0_5px_12px_rgba(130,78,62,0.25)]",
};

interface ProfileHeaderProps {
  currentUser: AuthUser;
  profile: UserProfile;
  role: Role | null;
}

/** Summary card at the top of /profile — every field here is real: the
 * avatar initials and status come from S1's `currentUser`, the role badge
 * from RoleProvider. No profile-completion percentage or fabricated
 * "Verified" claim, unlike the reference this was built from. */
export function ProfileHeader({
  currentUser,
  profile,
  role,
}: ProfileHeaderProps) {
  const { t } = useTranslation(["auth", "profile"]);

  const initials =
    currentUser.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S";

  return (
    <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold",
            toneClasses[profile.tone],
          )}
        >
          {initials}
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {currentUser.name}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {currentUser.email}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {role && (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[0.68rem] font-semibold text-primary uppercase">
                {t("profile:account.roleLabel")}:{" "}
                {t(`auth:accountType.${role}`)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.68rem] font-semibold text-emerald-600 dark:text-emerald-400">
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
