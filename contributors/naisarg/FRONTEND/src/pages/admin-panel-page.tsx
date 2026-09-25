import { useTranslation } from "react-i18next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PlaceholderPage } from "@/components/placeholder-page";
import { useRole } from "@/lib/role";

export function AdminPanelPage() {
  const { t } = useTranslation("chat");
  const { role, ready } = useRole();

  // Wait for the persisted role before deciding what to show, so the
  // server-rendered markup matches the first client render.
  if (!ready) return null;

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <PlaceholderPage title={t("nav.adminPanel")} allowed={false} />;
}
