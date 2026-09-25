import { createFileRoute } from "@tanstack/react-router";

import { IntelFeedPage } from "@/pages/intel-feed-page";

export const Route = createFileRoute("/intel-feed")({
  head: () => ({
    meta: [
      { title: "Intel Feed — SAATHI" },
      {
        name: "description",
        content:
          "Compliance and regulatory intel from BIS, industry bodies, and the press.",
      },
      { property: "og:title", content: "Intel Feed — SAATHI" },
      {
        property: "og:description",
        content: "A news-feed of compliance and regulatory intel.",
      },
    ],
  }),
  component: IntelFeedPage,
});
