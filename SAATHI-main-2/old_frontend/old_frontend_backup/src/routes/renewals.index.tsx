import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { RenewalPage } from "@/pages/renewal-page";

export const Route = createFileRoute("/renewals/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Annual Licence Renewal — SAATHI" },
      {
        name: "description",
        content:
          "Illustrative annual renewal flow with a conditional surveillance-audit step for a submitted BIS application — prototype data, not a live BIS filing.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <RenewalPage applicationId="APP-DEMO-HELMET" />
    </ProtectedRoute>
  );
}
