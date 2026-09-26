import { createFileRoute } from "@tanstack/react-router";
import { InvoicesPage } from "@/pages/invoices-page";

export const Route = createFileRoute("/invoices")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Statutory Fee Invoices & GST Receipts — SAATHI BIS Assistant" },
      {
        name: "description",
        content:
          "Manage statutory fee schedules, itemized GST breakdowns, and download SIH 2026 demonstration receipts.",
      },
      { property: "og:title", content: "Fee Invoices & Receipts — SAATHI" },
    ],
  }),
  component: InvoicesPage,
});
