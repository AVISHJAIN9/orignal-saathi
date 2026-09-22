import {
  Controller,
  Get
} from '@nestjs/common';

// Liveness probe endpoint answering independently of database availability
@Controller(
  'health'
)
export class HealthController {

  @Get(
  )
  check(
  ): {
    status: string;
    service: string;
    timestamp: string;
  } {

    return {
      status: 'ok',
      service: 'saathi-d4-conversation-history',
      timestamp: new Date(
      ).toISOString(
      )
    };

  }

}