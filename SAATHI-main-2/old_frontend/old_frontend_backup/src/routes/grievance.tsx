import { createFileRoute } from "@tanstack/react-router";

import { GrievancePage } from "@/pages/grievance-page";

export const Route = createFileRoute("/grievance")({
  head: () => ({
    meta: [
      { title: "Grievance Officer & Consent — SAATHI" },
      {
        name: "description",
        content:
          "Grievance officer contact information and the DPDP consent notice for the SAATHI prototype.",
      },
      { property: "og:title", content: "Grievance Officer & Consent — SAATHI" },
      {
        property: "og:description",
        content: "Grievance contact and data-consent information.",
      },
    ],
  }),
  component: GrievancePage,
});
