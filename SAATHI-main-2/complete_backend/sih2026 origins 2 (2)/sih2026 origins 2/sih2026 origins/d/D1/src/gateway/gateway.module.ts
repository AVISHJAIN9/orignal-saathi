import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ComplianceGatewayController,
  LifecycleGatewayController,
  InternationalGatewayController,
  AuthGatewayController,
  ExperienceGatewayController,
  PlatformGatewayController,
  GovernanceGatewayController,
} from './gateway.controller';
import { GatewayService } from './gateway.service';

/**
 * GatewayModule — D1 is the single public API gateway for all series:
 *   /api/v1/compliance    → c/ series (C1–C46)  [JWT required]
 *   /api/v1/lifecycle     → s/ series (S1–S44)  [JWT required]
 *   /api/v1/international → i/ series (I1–I25)  [public read]
 *   /api/v1/experience    → x/ series (X1–X15)  [JWT required]
 *   /api/v1/platform      → p/ series (P1–P7)
 *   /api/v1/governance    → g/ series (G1–G22)
 *   /api/v1/auth          → proxy to p/p1 standalone Auth microservice
 */
@Module({
  imports: [ConfigModule],
  controllers: [
    ComplianceGatewayController,
    LifecycleGatewayController,
    InternationalGatewayController,
    ExperienceGatewayController,
    AuthGatewayController,
    PlatformGatewayController,
    GovernanceGatewayController,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
