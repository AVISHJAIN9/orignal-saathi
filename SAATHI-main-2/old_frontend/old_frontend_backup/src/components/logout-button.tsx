import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/lib/router-compat";

import { useAuth } from "@/lib/auth";
import { useRole } from "@/lib/role";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setRole } = useRole();

  // "Log out" is the one user-facing action that spans both AuthProvider
  // (identity) and RoleProvider (persona preview) — see auth-provider.tsx's
  // doc comment for why those stay two separate providers that don't
  // otherwise know about each other. Only theme/language/sound preferences
  // are left untouched, per the "clear only auth-related state" rule.
  async function handleLogout() {
    await logout();
    setRole(null);
    navigate("/");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "elevation-lift flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-[color,background-color,box-shadow,transform,translate] duration-[240ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] hover:translate-x-0.5 hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <LogOut className="size-4" />
      {t("logout")}
    </button>
  );
}
