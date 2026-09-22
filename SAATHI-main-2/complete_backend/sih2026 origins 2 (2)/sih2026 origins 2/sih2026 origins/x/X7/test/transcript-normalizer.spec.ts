import { TranscriptNormalizer } from '../src/transcript-normalizer';

describe('X7: Transcript Normalizer (Devanagari & Indian Phonetics)', () => {
  let normalizer: TranscriptNormalizer;

  beforeEach(() => {
    normalizer = new TranscriptNormalizer();
  });

  it('should convert Devanagari numerals and Hindi patterns to standard strings', () => {
    const raw = 'आईएस १०५०० क्लॉज़ ४.२';
    const { normalized } = normalizer.normalize(raw);
    expect(normalized).toBe('IS 10500 Clause 4.2');
  });

  it('should filter out vocal filler words', () => {
    const raw = 'um like IS 456 Table 2 matlb strength kya hai';
    const { normalized } = normalizer.normalize(raw);
    expect(normalized).not.toContain('um');
    expect(normalized).toContain('IS 456');
  });

  it('should infer intent and target standard accurately', () => {
    const infer = normalizer.inferIntentAndStandard('IS 10500 drinking water TDS test limit');
    expect(infer.intent).toBe('CLAUSE_REQUIREMENTS');
    expect(infer.standard).toBe('IS 10500');
  });
});
