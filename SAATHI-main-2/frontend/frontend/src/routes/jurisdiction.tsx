import { createFileRoute } from "@tanstack/react-router";

import { JurisdictionPage } from "@/pages/jurisdiction-page";

export const Route = createFileRoute("/jurisdiction")({
  head: () => ({
    meta: [
      { title: "Jurisdiction — SAATHI" },
      {
        name: "description",
        content:
          "A global map of cross-border regulatory frameworks, bilateral MoUs, and certification schemes aligned with India's BIS.",
      },
      { property: "og:title", content: "Jurisdiction — SAATHI" },
      {
        property: "og:description",
        content:
          "Explore international standards ecosystems and their alignment with BIS.",
      },
    ],
  }),
  component: JurisdictionPage,
});
