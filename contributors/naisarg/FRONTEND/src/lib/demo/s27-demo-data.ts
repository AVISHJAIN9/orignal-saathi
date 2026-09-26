import { DEMO_WATERMARK_TEXT } from "./demo-context";

export interface RetrievalQualityKpi {
  groundednessRate: number; // e.g. 94.2 (percentage of answers whose claims are directly cited from verified standards)
  declineRate: number; // e.g. 4.8 (percentage of queries where system safely abstained / declined per X2 cite-or-decline)
  retrievalSuccessRate: number; // e.g. 96.5
  lowConfidenceRate: number; // e.g. 3.1
  avgRetrievalLatencyMs: number; // e.g. 185
  avgGenerationLatencyMs: number; // e.g. 620
  totalQueriesEvaluated: number; // e.g. 14820
  citationCoverageRate: number; // e.g. 98.1
  isDemoTelemetry: boolean;
  demoLabel: string;
}

export interface GroundednessTimePoint {
  date: string; // "YYYY-MM-DD"
  groundednessRate: number;
  declineRate: number;
  queriesEvaluated: number;
}

export interface RetrievalFailureCategory {
  category: string;
  count: number;
  percentage: number;
  remedyAction: string;
}

export interface CoverageGapStandard {
  standardNumber: string;
  standardTitle: string;
  coverageScore: number; // 0 - 100
  evaluatedQueries: number;
  primaryDeficiency: string;
}

export interface S27TelemetryBundle {
  kpis: RetrievalQualityKpi;
  timeSeries: GroundednessTimePoint[];
  failureCategories: RetrievalFailureCategory[];
  coverageGapStandards: CoverageGapStandard[];
  evaluationWindow: string;
}

export const S27_DEMO_TELEMETRY: S27TelemetryBundle = {
  kpis: {
    groundednessRate: 94.2,
    declineRate: 4.8,
    retrievalSuccessRate: 96.5,
    lowConfidenceRate: 3.1,
    avgRetrievalLatencyMs: 185,
    avgGenerationLatencyMs: 620,
    totalQueriesEvaluated: 14820,
    citationCoverageRate: 98.1,
    isDemoTelemetry: true,
    demoLabel: "DEMO TELEMETRY — Smart India Hackathon 2026 Evaluation Environment",
  },
  timeSeries: [
    { date: "Day -6", groundednessRate: 92.4, declineRate: 5.6, queriesEvaluated: 1840 },
    { date: "Day -5", groundednessRate: 93.1, declineRate: 5.2, queriesEvaluated: 2110 },
    { date: "Day -4", groundednessRate: 93.8, declineRate: 5.0, queriesEvaluated: 1980 },
    { date: "Day -3", groundednessRate: 94.0, declineRate: 4.9, queriesEvaluated: 2250 },
    { date: "Day -2", groundednessRate: 94.5, declineRate: 4.7, queriesEvaluated: 2410 },
    { date: "Day -1", groundednessRate: 94.1, declineRate: 4.8, queriesEvaluated: 2090 },
    { date: "Today", groundednessRate: 94.2, declineRate: 4.8, queriesEvaluated: 2140 },
  ],
  failureCategories: [
    {
      category: "Ambiguous Standard Clause Citation",
      count: 242,
      percentage: 34.1,
      remedyAction: "Refine hierarchical chunking across annexures and test table footnotes",
    },
    {
      category: "Recent Gazette Amendment Mismatch",
      count: 178,
      percentage: 25.1,
      remedyAction: "Prioritize gazette timeline ingest in Regulatory Radar",
    },
    {
      category: "Foreign Test Method Equivalence (ISO/IEC vs IS)",
      count: 154,
      percentage: 21.7,
      remedyAction: "Incorporate cross-standard concordance vectors in M3 retrieval index",
    },
    {
      category: "Multi-Part Specification Ambiguity (e.g. Part 1 vs Part 2)",
      count: 135,
      percentage: 19.1,
      remedyAction: "Require scheme disambiguation in M4 query understanding step",
    },
  ],
  coverageGapStandards: [
    {
      standardNumber: "IS 15885 (Part 2/Sec 13)",
      standardTitle: "Safety of Lamp Controlgear — Particular Requirements",
      coverageScore: 68.4,
      evaluatedQueries: 412,
      primaryDeficiency: "Complex nested endurance test condition matrices",
    },
    {
      standardNumber: "IS 16046 (Part 2):2018",
      standardTitle: "Secondary Cells and Batteries Containing Alkaline Electrolytes",
      coverageScore: 73.1,
      evaluatedQueries: 588,
      primaryDeficiency: "Cell chemistry distinction clauses (NMC vs LFP)",
    },
    {
      standardNumber: "IS 302 (Part 2/Sec 30):2007",
      standardTitle: "Safety of Household and Similar Electrical Appliances",
      coverageScore: 77.8,
      evaluatedQueries: 342,
      primaryDeficiency: "High-voltage breakdown voltage tables in Annex AA",
    },
  ],
  evaluationWindow: "Rolling 7-Day Window (SIH 2026 Evaluation Telemetry)",
};
