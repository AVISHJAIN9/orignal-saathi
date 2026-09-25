import { createFileRoute } from "@tanstack/react-router";
import { LocationsPage } from "@/pages/locations-page";

export const Route = createFileRoute("/locations")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Manufacturing Locations & License Isolation — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Manage plant-specific BIS Standard Mark licenses, scheduled factory audits, and compliance health across manufacturing units.",
      },
      { property: "og:title", content: "Manufacturing Locations — SAATHI" },
    ],
  }),
  component: LocationsPage,
});
