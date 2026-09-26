import { createFileRoute } from "@tanstack/react-router";

import { DevelopersPage } from "@/pages/developers-page";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — SAATHI" },
      {
        name: "description",
        content:
          "API reference for the SAATHI assistant, standards, conformity, and document analysis endpoints.",
      },
      { property: "og:title", content: "Developers — SAATHI" },
      {
        property: "og:description",
        content:
          "Authentication, endpoints, rate limits, and error codes for the SAATHI API.",
      },
    ],
  }),
  component: DevelopersPage,
});
