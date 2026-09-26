import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { PaymentStatusPage } from "@/pages/payment-status-page";

export const Route = createFileRoute("/payments/$applicationId")({
  // Client-only: like /dashboard, what this page shows depends on the
  // client-only auth session and role, which the server cannot know.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment & Fee Status — SAATHI" },
      {
        name: "description",
        content:
          "Illustrative payment and fee status for a BIS certification application.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { applicationId } = Route.useParams();
  return (
    <ProtectedRoute>
      <PaymentStatusPage applicationId={applicationId} />
    </ProtectedRoute>
  );
}
