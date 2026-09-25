import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardPage } from "@/pages/dashboard-page";

function ProtectedDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/dashboard")({
  // Client-only: what this page shows depends on the client-only auth
  // session and role, which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — SAATHI" },
      {
        name: "description",
        content:
          "A personalized view of your BIS applications, deadlines, and outstanding actions.",
      },
      { property: "og:title", content: "Dashboard — SAATHI" },
      {
        property: "og:description",
        content:
          "Track your applications, deadlines, and compliance status in one place.",
      },
    ],
  }),
  component: ProtectedDashboardPage,
});
