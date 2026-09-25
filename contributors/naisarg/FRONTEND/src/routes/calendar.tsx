import { createFileRoute } from "@tanstack/react-router";

import { CalendarPage } from "@/pages/calendar-page";

export const Route = createFileRoute("/calendar")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Compliance Calendar & Reminders — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Consolidated compliance timeline, statutory payment deadlines, factory audit appointments, and reminder notifications.",
      },
      { property: "og:title", content: "Compliance Calendar — SAATHI" },
    ],
  }),
  component: CalendarPage,
});
