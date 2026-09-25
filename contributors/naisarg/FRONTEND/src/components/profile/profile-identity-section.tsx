import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AuthUser } from "@/lib/auth";

interface ProfileIdentitySectionProps {
  currentUser: AuthUser;
}

/** Read-only — S1's AuthProvider has no `updateUser()`, so an editable
 * form here would silently do nothing on submit. The editable nickname
 * these fields are sometimes confused with lives in the Preferences tab
 * instead (see `nicknameNote` below). */
export function ProfileIdentitySection({
  currentUser,
}: ProfileIdentitySectionProps) {
  const { t } = useTranslation(["profile", "auth"]);

  const rows: { label: string; value: string }[] = [
    { label: t("auth:profile.nameLabel"), value: currentUser.name },
    { label: t("auth:profile.emailLabel"), value: currentUser.email },
    { label: t("auth:profile.accountIdLabel"), value: currentUser.id },
    {
      label: t("auth:profile.statusLabel"),
      value: t(`auth:profile.status.${currentUser.status}`, {
        defaultValue: currentUser.status,
      }),
    },
  ];

  return (
    <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <User className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("profile:identity.heading")}
        </h2>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("profile:identity.body")}
      </p>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="truncate text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="rounded-xl border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        {t("auth:profile.nicknameNote")}
      </p>
    </div>
  );
}
