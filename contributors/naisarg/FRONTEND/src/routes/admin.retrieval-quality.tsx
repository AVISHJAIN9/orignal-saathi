import { createFileRoute } from "@tanstack/react-router";
import { RetrievalQualityPage } from "@/pages/retrieval-quality-page";

export const Route = createFileRoute("/admin/retrieval-quality")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Retrieval-Quality & Ops Telemetry — SAATHI Admin" },
      {
        name: "description",
        content:
          "Internal operations telemetry monitoring citation groundedness, safe decline rates, and retrieval latency across Indian Standards knowledge bases.",
      },
      { property: "og:title", content: "Retrieval-Quality Ops — SAATHI Admin" },
    ],
  }),
  component: RetrievalQualityPage,
});
