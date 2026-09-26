import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import axios from 'axios';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liveness and Readiness probe check' })
  @ApiResponse({ status: 200, description: 'Service health check report' })
  async check() {
    let dbStatus = 'healthy';
    try {
      await this.dataSource.query('SELECT 1');
    } catch (e: any) {
      dbStatus = `unhealthy: ${e.message}`;
    }

    let ragStatus = 'unreachable';
    const ragUrl = this.configService.get<string>(
      'RAG_SERVICE_URL',
      'http://localhost:8000',
    );
    try {
      const resp = await axios.get(`${ragUrl}/health`, { timeout: 3000 });
      ragStatus = resp.status === 200 ? 'healthy' : `status ${resp.status}`;
    } catch {
      ragStatus = 'offline / unreachable';
    }

    let redisStatus = 'configured';
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
    try {
      const net = require('net');
      const socket = new net.Socket();
      await new Promise((resolve, reject) => {
        socket.setTimeout(2000);
        socket.connect(redisPort, redisHost, () => {
          socket.write('*1\r\n$4\r\nPING\r\n');
        });
        socket.on('data', (data: Buffer) => {
          if (data.toString().includes('PONG')) {
            redisStatus = 'healthy';
          } else {
            redisStatus = 'connected';
          }
          socket.destroy();
          resolve(true);
        });
        socket.on('error', (err: any) => {
          redisStatus = `unhealthy: ${err.message}`;
          socket.destroy();
          resolve(false);
        });
        socket.on('timeout', () => {
          redisStatus = 'timeout';
          socket.destroy();
          resolve(false);
        });
      });
    } catch {
      redisStatus = 'unreachable';
    }

    const allHealthy = dbStatus === 'healthy' && (redisStatus === 'healthy' || redisStatus === 'connected');

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      service: 'saathi-d1-conversational-chat',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      dependencies: {
        database: dbStatus,
        redis: redisStatus,
        ragService: ragStatus,
      },
    };
  }
}
