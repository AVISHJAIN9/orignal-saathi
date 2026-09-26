import { createFileRoute } from "@tanstack/react-router";

import { LicenseActionsPage } from "@/pages/license-actions-page";

export const Route = createFileRoute("/license-actions")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "License Actions & Remediation Flow — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative Bureau of Indian Standards license suspension orders, show-cause notices, and structured CAPA remediation dossiers.",
      },
      { property: "og:title", content: "License Actions — SAATHI" },
    ],
  }),
  component: LicenseActionsPage,
});
