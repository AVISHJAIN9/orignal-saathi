import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/renewals")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "License Renewal Timeline & Reminders — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Track 90-day, 30-day, and 7-day statutory license renewal milestones, kept in sync with your Certificates.",
      },
      { property: "og:title", content: "Renewal Reminders — SAATHI" },
    ],
  }),
  // Layout only: the timeline renders at /renewals and /renewals/$applicationId
  // (index routes), the renewal wizard at /renewals/$applicationId/wizard.
  component: Outlet,
});
