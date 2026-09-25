import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { ClassificationPage } from "@/pages/classification-page";

function ProtectedClassificationPage() {
  return (
    <ProtectedRoute>
      <ClassificationPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/classification")({
  // Client-only: the wizard's session state depends on client-only mock
  // session storage, which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Product Classification — SAATHI" },
      {
        name: "description",
        content:
          "Answer a few questions to find the Indian Standard applicable to your product.",
      },
      { property: "og:title", content: "Product Classification — SAATHI" },
      {
        property: "og:description",
        content: "A guided product classification wizard for BIS standards.",
      },
    ],
  }),
  component: ProtectedClassificationPage,
});
