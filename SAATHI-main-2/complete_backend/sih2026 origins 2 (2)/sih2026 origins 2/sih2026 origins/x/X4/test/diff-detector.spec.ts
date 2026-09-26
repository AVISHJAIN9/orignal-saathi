import { DiffDetector } from '../src/diff-detector';

describe('X4: Diff Detector', () => {
  let detector: DiffDetector;

  beforeEach(() => {
    detector = new DiffDetector();
  });

  it('should detect modified clauses and generate markdown diff report', () => {
    const activeDoc: any = {
      standardNumber: 'IS 10500:2012',
      clauses: [
        {
          clauseNumber: '4.2',
          title: 'TDS Limits',
          content: 'TDS acceptable limit is 500 mg/l.',
          clauseChecksum: detector.computeChecksum('TDS acceptable limit is 500 mg/l.'),
        },
      ],
    };

    const circular: any = {
      affectedStandardNumber: 'IS 10500:2012',
      amendedClauses: [
        {
          clauseNumber: '4.2',
          title: 'TDS Limits',
          newContent: 'TDS acceptable limit is 400 mg/l.',
        },
      ],
    };

    const diff = detector.detectDiffs(activeDoc, circular);
    expect(diff.hasChanges).toBe(true);
    expect(diff.changedClauses.length).toBe(1);
    expect(diff.markdownDiffReport).toContain('- Old: TDS acceptable limit is 500 mg/l.');
    expect(diff.markdownDiffReport).toContain('+ New: TDS acceptable limit is 400 mg/l.');
  });
});
