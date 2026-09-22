import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { ConformityCheckPage } from "@/pages/conformity-check-page";

function ProtectedConformityCheckPage() {
  return (
    <ProtectedRoute>
      <ConformityCheckPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/conformity")({
  // Client-only: what this screen shows depends on the locally stored role,
  // which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conformity Check — Test your product report against BIS" },
      {
        name: "description",
        content:
          "Upload a test report and see which BIS clauses pass, which need attention, and what evidence is missing.",
      },
      { property: "og:title", content: "Conformity Check — SAATHI" },
      {
        property: "og:description",
        content:
          "Clause-by-clause conformity gaps for your product test report.",
      },
    ],
  }),
  component: ProtectedConformityCheckPage,
});
