import { createFileRoute } from "@tanstack/react-router";

import { SchemeSelectorPage } from "@/pages/scheme-selector-page";

export const Route = createFileRoute("/scheme-selector")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Intelligent Scheme Selector — SAATHI Regulatory Intelligence" },
      {
        name: "description",
        content:
          "Authoritative BIS certification scheme selector for Indian Standards and QCO orders.",
      },
      { property: "og:title", content: "Intelligent Scheme Selector — SAATHI" },
    ],
  }),
  component: SchemeSelectorPage,
});
