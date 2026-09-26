import { createFileRoute } from "@tanstack/react-router";

import { DocumentCorrectionsPage } from "@/pages/document-corrections-page";

export const Route = createFileRoute("/document-corrections")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Document Re-submission & Correction Flow — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative BIS document correction flow: review official scrutiny remarks, replace deficient test reports and undertakings, and track re-submission review status.",
      },
      { property: "og:title", content: "Document Corrections — SAATHI" },
    ],
  }),
  component: DocumentCorrectionsPage,
});
