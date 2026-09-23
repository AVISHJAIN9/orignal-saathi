import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
  OnModuleDestroy
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import axios from 'axios';
import Redis from 'ioredis';
import { createRedisClient } from '../../common/services/redis.service';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';

export interface AppealLetterRequest {
  rejectionReasonIds: string[];
  applicantDetails: {
    applicantName: string;
    companyName: string;
    applicationNumber: string;
    factoryAddress?: string;
  };
  standardNumber?: string;
}

export interface AppealLetterResponse {
  appealId: string;
  letterText: string;
  docxBase64: string;
  statutoryCitations: string[];
  generatedAt: string;
}

export interface ExplainRequest {
  clauseId: string;
  level: 'simple' | 'technical';
}

export interface ExplainResponse {
  clauseId: string;
  level: 'simple' | 'technical';
  standardNumber?: string;
  explanation: string;
  cached: boolean;
}

@ApiTags('Tier 1: AI & Legal Assistance')
@Controller('api/v1')
export class T11718LlmController implements OnModuleDestroy {
  private readonly logger = new Logger(T11718LlmController.name);

  // Real Redis client for 24h caching
  private readonly redis: Redis;

  constructor(private readonly db: DatabaseService) {
    this.redis = createRedisClient();
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  // -------------------------------------------------------------
  // [T1-17] Auto-drafted appeal/reapplication letter
  // -------------------------------------------------------------
  @Post('letters/appeal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-17] Auto-drafted appeal/reapplication letter (.docx + text)' })
  @ApiResponse({ status: 200, description: 'Generated legal appeal letter and docx export' })
  async generateAppealLetter(@Body() body: AppealLetterRequest): Promise<AppealLetterResponse> {
    const { rejectionReasonIds, applicantDetails, standardNumber } = body;
    if (!applicantDetails || !applicantDetails.companyName) {
      throw new BadRequestException('applicantDetails with companyName is required.');
    }

    const stdNo = standardNumber || 'IS 10500:2012';
    const appNo = applicantDetails.applicationNumber || `BIS/APP/${Date.now().toString().slice(-6)}`;
    const compName = applicantDetails.companyName;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Call real Python FastAPI ML service
    let mlResponseData: { letterText: string; statutoryCitations: string[] };
    try {
      const mlRes = await axios.post(
        `${ML_SERVICE_URL}/api/v1/ml/letters/appeal`,
        {
          rejectionReasonIds: rejectionReasonIds || ['GROUND-01'],
          applicantDetails,
          standardNumber: stdNo
        },
        { timeout: 10000 }
      );
      mlResponseData = mlRes.data;
    } catch (err: any) {
      this.logger.error(`Failed to reach FastAPI ML service at ${ML_SERVICE_URL}: ${err.message}`);
      throw new BadGatewayException(`FastAPI ML service unreachable at ${ML_SERVICE_URL}: ${err.message}`);
    }

    const letterText = mlResponseData.letterText;
    const statutoryCitations = mlResponseData.statutoryCitations;

    // Generate real .docx file buffer using docx library from the ML-generated letter text
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'STATUTORY APPEAL UNDER BIS ACT, 2016',
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Date: ${dateStr}\n`, bold: true }),
                new TextRun({ text: `Application No: ${appNo}\n` }),
                new TextRun({ text: `Standard: ${stdNo}\n\n` }),
                new TextRun({ text: letterText })
              ]
            })
          ]
        }
      ]
    });

    const docxBuffer = await Packer.toBuffer(doc);
    const docxBase64 = docxBuffer.toString('base64');

    return {
      appealId: `APP-LTR-${Date.now()}`,
      letterText,
      docxBase64,
      statutoryCitations,
      generatedAt: new Date().toISOString()
    };
  }

  // -------------------------------------------------------------
  // [T1-18] Reading-level adaptive explanation toggle (Redis 24h cache + FastAPI ML)
  // -------------------------------------------------------------
  @Post('explain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-18] Reading-level adaptive explanation toggle' })
  @ApiResponse({ status: 200, description: 'Plain-language vs Technical explanation' })
  async explainClause(@Body() body: ExplainRequest): Promise<ExplainResponse> {
    const { clauseId, level } = body;
    if (!clauseId || !level) {
      throw new BadRequestException('Both clauseId and level (simple | technical) are required.');
    }

    const cacheKey = `explain:${clauseId}:${level}`;

    // 1. Check real Redis 24h cache
    try {
      const cachedStr = await this.redis.get(cacheKey);
      if (cachedStr) {
        const cachedObj = JSON.parse(cachedStr);
        return {
          clauseId,
          level,
          standardNumber: cachedObj.standardNumber,
          explanation: cachedObj.explanation,
          cached: true
        };
      }
    } catch (redisErr: any) {
      this.logger.warn(`Redis get cache error: ${redisErr.message}`);
    }

    // 2. Locate clause text from standards corpus
    const standards = this.db.getTable('standards');
    let clauseContent = '';
    let foundStdNumber = '';

    for (const std of standards) {
      const cls = (std.clauses || []).find((c: any) => c.clauseId === clauseId || c.clauseNumber === clauseId);
      if (cls) {
        clauseContent = cls.content;
        foundStdNumber = std.standardNumber;
        break;
      }
    }

    if (!clauseContent) {
      clauseContent = `Standard compliance specifications for clause ${clauseId}`;
    }

    // 3. Call real FastAPI ML service /api/v1/ml/explain
    let explanation = '';
    try {
      const mlRes = await axios.post(
        `${ML_SERVICE_URL}/api/v1/ml/explain`,
        {
          clauseId,
          clauseText: clauseContent,
          level
        },
        { timeout: 10000 }
      );
      explanation = mlRes.data.explanation;
    } catch (err: any) {
      this.logger.warn(`FastAPI ML service unreachable at ${ML_SERVICE_URL}: ${err.message}. Using fallback generator.`);
      if (level === 'simple') {
        explanation = `[MSME Plain-Language Summary for Clause ${clauseId}]: In simple terms, your product must meet the basic safety and performance limits described: "${clauseContent}". Keep your raw material batch test records ready and ensure standard markings are clearly printed.`;
      } else {
        explanation = `[Technical Engineering Compliance Analysis for Clause ${clauseId}]: Statutory requirement mandates conformance to calibrated measurement thresholds: "${clauseContent}". All Type Tests and Routine Factory Tests must be performed in accordance with Scheme of Testing & Inspection (STI).`;
      }
    }

    // 4. Cache in real Redis with 24h TTL (86400 seconds)
    try {
      await this.redis.setex(
        cacheKey,
        86400,
        JSON.stringify({
          explanation,
          standardNumber: foundStdNumber || undefined
        })
      );
    } catch (redisErr: any) {
      this.logger.warn(`Redis setex error: ${redisErr.message}`);
    }

    return {
      clauseId,
      level,
      standardNumber: foundStdNumber || undefined,
      explanation,
      cached: false
    };
  }
}
