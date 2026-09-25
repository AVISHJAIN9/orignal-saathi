import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/protected-route";
import { SampleTrackerPage } from "@/pages/sample-tracker-page";

export const Route = createFileRoute("/sample-tracker")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sample Testing Status Tracker — SAATHI" },
      {
        name: "description",
        content:
          "Testing-stage tracker (dispatched, received, in testing, passed/failed) for your submitted BIS application.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <SampleTrackerPage />
    </ProtectedRoute>
  );
}
