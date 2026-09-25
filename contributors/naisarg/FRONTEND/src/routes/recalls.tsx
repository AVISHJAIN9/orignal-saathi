import { createFileRoute } from "@tanstack/react-router";

import { RecallsPage } from "@/pages/recalls-page";

export const Route = createFileRoute("/recalls")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Product Recalls & Non-Conformance Alerts — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative Bureau of Indian Standards surveillance non-conformances, safety advisories, and product recall notices.",
      },
      { property: "og:title", content: "Product Recalls — SAATHI" },
    ],
  }),
  component: RecallsPage,
});
