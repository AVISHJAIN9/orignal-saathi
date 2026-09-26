import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/pages/legal-page";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal — SAATHI" },
      {
        name: "description",
        content:
          "Privacy policy, terms of use, and the AI/prototype disclaimer governing SAATHI, plus the official BIS authority notice.",
      },
      { property: "og:title", content: "Legal — SAATHI" },
      {
        property: "og:description",
        content:
          "Privacy, terms, and responsible-use information for the SAATHI prototype.",
      },
    ],
  }),
  component: LegalPage,
});
