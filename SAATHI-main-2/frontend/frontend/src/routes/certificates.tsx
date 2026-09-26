import { createFileRoute } from "@tanstack/react-router";
import { CertificatesPage } from "@/pages/certificates-page";

export const Route = createFileRoute("/certificates")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Certificate Center — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative BIS Certificate Center: view granted Standard Mark (ISI) licenses, download official certification documents, track revisions, and manage lifecycle validity.",
      },
      { property: "og:title", content: "Certificate Center — SAATHI" },
    ],
  }),
  component: CertificatesPage,
});
