import { extractAllCitations, parseClauseReference } from '../src/clause-parser';

describe('X1: Clause Parser (Enhanced Multi-Citation & Compound)', () => {
  describe('parseClauseReference', () => {
    it('should parse standard and clause number from reference string', () => {
      const parsed = parseClauseReference('IS 10500:2012 Clause 4.2');
      expect(parsed.standardNumber).toBe('IS 10500:2012');
      expect(parsed.clauseNumber).toBe('4.2');
      expect(parsed.anchorSlug).toBe('clause-4-2');
    });

    it('should handle compound references (Clause + Table)', () => {
      const parsed = parseClauseReference('IS 456 Clause 5 Table 2');
      expect(parsed.standardNumber).toBe('IS 456');
      expect(parsed.clauseNumber).toBe('5');
      expect(parsed.tableNumber).toBe('2');
      expect(parsed.anchorSlug).toBe('clause-5-table-2');
    });

    it('should parse Devanagari numerals in citation strings', () => {
      const parsed = parseClauseReference('IS १०५०० Clause ४.२');
      expect(parsed.standardNumber).toBe('IS 10500');
      expect(parsed.clauseNumber).toBe('4.2');
      expect(parsed.anchorSlug).toBe('clause-4-2');
    });

    it('should extract parenthetical section titles', () => {
      const parsed = parseClauseReference('IS 10500 Clause 4.1 (Bacteriological Quality)');
      expect(parsed.clauseNumber).toBe('4.1');
      expect(parsed.sectionTitle).toBe('Bacteriological Quality');
    });
  });

  describe('extractAllCitations', () => {
    it('should extract multiple citations from a full multi-paragraph response', () => {
      const response = `
        Drinking water quality is defined in IS 10500:2012 Clause 4.2.
        For concrete structures, please refer to IS 456:2000 Table 2.
        Electrical domestic plugs must follow IS 1293:2019 Annex A.
      `;

      const all = extractAllCitations(response);
      expect(all.length).toBe(3);
      expect(all[0].standardNumber).toBe('IS 10500:2012');
      expect(all[1].standardNumber).toBe('IS 456:2000');
      expect(all[2].standardNumber).toBe('IS 1293:2019');
    });
  });
});
