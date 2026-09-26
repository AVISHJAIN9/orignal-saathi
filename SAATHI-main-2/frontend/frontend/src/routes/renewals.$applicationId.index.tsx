import { createFileRoute } from "@tanstack/react-router";

import { RenewalsPage } from "@/pages/renewals-page";

export const Route = createFileRoute("/renewals/$applicationId/")({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const { applicationId } = Route.useParams();
  return <RenewalsPage focusApplicationId={applicationId} />;
}
