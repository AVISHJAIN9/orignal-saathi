import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { DocumentCortexPage } from "@/pages/document-cortex-page";

function ProtectedDocumentCortexPage() {
  return (
    <ProtectedRoute>
      <DocumentCortexPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/document-cortex")({
  // Client-only: what this screen shows depends on the locally stored role,
  // which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Document Cortex — SAATHI" },
      {
        name: "description",
        content:
          "Upload a document and get an instant AI compliance analysis: detected product, relevant standards, issues, and recommendations.",
      },
      { property: "og:title", content: "Document Cortex — SAATHI" },
      {
        property: "og:description",
        content: "Upload a document and get an instant AI compliance analysis.",
      },
    ],
  }),
  component: ProtectedDocumentCortexPage,
});
