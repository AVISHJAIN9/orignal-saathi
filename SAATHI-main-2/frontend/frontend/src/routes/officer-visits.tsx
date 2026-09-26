import { createFileRoute } from "@tanstack/react-router";

import { OfficerVisitsPage } from "@/pages/officer-visits-page";

export const Route = createFileRoute("/officer-visits")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Government-Officer Visit Schedule — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative schedule, preparation requirements, and official logs for Bureau of Indian Standards factory inspections and officer visits.",
      },
      { property: "og:title", content: "Officer Visit Schedule — SAATHI" },
    ],
  }),
  component: OfficerVisitsPage,
});
