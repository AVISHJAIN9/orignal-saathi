import { generateClauseAnchor, isValidAnchorSlug } from '../src/clause-anchor.util';

describe('X1: Clause Anchor Util', () => {
  it('should generate valid anchors from section number', () => {
    expect(generateClauseAnchor('4.2.1')).toBe('clause-4-2-1');
  });

  it('should generate valid anchors from section title when number is missing', () => {
    expect(generateClauseAnchor(null, 'Sampling & Test Procedure')).toBe('section-sampling-test-procedure');
  });

  it('should validate anchor slug formatting', () => {
    expect(isValidAnchorSlug('clause-4-2')).toBe(true);
    expect(isValidAnchorSlug('table-2')).toBe(true);
    expect(isValidAnchorSlug('annex-a')).toBe(true);
    expect(isValidAnchorSlug('invalid_anchor_slug')).toBe(false);
  });
});
