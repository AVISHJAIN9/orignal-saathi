import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { RegistrationPage } from "@/pages/registration-page";

// RegistrationWizard expects to render inside <ProtectedRoute> (signed-in
// user prefill, session-expiry redirect) — same as /register.
function ProtectedRegistrationPage() {
  return (
    <ProtectedRoute>
      <RegistrationPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/registration/new")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "New Applicant Registration — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Step-by-step guided registration workflow for BIS application filing and licensing.",
      },
      { property: "og:title", content: "New Applicant Registration — SAATHI" },
    ],
  }),
  component: ProtectedRegistrationPage,
});
