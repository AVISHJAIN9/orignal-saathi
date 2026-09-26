import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RetentionService, RetentionPurgeResult, RetentionPolicyStatus } from './retention.service';
import { TriggerPurgeDto } from './dto/trigger-purge.dto';

@Controller('api/v1/retention')
export class RetentionController {
  private readonly logger = new Logger(RetentionController.name);

  constructor(private readonly retentionService: RetentionService) {}

  /**
   * Manually trigger immediate data retention purge cycle
   * Allows administrators to trigger cleanups on demand with optional retention days override.
   */
  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  async triggerPurge(
    @Body() triggerDto?: TriggerPurgeDto,
  ): Promise<{
    message: string;
    result: RetentionPurgeResult;
  }> {
    this.logger.log(
      `[P2 Retention Controller] Manual purge triggered with retentionDays override: ${triggerDto?.retentionDays ?? 'default'}`,
    );

    const result = await this.retentionService.purgeExpiredData(
      triggerDto?.retentionDays,
    );

    return {
      message:
        result.status === 'SUCCESS'
          ? `Purge completed: ${result.deletedConversations} conversations and ${result.deletedMessages} messages deleted.`
          : result.status === 'NO_OP'
            ? 'Purge completed: 0 expired records found.'
            : `Purge execution failed: ${result.errorMessage}`,
      result,
    };
  }

  /**
   * Get current data retention policy settings and database statistics
   */
  @Get('status')
  async getStatus(): Promise<{
    status: string;
    policy: RetentionPolicyStatus;
    timestamp: string;
  }> {
    const policy = await this.retentionService.getRetentionStatus();
    return {
      status: 'active',
      policy,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Service health check
   */
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'SAATHI-BIS-Module-P2-DataRetention',
      timestamp: new Date().toISOString(),
    };
  }
}
