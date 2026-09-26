import { createFileRoute } from "@tanstack/react-router";

import { RenewalsPage } from "@/pages/renewals-page";

export const Route = createFileRoute("/renewals/")({
  ssr: false,
  component: RenewalsPage,
});
