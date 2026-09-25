import { createFileRoute } from "@tanstack/react-router";
import { PublicVerificationPage } from "@/pages/public-verification-page";

export const Route = createFileRoute("/verify/certificate")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Public Certificate Verification — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Official Public Certificate Verification Portal: verify Bureau of Indian Standards license numbers, Standard Mark grants, and product conformity directly against the national central registry.",
      },
      { property: "og:title", content: "Public Certificate Verification — SAATHI" },
    ],
  }),
  component: PublicVerificationPage,
});
