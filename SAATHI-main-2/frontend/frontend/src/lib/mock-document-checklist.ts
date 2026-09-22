// MOCK: S15 — Registration-Specific Document Checklist. This module does
// NOT author a third, parallel BIS requirement list. It only *merges* two
// requirement datasets this repo already has:
//
//   - REQUIREMENTS_BY_STANDARD (mock-registration.ts) — the document keys
//     and labels S3's registration wizard already treats as required for
//     a standard.
//   - REPORT_TEMPLATES (mock-compliance-gaps.ts) — C3's per-requirement
//     data, which already carries a real `mandatory: boolean` flag and a
//     clause/QCO source citation.
//
// A standard only gets a checklist here if it has real data in BOTH
// sources (today: IS 4151, IS 14543) — every other standard in
// MOCK_STANDARDS resolves to `no_checklist_data` rather than a fabricated
// list, same honest-fallback rule as `runGapAnalysis`'s
// `no_requirements_data`.
//
// Tiering:
//   - "required"   — a REQUIREMENTS_BY_STANDARD document (S3 already
//     requires it), OR a mandatory:true compliance-gap requirement whose
//     evidence keywords don't match any REQUIREMENTS_BY_STANDARD document
//     (i.e. C3 expects evidence for it that S3's document list doesn't
//     currently collect — surfaced honestly rather than silently dropped).
//   - "supporting" — a mandatory:false compliance-gap requirement not
//     already covered by a required document (e.g. a calibration
//     certificate, a batch record) — real evidence C3 checks for, but not
//     mandatory for certification.
//   - "conditional" — ONE explicitly-authored rule, commented below,
//     tying the existing "authorization_letter" document to the real
//     `ApplicantDetails.applicantType` field. This is an illustrative,
//     clearly-labeled inference (an individual applicant plausibly has no
//     company signatory to authorize), not a cited BIS clause.

import {
  REQUIREMENTS_BY_STANDARD,
  type ApplicantType,
} from "@/lib/mock-registration";
import { REPORT_TEMPLATES } from "@/lib/mock-compliance-gaps";
import { getStandardByKey } from "@/lib/mock-standards";

export type ChecklistItemTier = "required" | "conditional" | "supporting";

export interface ChecklistItem {
  key: string;
  label: string;
  tier: ChecklistItemTier;
  clause?: string;
  // Only set for tier === "conditional" — explains the (illustrative,
  // non-authoritative) rule that decides whether this item applies.
  conditionalNote?: string;
}

export type ChecklistOutcome =
  | {
      status: "generated";
      standardNumber: string;
      product: string;
      items: ChecklistItem[];
    }
  | { status: "no_checklist_data" };

const CONDITIONAL_ITEM_KEY = "authorization_letter";

const CONDITIONAL_NOTE =
  "Illustrative rule, not a cited BIS clause: an organization (manufacturer, importer, or dealer) applying through an authorized signatory needs this letter; an individual applicant signing their own application does not.";

/**
 * Whether a conditional checklist item applies for a given applicant
 * type. Returns null when no applicant type is known yet (nothing to
 * resolve against) rather than guessing — mirrors the missing_evidence
 * vs. fail distinction mock-compliance-gaps.ts documents: "we don't know"
 * must never collapse into either "applies" or "doesn't apply".
 */
export function resolveConditionalApplicability(
  itemKey: string,
  applicantType: ApplicantType | "",
): boolean | null {
  if (itemKey !== CONDITIONAL_ITEM_KEY) return null;
  if (!applicantType) return null;
  return applicantType !== "individual";
}

function isCoveredByRequiredDocuments(
  evidenceKeywords: string[],
  documents: { key: string; label: string }[],
): boolean {
  return documents.some((doc) => {
    const haystack = `${doc.key} ${doc.label}`.toLowerCase();
    return evidenceKeywords.some((keyword) => haystack.includes(keyword));
  });
}

/**
 * Builds the document checklist for a standard, merging
 * REQUIREMENTS_BY_STANDARD and REPORT_TEMPLATES as described above.
 * Synchronous and side-effect-free — this is a derived view over two
 * already-loaded mock datasets, not a simulated network call.
 */
export function getDocumentChecklist(standardKey: string): ChecklistOutcome {
  const standard = getStandardByKey(standardKey);
  const bundle = REQUIREMENTS_BY_STANDARD[standardKey];
  const template = REPORT_TEMPLATES.find(
    (t) => t.standardNumber === standard?.standardNumber,
  );
  if (!standard || !bundle || !template) return { status: "no_checklist_data" };

  const items: ChecklistItem[] = bundle.documents.map((doc) =>
    doc.key === CONDITIONAL_ITEM_KEY
      ? {
          key: doc.key,
          label: doc.label,
          tier: "conditional",
          conditionalNote: CONDITIONAL_NOTE,
        }
      : { key: doc.key, label: doc.label, tier: "required" },
  );

  for (const requirement of template.requirements) {
    if (
      isCoveredByRequiredDocuments(
        requirement.evidenceKeywords,
        bundle.documents,
      )
    ) {
      continue;
    }
    items.push({
      key: requirement.key,
      label: requirement.requirement,
      tier: requirement.mandatory ? "required" : "supporting",
      clause: requirement.source.clause,
    });
  }

  return {
    status: "generated",
    standardNumber: standard.standardNumber,
    product: template.product,
    items,
  };
}
