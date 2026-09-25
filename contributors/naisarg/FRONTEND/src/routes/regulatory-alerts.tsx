import { createFileRoute } from "@tanstack/react-router";

import { RegulatoryAlertsPage } from "@/pages/regulatory-alerts-page";

export const Route = createFileRoute("/regulatory-alerts")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Personalized Regulatory Change Alerts — SAATHI Regulatory Intelligence" },
      {
        name: "description",
        content:
          "Proactive, personalized regulatory change alerts affecting your monitored Indian Standards, QCOs, and compliance paths.",
      },
      { property: "og:title", content: "Regulatory Change Alerts — SAATHI" },
    ],
  }),
  component: RegulatoryAlertsPage,
});
