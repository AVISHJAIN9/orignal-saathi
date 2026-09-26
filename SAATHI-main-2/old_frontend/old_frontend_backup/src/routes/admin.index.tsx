import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { AdminPanelPage } from "@/pages/admin-panel-page";

function ProtectedAdminPanelPage() {
  return (
    <ProtectedRoute>
      <AdminPanelPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/admin/")({
  // Client-only: what this screen shows depends on the locally stored role,
  // which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Panel — SAATHI Operations" },
      {
        name: "description",
        content:
          "Operational view of SAATHI: query volume, top topics, document coverage and answer quality KPIs.",
      },
      { property: "og:title", content: "Admin Panel — SAATHI Operations" },
      {
        property: "og:description",
        content:
          "KPIs, query trends and topic breakdowns for the SAATHI assistant.",
      },
    ],
  }),
  component: ProtectedAdminPanelPage,
});
