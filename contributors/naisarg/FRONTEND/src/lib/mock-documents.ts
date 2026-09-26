import { MOCK_STANDARDS } from "@/lib/mock-standards";

export type DocumentStatus = "queued" | "processing" | "indexed" | "failed";

interface SeedDocumentRow {
  id: string;
  kind: "seed";
  key: string;
  standardNumber: string;
  categoryKey: string;
  status: DocumentStatus;
  lastUpdated: string;
}

export interface UploadedDocumentRow {
  id: string;
  kind: "upload";
  fileName: string;
  status: DocumentStatus;
  lastUpdated: string;
}

export type DocumentRow = SeedDocumentRow | UploadedDocumentRow;

// MOCK: fixed illustrative "last indexed" dates for the seed documents below
// — not derived from anything real, just varied enough to look like an
// actual ingestion history.
const SEED_LAST_UPDATED: Record<string, string> = {
  is4151: "2025-11-02",
  is302: "2025-10-18",
  is1417: "2025-09-30",
  is14543: "2025-08-25",
  is2347: "2025-07-14",
};

// D5 — the document library starts pre-populated with the same seed
// standards already cited elsewhere in the app (see mock-standards.ts),
// shown here as already-indexed source documents.
export const SEED_DOCUMENTS: DocumentRow[] = MOCK_STANDARDS.map((standard) => ({
  id: standard.key,
  kind: "seed",
  key: standard.key,
  standardNumber: standard.standardNumber,
  categoryKey: standard.categoryKey,
  status: "indexed",
  lastUpdated: SEED_LAST_UPDATED[standard.key] ?? new Date().toISOString(),
}));
