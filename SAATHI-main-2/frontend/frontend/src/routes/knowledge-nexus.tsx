import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { KnowledgeNexusPage } from "@/pages/knowledge-nexus-page";

function ProtectedKnowledgeNexusPage() {
  return (
    <ProtectedRoute>
      <KnowledgeNexusPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/knowledge-nexus")({
  // Client-only: post/reply/bookmark state lives in client-only component
  // state (see nexus-workbench.tsx), which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Knowledge Nexus — SAATHI" },
      {
        name: "description",
        content:
          "Browse and discuss BIS standards interpretation questions with the SAATHI community.",
      },
      { property: "og:title", content: "Knowledge Nexus — SAATHI" },
      {
        property: "og:description",
        content: "A community knowledge base for Indian Standards questions.",
      },
    ],
  }),
  component: ProtectedKnowledgeNexusPage,
});
