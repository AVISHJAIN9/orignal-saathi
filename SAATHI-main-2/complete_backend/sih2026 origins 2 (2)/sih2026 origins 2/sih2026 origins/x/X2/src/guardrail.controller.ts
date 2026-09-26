import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CiteOrDeclineService } from './cite-or-decline.service';
import { EvaluationHarness } from './evaluation-harness';
import { GOLDEN_QA_DATASET } from './golden-qa-dataset';
import { RetrievedChunk } from './guardrail.types';

@Controller('guardrail')
export class GuardrailController {
  constructor(
    private readonly guardrailService: CiteOrDeclineService,
    private readonly evalHarness: EvaluationHarness
  ) {}

  @Post('evaluate')
  public evaluateResponse(
    @Body('query') query: string,
    @Body('response') response: string,
    @Body('retrievedChunks') retrievedChunks: RetrievedChunk[],
    @Body('threshold') threshold?: number
  ) {
    return this.guardrailService.evaluate(query, response, retrievedChunks, {
      groundednessThreshold: threshold,
    });
  }

  @Post('run-eval-suite')
  public runEvaluationSuite(@Query('threshold') threshold?: string) {
    const threshNum = threshold ? parseFloat(threshold) : undefined;
    return this.evalHarness.runEvaluation(GOLDEN_QA_DATASET, {
      groundednessThreshold: threshNum,
    });
  }

  @Get('history')
  public getEvaluationHistory() {
    return this.evalHarness.getHistory();
  }
}
