import { LogOut, MessageSquare, Repeat, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/lib/router-compat";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/lib/auth";
import { useRole } from "@/lib/role";

interface AccountMenuProps {
  onSignInClick: () => void;
  signInLabel: string;
  className?: string;
}

/**
 * Navbar auth affordance: "Sign In" when logged out, avatar + name +
 * dropdown when logged in — reuses the existing DropdownMenu/Avatar
 * primitives rather than building new ones, per the S1 navbar
 * requirement. This sits in LandingNav specifically, since that's the
 * one persistent header shown regardless of auth state; the in-app chat
 * sidebar already has its own account affordance (ProfileSettings +
 * LogoutButton) that this doesn't duplicate.
 *
 * Identity (S1's AuthProvider/useAuth — currentUser, logout) and role
 * (RoleProvider/useRole — role, setRole) stay the two independent things
 * they already are elsewhere in this app (see auth-provider.tsx's doc
 * comment): "Switch Role" only clears the role and reopens the login
 * dialog via the same `onSignInClick` the logged-out state already uses —
 * it does not end the identity session the way "Log out" does.
 */
export function AccountMenu({
  onSignInClick,
  signInLabel,
  className,
}: AccountMenuProps) {
  const { t } = useTranslation("auth");
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  if (!isAuthenticated || !currentUser) {
    return (
      <button type="button" onClick={onSignInClick} className={className}>
        {signInLabel}
      </button>
    );
  }

  async function handleSignOut() {
    await logout();
    setRole(null);
    navigate("/");
  }

  function handleSwitchRole() {
    setRole(null);
    onSignInClick();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("nav.accountMenuLabel", { name: currentUser.name })}
          className="elevation-lift inline-flex max-w-[10rem] items-center gap-2 h-8 rounded-full border border-[var(--plate-line,var(--border))] bg-background/80 ps-0.5 pe-0.5 sm:pe-3 lg:pe-0.5 xl:pe-3 outline-none transition-colors duration-200 hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <UserAvatar size="sm" name={currentUser.name} className="size-6.5" />
          <span className="hidden truncate text-xs font-semibold text-foreground sm:inline lg:hidden xl:inline">
            {currentUser.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-2.5 border-b border-border px-2 py-2.5">
          <UserAvatar size="md" name={currentUser.name} className="size-9" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-foreground">
              {currentUser.name}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {currentUser.email}
            </span>
            {role && (
              <span className="mt-0.5 w-fit rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary capitalize">
                {t(`accountType.${role}`)}
              </span>
            )}
          </div>
        </div>
        <DropdownMenuItem onSelect={() => navigate("/chat")}>
          <MessageSquare className="size-4" aria-hidden />
          {t("nav.openAssistant")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/profile")}>
          <User className="size-4" aria-hidden />
          {t("nav.profileCredentials")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSwitchRole}>
          <Repeat className="size-4" aria-hidden />
          {t("nav.switchRole")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" aria-hidden />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
