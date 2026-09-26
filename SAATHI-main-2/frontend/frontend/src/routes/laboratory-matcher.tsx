import { createFileRoute } from "@tanstack/react-router";

import { LaboratoryMatcherPage } from "@/pages/laboratory-matcher-page";

export const Route = createFileRoute("/laboratory-matcher")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Intelligent Laboratory Matcher — SAATHI Regulatory Intelligence" },
      {
        name: "description",
        content:
          "Find verified laboratories capable of performing testing required for your BIS compliance path.",
      },
      { property: "og:title", content: "Intelligent Laboratory Matcher — SAATHI" },
    ],
  }),
  component: LaboratoryMatcherPage,
});
