import { GroundednessChecker } from '../src/groundedness-checker';

describe('X2: Groundedness Checker (Semantic & Propositional)', () => {
  let checker: GroundednessChecker;

  beforeEach(() => {
    checker = new GroundednessChecker();
  });

  it('should extract propositions from markdown bullet lists', () => {
    const markdown = `
      * Drinking water must comply with IS 10500:2012.
      * Maximum permissible TDS is 500 mg/l under Table 1.
      * E. Coli must not be detectable in 100ml.
    `;

    const claims = checker.extractClaims(markdown);
    expect(claims.length).toBe(3);
    expect(claims[0]).toContain('Drinking water must comply');
  });

  it('should calculate cosine similarity between two float vectors', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const sim = checker.cosineSimilarity(vecA, vecB);
    expect(sim).toBeCloseTo(1.0);

    const orthogonal = checker.cosineSimilarity([1, 0], [0, 1]);
    expect(orthogonal).toBeCloseTo(0.0);
  });

  it('should attribute evidence snippet and NLI entailment', () => {
    const claims = ['Total dissolved solids acceptable limit is 500 mg/l.'];
    const chunks = [
      {
        chunkId: 'chk-10500',
        documentId: 'doc-10500',
        standardNumber: 'IS 10500:2012',
        content: 'Total dissolved solids acceptable limit is 500 mg/l as per Table 1.',
        similarityScore: 0.95,
      },
    ];

    const verified = checker.verifyClaims(claims, chunks);
    expect(verified[0].isGrounded).toBe(true);
    expect(verified[0].nliEntailment).toBe('ENTAILS');
    expect(verified[0].supportingChunkId).toBe('chk-10500');
    expect(verified[0].evidenceSnippet).toContain('500 mg/l');
  });
});
