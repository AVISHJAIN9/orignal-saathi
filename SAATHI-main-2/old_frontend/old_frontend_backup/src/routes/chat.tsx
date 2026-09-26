import { createFileRoute } from "@tanstack/react-router";

import App from "@/App";
import { ProtectedRoute } from "@/components/protected-route";

function ProtectedChat() {
  return (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/chat")({
  // Client-only: what this screen shows depends on the locally stored role,
  // which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Chat with SAATHI — Ask about BIS standards" },
      {
        name: "description",
        content:
          "Ask questions about Indian Standards and get cited answers in English or Hindi, with a product classification wizard.",
      },
      { property: "og:title", content: "Chat with SAATHI" },
      {
        property: "og:description",
        content:
          "Cited answers on BIS standards, bilingual and clause accurate.",
      },
    ],
  }),
  component: ProtectedChat,
});
