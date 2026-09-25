import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { RenewalPage } from "@/pages/renewal-page";

export const Route = createFileRoute("/renewals/$applicationId/wizard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Annual Licence Renewal — SAATHI" },
      {
        name: "description",
        content:
          "Annual renewal flow with a conditional surveillance-audit step for a submitted BIS application.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { applicationId } = Route.useParams();
  return (
    <ProtectedRoute>
      <RenewalPage applicationId={applicationId} />
    </ProtectedRoute>
  );
}
