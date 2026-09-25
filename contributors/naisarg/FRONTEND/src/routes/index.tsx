import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/pages/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAATHI — BIS Standards Assistant for India" },
      {
        name: "description",
        content:
          "SAATHI answers BIS standards and certification questions in English and Hindi, with citations to the exact clause.",
      },
      { property: "og:title", content: "SAATHI — BIS Standards Assistant for India" },
      {
        property: "og:description",
        content:
          "Bilingual guidance on Indian Standards, conformity checks and certification marks, cited clause by clause.",
      },
    ],
  }),
  component: LandingPage,
});
