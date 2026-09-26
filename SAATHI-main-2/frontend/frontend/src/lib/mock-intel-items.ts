// MOCK: illustrative news-feed items, not live ones. headline/summary
// resolve against the intel i18n namespace (items.<key>.*) the same way
// mock-standards.ts resolves titles against the standards namespace.
// timestamp is a pre-baked relative label (see mock-notifications.ts for
// why: this is demo data, not a real clock to compute relative time from).

export type IntelCategory =
  "bis" | "standards" | "certification" | "international" | "industry";

export interface IntelItemDatum {
  key: string;
  category: IntelCategory;
  source: string;
}

// Roughly newest-first, two items per category so every filter has
// something to show.
export const MOCK_INTEL_ITEMS: IntelItemDatum[] = [
  { key: "i1", category: "bis", source: "BIS Press Release" },
  { key: "i2", category: "certification", source: "Economic Times" },
  { key: "i3", category: "international", source: "Reuters India" },
  { key: "i4", category: "standards", source: "PIB India" },
  { key: "i5", category: "industry", source: "Business Standard" },
  { key: "i6", category: "bis", source: "BIS Press Release" },
  { key: "i7", category: "certification", source: "CII Bulletin" },
  { key: "i8", category: "standards", source: "Mint" },
  { key: "i9", category: "international", source: "Reuters India" },
  { key: "i10", category: "industry", source: "Economic Times" },
];
