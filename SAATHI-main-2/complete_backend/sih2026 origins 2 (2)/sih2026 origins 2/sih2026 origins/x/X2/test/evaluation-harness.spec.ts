import { CiteOrDeclineService } from '../src/cite-or-decline.service';
import { EvaluationHarness } from '../src/evaluation-harness';
import { GOLDEN_QA_DATASET } from '../src/golden-qa-dataset';

describe('X2: Evaluation Harness & Benchmark Suite', () => {
  let harness: EvaluationHarness;
  let service: CiteOrDeclineService;

  beforeEach(() => {
    service = new CiteOrDeclineService();
    harness = new EvaluationHarness(service);
  });

  it('should run benchmark suite, generate executive report, and track history', () => {
    const metrics = harness.runEvaluation(GOLDEN_QA_DATASET);

    expect(metrics.totalEvaluated).toBe(GOLDEN_QA_DATASET.length);
    expect(metrics.groundednessRate).toBeGreaterThanOrEqual(0.6);
    expect(metrics.hallucinationPreventionRate).toBeGreaterThanOrEqual(0.8);
    expect(metrics.executiveSummaryReport).toContain('# Golden Q&A Evaluation Summary Report');

    const history = harness.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].totalEvaluated).toBe(GOLDEN_QA_DATASET.length);
  });
});
