import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/guards/public.decorator';

@ApiTags('System')
@Controller()
export class HealthController {
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Root status & API entry point' })
  getRoot() {
    return {
      status: 'ok',
      message: 'SAATHI BIS Standards Assistant Backend is running live',
      documentation: '/api/docs',
      health: '/health',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Root health check' })
  getRootHealth() {
    return {
      status: 'healthy',
      service: 'saathi-backend-extra',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }
}
