import { useTranslation } from "react-i18next";

import { DocumentManagementPanel } from "@/components/admin/document-management-panel";
import { PlaceholderPage } from "@/components/placeholder-page";
import { useRole } from "@/lib/role";

export function DocumentManagementPage() {
  const { t } = useTranslation("admin");
  const { role, ready } = useRole();

  // Wait for the persisted role before deciding what to show, so the
  // server-rendered markup matches the first client render.
  if (!ready) return null;

  if (role === "admin") {
    return <DocumentManagementPanel />;
  }

  return <PlaceholderPage title={t("documents.pageTitle")} allowed={false} />;
}
