import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { RegistrationPage } from "@/pages/registration-page";

function ProtectedRegistrationPage() {
  return (
    <ProtectedRoute>
      <RegistrationPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/register")({
  // Client-only: the wizard's state (draft resume, auth) depends on
  // client-only storage the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "New Applicant Registration — SAATHI" },
      {
        name: "description",
        content:
          "Register a new BIS certification application: applicant and business details, product classification, required documents, and testing requirements.",
      },
      { property: "og:title", content: "New Applicant Registration — SAATHI" },
      {
        property: "og:description",
        content: "Guided BIS registration wizard prototype.",
      },
    ],
  }),
  component: ProtectedRegistrationPage,
});
