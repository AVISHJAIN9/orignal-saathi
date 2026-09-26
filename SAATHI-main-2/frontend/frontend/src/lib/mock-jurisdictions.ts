// MOCK: illustrative India state/UT regulatory reference data, not a live
// feed. What IS real: the BIS office network each entry is built on — the
// Headquarters, 5 Regional Offices and the Branch Offices listed in the
// "Regional & Branch Offices" directory on bis.gov.in (checked September
// 2026), and which states have an office of their own (hasDedicatedOffice).
// What is illustrative: coverageScore (a 0-100 index of local testing and
// certification reach, not an official BIS figure), status tags, and every
// recentUpdates entry — examples of the kind of state-level notice tracked,
// not real events.
//
// Like the earlier cross-border version, this prose is NOT routed through
// the i18n namespace (dense factual strings x 36 regions); the page chrome
// around it is fully translated via the jurisdiction namespace.
//
// coordinates are positions in the India map's viewBox (see
// india-state-paths.ts), projected from each state's primary BIS office
// city — or its capital where there is no office. Where that would stack
// markers (Haryana and Himachal Pradesh by Delhi/Chandigarh, Meghalaya by
// Guwahati) a representative point inside the state is used instead.

export type JurisdictionFilter =
  "all" | "high_relevance" | "active_changes" | "has_office";

export interface RegulatoryUpdate {
  date: string;
  title: string;
  summary: string;
  impact: "High" | "Medium" | "Low";
}

/** India's Zonal Council grouping (Sikkim is in the North Eastern Council). */
export type IndiaZone =
  "North" | "South" | "East" | "West" | "Central" | "Northeast";

export interface JurisdictionData {
  id: string;
  name: string;
  /** Vehicle-registration state/UT code (DL, MH, TN, TG, OD, ...). */
  code: string;
  region: IndiaZone;
  coordinates: { x: number; y: number };
  primaryAuthority: string;
  regulatoryFramework: string;
  standardsEcosystem: string;
  certificationRelevance: string;
  regionalOffice: {
    type:
      "Headquarters" | "Regional Office" | "Branch Office" | "Liaison Coverage";
    description: string;
    coverageScore: number; // 0-100, illustrative
  };
  lastDataUpdate: string;
  status: "active_changes" | "high_relevance" | "standard";
  sectors: string[];
  schemes: string[];
  recentUpdates: RegulatoryUpdate[];
  /** Has its own BIS Regional/Branch Office (vs. served from a neighbour's). */
  hasDedicatedOffice: boolean;
}

/** id of the BIS Headquarters entry — the hub every coverage line starts from. */
export const BIS_HQ_ID = "dl";

export const MOCK_JURISDICTIONS: JurisdictionData[] = [
  {
    id: "dl",
    name: "Delhi",
    code: "DL",
    region: "North",
    coordinates: { x: 191, y: 191 },
    primaryAuthority: "BIS Headquarters & Central Regional Office, New Delhi",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Electronics & IT, Consumer Durables, Hallmarking, Services.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II), FMCS, Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Headquarters",
      description:
        "BIS Headquarters (Manak Bhavan, New Delhi) and the Central Regional Office; Delhi Branch Offices DLBO-I and DLBO-II.",
      coverageScore: 100,
    },
    lastDataUpdate: "This week",
    status: "high_relevance",
    sectors: [
      "Electronics & IT",
      "Consumer Durables",
      "Hallmarking",
      "Services",
    ],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)", "FMCS", "Hallmarking"],
    recentUpdates: [
      {
        date: "12 Sep 2026",
        title: "BIS HQ standards-formulation drafts open for public comment",
        summary:
          "Division Council drafts published centrally for comment by manufacturers and consumer bodies nationwide.",
        impact: "High",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "ch",
    name: "Chandigarh",
    code: "CH",
    region: "North",
    coordinates: { x: 183, y: 146 },
    primaryAuthority: "BIS Northern Regional Office, Chandigarh",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Light Engineering, Tractor & Auto Components, Hosiery.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Regional Office",
      description:
        "Northern Regional Office, with the Chandigarh, Haryana (HRBO) and Panipat (PPBO) Branch Offices operating from the city.",
      coverageScore: 95,
    },
    lastDataUpdate: "Last month",
    status: "high_relevance",
    sectors: ["Light Engineering", "Tractor & Auto Components", "Hosiery"],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "hr",
    name: "Haryana",
    code: "HR",
    region: "North",
    coordinates: { x: 165, y: 181 },
    primaryAuthority: "BIS Faridabad Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Automobiles & Two-Wheelers, Textiles (Panipat), Steel Products.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Faridabad Branch Office (Central Region); the Haryana (HRBO) and Panipat (PPBO) Branch Offices operate from Chandigarh. Marker shown in central Haryana to separate it from Delhi.",
      coverageScore: 82,
    },
    lastDataUpdate: "This week",
    status: "active_changes",
    sectors: [
      "Automobiles & Two-Wheelers",
      "Textiles (Panipat)",
      "Steel Products",
    ],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)"],
    recentUpdates: [
      {
        date: "03 Sep 2026",
        title:
          "Factory surveillance drive for textile and handloom QCO products",
        summary:
          "Illustrative: stepped-up market surveillance of QCO-notified textile goods across Panipat clusters.",
        impact: "Medium",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "hp",
    name: "Himachal Pradesh",
    code: "HP",
    region: "North",
    coordinates: { x: 187, y: 120 },
    primaryAuthority: "BIS Parwanoo Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Pharmaceuticals (Baddi), Electrical Equipment, Horticulture Packaging.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Parwanoo Branch Office (Northern Region). Marker shown in central Himachal to separate it from Chandigarh.",
      coverageScore: 68,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: [
      "Pharmaceuticals (Baddi)",
      "Electrical Equipment",
      "Horticulture Packaging",
    ],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "pb",
    name: "Punjab",
    code: "PB",
    region: "North",
    coordinates: { x: 164, y: 143 },
    primaryAuthority: "Served via BIS Chandigarh offices",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Bicycles & Parts (Ludhiana), Hand Tools, Hosiery.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; served from the Chandigarh offices next door. The Northern Regional Laboratory is at Mohali.",
      coverageScore: 72,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Bicycles & Parts (Ludhiana)", "Hand Tools", "Hosiery"],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "rj",
    name: "Rajasthan",
    code: "RJ",
    region: "North",
    coordinates: { x: 163, y: 227 },
    primaryAuthority: "BIS Jaipur Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Cement, Gems & Jewellery, Dimensional Stone.",
    certificationRelevance:
      "ISI Mark (Scheme I), Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Jaipur Branch Office (Central Region).",
      coverageScore: 70,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Cement", "Gems & Jewellery", "Dimensional Stone"],
    schemes: ["ISI Mark (Scheme I)", "Hallmarking"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "jk",
    name: "Jammu & Kashmir",
    code: "JK",
    region: "North",
    coordinates: { x: 145, y: 104 },
    primaryAuthority: "BIS Jammu & Kashmir Branch Office, Jammu",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Handicrafts, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Jammu & Kashmir Branch Office (Northern Region) and the Jammu Branch Laboratory.",
      coverageScore: 64,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Handicrafts", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "la",
    name: "Ladakh",
    code: "LA",
    region: "North",
    coordinates: { x: 198, y: 74 },
    primaryAuthority: "Served via BIS Jammu & Kashmir Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Construction Materials, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the UT; nearest office is the Jammu & Kashmir Branch Office.",
      coverageScore: 30,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Construction Materials", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "up",
    name: "Uttar Pradesh",
    code: "UP",
    region: "Central",
    coordinates: { x: 265, y: 229 },
    primaryAuthority: "BIS Lucknow, Ghaziabad & Noida Branch Offices",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Electronics (Noida), Leather, Brassware, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II), Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Lucknow, Ghaziabad and Noida Branch Offices (Central Region); the BIS Central Laboratory is at Sahibabad.",
      coverageScore: 88,
    },
    lastDataUpdate: "This week",
    status: "active_changes",
    sectors: ["Electronics (Noida)", "Leather", "Brassware", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)", "Hallmarking"],
    recentUpdates: [
      {
        date: "27 Aug 2026",
        title: "Mobile-handset assembly units in Noida onboarded to CRS",
        summary:
          "Illustrative: CRS registration camp for handset and accessory makers in the Noida cluster.",
        impact: "High",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "uk",
    name: "Uttarakhand",
    code: "UK",
    region: "Central",
    coordinates: { x: 207, y: 155 },
    primaryAuthority: "BIS Dehradun Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Pharmaceuticals, Auto Components.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Dehradun Branch Office (Northern Region).",
      coverageScore: 62,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Pharmaceuticals", "Auto Components"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "mp",
    name: "Madhya Pradesh",
    code: "MP",
    region: "Central",
    coordinates: { x: 195, y: 305 },
    primaryAuthority: "BIS Bhopal Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Soya Processing, Cement, Engineering.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Bhopal Branch Office (Central Region).",
      coverageScore: 66,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Soya Processing", "Cement", "Engineering"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "cg",
    name: "Chhattisgarh",
    code: "CG",
    region: "Central",
    coordinates: { x: 278, y: 347 },
    primaryAuthority: "BIS Raipur Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem: "Key manufacturing clusters: Steel, Power Equipment.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Raipur Branch Office (Eastern Region).",
      coverageScore: 60,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Steel", "Power Equipment"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "wb",
    name: "West Bengal",
    code: "WB",
    region: "East",
    coordinates: { x: 410, y: 319 },
    primaryAuthority: "BIS Eastern Regional Office, Kolkata",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Jute Products, Engineering Goods, Leather.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II), Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Regional Office",
      description:
        "Eastern Regional Office and Kolkata Branch Office; Eastern Regional Laboratory at Kolkata.",
      coverageScore: 92,
    },
    lastDataUpdate: "Last month",
    status: "high_relevance",
    sectors: ["Jute Products", "Engineering Goods", "Leather"],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)", "Hallmarking"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "br",
    name: "Bihar",
    code: "BR",
    region: "East",
    coordinates: { x: 347, y: 255 },
    primaryAuthority: "BIS Patna Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Food Processing, Construction Materials.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Patna Branch Office (Eastern Region) and the Patna Branch Laboratory.",
      coverageScore: 62,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Food Processing", "Construction Materials"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "jh",
    name: "Jharkhand",
    code: "JH",
    region: "East",
    coordinates: { x: 368, y: 314 },
    primaryAuthority: "BIS Jamshedpur Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem: "Key manufacturing clusters: Steel, Auto Components.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Jamshedpur Branch Office (Eastern Region).",
      coverageScore: 63,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Steel", "Auto Components"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "od",
    name: "Odisha",
    code: "OD",
    region: "East",
    coordinates: { x: 360, y: 367 },
    primaryAuthority: "BIS Bhubaneswar Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Aluminium, Steel, Seafood.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Bhubaneswar Branch Office (Eastern Region).",
      coverageScore: 64,
    },
    lastDataUpdate: "This week",
    status: "active_changes",
    sectors: ["Aluminium", "Steel", "Seafood"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [
      {
        date: "18 Aug 2026",
        title: "Consumer awareness camps on ISI-marked household goods",
        summary:
          "Illustrative: district-level awareness sessions on verifying ISI marks via the BIS Care app.",
        impact: "Low",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "an",
    name: "Andaman & Nicobar Islands",
    code: "AN",
    region: "East",
    coordinates: { x: 496, y: 551 },
    primaryAuthority: "Served via the BIS Eastern Region network",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Construction Materials, Seafood.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the UT; served by the Eastern Region network.",
      coverageScore: 25,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Construction Materials", "Seafood"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "mh",
    name: "Maharashtra",
    code: "MH",
    region: "West",
    coordinates: { x: 106, y: 393 },
    primaryAuthority: "BIS Western Regional Office, Mumbai",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Automobiles, Chemicals, Electronics, Pharmaceuticals.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II), FMCS, Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Regional Office",
      description:
        "Western Regional Office and Mumbai (MUBO), Pune and Nagpur Branch Offices; Western Regional Laboratory at Mumbai.",
      coverageScore: 96,
    },
    lastDataUpdate: "This week",
    status: "high_relevance",
    sectors: ["Automobiles", "Chemicals", "Electronics", "Pharmaceuticals"],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)", "FMCS", "Hallmarking"],
    recentUpdates: [
      {
        date: "05 Aug 2026",
        title: "Pune auto-component cluster QCO compliance review",
        summary:
          "Illustrative: sector meeting on upcoming QCO timelines for automotive components.",
        impact: "Medium",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "gj",
    name: "Gujarat",
    code: "GJ",
    region: "West",
    coordinates: { x: 100, y: 310 },
    primaryAuthority:
      "BIS Ahmedabad, Surat, Rajkot & Gandhidham Branch Offices",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Ceramics (Morbi), Chemicals, Diamonds & Jewellery (Surat), Engineering (Rajkot).",
    certificationRelevance:
      "ISI Mark (Scheme I), Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Ahmedabad (I & II), Surat, Rajkot and Gandhidham Branch Offices (Western Region).",
      coverageScore: 86,
    },
    lastDataUpdate: "This week",
    status: "active_changes",
    sectors: [
      "Ceramics (Morbi)",
      "Chemicals",
      "Diamonds & Jewellery (Surat)",
      "Engineering (Rajkot)",
    ],
    schemes: ["ISI Mark (Scheme I)", "Hallmarking"],
    recentUpdates: [
      {
        date: "12 Sep 2026",
        title: "Ceramic tile makers in Morbi briefed on revised IS provisions",
        summary:
          "Illustrative: technical session on testing requirements for ceramic tiles.",
        impact: "Medium",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "ga",
    name: "Goa",
    code: "GA",
    region: "West",
    coordinates: { x: 125, y: 469 },
    primaryAuthority: "Served via the BIS Western Region network",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Pharmaceuticals, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; served by the Western Region network.",
      coverageScore: 40,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Pharmaceuticals", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "dd",
    name: "Dadra & Nagar Haveli and Daman & Diu",
    code: "DD",
    region: "West",
    coordinates: { x: 109, y: 368 },
    primaryAuthority: "Served via BIS Surat & Mumbai offices",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Plastics, Textiles, Packaging.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the UT; nearest offices are Surat and Mumbai.",
      coverageScore: 45,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Plastics", "Textiles", "Packaging"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "tn",
    name: "Tamil Nadu",
    code: "TN",
    region: "South",
    coordinates: { x: 251, y: 520 },
    primaryAuthority: "BIS Southern Regional Office, Chennai",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Automobiles, Textiles (Tiruppur), Pumps & Motors (Coimbatore), Electronics.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II), Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Regional Office",
      description:
        "Southern Regional Office and Chennai, Coimbatore and Madurai Branch Offices; Southern Regional Laboratory at Chennai.",
      coverageScore: 95,
    },
    lastDataUpdate: "This week",
    status: "high_relevance",
    sectors: [
      "Automobiles",
      "Textiles (Tiruppur)",
      "Pumps & Motors (Coimbatore)",
      "Electronics",
    ],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)", "Hallmarking"],
    recentUpdates: [
      {
        date: "03 Sep 2026",
        title:
          "Pump and motor makers in Coimbatore briefed on energy-efficiency standards",
        summary:
          "Illustrative: cluster workshop on testing and marking requirements.",
        impact: "Medium",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "ka",
    name: "Karnataka",
    code: "KA",
    region: "South",
    coordinates: { x: 199, y: 523 },
    primaryAuthority: "BIS Bengaluru & Hubli Branch Offices",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Electronics & IT Hardware, Aerospace, Machine Tools.",
    certificationRelevance:
      "CRS (Scheme II), ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Bengaluru and Hubli Branch Offices (Southern Region) and the Bangalore Branch Laboratory.",
      coverageScore: 84,
    },
    lastDataUpdate: "This week",
    status: "active_changes",
    sectors: ["Electronics & IT Hardware", "Aerospace", "Machine Tools"],
    schemes: ["CRS (Scheme II)", "ISI Mark (Scheme I)"],
    recentUpdates: [
      {
        date: "27 Aug 2026",
        title: "IT-hardware importers reminded of CRS labelling requirements",
        summary:
          "Illustrative: outreach to Bengaluru distributors on CRS registration display.",
        impact: "High",
      },
    ],
    hasDedicatedOffice: true,
  },
  {
    id: "tg",
    name: "Telangana",
    code: "TG",
    region: "South",
    coordinates: { x: 216, y: 429 },
    primaryAuthority: "BIS Hyderabad Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Pharmaceuticals, Electronics, Defence Manufacturing.",
    certificationRelevance:
      "ISI Mark (Scheme I), CRS (Scheme II) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Hyderabad Branch Office (Southern Region) and the Hyderabad Branch Laboratory.",
      coverageScore: 78,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Pharmaceuticals", "Electronics", "Defence Manufacturing"],
    schemes: ["ISI Mark (Scheme I)", "CRS (Scheme II)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "ap",
    name: "Andhra Pradesh",
    code: "AP",
    region: "South",
    coordinates: { x: 259, y: 448 },
    primaryAuthority: "BIS Vijayawada Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Aquaculture Feed, Cement, Electronics.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Vijayawada Branch Office (Southern Region).",
      coverageScore: 62,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Aquaculture Feed", "Cement", "Electronics"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "kl",
    name: "Kerala",
    code: "KL",
    region: "South",
    coordinates: { x: 173, y: 587 },
    primaryAuthority: "BIS Kochi Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Coir Products, Seafood, Rubber Goods.",
    certificationRelevance:
      "ISI Mark (Scheme I), Hallmarking — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description: "Kochi Branch Office (Southern Region).",
      coverageScore: 66,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Coir Products", "Seafood", "Rubber Goods"],
    schemes: ["ISI Mark (Scheme I)", "Hallmarking"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "py",
    name: "Puducherry",
    code: "PY",
    region: "South",
    coordinates: { x: 243, y: 544 },
    primaryAuthority: "Served via BIS Chennai Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Light Engineering, Textiles.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the UT; nearest office is the Chennai Branch Office.",
      coverageScore: 50,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Light Engineering", "Textiles"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "ld",
    name: "Lakshadweep",
    code: "LD",
    region: "South",
    coordinates: { x: 101, y: 573 },
    primaryAuthority: "Served via BIS Kochi Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem: "Key manufacturing clusters: Fisheries, Coir.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the UT; nearest office is the Kochi Branch Office.",
      coverageScore: 20,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Fisheries", "Coir"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "as",
    name: "Assam",
    code: "AS",
    region: "Northeast",
    coordinates: { x: 477, y: 244 },
    primaryAuthority: "BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide.",
    standardsEcosystem:
      "Key manufacturing clusters: Tea Processing, Petroleum Products, Bamboo Products.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications, surveillance and factory inspections handled locally.",
    regionalOffice: {
      type: "Branch Office",
      description:
        "Guwahati Branch Office (Eastern Region) and the Guwahati Branch Laboratory — BIS's only office in the Northeast.",
      coverageScore: 70,
    },
    lastDataUpdate: "Last month",
    status: "high_relevance",
    sectors: ["Tea Processing", "Petroleum Products", "Bamboo Products"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: true,
  },
  {
    id: "ar",
    name: "Arunachal Pradesh",
    code: "AR",
    region: "Northeast",
    coordinates: { x: 513, y: 224 },
    primaryAuthority: "Served via BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Hydropower Equipment, Construction Materials.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest office is Guwahati.",
      coverageScore: 30,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Hydropower Equipment", "Construction Materials"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "mn",
    name: "Manipur",
    code: "MN",
    region: "Northeast",
    coordinates: { x: 518, y: 277 },
    primaryAuthority: "Served via BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Handloom, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest office is Guwahati.",
      coverageScore: 28,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Handloom", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "ml",
    name: "Meghalaya",
    code: "ML",
    region: "Northeast",
    coordinates: { x: 460, y: 258 },
    primaryAuthority: "Served via BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Cement, Construction Materials.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest office is Guwahati. Marker shown in western Meghalaya to separate it from Guwahati.",
      coverageScore: 38,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Cement", "Construction Materials"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "mz",
    name: "Mizoram",
    code: "MZ",
    region: "Northeast",
    coordinates: { x: 496, y: 295 },
    primaryAuthority: "Served via BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Bamboo Products, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest office is Guwahati.",
      coverageScore: 26,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Bamboo Products", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "nl",
    name: "Nagaland",
    code: "NL",
    region: "Northeast",
    coordinates: { x: 527, y: 247 },
    primaryAuthority: "Served via BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Handicrafts, Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest office is Guwahati.",
      coverageScore: 26,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Handicrafts", "Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "tr",
    name: "Tripura",
    code: "TR",
    region: "Northeast",
    coordinates: { x: 468, y: 293 },
    primaryAuthority: "Served via BIS Guwahati Branch Office",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem: "Key manufacturing clusters: Rubber, Bamboo Products.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest office is Guwahati.",
      coverageScore: 30,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Rubber", "Bamboo Products"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
  {
    id: "sk",
    name: "Sikkim",
    code: "SK",
    region: "Northeast",
    coordinates: { x: 415, y: 218 },
    primaryAuthority: "Served via BIS Kolkata & Guwahati offices",
    regulatoryFramework:
      "BIS Act 2016 and BIS (Conformity Assessment) Regulations; central Quality Control Orders apply nationwide, enforced through the nearest BIS office.",
    standardsEcosystem:
      "Key manufacturing clusters: Pharmaceuticals, Organic Food Processing.",
    certificationRelevance:
      "ISI Mark (Scheme I) — applications and inspections routed via the nearest BIS office.",
    regionalOffice: {
      type: "Liaison Coverage",
      description:
        "No BIS office located in the state; nearest offices are Kolkata and Guwahati.",
      coverageScore: 30,
    },
    lastDataUpdate: "Last month",
    status: "standard",
    sectors: ["Pharmaceuticals", "Organic Food Processing"],
    schemes: ["ISI Mark (Scheme I)"],
    recentUpdates: [],
    hasDedicatedOffice: false,
  },
];

export const JURISDICTION_SUMMARY_STATS = {
  statesCovered: MOCK_JURISDICTIONS.length,
  statesWithOffice: MOCK_JURISDICTIONS.filter((j) => j.hasDedicatedOffice)
    .length,
  // Headquarters + the 5 Regional Offices.
  regionalHubs: MOCK_JURISDICTIONS.filter(
    (j) =>
      j.regionalOffice.type === "Headquarters" ||
      j.regionalOffice.type === "Regional Office",
  ).length,
  recentLocalAmendments: MOCK_JURISDICTIONS.filter(
    (j) => j.recentUpdates.length > 0,
  ).length,
};
