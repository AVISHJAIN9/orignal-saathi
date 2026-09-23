import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from '../../database/database.service';

export interface TelemetryReading {
  productId: string;
  timestamp: string;
  parameter: string;
  value: number;
  unit: string;
  threshold: {
    min: number;
    max: number;
  };
  isBreached: boolean;
  alertEvent?: {
    severity: 'WARNING' | 'CRITICAL';
    message: string;
  };
}

export interface TelemetryPayload {
  productId: string;
  connectionType: string;
  activeSensorCount: number;
  readings: TelemetryReading[];
  hasBreachAlert: boolean;
}

export function generateTelemetry(productId: string): TelemetryPayload {
  const now = new Date().toISOString();
  const isPlug = productId.toLowerCase().includes('plug') || productId.toLowerCase().includes('1293');

  let readings: TelemetryReading[] = [];

  if (isPlug) {
    // Temperature rise sensor (threshold max 45 K)
    const tempVal = Math.round((35 + Math.random() * 15) * 10) / 10;
    const isBreached = tempVal > 45.0;

    readings = [
      {
        productId,
        timestamp: now,
        parameter: 'Terminal Temperature Rise',
        value: tempVal,
        unit: 'K',
        threshold: { min: 0, max: 45.0 },
        isBreached,
        alertEvent: isBreached
          ? {
              severity: 'CRITICAL',
              message: `Terminal temperature ${tempVal} K breached statutory IS 1293:2019 max limit (45.0 K)! Production line interlock initiated.`
            }
          : undefined
      },
      {
        productId,
        timestamp: now,
        parameter: 'Dielectric Insulation Leakage',
        value: Math.round((0.8 + Math.random() * 0.4) * 100) / 100,
        unit: 'mA',
        threshold: { min: 0, max: 2.0 },
        isBreached: false
      }
    ];
  } else {
    // Pipe hydrostatic pressure sensor (threshold min 5.4 MPa)
    const pressureVal = Math.round((5.1 + Math.random() * 0.8) * 100) / 100;
    const isBreached = pressureVal < 5.4;

    readings = [
      {
        productId,
        timestamp: now,
        parameter: 'Hydrostatic Induced Hoop Stress',
        value: pressureVal,
        unit: 'MPa',
        threshold: { min: 5.4, max: 8.0 },
        isBreached,
        alertEvent: isBreached
          ? {
              severity: 'WARNING',
              message: `Hydrostatic pressure fell to ${pressureVal} MPa (Mandatory hold is >= 5.4 MPa under IS 4984). Check pump pressure manifold.`
            }
          : undefined
      }
    ];
  }

  return {
    productId,
    connectionType: 'HTTP Polling (WebSocket stream active at /api/v1/monitoring/stream/:productId)',
    activeSensorCount: readings.length,
    readings,
    hasBreachAlert: readings.some((r) => r.isBreached)
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: /^\/api\/v1\/monitoring\/stream(\/.*)?$/
})
export class T120MonitoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(T120MonitoringGateway.name);
  private clientIntervals = new Map<string, NodeJS.Timeout>();

  handleConnection(client: Socket) {
    const rawNsp = client.nsp?.name || '';
    let productId = (client.handshake.query?.productId as string) || '';

    if (!productId && rawNsp) {
      const match = rawNsp.match(/\/api\/v1\/monitoring\/stream\/([^/?]+)/);
      if (match && match[1]) {
        productId = decodeURIComponent(match[1]);
      }
    }

    if (!productId || productId === 'stream') {
      productId = 'PROD-PLUG-1293';
    }

    this.logger.log(`Client connected to monitoring stream: ${client.id} for product: ${productId} (nsp: ${rawNsp})`);

    // Send immediate initial reading
    this.sendReading(client, productId);

    // Stream telemetry every 2 seconds
    const interval = setInterval(() => {
      this.sendReading(client, productId);
    }, 2000);

    this.clientIntervals.set(client.id, interval);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from monitoring stream: ${client.id}`);
    const interval = this.clientIntervals.get(client.id);
    if (interval) {
      clearInterval(interval);
      this.clientIntervals.delete(client.id);
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { productId: string }
  ) {
    if (data?.productId) {
      const existing = this.clientIntervals.get(client.id);
      if (existing) clearInterval(existing);

      this.sendReading(client, data.productId);
      const interval = setInterval(() => {
        this.sendReading(client, data.productId);
      }, 2000);
      this.clientIntervals.set(client.id, interval);
    }
  }

  private sendReading(client: Socket, productId: string) {
    const telemetry = generateTelemetry(productId);
    // Push simulated sensor reading
    client.emit('telemetry', telemetry);

    // Emit distinct alert event when a threshold is breached
    if (telemetry.hasBreachAlert) {
      const breached = telemetry.readings.filter((r) => r.isBreached);
      client.emit('alert', {
        productId,
        timestamp: new Date().toISOString(),
        breachedReadings: breached,
        alerts: breached.map((b) => b.alertEvent)
      });
    }
  }
}

@ApiTags('Tier 1: Production Monitoring')
@Controller('api/v1/monitoring')
export class T120MonitoringController {
  private readonly logger = new Logger(T120MonitoringController.name);

  constructor(private readonly db: DatabaseService) {}

  @Get('stream/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-20] Live production-parameter monitoring feed and breach alert check (HTTP Polling fallback)' })
  @ApiParam({ name: 'productId', description: 'Product identifier (e.g. PROD-PIPE-4984 or PROD-PLUG-1293)' })
  @ApiResponse({ status: 200, description: 'Simulated sensor telemetry stream slice with threshold breach detection' })
  getTelemetrySlice(@Param('productId') productId: string): TelemetryPayload {
    return generateTelemetry(productId);
  }
}
