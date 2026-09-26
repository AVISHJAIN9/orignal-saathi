import {
  ACTIVE_STANDARDS_COUNT,
  INITIAL_STANDARDS_SAMPLE,
  TOTAL_STANDARDS_COUNT,
  type FullStandardItem,
} from "./seed-standards-data";

export { ACTIVE_STANDARDS_COUNT, TOTAL_STANDARDS_COUNT };

export interface StandardDatum {
  key: string;
  standardNumber: string;
  categoryKey: string;
  id?: string;
  title?: string;
  description?: string;
  categoryLabel?: string;
  status?: "Active" | "Withdrawn" | string;
}

export const MOCK_STANDARDS: StandardDatum[] = [
  {
    key: "is4151",
    standardNumber: "IS 4151",
    categoryKey: "helmets",
    title: "Protective Helmets for Two-Wheeler Riders — Specification",
    categoryLabel: "Helmets",
  },
  {
    key: "is302",
    standardNumber: "IS 302",
    categoryKey: "appliances",
    title: "Safety of Household Electrical Appliances",
    categoryLabel: "Appliances",
  },
  {
    key: "is1417",
    standardNumber: "IS 1417",
    categoryKey: "gold",
    title: "Grades of Gold and Gold Alloys for Hallmarking",
    categoryLabel: "Gold Jewellery",
  },
  {
    key: "is14543",
    standardNumber: "IS 14543",
    categoryKey: "water",
    title: "Packaged Natural Mineral Water — Specification",
    categoryLabel: "Packaged Water",
  },
  {
    key: "is2347",
    standardNumber: "IS 2347",
    categoryKey: "cookers",
    title: "Aluminium Pressure Cookers — Specification",
    categoryLabel: "Pressure Cookers",
  },
  {
    key: "is9873",
    standardNumber: "IS 9873 (Part 1):2025",
    categoryKey: "toys",
    title: "Safety of Toys: Mechanical and Physical Properties",
    categoryLabel: "Toys",
  },
];

const ALL_STANDARDS_MAP = new Map<string, StandardDatum>();

for (const s of MOCK_STANDARDS) {
  ALL_STANDARDS_MAP.set(s.key, s);
}

for (const s of INITIAL_STANDARDS_SAMPLE) {
  if (!ALL_STANDARDS_MAP.has(s.key)) {
    ALL_STANDARDS_MAP.set(s.key, s);
  }
  if (s.id) {
    ALL_STANDARDS_MAP.set(`is-${s.id}`, s);
  }
}

export function registerAllStandards(standards: StandardDatum[]) {
  for (const s of standards) {
    ALL_STANDARDS_MAP.set(s.key, s);
    if (s.id) {
      ALL_STANDARDS_MAP.set(`is-${s.id}`, s);
    }
  }
}

// The slug used in /standards/$standardKey
export function getStandardByKey(key: string): StandardDatum | undefined {
  return (
    ALL_STANDARDS_MAP.get(key) ||
    MOCK_STANDARDS.find((standard) => standard.key === key)
  );
}

// Reverse lookup by standard number
export function getStandardKeyByNumber(
  standardNumber: string,
): string | undefined {
  for (const standard of ALL_STANDARDS_MAP.values()) {
    if (standard.standardNumber === standardNumber) return standard.key;
  }
  return MOCK_STANDARDS.find(
    (standard) => standard.standardNumber === standardNumber,
  )?.key;
}
