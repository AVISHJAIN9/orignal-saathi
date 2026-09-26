// MOCK: illustrative regulatory timeline events, not live ones. title/
// description resolve against the radar i18n namespace (items.<key>.*) the
// same way mock-standards.ts resolves titles against the standards
// namespace. `date` stays a plain ISO string (not translated) and is
// formatted at render time, the same way document-management-panel.tsx
// formats lastUpdated.

export type RegulatoryCategory =
  "bis" | "standards" | "certification" | "international" | "upcoming";

export interface RegulatoryEventDatum {
  key: string;
  date: string;
  category: RegulatoryCategory;
}

// Sorted oldest-first; a mix of past amendments/publications and upcoming
// deadlines/drafts, spread across every category the filters expose.
export const MOCK_REGULATORY_EVENTS: RegulatoryEventDatum[] = [
  { key: "r1", date: "2026-06-15", category: "bis" },
  { key: "r2", date: "2026-07-02", category: "international" },
  { key: "r3", date: "2026-07-18", category: "certification" },
  { key: "r4", date: "2026-08-05", category: "standards" },
  { key: "r5", date: "2026-08-20", category: "bis" },
  { key: "r6", date: "2026-09-15", category: "upcoming" },
  { key: "r7", date: "2026-10-01", category: "upcoming" },
  { key: "r8", date: "2026-11-20", category: "certification" },
  { key: "r9", date: "2026-12-05", category: "standards" },
  { key: "r10", date: "2027-01-10", category: "international" },
];
