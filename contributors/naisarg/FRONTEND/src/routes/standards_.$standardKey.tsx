import { createFileRoute } from "@tanstack/react-router";

import { StandardDetailPage } from "@/pages/standard-detail-page";

interface StandardDetailSearch {
  // Lets another page (the S2 dashboard's Action Required / Regulatory
  // Alert cards) deep-link straight into a specific tab — e.g.
  // `?tab=complianceGaps` — instead of only ever landing on Overview.
  // Left undefined for a plain link, which keeps today's default.
  tab?: string;
}

export const Route = createFileRoute("/standards_/$standardKey")({
  validateSearch: (search: Record<string, unknown>): StandardDetailSearch => ({
    tab:
      typeof search["tab"] === "string" ? (search["tab"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Standard Detail — SAATHI Catalogue" },
      {
        name: "description",
        content:
          "Overview, requirements, clauses, QCO applicability and official sources for an Indian Standard.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { standardKey } = Route.useParams();
  const { tab } = Route.useSearch();
  return <StandardDetailPage standardKey={standardKey} initialTab={tab} />;
}
