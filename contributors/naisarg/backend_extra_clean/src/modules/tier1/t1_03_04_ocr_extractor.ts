import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  OnModuleInit,
  OnModuleDestroy
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { Queue, Worker, Job } from 'bullmq';
import { getRedisConnectionOptions } from '../../common/services/redis.service';
import { extractTextFromBuffer } from '../../common/utils/ocr-extractor.util';
import {
  ExtractedParameterResult,
  evaluateCertificateText
} from '../../common/utils/cert-evaluation.util';

export type { ExtractedParameterResult };

export interface DatasheetClauseEvaluation {
  clauseNumber: string;
  clauseTitle: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
  parameters: ExtractedParameterResult[];
}

@Controller('api/v1')
@ApiTags('Tier 1: OCR & Compliance Extraction')
export class T10304OcrController implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(T10304OcrController.name);

  private certQueue: Queue;
  private consignmentQueue: Queue;
  private embeddedWorker?: Worker;

  constructor(private readonly db: DatabaseService) {
    const connection = getRedisConnectionOptions();
    this.certQueue = new Queue('cert-validation', { connection });
    this.consignmentQueue = new Queue('consignment-bulk', { connection });

    this.certQueue.on('error', (err) => {
      this.logger.warn(`BullMQ certQueue error: ${err?.message || err}`);
    });
    this.consignmentQueue.on('error', (err) => {
      this.logger.warn(`BullMQ consignmentQueue error: ${err?.message || err}`);
    });
  }

  onModuleInit() {
    const connection = getRedisConnectionOptions();
    // Initialize embedded BullMQ worker to process validation jobs over Redis
    this.embeddedWorker = new Worker(
      'cert-validation',
      async (job: Job) => {
        const { fileBufferBase64, originalName, mimeType, standardNumber, rawText } = job.data;
        const stdNumber = standardNumber || 'IS 10500:2012';

        let extractedText = rawText || '';
        if (fileBufferBase64) {
          const buffer = Buffer.from(fileBufferBase64, 'base64');
          extractedText = await extractTextFromBuffer(buffer, mimeType, originalName);
        }

        const evaluated = evaluateCertificateText(extractedText, stdNumber);
        const overallStatus = evaluated.every((p) => p.pass) ? 'PASS' : 'FAIL';

        return {
          jobId: job.id,
          standardNumber: stdNumber,
          overallStatus,
          parameters: evaluated,
          extractedTextLength: extractedText.length,
          processedAt: new Date().toISOString()
        };
      },
      { connection }
    );

    this.embeddedWorker.on('error', (err) => {
      this.logger.warn(`BullMQ embeddedWorker error: ${err?.message || err}`);
    });

    this.logger.log('BullMQ Queue (cert-validation) & Worker initialized on Redis.');
  }

  async onModuleDestroy() {
    if (this.embeddedWorker) {
      await this.embeddedWorker.close();
    }
    await this.certQueue.close();
    await this.consignmentQueue.close();
  }

  // -------------------------------------------------------------
  // [T1-03] Certificate / Test Report OCR Validator (Async via BullMQ)
  // -------------------------------------------------------------
  @Post('certificates/validate')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '[T1-03] Async Certificate/test-report OCR validator' })
  @ApiConsumes('multipart/form-data')
  async validateCertificate(
    @UploadedFile() file: Express.Multer.File,
    @Body('standardNumber') standardNumber?: string
  ) {
    const stdNumber = standardNumber || 'IS 10500:2012';

    // Enqueue job to real BullMQ Redis queue
    const job = await this.certQueue.add(
      'validate-cert',
      {
        fileBufferBase64: file?.buffer ? file.buffer.toString('base64') : null,
        originalName: file?.originalname,
        mimeType: file?.mimetype,
        standardNumber: stdNumber,
        rawText: file && !file.buffer ? file.originalname : undefined
      },
      {
        removeOnComplete: false,
        removeOnFail: false
      }
    );

    return {
      jobId: job.id,
      status: 'queued',
      message: 'Certificate OCR validation job enqueued to BullMQ. Poll GET /api/v1/jobs/:id for result.',
      pollUrl: `/api/v1/jobs/${job.id}`
    };
  }

  // Poll Job Status from real BullMQ Redis instance
  @Get('jobs/:id')
  @ApiOperation({ summary: 'Poll async job status' })
  async getJobStatus(@Param('id') jobId: string) {
    let job = await this.certQueue.getJob(jobId);
    if (!job) {
      job = await this.consignmentQueue.getJob(jobId);
    }

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found.`);
    }

    const state = await job.getState();

    if (state === 'completed') {
      return {
        jobId: job.id,
        status: 'completed',
        data: job.returnvalue
      };
    }

    if (state === 'failed') {
      return {
        jobId: job.id,
        status: 'failed',
        error: job.failedReason || 'Job processing failed'
      };
    }

    return {
      jobId: job.id,
      status: 'pending',
      bullState: state,
      message: 'Job is currently executing in BullMQ worker.'
    };
  }

  // -------------------------------------------------------------
  // [T1-04] Datasheet/Spec-Sheet Compliance Scanner (Real OCR)
  // -------------------------------------------------------------
  @Post('datasheets/scan')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '[T1-04] Datasheet/spec-sheet compliance scanner' })
  @ApiConsumes('multipart/form-data')
  async scanDatasheet(
    @UploadedFile() file: Express.Multer.File,
    @Body('standardNumber') standardNumber?: string
  ) {
    const stdNumber = standardNumber || 'IS 10500:2012';

    let fileText = '';
    if (file && file.buffer) {
      fileText = await extractTextFromBuffer(file.buffer, file.mimetype, file.originalname);
    } else if (file && file.originalname) {
      fileText = file.originalname;
    }

    const evaluatedParams = evaluateCertificateText(fileText, stdNumber);

    // Group into red/green table keyed by standard clause
    const clauseMap = new Map<string, ExtractedParameterResult[]>();
    for (const p of evaluatedParams) {
      const list = clauseMap.get(p.clauseReference) || [];
      list.push(p);
      clauseMap.set(p.clauseReference, list);
    }

    const clauses: DatasheetClauseEvaluation[] = [];
    for (const [clauseNumber, params] of clauseMap.entries()) {
      const allPassed = params.every((p) => p.pass);
      clauses.push({
        clauseNumber,
        clauseTitle: `Clause ${clauseNumber} Statutory Evaluation`,
        status: allPassed ? 'COMPLIANT' : 'NON_COMPLIANT',
        parameters: params
      });
    }

    return {
      standardNumber: stdNumber,
      overallCompliance: clauses.every((c) => c.status === 'COMPLIANT'),
      clauseTable: clauses,
      totalClausesChecked: clauses.length,
      timestamp: new Date().toISOString()
    };
  }
}
