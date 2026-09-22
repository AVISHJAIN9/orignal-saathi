import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { NotificationsPage } from "@/pages/notifications-page";

function ProtectedNotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/notifications")({
  // Client-only: what this screen shows now depends on the client-only
  // auth session, which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Notifications — SAATHI" },
      {
        name: "description",
        content:
          "Regulatory updates, document analysis results, and compliance deadlines relevant to your account.",
      },
      { property: "og:title", content: "Notifications — SAATHI" },
      {
        property: "og:description",
        content: "Stay on top of regulatory updates and compliance deadlines.",
      },
    ],
  }),
  component: ProtectedNotificationsPage,
});
