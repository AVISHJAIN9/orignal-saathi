export interface AnonymizedQueryLog {
  queryId: string;
  sanitizedQueryText: string;
  matchedStandardNumber?: string;
  matchedIntent: 'STANDARD_LOOKUP' | 'PRODUCT_COMPLIANCE' | 'CLAUSE_REQUIREMENTS' | 'FEE_LAB_PROCEDURE' | 'UNMATCHED_GAP';
  confidenceScore: number;
  wasDeclined: boolean;
  userState?: string;
  timestamp: string;
}

export interface StandardDemandMetric {
  standardNumber: string;
  totalQueryCount: number;
  averageConfidence: number;
  clarityIndex: number;
  topUserStates: string[];
}

export interface StandardsGapCluster {
  clusterId: string;
  productTopic: string;
  queryCount: number;
  sampleQueries: string[];
  suggestedCommitteeDivision: string;
  sectionalCommitteeCode: string;
  urgencyScore: number;
  recommendation: string;
}

export interface BisMinistryDashboardReport {
  reportGeneratedAt: string;
  totalQueriesAnalyzed: number;
  overallSystemGroundedness: number;
  topDemandedStandards: StandardDemandMetric[];
  emergingProductGaps: StandardsGapCluster[];
  regionalQueryDistribution: Record<string, number>;
  documentationAmbiguityHotspots: Array<{
    standardNumber: string;
    lowConfidenceQueryCount: number;
    notes: string;
  }>;
  executiveDgBriefingText: string;
}
