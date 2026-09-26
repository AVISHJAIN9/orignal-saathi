import { createFileRoute } from "@tanstack/react-router";

import { FactoryAuditsPage } from "@/pages/factory-audits-page";

export const Route = createFileRoute("/factory-audits")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Factory Audit Scheduling & Coordination — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Official workspace for Bureau of Indian Standards factory inspections, preparation checklists, officer coordination, and reschedule requests.",
      },
      { property: "og:title", content: "Factory Audits — SAATHI" },
    ],
  }),
  component: FactoryAuditsPage,
});
