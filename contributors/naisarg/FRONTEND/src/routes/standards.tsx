import { createFileRoute } from "@tanstack/react-router";

import { StandardsBrowserPage } from "@/pages/standards-browser-page";

export const Route = createFileRoute("/standards")({
  head: () => ({
    meta: [
      { title: "Browse Indian Standards — SAATHI Catalogue" },
      {
        name: "description",
        content:
          "Search the Indian Standards catalogue by number, title or sector, with scope, marks and status for each standard.",
      },
      { property: "og:title", content: "Browse Indian Standards — SAATHI" },
      {
        property: "og:description",
        content: "A searchable catalogue of Indian Standards with live sync status.",
      },
    ],
  }),
  component: StandardsBrowserPage,
});
