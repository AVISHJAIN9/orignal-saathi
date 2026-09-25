import { createFileRoute } from "@tanstack/react-router";
import { BusinessAccountPage } from "@/pages/business-account-page";

export const Route = createFileRoute("/business-account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Business Account & Team Management — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Authoritative BIS Multi-User Business Account: manage organization members, role-based access control, pending invitations, compliance responsibilities, and audit logs.",
      },
      { property: "og:title", content: "Business Account — SAATHI" },
    ],
  }),
  component: BusinessAccountPage,
});
