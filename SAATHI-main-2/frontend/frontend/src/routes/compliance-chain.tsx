import { createFileRoute } from "@tanstack/react-router";
import { ComplianceChainPage } from "@/pages/compliance-chain-page";

export const Route = createFileRoute("/compliance-chain")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Compliance Chain — SAATHI Regulatory Intelligence" },
      {
        name: "description",
        content:
          "End-to-end BIS compliance journey orchestration from product classification to certification.",
      },
      { property: "og:title", content: "Compliance Chain — SAATHI" },
    ],
  }),
  component: ComplianceChainPage,
});
