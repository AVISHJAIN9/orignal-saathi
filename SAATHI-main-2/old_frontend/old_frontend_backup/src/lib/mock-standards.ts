// MOCK: the real seed standards already cited elsewhere in the app (see
// src/i18n/locales/*/conversation.json). titleKey/categoryKey resolve
// against the standards/admin i18n namespaces so titles and category
// labels stay translated and in sync with the citations shown in chat.

export interface StandardDatum {
  key: string;
  standardNumber: string;
  categoryKey: string;
}

export const MOCK_STANDARDS: StandardDatum[] = [
  { key: "is4151", standardNumber: "IS 4151", categoryKey: "helmets" },
  { key: "is302", standardNumber: "IS 302", categoryKey: "appliances" },
  { key: "is1417", standardNumber: "IS 1417", categoryKey: "gold" },
  { key: "is14543", standardNumber: "IS 14543", categoryKey: "water" },
  { key: "is2347", standardNumber: "IS 2347", categoryKey: "cookers" },
  {
    key: "is9873",
    standardNumber: "IS 9873 (Part 1):2025",
    categoryKey: "toys",
  },
];

// The slug used in /standards/$standardKey — same `key` every other lookup
// in this app already uses (i18n, mock-conformity, mock-bot), so a URL never
// needs to encode a standard number like "IS 9873 (Part 1):2025".
export function getStandardByKey(key: string): StandardDatum | undefined {
  return MOCK_STANDARDS.find((standard) => standard.key === key);
}

// Reverse lookup, e.g. for mock-notifications.ts's S4 requirement-update
// notifications, which are derived from mock-revisions.ts records keyed
// by `standardNumber` ("IS 14543") and need the catalogue `key`
// ("is14543") to deep-link into /standards/$standardKey.
export function getStandardKeyByNumber(
  standardNumber: string,
): string | undefined {
  return MOCK_STANDARDS.find(
    (standard) => standard.standardNumber === standardNumber,
  )?.key;
}
