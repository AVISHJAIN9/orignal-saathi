import { createFileRoute } from "@tanstack/react-router";
import { AppealsPage } from "@/pages/appeals-page";

export const Route = createFileRoute("/appeals")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Appeals & Dispute Resolution — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative BIS appeal and dispute-resolution flow: review official scrutiny findings, explore available statutory resolution paths, submit structured appeals, and track resolution status.",
      },
      { property: "og:title", content: "Appeals & Dispute Resolution — SAATHI" },
    ],
  }),
  component: AppealsPage,
});
