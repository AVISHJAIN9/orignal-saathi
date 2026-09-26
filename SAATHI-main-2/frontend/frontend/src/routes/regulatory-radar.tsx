import { createFileRoute } from "@tanstack/react-router";

import { RegulatoryRadarPage } from "@/pages/regulatory-radar-page";

export const Route = createFileRoute("/regulatory-radar")({
  head: () => ({
    meta: [
      { title: "Regulatory Radar — SAATHI" },
      {
        name: "description",
        content:
          "Amendments, new standards, and certification deadlines that affect BIS-regulated products.",
      },
      { property: "og:title", content: "Regulatory Radar — SAATHI" },
      {
        property: "og:description",
        content:
          "A timeline of regulatory changes affecting BIS-regulated products.",
      },
    ],
  }),
  component: RegulatoryRadarPage,
});
