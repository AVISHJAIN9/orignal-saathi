import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags, ApiBody } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';

@ApiTags('M1 - Document Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload BIS Standard PDF for Ingestion & Vector Chunking' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('standardNumber') standardNumber: string,
    @Body('sourceUrl') sourceUrl?: string,
  ) {
    const stdNum = standardNumber || 'IS_CUSTOM_DOC';
    const buffer = file?.buffer || Buffer.alloc(0);
    const filename = file?.originalname || 'standard.pdf';

    return this.ingestionService.queueDocumentIngestion(
      filename,
      stdNum,
      buffer,
      sourceUrl,
    );
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Check document ingestion job status' })
  @ApiParam({ name: 'jobId', description: 'Ingestion Job UUID or ID' })
  public async getStatus(@Param('jobId') jobId: string) {
    return this.ingestionService.getJobStatus(jobId);
  }

  @Post('crawl/trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Trigger a BIS website crawl run',
    description:
      'Crawls bis.gov.in public pages (standards, QCOs, schemes, hallmarking, FAQs). ' +
      'Respects robots.txt and crawl delay. Skips pages that have not changed since the last crawl. ' +
      'Each changed page is queued as a BullMQ job for ingestion and embedding.',
  })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        existingChecksums: {
          type: 'object',
          description: 'Map of URL → SHA-256 checksum of last crawled version. Pages matching their stored checksum will be skipped.',
          additionalProperties: { type: 'string' },
        },
      },
    },
  })
  public async triggerCrawl(
    @Body('existingChecksums') existingChecksums?: Record<string, string>,
  ) {
    return this.ingestionService.triggerCrawlRun(existingChecksums || {});
  }

  @Get('queue/stats')
  @ApiOperation({
    summary: 'Get BullMQ queue statistics',
    description: 'Returns counts for waiting, active, completed, failed jobs, and the dead-letter queue (DLQ).',
  })
  public async getQueueStats() {
    return this.ingestionService.getQueueStats();
  }
}
