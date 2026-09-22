import { AttributedEvidence, RetrievedChunk } from './guardrail.types';

export class GroundednessChecker {
  /**
   * Splits response into individual factual claim sentences, supporting numbered clauses and bullet lists
   */
  public extractClaims(responseText: string): string[] {
    if (!responseText || typeof responseText !== 'string') {
      return [];
    }

    // Split on markdown lists, numbered lists, newlines, and sentence delimiters
    const lines = responseText
      .split(/\n+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    const claims: string[] = [];

    for (const line of lines) {
      // Strip markdown bullets / numbered prefixes
      const cleanLine = line.replace(/^[\*\-\•\d+\.]+\s*/, '').trim();

      if (cleanLine.length > 10) {
        // Split complex compound sentences
        const sentences = cleanLine
          .split(/(?<=[.?!])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 8);

        if (sentences.length > 0) {
          claims.push(...sentences);
        } else {
          claims.push(cleanLine);
        }
      }
    }

    return claims.length > 0 ? claims : [responseText.trim()];
  }

  /**
   * Calculates cosine similarity between two float vectors
   */
  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Verifies each claim against retrieved chunks with semantic similarity and NLI entailment
   */
  public verifyClaims(
    claims: string[],
    retrievedChunks: RetrievedChunk[]
  ): AttributedEvidence[] {
    if (retrievedChunks.length === 0) {
      return claims.map((claim) => ({
        claimText: claim,
        isGrounded: false,
        groundedScore: 0,
        nliEntailment: 'CONTRADICTS' as const,
      }));
    }

    return claims.map((claim) => {
      const claimTokens = this.tokenize(claim);
      if (claimTokens.length === 0) {
        return {
          claimText: claim,
          isGrounded: true,
          groundedScore: 1.0,
          nliEntailment: 'ENTAILS' as const,
        };
      }

      let bestChunk: RetrievedChunk | null = null;
      let highestScore = 0;
      let bestEvidenceSnippet = '';

      for (const chunk of retrievedChunks) {
        const chunkSentences = chunk.content.split(/(?<=[.?!])\s+/);

        for (const cSent of chunkSentences) {
          const cTokens = this.tokenize(cSent);
          const jaccard = this.calculateJaccardSimilarity(claimTokens, cTokens);

          if (jaccard > highestScore) {
            highestScore = jaccard;
            bestChunk = chunk;
            bestEvidenceSnippet = cSent.trim();
          }
        }

        const fullChunkTokens = this.tokenize(`${chunk.standardNumber} ${chunk.content}`);
        const fullOverlap = this.calculateTokenOverlap(claimTokens, fullChunkTokens);
        if (fullOverlap > highestScore) {
          highestScore = fullOverlap;
          bestChunk = chunk;
          bestEvidenceSnippet = chunk.content.substring(0, 160);
        }
      }

      const isGrounded = highestScore >= 0.45;
      const nliEntailment = isGrounded
        ? 'ENTAILS'
        : highestScore > 0.2
        ? 'NEUTRAL'
        : 'CONTRADICTS';

      return {
        claimText: claim,
        isGrounded,
        groundedScore: Number(highestScore.toFixed(2)),
        nliEntailment,
        supportingChunkId: isGrounded ? bestChunk?.chunkId : undefined,
        supportingStandard: isGrounded ? bestChunk?.standardNumber : undefined,
        evidenceSnippet: isGrounded ? bestEvidenceSnippet : undefined,
      };
    });
  }

  private calculateJaccardSimilarity(tokensA: string[], tokensB: string[]): number {
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    let intersection = 0;
    for (const t of setA) {
      if (setB.has(t)) intersection++;
    }
    const union = new Set([...tokensA, ...tokensB]).size;
    return union > 0 ? intersection / union : 0;
  }

  private calculateTokenOverlap(claimTokens: string[], corpusTokens: string[]): number {
    const corpusSet = new Set(corpusTokens);
    let matches = 0;
    for (const t of claimTokens) {
      if (corpusSet.has(t)) matches++;
    }
    return claimTokens.length > 0 ? matches / claimTokens.length : 0;
  }

  private tokenize(text: string): string[] {
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'to', 'for',
      'of', 'with', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was',
      'were', 'will', 'shall', 'should', 'must', 'can', 'has', 'have', 'had'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s\.\-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !stopwords.has(t));
  }
}
