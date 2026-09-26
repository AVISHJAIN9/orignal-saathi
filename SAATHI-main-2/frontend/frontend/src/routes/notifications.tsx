import { createFileRoute } from "@tanstack/react-router";

import { NotificationsPage } from "@/pages/notifications-page";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — SAATHI" },
      {
        name: "description",
        content:
          "Regulatory updates, document analysis results, and compliance deadlines relevant to your account.",
      },
      { property: "og:title", content: "Notifications — SAATHI" },
      {
        property: "og:description",
        content: "Stay on top of regulatory updates and compliance deadlines.",
      },
    ],
  }),
  component: NotificationsPage,
});
