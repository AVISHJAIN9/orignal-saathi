import { GapAnalyticsService } from '../src/gap-analytics.service';
import { PiiSanitizer } from '../src/pii-sanitizer';

describe('X8: Standards Gap Analytics for BIS (Enhanced)', () => {
  let analyticsService: GapAnalyticsService;
  let sanitizer: PiiSanitizer;

  beforeEach(() => {
    sanitizer = new PiiSanitizer();
    analyticsService = new GapAnalyticsService(sanitizer);
  });

  describe('Sectional Committee Gap Routing', () => {
    it('should assign correct sectional committee codes (e.g. ETD 51) to gaps', () => {
      analyticsService.logQuery('Safety for EV battery swapping stations and lithium recycling', 0.2, true, undefined, 'Karnataka');

      const gaps = analyticsService.identifyStandardsGaps();
      expect(gaps.length).toBeGreaterThan(0);
      expect(gaps[0].sectionalCommitteeCode).toBe('ETD 51');
      expect(gaps[0].suggestedCommitteeDivision).toBe('Electrotechnical Division (ETD)');
    });

    it('should generate executive DG memorandum text in ministry report', () => {
      analyticsService.logQuery('TDS drinking water IS 10500', 0.95, false, 'IS 10500', 'Delhi');
      analyticsService.logQuery('EV battery swapping', 0.2, true, undefined, 'Delhi');

      const report = analyticsService.generateMinistryReport();
      expect(report.executiveDgBriefingText).toContain('EXECUTIVE MEMORANDUM FOR DIRECTOR GENERAL');
      expect(report.executiveDgBriefingText).toContain('ETD 51');
    });
  });
});
