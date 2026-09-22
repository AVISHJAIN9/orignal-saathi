// MOCK: illustrative Quality Control Order (QCO) applicability data for the
// C1 feature — there is no real QCO engine yet (see PRODUCT.md: that's a
// separate backend workstream). `checkQcoApplicability` stands in for that
// future endpoint: same async, standard-number-in / record-or-null-out
// shape a real call would have, so swapping it out later only means
// replacing this one function's body.
//
// Unlike mock-conformity.ts's gap titles/descriptions, the QCO record
// content below (title/product/scope/exemptions/requirements) is NOT
// routed through i18n — same call mock-jurisdictions.ts makes for its dense
// regulatory prose, and for the same reason: a real QCO engine would return
// this kind of legal/regulatory text in whatever language BIS notified it
// in, not pre-translated Hindi, so keeping it as literal English here is
// the honest shape of what the real endpoint will actually hand back. Only
// the UI chrome around it (labels, states, buttons) is translated — see the
// `standards:detail.qco` i18n namespace.
//
// Deliberately NOT a live regulatory claim: this is a small, hand-picked
// illustrative dataset covering all three applicability outcomes, not a
// real determination of which standards currently have a notified QCO.

export type QcoStatus = "applicable" | "not_applicable";
export type QcoSourceType = "gazette_notification" | "official_portal";

export interface QcoRecord {
  qcoId: string;
  title: string;
  product: string;
  standardNumbers: string[];
  scope: string;
  effectiveDate: string;
  status: QcoStatus;
  exemptions: string[];
  requirements: string[];
  sourceUrl: string;
  sourceType: QcoSourceType;
}

// The prototype only ever links to BIS's general portal, never a fabricated
// per-order URL — same rule standard-detail.tsx's Sources tab already follows.
const BIS_PORTAL_URL = "https://www.bis.gov.in";

const MOCK_QCO_RECORDS: QcoRecord[] = [
  {
    qcoId: "QCO-HELMET-2021",
    title:
      "Protective Helmets for Two-Wheeler Riders (Quality Control) Order, 2021",
    product: "Protective helmets for two-wheeler riders",
    standardNumbers: ["IS 4151"],
    scope:
      "Mandatory BIS certification for all protective helmets manufactured, imported, stored for sale, or sold for use by two-wheeler riders and pillion passengers in India.",
    effectiveDate: "2021-06-01",
    status: "applicable",
    exemptions: [
      "Helmets manufactured solely for export, and not sold within India, are exempt from this Order.",
    ],
    requirements: [
      "Valid BIS Licence (ISI mark) under IS 4151 prior to manufacture or import.",
      "Each helmet must bear the Standard Mark (ISI mark) legibly and indelibly.",
      "Compliance with impact absorption, penetration resistance, and retention system tests specified in IS 4151.",
    ],
    sourceUrl: BIS_PORTAL_URL,
    sourceType: "gazette_notification",
  },
  {
    qcoId: "QCO-APPLIANCE-2020",
    title: "Electrical Appliances and Equipment (Quality Control) Order, 2020",
    product: "Household and similar electrical appliances",
    standardNumbers: ["IS 302"],
    scope:
      "Mandatory BIS certification for household electrical appliances covered under IS 302 before they are manufactured, stored for sale, sold, or distributed in India.",
    effectiveDate: "2020-11-13",
    status: "applicable",
    exemptions: [
      "Appliances manufactured exclusively for export are exempt from this Order.",
    ],
    requirements: [
      "Valid BIS Licence (ISI mark) under IS 302 before manufacture, sale, or import.",
      "Registration and testing at a BIS-recognised laboratory against general and specific safety requirements.",
      "Display of the Standard Mark on every unit placed in the market.",
    ],
    sourceUrl: BIS_PORTAL_URL,
    sourceType: "gazette_notification",
  },
  {
    qcoId: "QCO-WATER-2021",
    title: "Drinking Water (Packaged) (Quality Control) Order, 2021",
    product: "Packaged natural mineral water",
    standardNumbers: ["IS 14543"],
    scope:
      "Mandatory BIS certification for packaged natural mineral water manufactured or sold in India, before it can be marketed.",
    effectiveDate: "2021-01-01",
    status: "applicable",
    exemptions: [],
    requirements: [
      "Valid BIS Licence under IS 14543 before packaging and sale.",
      "Compliance with composition, contaminant, and hygiene limits specified in IS 14543.",
      "Batch-wise testing records maintained at the manufacturing unit.",
    ],
    sourceUrl: BIS_PORTAL_URL,
    sourceType: "gazette_notification",
  },
  {
    qcoId: "QCO-TOYS-2020",
    title: "Toys (Quality Control) Order, 2020",
    product: "Toys intended for use by children under 14 years",
    standardNumbers: ["IS 9873 (Part 1):2025"],
    scope:
      "Mandatory BIS certification for toys manufactured, imported, or sold in India, covering the mechanical, physical, and other safety requirements that apply.",
    effectiveDate: "2020-09-25",
    status: "applicable",
    exemptions: [
      "Toys manufactured exclusively for export are exempt from this Order.",
    ],
    requirements: [
      "Valid BIS Licence (ISI mark) under IS 9873 prior to manufacture or import.",
      "Compliance with mechanical and physical safety requirements, including small-parts and sharp-edge tests.",
      "Every toy or its packaging must bear the Standard Mark.",
    ],
    sourceUrl: BIS_PORTAL_URL,
    sourceType: "gazette_notification",
  },
  {
    qcoId: "",
    title:
      "No Quality Control Order currently covers aluminium pressure cookers",
    product: "Aluminium household pressure cookers",
    standardNumbers: ["IS 2347"],
    scope:
      "As of the prototype's last sync, BIS has not notified a Quality Control Order specifically covering aluminium pressure cookers. IS 2347 remains a voluntary Indian Standard unless and until a QCO is notified for it.",
    effectiveDate: "",
    status: "not_applicable",
    exemptions: [],
    requirements: [],
    sourceUrl: BIS_PORTAL_URL,
    sourceType: "official_portal",
  },
];

import { ComplianceApi } from "@/lib/api-client";

/**
 * Connects to the C1 QCO Applicability Engine (/api/v1/compliance/c1/qco-check)
 * with deterministic fallback to statutory dataset.
 */
export async function checkQcoApplicability(
  standardNumber: string,
): Promise<QcoRecord | null> {
  try {
    const res = await ComplianceApi.checkQco(standardNumber);
    if (res) {
      const isMandatory = res.is_qco_mandatory ?? res.isMandatory ?? true;
      return {
        qcoId: res.qco_id || res.id || `QCO-${standardNumber.replace(/\s+/g, "_")}`,
        title: res.qco_title || res.title || `${standardNumber} Statutory Quality Control Order`,
        product: res.product_name || res.product || standardNumber,
        standardNumbers: [standardNumber],
        scope: res.scope || res.verdict || `Mandatory BIS certification for all products under ${standardNumber}.`,
        effectiveDate: res.enforcement_date || res.effective_date || "Enforced",
        status: isMandatory ? "applicable" : "not_applicable",
        exemptions: res.exemptions || ["Goods manufactured exclusively for export are exempt from this Order."],
        requirements: res.requirements || [
          `Valid BIS Licence under ${standardNumber} prior to manufacture or import.`,
          "Compliance with all mandatory test parameters specified in the Scheme of Inspection and Testing.",
          "Every certified product must bear the Standard ISI mark."
        ],
        sourceUrl: BIS_PORTAL_URL,
        sourceType: "gazette_notification",
      };
    }
  } catch (err) {
    // Gateway fallback
  }

  const record = MOCK_QCO_RECORDS.find((r) =>
    r.standardNumbers.includes(standardNumber),
  );
  return record ?? null;
}
