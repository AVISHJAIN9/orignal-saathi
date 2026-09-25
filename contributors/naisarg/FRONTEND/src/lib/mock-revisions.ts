// MOCK: illustrative standard-revision comparison data for the C2 feature
// — there is no real revision-comparison engine yet (see PRODUCT.md: that's
// a separate backend workstream). `compareRevisions` stands in for a future
// `POST /api/v1/standards/revision/compare` endpoint: same async,
// standard+from+to-in / outcome-out shape a real call would have, so
// swapping it out later only means replacing this one function's body.
//
// Same i18n rule as mock-qco.ts: the domain content below (clauseTitle,
// whatChanged, whyItMatters, previousValue/currentValue) is NOT routed
// through i18n — a real revision-diff engine would return this kind of
// regulatory text as-is, not pre-translated Hindi, so literal English here
// is the honest shape of what the real endpoint will actually hand back.
// Only the UI chrome around it (labels, states, buttons) is translated —
// see the `standards:detail.revision` i18n namespace.
//
// The core honesty rule this module exists to enforce: NEVER fabricate a
// comparison. `compareRevisions` only ever returns one of four outcomes,
// and three of them are various shades of "we can't reliably show you a
// diff here" — deliberately distinct from each other (see the outcome
// type below) so the UI never has to guess, or paper over a gap with an
// invented change.

export type ChangeType =
  | "added"
  | "removed"
  | "modified"
  | "clarified"
  | "limit_changed"
  | "test_method_changed";

export interface RevisionEvidence {
  page: number;
}

export interface RevisionChange {
  key: string;
  changeType: ChangeType;
  clause: string;
  clauseTitle: string;
  parameter: string;
  previousValue: string;
  currentValue: string;
  whatChanged: string;
  whyItMatters: string;
  highImpact: boolean;
  previousEvidence: RevisionEvidence;
  currentEvidence: RevisionEvidence;
}

export interface RevisionRecord {
  standardNumber: string;
  fromRevision: string;
  toRevision: string;
  changes: RevisionChange[];
  // True when this comparison covers a hand-picked subset of the real
  // differences between editions, not an exhaustive clause-by-clause diff
  // — always true in this prototype, surfaced in the UI rather than
  // implied to be complete.
  partial: boolean;
}

export type RevisionComparisonOutcome =
  | { status: "compared"; record: RevisionRecord }
  | { status: "single_revision"; onlyRevision: string }
  | { status: "unverified" }
  | { status: "extraction_insufficient" };

interface RevisionInventoryEntry {
  standardNumber: string;
  // Editions with confirmed, text-extractable source content.
  verified: string[];
  // Editions BIS/the prototype's corpus references but whose source text
  // hasn't been confirmed yet — metadata-only, e.g. a listed amendment the
  // full text of which hasn't been ingested.
  unverified: string[];
  // Editions that ARE verified to exist but whose only available source is
  // a scanned/image-only document — real, just not reliably extractable
  // into clause-level text to diff. A different failure mode from
  // `unverified`, which is about the edition's existence/metadata, not the
  // quality of a source that does exist.
  extractionInsufficient: string[];
}

const REVISION_INVENTORY: RevisionInventoryEntry[] = [
  {
    standardNumber: "IS 14543",
    verified: ["2004", "2021"],
    unverified: [],
    extractionInsufficient: [],
  },
  {
    standardNumber: "IS 4151",
    verified: ["2015"],
    unverified: [],
    extractionInsufficient: [],
  },
  {
    standardNumber: "IS 302",
    verified: ["2019"],
    unverified: ["2023"],
    extractionInsufficient: [],
  },
  {
    standardNumber: "IS 2347",
    verified: ["1994", "2017"],
    unverified: [],
    extractionInsufficient: ["2017"],
  },
  // IS 1417 and IS 9873 deliberately have no entry: this prototype has no
  // revision history at all for them yet, which the "From"/"To" pickers
  // surface honestly as empty rather than offering a comparison to run.
];

// Exported (not just module-private) so S4's requirement-update
// notifications (mock-notifications.ts) can derive their seed data
// directly from these same records instead of hand-copying the WATER
// record's changes into a second, disconnected mock.
export const MOCK_REVISION_RECORDS: RevisionRecord[] = [
  {
    standardNumber: "IS 14543",
    fromRevision: "2004",
    toRevision: "2021",
    partial: true,
    changes: [
      {
        key: "is14543-tds-limit",
        changeType: "limit_changed",
        clause: "6.2",
        clauseTitle: "Total Dissolved Solids (TDS)",
        parameter: "Maximum permissible TDS",
        previousValue: "≤ 500 mg/L",
        currentValue: "≤ 300 mg/L",
        whatChanged:
          "The maximum permissible limit for Total Dissolved Solids was tightened from 500 mg/L to 300 mg/L.",
        whyItMatters:
          "Products certified under the earlier edition may exceed the new, stricter limit and could fail testing under IS 14543:2021 without reformulation.",
        highImpact: true,
        previousEvidence: { page: 12 },
        currentEvidence: { page: 14 },
      },
      {
        key: "is14543-batch-traceability",
        changeType: "added",
        clause: "8.4",
        clauseTitle: "Batch Traceability Marking",
        parameter: "Batch/lot code on label",
        previousValue: "Not specified",
        currentValue:
          "Mandatory batch/lot code printed on every container label.",
        whatChanged:
          "A new clause requiring batch traceability marking was added.",
        whyItMatters:
          "Manufacturers must add a batch/lot code to labelling; products without it would not conform to the current edition.",
        highImpact: true,
        previousEvidence: { page: 15 },
        currentEvidence: { page: 17 },
      },
      {
        key: "is14543-pilot-batch-annex",
        changeType: "removed",
        clause: "Annex C",
        clauseTitle: "Sampling Plan for Pilot Bottling Runs",
        parameter: "Pilot-batch sampling procedure",
        previousValue:
          "Separate, reduced sampling procedure for pilot/trial bottling runs.",
        currentValue: "Removed — provision no longer present.",
        whatChanged:
          "Annex C, covering a separate sampling procedure for pilot bottling runs, has been removed in the current edition.",
        whyItMatters:
          "Manufacturers relying on the old pilot-batch sampling allowance must now follow the standard sampling procedure in Clause 7 for all batches, including trial runs.",
        highImpact: false,
        previousEvidence: { page: 22 },
        currentEvidence: { page: 20 },
      },
      {
        key: "is14543-labelling-qr",
        changeType: "modified",
        clause: "9.1",
        clauseTitle: "Labelling Requirements",
        parameter: "Mandatory label declarations",
        previousValue: "Brand name, source, TDS value, batch number.",
        currentValue:
          "Brand name, source, TDS value, batch number, and a QR code linking to the BIS Compliance Rating System (CRS) portal.",
        whatChanged:
          "Labelling requirements now additionally require a QR code linking to the BIS CRS portal.",
        whyItMatters:
          "Existing label artwork must be updated to include the QR code before the product can be sold under the current edition.",
        highImpact: true,
        previousEvidence: { page: 16 },
        currentEvidence: { page: 17 },
      },
      {
        key: "is14543-tds-test-method",
        changeType: "test_method_changed",
        clause: "Annex A",
        clauseTitle: "Determination of Total Dissolved Solids",
        parameter: "TDS test method",
        previousValue: "Gravimetric method per IS 3025 (Part 16) only.",
        currentValue:
          "Gravimetric method per IS 3025 (Part 16), plus an electrical-conductivity cross-check per IS 3025 (Part 14).",
        whatChanged:
          "An additional conductivity cross-check test method was introduced alongside the existing gravimetric method for verifying TDS.",
        whyItMatters:
          "Laboratories must now perform an additional conductivity test step; test reports citing only the old method may be considered incomplete.",
        highImpact: false,
        previousEvidence: { page: 24 },
        currentEvidence: { page: 26 },
      },
      {
        key: "is14543-definition-clarified",
        changeType: "clarified",
        clause: "4.1",
        clauseTitle: "Definitions",
        parameter: "Definition of “packaged natural mineral water”",
        previousValue:
          "Water from a protected underground source, packaged at source without alteration to composition.",
        currentValue:
          "Water from a protected underground source, packaged at or near the source without alteration to its essential composition (editorial clarification of “at source”).",
        whatChanged:
          "The definition was reworded to clarify that packaging may occur “at or near” the source, and that only the water's essential composition must remain unaltered.",
        whyItMatters:
          "This is an editorial clarification only — it does not change any testing or certification requirement.",
        highImpact: false,
        previousEvidence: { page: 4 },
        currentEvidence: { page: 4 },
      },
    ],
  },
];

/**
 * Which revisions BIS/the prototype's corpus knows about for a standard,
 * split by whether their source content is verified. Feeds the "From"/"To"
 * pickers — an empty result (both arrays) means this prototype has no
 * revision history at all for the standard yet, which the UI shows as its
 * own honest empty state rather than as one of the four comparison outcomes
 * below (there's nothing to even attempt comparing).
 */
export function getKnownRevisions(standardNumber: string): {
  verified: string[];
  unverified: string[];
} {
  const entry = REVISION_INVENTORY.find(
    (e) => e.standardNumber === standardNumber,
  );
  if (!entry) return { verified: [], unverified: [] };
  return { verified: entry.verified, unverified: entry.unverified };
}

/**
 * Stands in for the real revision-comparison endpoint. Never fabricates a
 * diff: resolves to exactly one of the four outcomes on
 * `RevisionComparisonOutcome`, checked in order of "how little we can
 * trust a comparison here" —
 *   1. fewer than two known revisions at all -> `single_revision`
 *   2. either selected revision's source is scanned/image-only ->
 *      `extraction_insufficient`
 *   3. either selected revision is metadata-only (unverified) ->
 *      `unverified`
 *   4. otherwise, the pre-built comparison for that exact revision pair.
 *
 * The final fallback (a verified pair with no pre-built comparison) isn't
 * reachable through the seeded picker data — `getKnownRevisions` only ever
 * offers pairs this module actually has a `RevisionRecord` for — but is
 * handled the same honest way rather than left to throw or fabricate one.
 */
export function compareRevisions(
  standardNumber: string,
  fromRevision: string,
  toRevision: string,
): Promise<RevisionComparisonOutcome> {
  const COMPARE_DELAY_MS = 1400;
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const entry = REVISION_INVENTORY.find(
        (e) => e.standardNumber === standardNumber,
      );
      const knownCount = entry
        ? entry.verified.length + entry.unverified.length
        : 0;

      if (knownCount <= 1) {
        const onlyRevision =
          entry?.verified[0] ?? entry?.unverified[0] ?? fromRevision;
        resolve({ status: "single_revision", onlyRevision });
        return;
      }

      const isExtractionInsufficient =
        entry?.extractionInsufficient.includes(fromRevision) ||
        entry?.extractionInsufficient.includes(toRevision);
      if (isExtractionInsufficient) {
        resolve({ status: "extraction_insufficient" });
        return;
      }

      const isUnverified =
        entry?.unverified.includes(fromRevision) ||
        entry?.unverified.includes(toRevision);
      if (isUnverified) {
        resolve({ status: "unverified" });
        return;
      }

      const record = MOCK_REVISION_RECORDS.find(
        (r) =>
          r.standardNumber === standardNumber &&
          r.fromRevision === fromRevision &&
          r.toRevision === toRevision,
      );

      if (record) {
        resolve({ status: "compared", record });
        return;
      }

      resolve({ status: "extraction_insufficient" });
    }, COMPARE_DELAY_MS);
  });
}
