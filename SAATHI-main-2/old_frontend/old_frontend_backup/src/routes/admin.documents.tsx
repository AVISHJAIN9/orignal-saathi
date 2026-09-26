import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { DocumentManagementPage } from "@/pages/document-management-page";

function ProtectedDocumentManagementPage() {
  return (
    <ProtectedRoute>
      <DocumentManagementPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/admin/documents")({
  // Client-only: what this screen shows depends on the locally stored role,
  // which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Document Management — SAATHI Admin" },
      {
        name: "description",
        content:
          "Upload, index and retire the standards documents that power SAATHI's cited answers.",
      },
      { property: "og:title", content: "Document Management — SAATHI Admin" },
      {
        property: "og:description",
        content: "Manage the standards corpus behind SAATHI's answers.",
      },
    ],
  }),
  component: ProtectedDocumentManagementPage,
});
