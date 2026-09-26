// Safe decorator wrapper for both NestJS dependency injection and standalone script execution
let Injectable = (): ClassDecorator => () => {};
try {
  Injectable = require('@nestjs/common').Injectable;
} catch (_) {}

import { GroundednessChecker } from './groundedness-checker';
import { GuardrailDecision, RetrievedChunk } from './guardrail.types';

export interface GuardrailOptions {
  groundednessThreshold?: number;
  minSimilarityScore?: number;
  strictCitationEnforcement?: boolean;
}

@Injectable()
export class CiteOrDeclineService {
  private readonly checker: GroundednessChecker;
  private readonly defaultThreshold: number;
  private readonly defaultMinSimilarity: number;

  constructor() {
    this.checker = new GroundednessChecker();
    this.defaultThreshold = process.env.GUARDRAIL_GROUNDEDNESS_THRESHOLD
      ? parseFloat(process.env.GUARDRAIL_GROUNDEDNESS_THRESHOLD)
      : 0.65;
    this.defaultMinSimilarity = process.env.GUARDRAIL_MIN_SIMILARITY
      ? parseFloat(process.env.GUARDRAIL_MIN_SIMILARITY)
      : 0.50;
  }

  public evaluate(
    query: string,
    generatedResponse: string,
    retrievedChunks: RetrievedChunk[],
    options?: GuardrailOptions
  ): GuardrailDecision {
    const threshold = options?.groundednessThreshold ?? this.defaultThreshold;
    const minSim = options?.minSimilarityScore ?? this.defaultMinSimilarity;

    const validChunks = retrievedChunks.filter(
      (c) => (c.similarityScore ?? 0) >= minSim
    );

    if (validChunks.length === 0) {
      return {
        status: 'DECLINED',
        groundednessScore: 0,
        unsupportedClaims: [generatedResponse],
        groundedClaimsCount: 0,
        totalClaimsCount: 1,
        hasCitations: false,
        citationCount: 0,
        attributedEvidence: [],
        response: this.getStandardDeclineMessage(query, 'NO_RELEVANT_CHUNKS'),
        refusalReason: 'No verified Indian Standard (IS) chunks found matching the query.',
        confidenceTelemetry: {
          retrievalScore: 0,
          faithfulnessScore: 0,
          thresholdApplied: threshold,
        },
      };
    }

    const claims = this.checker.extractClaims(generatedResponse);
    const attributedEvidence = this.checker.verifyClaims(claims, validChunks);

    const groundedClaims = attributedEvidence.filter((c) => c.isGrounded);
    const unsupportedClaims = attributedEvidence
      .filter((c) => !c.isGrounded)
      .map((c) => c.claimText);

    const groundednessScore =
      attributedEvidence.length > 0
        ? groundedClaims.length / attributedEvidence.length
        : 0;

    const citations = this.extractCitations(generatedResponse);
    const hasCitations = citations.length > 0;

    const avgRetrievalScore =
      validChunks.reduce((acc, curr) => acc + (curr.similarityScore || 0), 0) /
      validChunks.length;

    if (groundednessScore < threshold) {
      return {
        status: 'DECLINED',
        groundednessScore,
        unsupportedClaims,
        groundedClaimsCount: groundedClaims.length,
        totalClaimsCount: attributedEvidence.length,
        hasCitations,
        citationCount: citations.length,
        attributedEvidence,
        response: this.getStandardDeclineMessage(query, 'LOW_GROUNDEDNESS'),
        refusalReason: `Groundedness score (${(groundednessScore * 100).toFixed(1)}%) was below the required threshold of ${(threshold * 100).toFixed(0)}%.`,
        confidenceTelemetry: {
          retrievalScore: avgRetrievalScore,
          faithfulnessScore: groundednessScore,
          thresholdApplied: threshold,
        },
      };
    }

    const isFlagged = unsupportedClaims.length > 0;

    return {
      status: isFlagged ? 'FLAGGED' : 'ALLOWED',
      groundednessScore,
      unsupportedClaims,
      groundedClaimsCount: groundedClaims.length,
      totalClaimsCount: attributedEvidence.length,
      hasCitations,
      citationCount: citations.length,
      attributedEvidence,
      response: generatedResponse,
      confidenceTelemetry: {
        retrievalScore: avgRetrievalScore,
        faithfulnessScore: groundednessScore,
        thresholdApplied: threshold,
      },
    };
  }

  public extractCitations(text: string): string[] {
    const citationRegex = /\b(?:IS\s*(?:\(Part\s*\d+[^\)]*\)|[0-9]+(?::\d{4})?)|Clause\s*\d+(?:\.\d+)*|Section\s*\d+(?:\.\d+)*|Regulation\s*\d+|Table\s*[0-9A-Z]+|Annexure\s*[0-9A-Z]+|Scheme-[I|V|X]+)\b/gi;
    const matches = text.match(citationRegex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  private getStandardDeclineMessage(
    query: string,
    reason: 'NO_RELEVANT_CHUNKS' | 'LOW_GROUNDEDNESS'
  ): string {
    if (reason === 'NO_RELEVANT_CHUNKS') {
      return (
        `I cannot provide a verified answer to "${query}" because no corresponding Indian Standard (IS) or Bureau of Indian Standards (BIS) regulatory documentation was found in the official knowledge base. ` +
        `To ensure compliance accuracy, SAATHI only states facts explicitly verified by BIS publications. Please consult the BIS helpdesk or refine your query with a specific product or standard number.`
      );
    }
    return (
      `This query cannot be answered with high confidence from current BIS standards. ` +
      `Certain aspects of the requested information could not be verified against official clauses. ` +
      `An escalation ticket can be raised to the BIS technical committee for official clarification.`
    );
  }

  // ==============================================================================
  // Phase 5.3 — Model 3 Interface: Groundedness & Confidence Calibrator
  // ==============================================================================
  // AWAITING_TRAINED_MODEL: Model 3 (groundedness calibrator)
  // Config flag: GROUNDEDNESS_CLASSIFIER_MODE=rules|trained-model (defaults to 'rules')
  public scoreGroundedness(
    query: string,
    retrievedChunks: RetrievedChunk[],
    generatedAnswer: string
  ): {
    groundedProbability: number;
    shouldDecline: boolean;
    mode: string;
    decision: GuardrailDecision;
  } {
    const mode = process.env.GROUNDEDNESS_CLASSIFIER_MODE || 'rules';

    if (mode === 'trained-model') {
      // AWAITING_TRAINED_MODEL: Call site for trained NLI cross-encoder calibration
    }

    const decision = this.evaluate(query, generatedAnswer, retrievedChunks);
    const shouldDecline = decision.status === 'DECLINED';

    return {
      groundedProbability: decision.groundednessScore,
      shouldDecline,
      mode,
      decision,
    };
  }
}
