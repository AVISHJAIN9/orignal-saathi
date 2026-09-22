import { Module } from '@nestjs/common';
import { CiteOrDeclineService } from './cite-or-decline.service';
import { EvaluationHarness } from './evaluation-harness';
import { GroundednessChecker } from './groundedness-checker';
import { GuardrailController } from './guardrail.controller';

@Module({
  controllers: [GuardrailController],
  providers: [CiteOrDeclineService, GroundednessChecker, EvaluationHarness],
  exports: [CiteOrDeclineService, GroundednessChecker, EvaluationHarness],
})
export class GuardrailModule {}
