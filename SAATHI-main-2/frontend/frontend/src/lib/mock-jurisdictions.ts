// MOCK: illustrative cross-border regulatory reference data, not a live feed.
// Unlike mock-regulatory-events.ts, this content is NOT routed through the
// i18n namespace — each jurisdiction carries dense, multi-field regulatory
// prose (framework, ecosystem, per-update summaries) that the reference
// implementation this was ported from also leaves untranslated for the same
// reason: translating ~150 factual regulatory strings across 8 countries is
// disproportionate to what a prototype's Hindi coverage needs. The page
// chrome around this data (headings, filters, drawer labels) is fully
// translated via the jurisdiction i18n namespace.

export type JurisdictionFilter =
  "all" | "high_relevance" | "active_changes" | "bis_related" | "international";

export interface RegulatoryUpdate {
  date: string;
  title: string;
  summary: string;
  impact: "High" | "Medium" | "Low";
}

export interface JurisdictionData {
  id: string;
  name: string;
  code: string;
  flag: string;
  region:
    | "Asia-Pacific"
    | "Europe"
    | "North America"
    | "Middle East"
    | "Oceania"
    | "Latin America";
  // Position on a normalized 1000x500 map viewBox.
  coordinates: { x: number; y: number };
  primaryAuthority: string;
  regulatoryFramework: string;
  standardsEcosystem: string;
  certificationRelevance: string;
  bisRelationship: {
    status:
      | "Bilateral MoU"
      | "Harmonized ISO/IEC"
      | "WTO TBT Notification"
      | "Mutual Scrutiny";
    description: string;
    alignmentScore: number; // 0-100
  };
  lastDataUpdate: string;
  status: "active_changes" | "high_relevance" | "bis_related" | "standard";
  sectors: string[];
  schemes: string[];
  recentUpdates: RegulatoryUpdate[];
  wtoTbtNotified: boolean;
}

export const MOCK_JURISDICTIONS: JurisdictionData[] = [
  {
    id: "in",
    name: "India",
    code: "IND",
    flag: "🇮🇳",
    region: "Asia-Pacific",
    coordinates: { x: 710, y: 260 },
    primaryAuthority: "Bureau of Indian Standards (BIS) & DPIIT",
    regulatoryFramework:
      "Bureau of Indian Standards Act 2016, Quality Control Orders (QCOs), CRO (MeitY)",
    standardsEcosystem:
      "Indian Standards (IS) developed by 15 Division Councils; 85%+ aligned with ISO/IEC standards.",
    certificationRelevance:
      "Scheme I (ISI Mark), Scheme II (Compulsory Registration Scheme - CRS), Scheme IV, FMCS for foreign manufacturers.",
    bisRelationship: {
      status: "Harmonized ISO/IEC",
      description:
        "Host regulatory jurisdiction; BIS represents India at ISO, IEC, and Codex Alimentarius.",
      alignmentScore: 100,
    },
    lastDataUpdate: "Today, 09:30 IST",
    status: "high_relevance",
    sectors: [
      "Electronics",
      "Automotive",
      "Steel & Metals",
      "Food & Water",
      "PPE & Helmets",
      "Toys",
      "Chemicals",
    ],
    schemes: [
      "ISI Mark (Scheme I)",
      "CRS Scheme II (MeitY)",
      "FMCS (Foreign)",
      "Hallmarking Scheme",
    ],
    recentUpdates: [
      {
        date: "15 Aug 2024",
        title: "QCO 2024 for High-Voltage Switchgear & Controlgear notified",
        summary:
          "Mandatory ISI certification required for all switchgear imported or manufactured after 6 months.",
        impact: "High",
      },
      {
        date: "28 Jul 2024",
        title:
          "Revised Series Guidelines for Li-Ion battery pack CRS inclusion",
        summary:
          "Clarification on cell-level delta testing for minor capacity variants without redesign.",
        impact: "Medium",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "eu",
    name: "European Union",
    code: "EU",
    flag: "🇪🇺",
    region: "Europe",
    coordinates: { x: 505, y: 155 },
    primaryAuthority:
      "European Committee for Standardization (CEN / CENELEC / ETSI)",
    regulatoryFramework:
      "EU Single Market Directives & Regulations (LVD, RED, Machinery Directive, CPR, RoHS, REACH)",
    standardsEcosystem:
      "European Norms (EN); high direct correlation with IEC/ISO standards.",
    certificationRelevance:
      "CE Marking (Self-declaration or Notified Body Type-Examination Certificates based on module).",
    bisRelationship: {
      status: "Bilateral MoU",
      description:
        "BIS maintains active cooperation agreements with CEN and CENELEC for standards exchange.",
      alignmentScore: 88,
    },
    lastDataUpdate: "Yesterday, 14:15 CET",
    status: "high_relevance",
    sectors: [
      "Machinery",
      "Telecommunications (RED)",
      "Electrical Equipment (LVD)",
      "Medical Devices (MDR)",
      "Chemicals",
    ],
    schemes: ["CE Mark Module A-H", "ENEC Mark", "RoHS / WEEE Compliance"],
    recentUpdates: [
      {
        date: "10 Aug 2024",
        title: "EU Cyber Resilience Act (CRA) technical requirements finalized",
        summary:
          "Mandatory cybersecurity benchmarks for all connected hardware entering EU internal market.",
        impact: "High",
      },
      {
        date: "02 Jul 2024",
        title:
          "Ecodesign for Sustainable Products Regulation (ESPR) entry into force",
        summary:
          "Digital Product Passport (DPP) requirements introduced across consumer goods.",
        impact: "High",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "us",
    name: "United States",
    code: "USA",
    flag: "🇺🇸",
    region: "North America",
    coordinates: { x: 230, y: 180 },
    primaryAuthority: "ANSI (Coordinator), OSHA / NRTLs, FCC, FDA, CPSC",
    regulatoryFramework:
      "Code of Federal Regulations (CFR Titles 16, 21, 29, 47), FCC Part 15, OSHA 1910",
    standardsEcosystem:
      "Decentralized voluntary consensus standards (ASTM, IEEE, NFPA, UL Standards, ASME).",
    certificationRelevance:
      "Nationally Recognized Testing Laboratory (NRTL) listing (UL, ETL, CSA), FCC Supplier Declaration of Conformity.",
    bisRelationship: {
      status: "Bilateral MoU",
      description:
        "BIS-ANSI MoU on technical cooperation; collaborative dialogue on emerging AI & EV standards.",
      alignmentScore: 76,
    },
    lastDataUpdate: "2 days ago",
    status: "active_changes",
    sectors: [
      "Consumer Electronics",
      "Medical Devices",
      "Aerospace",
      "Food & Drugs (FDA)",
      "Industrial Equipment",
    ],
    schemes: [
      "FCC Title 47 SDoC",
      "NRTL Safety Listing (UL/ETL)",
      "FDA 510(k) Clearance",
      "CPSC Children Product Certificate (CPC)",
    ],
    recentUpdates: [
      {
        date: "04 Aug 2024",
        title: "FCC Cybersecurity Trust Mark for IoT Devices launched",
        summary:
          "Voluntary US Cyber Trust Mark program open for smart home devices and consumer routers.",
        impact: "Medium",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "GBR",
    flag: "🇬🇧",
    region: "Europe",
    coordinates: { x: 475, y: 135 },
    primaryAuthority: "British Standards Institution (BSI) & OPSS",
    regulatoryFramework:
      "UK Designated Standards under post-Brexit product safety statutory instruments.",
    standardsEcosystem: "British Standards (BS) and BS EN transposed norms.",
    certificationRelevance:
      "UKCA (UK Conformity Assessed) marking and indefinite recognition of CE marking for most manufactured goods.",
    bisRelationship: {
      status: "Bilateral MoU",
      description:
        "Historic standards partnership; joint working groups under India-UK FTA technical barriers to trade chapter.",
      alignmentScore: 84,
    },
    lastDataUpdate: "3 days ago",
    status: "bis_related",
    sectors: [
      "Consumer Goods",
      "Construction Products",
      "Electrical Equipment",
      "Pressure Vessels",
    ],
    schemes: ["UKCA Mark", "BSI Kitemark", "BEAB Approved"],
    recentUpdates: [
      {
        date: "12 Jul 2024",
        title:
          "UK Government indefinitely extends CE mark recognition for industrial goods",
        summary:
          "Manufacturers may continue using either UKCA or CE mark for placing products on Great Britain market.",
        impact: "High",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "jp",
    name: "Japan",
    code: "JPN",
    flag: "🇯🇵",
    region: "Asia-Pacific",
    coordinates: { x: 865, y: 185 },
    primaryAuthority: "Japanese Industrial Standards Committee (JISC) & METI",
    regulatoryFramework:
      "Industrial Standardization Act, Electrical Appliance and Material Safety Act (DENAN Law)",
    standardsEcosystem:
      "Japanese Industrial Standards (JIS); highly rigorous national transposition of IEC/ISO standards.",
    certificationRelevance:
      "PSE Mark (Diamond for specified high-risk electricals, Circle for non-specified), JIS Mark.",
    bisRelationship: {
      status: "Mutual Scrutiny",
      description:
        "India-Japan CEPA agreement includes mutual recognition facilitation provisions for automotive & IT goods.",
      alignmentScore: 82,
    },
    lastDataUpdate: "4 days ago",
    status: "bis_related",
    sectors: [
      "Automotive & Robotics",
      "Precision Electronics",
      "Batteries & Energy Storage",
      "Industrial Tools",
    ],
    schemes: [
      "PSE Diamond (Specified)",
      "PSE Circle (Self-declaration)",
      "JIS Mark",
      "Telec Radio Approval",
    ],
    recentUpdates: [
      {
        date: "20 Jun 2024",
        title:
          "DENAN Law Technical Requirements Ordinance updated for wireless chargers",
        summary:
          "New test clauses for magnetic field emissions and thermal shielding in induction charging pads.",
        impact: "Medium",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "ae",
    name: "United Arab Emirates",
    code: "ARE",
    flag: "🇦🇪",
    region: "Middle East",
    coordinates: { x: 645, y: 235 },
    primaryAuthority: "Ministry of Industry and Advanced Technology (MoIAT)",
    regulatoryFramework:
      "UAE National Quality Infrastructure Laws, GSO unified Gulf technical regulations.",
    standardsEcosystem:
      "UAE.S standards aligned with GSO and ISO/IEC frameworks.",
    certificationRelevance:
      "ECAS (Emirates Conformity Assessment Scheme), EQM (Emirates Quality Mark), G-Mark (Gulf Conformity Mark).",
    bisRelationship: {
      status: "Bilateral MoU",
      description:
        "Comprehensive Economic Partnership Agreement (CEPA); close technical collaboration on gold hallmarking and food safety.",
      alignmentScore: 90,
    },
    lastDataUpdate: "5 days ago",
    status: "high_relevance",
    sectors: [
      "Precious Metals & Gems",
      "Food & Halal Products",
      "Low Voltage Electricals",
      "Building Materials",
    ],
    schemes: [
      "ECAS Certificate of Conformity",
      "EQM Emirates Quality Mark",
      "G-Mark Low Voltage Equipment",
    ],
    recentUpdates: [
      {
        date: "18 Jul 2024",
        title:
          "Bilateral recognition of gold jewellery testing certificates under India-UAE CEPA",
        summary:
          "Simplified clearance for BIS hallmarked jewellery entering UAE markets.",
        impact: "High",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "au",
    name: "Australia",
    code: "AUS",
    flag: "🇦🇺",
    region: "Oceania",
    coordinates: { x: 860, y: 390 },
    primaryAuthority: "Standards Australia & ACMA / EESS",
    regulatoryFramework:
      "Electrical Equipment Safety System (EESS), ACMA Telecommunications Act, Therapeutic Goods Act",
    standardsEcosystem: "AS/NZS joint harmonized standards.",
    certificationRelevance:
      "Regulatory Compliance Mark (RCM), TGA Approval for medical devices, WaterMark for plumbing.",
    bisRelationship: {
      status: "Bilateral MoU",
      description:
        "India-Australia ECTA; joint technical cooperation on critical minerals and renewable equipment standards.",
      alignmentScore: 85,
    },
    lastDataUpdate: "6 days ago",
    status: "standard",
    sectors: [
      "Renewables & Solar",
      "Mining Machinery",
      "Consumer Electronics",
      "Plumbing & Water",
    ],
    schemes: ["RCM (Electrical/EMC)", "WaterMark Scheme", "TGA ARTG Inclusion"],
    recentUpdates: [
      {
        date: "11 Jul 2024",
        title: "AS/NZS 5033:2024 Photovoltaic (PV) arrays standard published",
        summary:
          "Updated DC isolator and earthing specifications for rooftop solar installations.",
        impact: "Medium",
      },
    ],
    wtoTbtNotified: true,
  },
  {
    id: "sg",
    name: "Singapore",
    code: "SGP",
    flag: "🇸🇬",
    region: "Asia-Pacific",
    coordinates: { x: 775, y: 300 },
    primaryAuthority:
      "Enterprise Singapore & Consumer Product Safety Authority (CPSA)",
    regulatoryFramework:
      "Consumer Protection (Safety Requirements) Regulations (CPSR), IMDA Telecoms Act",
    standardsEcosystem:
      "Singapore Standards (SS); high direct harmonization with IEC/ISO.",
    certificationRelevance:
      "SAFETY Mark for 33 Controlled Goods categories, IMDA Equipment Registration.",
    bisRelationship: {
      status: "Bilateral MoU",
      description:
        "Close ASEAN-India standards alignment; mutual fast-track for IT and telecommunication testing certificates.",
      alignmentScore: 92,
    },
    lastDataUpdate: "1 week ago",
    status: "standard",
    sectors: [
      "Smart Electronics",
      "Medical Tech",
      "Food & Nutrition",
      "Fintech & Security Hardware",
    ],
    schemes: [
      "SAFETY Mark (CPSR)",
      "IMDA Telecom Dealer License",
      "Singapore Standard Quality Mark",
    ],
    recentUpdates: [
      {
        date: "05 Jul 2024",
        title: "CPSR updates safety requirements for USB PD GaN fast adaptors",
        summary:
          "Safety testing under SS 146 / IEC 62368-1 mandatory for all wall-plugs sold in retail.",
        impact: "Low",
      },
    ],
    wtoTbtNotified: true,
  },
];

export const JURISDICTION_SUMMARY_STATS = {
  totalTracked: 48,
  activeRegulatoryZones: 12,
  recentHarmonizationUpdates: 6,
  highImpactRegimes: 8,
};
