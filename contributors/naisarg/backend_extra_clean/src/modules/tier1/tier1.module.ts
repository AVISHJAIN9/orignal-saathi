import { Module } from '@nestjs/common';
import { T102DiffController } from './t1_02_diff';
import { T10304OcrController } from './t1_03_04_ocr_extractor';
import { T105AuthenticityController } from './t1_05_authenticity';
import { T109GemMatcherController } from './t1_09_gem_matcher';
import { T110SandboxController } from './t1_10_sandbox';
import { T115CostOptimizerController } from './t1_15_cost_optimizer';
import { T116GenealogyController } from './t1_16_genealogy';
import { T11718LlmController } from './t1_17_18_llm_features';
import { T11320RenewalController } from './t1_13_20_renewal';
import { T120MonitoringController, T120MonitoringGateway } from './t1_20_monitoring_ws';
import { T121LabelCheckerController } from './t1_21_label_checker';
import { T122ConsignmentBulkController } from './t1_22_consignment_bulk';
import { T12324GazetteAlertsController } from './t1_23_24_gazette_alerts';
import { T12529RemainingController } from './t1_25_29_remaining';
import { IndicSarvamController } from './indic_sarvam.controller';
import { SmsGatewayController } from '../sms_service';
import { EmailGatewayController } from '../email_service';

@Module({
  controllers: [
    T102DiffController,
    T10304OcrController,
    T105AuthenticityController,
    T109GemMatcherController,
    T110SandboxController,
    T115CostOptimizerController,
    T116GenealogyController,
    T11718LlmController,
    T11320RenewalController,
    T120MonitoringController,
    T121LabelCheckerController,
    T122ConsignmentBulkController,
    T12324GazetteAlertsController,
    T12529RemainingController,
    IndicSarvamController,
    SmsGatewayController,
    EmailGatewayController
  ],
  providers: [
    T120MonitoringGateway
  ],
  exports: [
    T120MonitoringGateway
  ]
})
export class Tier1Module {}
