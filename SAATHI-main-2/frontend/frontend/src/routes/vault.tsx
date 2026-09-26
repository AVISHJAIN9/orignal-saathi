import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { ComplianceVaultPage } from "@/pages/compliance-vault-page";

interface VaultSearch {
  // Lets another page (a dashboard card, a notification) deep-link straight
  // into one saved item — e.g. `?item=standard:is4151` — instead of only
  // ever landing on the list view. Same convention as Standard Detail's
  // `?tab=`. Left undefined for a plain link, which keeps today's default.
  item?: string;
}

function ProtectedComplianceVaultPage() {
  const { item } = Route.useSearch();
  return (
    <ProtectedRoute>
      <ComplianceVaultPage initialItemId={item} />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/vault")({
  // Client-only: saved items live in client-only localStorage (mock-vault.ts),
  // which the server cannot know.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): VaultSearch => ({
    item:
      typeof search["item"] === "string"
        ? (search["item"] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Compliance Vault — SAATHI" },
      {
        name: "description",
        content:
          "Standards you've bookmarked and documents you've saved from Document Cortex, all in one place.",
      },
      { property: "og:title", content: "Compliance Vault — SAATHI" },
      {
        property: "og:description",
        content: "Your saved standards and documents.",
      },
    ],
  }),
  component: ProtectedComplianceVaultPage,
});
