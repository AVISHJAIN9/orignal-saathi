import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  OnModuleDestroy
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { Queue } from 'bullmq';
import { getRedisConnectionOptions } from '../../common/services/redis.service';

export interface ConsignmentRowEvaluation {
  rowNumber: number;
  hsnCode: string;
  itemDescription: string;
  declaredStandard: string;
  declaredQuantity: number;
  measuredParameter: string;
  measuredValue: number;
  complianceStatus: 'PASS' | 'FAIL';
  reason?: string;
}

export interface ConsignmentBulkCheckResponse {
  isAsync: boolean;
  jobId?: string;
  totalItems: number;
  passedItems: number;
  failedItems: number;
  clearanceStatus: 'CLEARED_FOR_CUSTOMS' | 'HELD_AT_PORT_DEFECT_FOUND';
  rowResults: ConsignmentRowEvaluation[];
  timestamp: string;
}

@ApiTags('Tier 1: Consignment Compliance')
@Controller('api/v1/consignments')
export class T122ConsignmentBulkController implements OnModuleDestroy {
  private readonly logger = new Logger(T122ConsignmentBulkController.name);
  private readonly consignmentQueue: Queue;

  constructor(private readonly db: DatabaseService) {
    const connection = getRedisConnectionOptions();
    this.consignmentQueue = new Queue('consignment-bulk', { connection });
    this.consignmentQueue.on('error', (err) => {
      this.logger.warn(`BullMQ consignmentQueue error: ${err?.message || err}`);
    });
  }

  async onModuleDestroy() {
    await this.consignmentQueue.close();
  }

  @Post('bulk-check')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '[T1-22] Bulk import consignment checker (CSV with BullMQ async handling)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Batch compliance evaluation across declared consignment rows' })
  async checkConsignment(
    @UploadedFile() file?: Express.Multer.File,
    @Body('csvContent') csvContentParam?: string
  ): Promise<ConsignmentBulkCheckResponse> {
    let rawCsv = csvContentParam || '';
    if (file && file.buffer) {
      rawCsv += '\n' + file.buffer.toString('utf-8');
    }

    if (!rawCsv.trim()) {
      // Realistic default consignment dataset for testing & demo
      rawCsv = `HSN,Description,Standard,Quantity,Parameter,Value
85366910,Domestic 16A Shuttered Plug,IS 1293:2019,5000,TerminalTempRise,38
85366910,Unshuttered Multi-Plug Adapter,IS 1293:2019,2000,TerminalTempRise,52
39172110,HDPE Water Supply Pipe 110mm,IS 4984:2016,1500,BaseDensity,948
25232910,Ordinary Portland Cement 53G,IS 269:2015,10000,CompressiveStrength_28D,56`;
    }

    const lines = rawCsv
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const hasHeader = lines[0].toLowerCase().includes('hsn') || lines[0].toLowerCase().includes('description');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const rowResults: ConsignmentRowEvaluation[] = [];

    dataLines.forEach((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      const hsn = parts[0] || '85366910';
      const desc = parts[1] || 'General Manufactured Goods';
      const standard = parts[2] || 'IS 1293:2019';
      const qty = parseInt(parts[3] || '1000', 10);
      const param = parts[4] || 'TerminalTempRise';
      const val = parseFloat(parts[5] || '40.0');

      let pass = true;
      let reason: string | undefined = undefined;

      // Evaluation rules
      if (param.toLowerCase().includes('temp') && val > 45.0) {
        pass = false;
        reason = `Terminal temperature rise (${val} K) exceeds mandatory IS 1293 statutory limit of 45 K.`;
      } else if (param.toLowerCase().includes('density') && (val < 940 || val > 958)) {
        pass = false;
        reason = `Base polymer density (${val} kg/m3) outside IS 4984 statutory range 940-958.`;
      } else if (param.toLowerCase().includes('strength') && val < 53.0) {
        pass = false;
        reason = `28-Day Compressive Strength (${val} MPa) below IS 269 53 Grade limit (53.0 MPa).`;
      }

      rowResults.push({
        rowNumber: idx + 1,
        hsnCode: hsn,
        itemDescription: desc,
        declaredStandard: standard,
        declaredQuantity: qty,
        measuredParameter: param,
        measuredValue: val,
        complianceStatus: pass ? 'PASS' : 'FAIL',
        reason
      });
    });

    const passedItems = rowResults.filter((r) => r.complianceStatus === 'PASS').length;
    const failedItems = rowResults.length - passedItems;

    // Check if > 500 rows to offload asynchronously to BullMQ queue
    const isAsync = rowResults.length > 500;
    let jobId: string | undefined = undefined;

    if (isAsync) {
      const job = await this.consignmentQueue.add(
        'evaluate-bulk',
        {
          rows: rowResults,
          totalRows: rowResults.length
        },
        { removeOnComplete: false, removeOnFail: false }
      );
      jobId = job.id;
    }

    return {
      isAsync,
      jobId,
      totalItems: rowResults.length,
      passedItems,
      failedItems,
      clearanceStatus: failedItems === 0 ? 'CLEARED_FOR_CUSTOMS' : 'HELD_AT_PORT_DEFECT_FOUND',
      rowResults: isAsync ? [] : rowResults,
      timestamp: new Date().toISOString()
    };
  }
}
