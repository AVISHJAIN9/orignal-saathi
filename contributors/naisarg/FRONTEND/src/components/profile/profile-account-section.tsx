import {
  Bell,
  ClipboardList,
  FileScan,
  MessageSquare,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import type { AuthUser } from "@/lib/auth";
import type { Role } from "@/lib/role";

interface ProfileAccountSectionProps {
  currentUser: AuthUser;
  role: Role | null;
}

const LINKS = [
  { key: "documents", href: "/document-cortex", icon: FileScan },
  { key: "applications", href: "/dashboard", icon: ClipboardList },
  { key: "complianceChecks", href: "/conformity", icon: ScanSearch },
  { key: "notifications", href: "/notifications", icon: Bell },
  { key: "conversations", href: "/chat", icon: MessageSquare },
] as const;

/** Role/status plus the 5 real destinations this account's work lives at
 * — reuses the exact same `auth:profile.links.*` labels the sidebar's
 * ProfileSettings dialog already used for 4 of these 5, rather than
 * re-authoring a second set of labels for the same links. */
export function ProfileAccountSection({
  currentUser,
  role,
}: ProfileAccountSectionProps) {
  const { t } = useTranslation(["profile", "auth"]);

  return (
    <div className="elevation-1 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <ShieldCheck className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("profile:account.heading")}
        </h2>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("profile:account.body")}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
          <span className="text-xs font-medium text-muted-foreground">
            {t("profile:account.roleLabel")}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {role ? t(`auth:accountType.${role}`) : "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
          <span className="text-xs font-medium text-muted-foreground">
            {t("auth:profile.statusLabel")}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {t(`auth:profile.status.${currentUser.status}`, {
              defaultValue: currentUser.status,
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("auth:profile.linksHeading")}
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.key}
                to={link.href}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Icon className="size-4 text-primary" aria-hidden />
                {t(`auth:profile.links.${link.key}`)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
