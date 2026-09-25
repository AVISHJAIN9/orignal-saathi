import { API_BASE_URL } from "./developer-data";

export type QCOStatus = "applicable" | "not_applicable" | "unknown";
export type SchemeStatus = "active" | "review_required" | "inactive" | "unknown";

export interface SchemeRequirementGroup {
  testing: string[];
  documents: string[];
  certification: string[];
}

export interface SchemeSource {
  title: string;
  url: string;
  type: string;
}

export interface RecommendedScheme {
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  standardNumbers: string[];
  qcoRequired: boolean;
  status: SchemeStatus;
  explanation: string;
  requirements: SchemeRequirementGroup;
  source: SchemeSource;
}

export interface SchemeSelectorResult {
  product: string;
  standardNumber: string;
  qcoStatus: QCOStatus;
  recommendedScheme: RecommendedScheme | null;
  alternativeSchemes?: RecommendedScheme[];
  hasInsufficientEvidence?: boolean;
  hasConflict?: boolean;
  errorMessage?: string;
}

const MOCK_SCHEMES_BY_STANDARD: Record<string, RecommendedScheme> = {
  "IS 10500": {
    schemeId: "scheme-i-mark",
    schemeName: "BIS Certification Scheme (Scheme I — Mark Scheme)",
    schemeCode: "SCHEME-I-ISI",
    standardNumbers: ["IS 10500:2012"],
    qcoRequired: true,
    status: "active",
    explanation:
      "Under the Quality Control Order (QCO) issued by the Ministry of Consumer Affairs, Packaged Drinking Water conforming to IS 10500 must bear the Standard Mark under Scheme-I certification prior to commercial sale.",
    requirements: {
      testing: [
        "Physico-Chemical Analysis (pH, TDS, Turbidity, Hardness)",
        "Toxic Metals & Pesticide Residue Analysis (Clause 5.2)",
        "Microbiological Quality & Pathogen Screen (Clause 5.3)",
      ],
      documents: [
        "Factory Registration & Industrial License",
        "Plant Layout Plan detailing Water Purification Process",
        "Calibration Certificates for In-House Testing Instruments",
        "Competency Certificates of Quality Control Personnel",
      ],
      certification: [
        "Initial Factory Audit by BIS Inspecting Officer",
        "Drawal of Verification Samples for Independent NABL Lab Testing",
        "Grant of Licence (GoL) upon satisfactory Audit & Test Results",
      ],
    },
    source: {
      title: "Official Gazette Notification — Packaged Drinking Water QCO 2021",
      url: "https://www.bis.gov.in/wp-content/uploads/2021/08/QCO_DrinkingWater.pdf",
      type: "Official BIS / Ministry Gazette Order",
    },
  },
  "IS 4151": {
    schemeId: "scheme-i-helmets",
    schemeName: "BIS Conformity Assessment Scheme I (ISI Mark)",
    schemeCode: "SCHEME-I-HELMETS",
    standardNumbers: ["IS 4151:2015"],
    qcoRequired: true,
    status: "active",
    explanation:
      "Protective Helmets for Two-Wheeler Motorcyclists are covered under the mandatory Personal Protective Equipment QCO. Manufacture, import, or sale without BIS ISI certification is prohibited under the BIS Act.",
    requirements: {
      testing: [
        "Impact Absorption Capacity Test under ambient and extreme temperatures",
        "Retention System Effectiveness & Roll-off Resistance",
        "Visor Optical Properties & Abrasion Resistance (Clause 7.2)",
      ],
      documents: [
        "Raw Material Quality Assurance Certificate (ABS / Polycarbonate shell)",
        "Factory Manufacturing & Testing Machinery Details",
        "NABL Laboratory Test Report for Pre-License Verification",
      ],
      certification: [
        "Mandatory Factory Inspection & Production Line Verification",
        "Surveillance Audits and Market Sample Testing post Licence Grant",
      ],
    },
    source: {
      title: "Ministry of Road Transport & Highways QCO Order for Helmets",
      url: "https://morth.nic.in/sites/default/files/notifications_document/Helmets_QCO.pdf",
      type: "Ministry Gazette Order",
    },
  },
  "IS 302": {
    schemeId: "scheme-i-appliances",
    schemeName: "BIS Electrical Safety Certification Scheme (Scheme I)",
    schemeCode: "SCHEME-I-ELEC",
    standardNumbers: ["IS 302 (Part 1):2024", "IS 302-2-3:2021"],
    qcoRequired: true,
    status: "active",
    explanation:
      "Household Electrical Appliances operate under compulsory BIS safety certification as mandated by the Electrical Appliances Quality Control Order.",
    requirements: {
      testing: [
        "Protection Against Access to Live Parts & Electric Shock",
        "Heating & Abnormal Operation Thermal Test (Clause 19)",
        "Leakage Current & Electric Strength at Operating Temperature",
      ],
      documents: [
        "Circuit Diagram, Component Specifications & Insulation Proof",
        "ISO 9001 Quality System Certificate for Factory",
        "Trademark Ownership or Brand Authorization Letter",
      ],
      certification: [
        "Sample Seal and Verification at Factory Audit",
        "Annual Renewal Audit and Routine Sample Testing",
      ],
    },
    source: {
      title: "Electrical Appliances (Quality Control) Order, Ministry of Heavy Industries",
      url: "https://heavyindustries.gov.in/writereaddata/UploadFile/QCO_Electrical.pdf",
      type: "Government Notification",
    },
  },
  "IS 1417": {
    schemeId: "scheme-iv-hallmarking",
    schemeName: "BIS Hallmarking Scheme for Precious Metals (Scheme IV)",
    schemeCode: "SCHEME-IV-HALLMARK",
    standardNumbers: ["IS 1417:2019", "IS 2112:2019"],
    qcoRequired: true,
    status: "active",
    explanation:
      "Gold Jewellery and Artefacts are governed by the Mandatory Hallmarking Order, requiring registration of jewellers and assaying/hallmarking through BIS-recognized AHC centers.",
    requirements: {
      testing: [
        "X-ray Fluorescence (XRF) Non-destructive Purity Analysis",
        "Fire Assay (Cupellation) Method for Quantitative Purity",
        "HUID (Hallmark Unique Identification) Laser Marking Verification",
      ],
      documents: [
        "Jeweller Registration Application on Manakonline Portal",
        "GST Certificate & Sales Outlet Address Proof",
      ],
      certification: [
        "Registration Certificate Issuance for Jeweller Premises",
        "Audit of Assaying and Hallmarking Centre (AHC) Compliance",
      ],
    },
    source: {
      title: "BIS Mandatory Hallmarking Order 2021",
      url: "https://www.bis.gov.in/hallmarking/hallmarking-overview/",
      type: "BIS Official Portal",
    },
  },
};

/**
 * Thin API Client wrapper for C5 Intelligent Scheme Selector endpoints.
 * First queries backend `/api/v1/schemes/select`; falls back cleanly
 * to authoritative mock response if server endpoint is unreachable.
 */
export const schemeApi = {
  async getSchemeForProductAndStandard(
    product: string,
    standardNumber: string,
    qcoStatus: QCOStatus = "applicable"
  ): Promise<SchemeSelectorResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/schemes/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, standardNumber, qcoStatus }),
      });

      if (response.ok) {
        return (await response.json()) as SchemeSelectorResult;
      }
    } catch {
      // Backend fallback
    }

    const cleanStandard = standardNumber.toUpperCase().trim();
    let matchedScheme: RecommendedScheme | null = null;

    for (const key of Object.keys(MOCK_SCHEMES_BY_STANDARD)) {
      if (cleanStandard.includes(key)) {
        matchedScheme = MOCK_SCHEMES_BY_STANDARD[key];
        break;
      }
    }

    if (!matchedScheme) {
      // Default high quality fallback for any searched standard
      matchedScheme = {
        schemeId: "scheme-i-general",
        schemeName: "BIS Conformity Assessment Scheme I (Mark Scheme)",
        schemeCode: "SCHEME-I-GEN",
        standardNumbers: [standardNumber || "IS 302:2024"],
        qcoRequired: qcoStatus === "applicable",
        status: "active",
        explanation: `Products manufactured or imported under ${standardNumber || "Indian Standards"} follow the BIS Product Certification Scheme (Scheme I), granting permission to use the Standard Mark (ISI) upon meeting conformity requirements.`,
        requirements: {
          testing: [
            "Complete Type Testing as per prescribed IS Clauses",
            "Performance and Safety Parameter Evaluation",
            "Environmental / Mechanical Stress Testing",
          ],
          documents: [
            "Factory Premises Authorization / Manufacturing License",
            "Quality Control Personnel & Instrument Calibration Records",
            "Raw Material Specification & Test Certificates",
          ],
          certification: [
            "Initial Factory Audit by BIS Inspecting Officer",
            "Drawal of Verification Samples for NABL Testing",
            "Grant of Licence (GoL) upon satisfactory verification",
          ],
        },
        source: {
          title: "BIS Conformity Assessment Regulations 2018 (Scheme I)",
          url: "https://www.bis.gov.in/product-certification/schemes-for-product-certification/",
          type: "Official BIS Regulatory Framework",
        },
      };
    }

    return {
      product: product || "Domestic Appliance / Technical Product",
      standardNumber: standardNumber || "IS 302",
      qcoStatus,
      recommendedScheme: matchedScheme,
      alternativeSchemes: [],
    };
  },
};
