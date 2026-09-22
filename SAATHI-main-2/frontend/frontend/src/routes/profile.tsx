import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { ProfilePage } from "@/pages/profile-page";

function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/profile")({
  // Client-only: what this page shows depends on the client-only auth
  // session and role, which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Profile — SAATHI" },
      {
        name: "description",
        content:
          "Your account identity, preferences, role and access, and recent activity.",
      },
      { property: "og:title", content: "Your Profile — SAATHI" },
      {
        property: "og:description",
        content: "Manage your SAATHI account and preferences.",
      },
    ],
  }),
  component: ProtectedProfilePage,
});
