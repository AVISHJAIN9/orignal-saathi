import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/lib/router-compat";

import { useRole } from "@/lib/role";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { setRole } = useRole();

  function handleLogout() {
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
