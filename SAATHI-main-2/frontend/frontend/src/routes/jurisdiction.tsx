import { createFileRoute } from "@tanstack/react-router";

import { JurisdictionPage } from "@/pages/jurisdiction-page";

export const Route = createFileRoute("/jurisdiction")({
  head: () => ({
    meta: [
      { title: "Jurisdiction — SAATHI" },
      {
        name: "description",
        content:
          "An India map of BIS Headquarters, Regional and Branch Offices, and state-level certification coverage across all states and UTs.",
      },
      { property: "og:title", content: "Jurisdiction — SAATHI" },
      {
        property: "og:description",
        content:
          "Explore how BIS certification reaches every Indian state and union territory.",
      },
    ],
  }),
  component: JurisdictionPage,
});
