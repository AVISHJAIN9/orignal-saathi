export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  standardNumber: string;
  sectionNumber?: string;
  sectionTitle?: string;
  content: string;
  similarityScore: number;
  embeddingVector?: number[];
}

export interface AttributedEvidence {
  claimText: string;
  isGrounded: boolean;
  groundedScore: number;
  nliEntailment: 'ENTAILS' | 'NEUTRAL' | 'CONTRADICTS';
  supportingChunkId?: string;
  supportingStandard?: string;
  evidenceSnippet?: string;
}

export type GuardrailDecisionStatus = 'ALLOWED' | 'FLAGGED' | 'DECLINED';

export interface GuardrailDecision {
  status: GuardrailDecisionStatus;
  groundednessScore: number;
  unsupportedClaims: string[];
  groundedClaimsCount: number;
  totalClaimsCount: number;
  hasCitations: boolean;
  citationCount: number;
  attributedEvidence: AttributedEvidence[];
  response: string;
  refusalReason?: string;
  confidenceTelemetry: {
    retrievalScore: number;
    faithfulnessScore: number;
    thresholdApplied: number;
  };
}

export interface GoldenQACase {
  id: string;
  intent: 'STANDARD_LOOKUP' | 'PRODUCT_COMPLIANCE' | 'CLAUSE_REQUIREMENTS' | 'FEE_LAB_PROCEDURE' | 'OUT_OF_SCOPE_ADVERSARIAL';
  query: string;
  expectedBehavior: 'ANSWER_WITH_CITATION' | 'DECLINE_NO_SOURCE' | 'DECLINE_OUT_OF_SCOPE';
  expectedStandard?: string;
  expectedClauses?: string[];
  sampleRetrievedChunks: RetrievedChunk[];
  sampleModelOutput: string;
}

export interface PersistentEvaluationRecord {
  evalId: string;
  timestamp: string;
  totalEvaluated: number;
  groundednessRate: number;
  declineRate: number;
  hallucinationPreventionRate: number;
  citationPrecision: number;
  scoreDeltaFromPrevious?: number;
}

export interface EvaluationMetrics {
  totalEvaluated: number;
  groundednessRate: number;
  declineRate: number;
  hallucinationPreventionRate: number;
  citationPrecision: number;
  intentBreakdown: Record<string, { total: number; passed: number }>;
  executiveSummaryReport?: string;
  adversarialReport?: any;
}
