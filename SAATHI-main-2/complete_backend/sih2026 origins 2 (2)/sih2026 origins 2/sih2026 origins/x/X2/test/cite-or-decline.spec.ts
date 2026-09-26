import { CiteOrDeclineService } from '../src/cite-or-decline.service';

describe('X2: Cite-or-Decline Service', () => {
  let service: CiteOrDeclineService;

  beforeEach(() => {
    service = new CiteOrDeclineService();
  });

  it('should approve grounded responses and extract citations', () => {
    const decision = service.evaluate(
      'TDS limit under IS 10500',
      'As per IS 10500:2012 Clause 4.2 Table 1, TDS is limited to 500 mg/l.',
      [
        {
          chunkId: 'chk-1',
          documentId: 'doc-1',
          standardNumber: 'IS 10500:2012',
          content: 'TDS is limited to 500 mg/l under standard clause 4.2 table 1.',
          similarityScore: 0.95,
        },
      ]
    );

    expect(decision.status).toBe('ALLOWED');
    expect(decision.hasCitations).toBe(true);
    expect(decision.citationCount).toBeGreaterThan(0);
    expect(decision.attributedEvidence.length).toBeGreaterThan(0);
  });

  it('should decline out-of-scope or ungrounded queries', () => {
    const decision = service.evaluate('Tell me stock tips', 'Buy AAPL stock', []);
    expect(decision.status).toBe('DECLINED');
    expect(decision.response).toContain('cannot provide a verified answer');
  });
});
