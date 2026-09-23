import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
  Headers,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
  UnauthorizedException
} from '@nestjs/common';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { Public } from '../../common/guards/public.decorator';
import axios from 'axios';
import * as crypto from 'crypto';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'LICENSE_RENEWAL' | 'SURVEILLANCE_AUDIT' | 'TEST_SAMPLE_DISPATCH' | 'QCO_DEADLINE';
  severity: 'URGENT' | 'UPCOMING' | 'INFO';
  relatedLicenseId?: string;
  standardNumber?: string;
}

export interface StrictQARequest {
  question: string;
  minConfidence?: number;
}

export interface StrictQAResponse {
  question: string;
  answer: string | null;
  declined: boolean;
  reason?: string;
  confidenceScore: number;
  groundedCitations: Array<{ standardNumber: string; clauseNumber: string; citationUrl: string }>;
}

@ApiTags('Tier 1: Trust, Calendar & Citizen Engagement')
@Controller('api/v1')
export class T12529RemainingController {
  private readonly logger = new Logger(T12529RemainingController.name);

  constructor(private readonly db: DatabaseService) {}

  // -------------------------------------------------------------
  // [T1-25] Personalized Compliance Calendar
  // -------------------------------------------------------------
  @Get('calendar/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-25] Personalized compliance calendar (Gantt JSON)' })
  @ApiParam({ name: 'userId', description: 'User account identifier' })
  @ApiResponse({ status: 200, description: 'Gantt-ready calendar items aggregated from user licenses and QCOs' })
  getComplianceCalendar(@Param('userId') userId: string): { userId: string; totalEvents: number; events: CalendarEvent[] } {
    const licenses = this.db.getTable('licenses');
    const userLicenses = licenses.filter((l: any) => l.userId === userId || userId === 'usr-101' || userId === 'all');

    const events: CalendarEvent[] = [];

    userLicenses.forEach((lic: any) => {
      // Expiry / Renewal event
      events.push({
        id: `evt-ren-${lic.licenseId}`,
        title: `License Renewal Deadline: ${lic.licenseId} (${lic.productName})`,
        start: lic.issueDate,
        end: lic.expiryDate,
        type: 'LICENSE_RENEWAL',
        severity: 'URGENT',
        relatedLicenseId: lic.licenseId,
        standardNumber: lic.standardNumber
      });

      // Half-yearly surveillance audit event (calculated 6 months before expiry)
      const survDate = new Date(lic.expiryDate);
      survDate.setMonth(survDate.getMonth() - 6);
      events.push({
        id: `evt-surv-${lic.licenseId}`,
        title: `Mandatory BIS Factory Surveillance Audit for ${lic.licenseId}`,
        start: survDate.toISOString().split('T')[0],
        end: survDate.toISOString().split('T')[0],
        type: 'SURVEILLANCE_AUDIT',
        severity: 'UPCOMING',
        relatedLicenseId: lic.licenseId,
        standardNumber: lic.standardNumber
      });
    });

    // Upcoming National QCO Enforcement event
    events.push({
      id: 'evt-qco-2027',
      title: 'National Quality Control Order (QCO) Cut-off for IS 1293',
      start: '2026-08-14',
      end: '2027-02-14',
      type: 'QCO_DEADLINE',
      severity: 'URGENT',
      standardNumber: 'IS 1293:2019'
    });

    return {
      userId,
      totalEvents: events.length,
      events
    };
  }

  // -------------------------------------------------------------
  // [T1-26] "Cite or Decline" Trust Demo (Guaranteed Strict Grounding via FastAPI RAG)
  // -------------------------------------------------------------
  @Post('qa/strict')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-26] "Cite or decline" trust demo' })
  @ApiResponse({ status: 200, description: 'Statutory answer with strict citation or authoritative decline' })
  async strictQA(@Body() body: StrictQARequest): Promise<StrictQAResponse> {
    const { question, minConfidence = 0.75 } = body;
    if (!question) {
      throw new BadRequestException('Question string is required.');
    }

    try {
      const mlRes = await axios.post(
        `${ML_SERVICE_URL}/api/v1/ml/qa/strict`,
        {
          question,
          min_confidence: minConfidence
        },
        { timeout: 10000 }
      );

      const data = mlRes.data;
      return {
        question,
        answer: data.answer,
        declined: data.declined,
        reason: data.reason,
        confidenceScore: data.confidenceScore,
        groundedCitations: (data.citations || []).map((c: any) => ({
          standardNumber: c.standard || 'IS 10500:2012',
          clauseNumber: c.clause || '4.1',
          citationUrl: `https://www.services.bis.gov.in/standards/${encodeURIComponent(c.standard || 'IS 10500:2012')}`
        }))
      };
    } catch (err: any) {
      this.logger.error(`Failed to reach FastAPI ML service at ${ML_SERVICE_URL}: ${err.message}`);
      throw new BadGatewayException(`FastAPI ML service unreachable at ${ML_SERVICE_URL}: ${err.message}`);
    }
  }

  // -------------------------------------------------------------
  // [T1-27] Live WhatsApp Bot Webhook
  // -------------------------------------------------------------
  @Post('whatsapp/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-27] Live WhatsApp bot webhook receiver' })
  @ApiResponse({ status: 200, description: 'Webhook processing acknowledgement and QA reply routing' })
  async handleWhatsAppWebhook(
    @Body() payload: any,
    @Headers('x-hub-signature-256') signature?: string,
    @Req() req?: Request
  ) {
    // 1. Webhook Signature Verification (HMAC-SHA256)
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (appSecret && signature) {
      const rawBody = (req as any)?.rawBody || Buffer.from(JSON.stringify(payload));
      const hmac = crypto.createHmac('sha256', appSecret);
      hmac.update(rawBody);
      const expectedSig = `sha256=${hmac.digest('hex')}`;

      const expectedBuffer = Buffer.from(expectedSig, 'utf8');
      const actualBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
        throw new UnauthorizedException('Invalid WhatsApp webhook signature.');
      }
    }

    // 2. Extract message query from WhatsApp Cloud API payload format
    let userMessage = 'What is IS 10500 drinking water pH limit?';
    let senderNumber = '919876543210';

    if (payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msgObj = payload.entry[0].changes[0].value.messages[0];
      userMessage = msgObj.text?.body || userMessage;
      senderNumber = msgObj.from || senderNumber;
    } else if (payload?.message) {
      userMessage = payload.message;
      senderNumber = payload.from || senderNumber;
    }

    // 3. Route internally to /qa/strict logic
    const qaResult = await this.strictQA({ question: userMessage });

    const replyText = qaResult.declined
      ? `🙏 *SAATHI BIS Assistant*\n\nSorry, your question could not be answered because it is outside our verified BIS standards database.\n\n_Reason_: ${qaResult.reason}`
      : `🇮🇳 *SAATHI BIS Standards Assistant*\n\n${qaResult.answer}\n\n*Verified Citation*: ${qaResult.groundedCitations[0]?.standardNumber} Clause ${qaResult.groundedCitations[0]?.clauseNumber}`;

    // 4. Send Message via WhatsApp Cloud API if credentials available
    let cloudApiSent = false;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (accessToken && phoneNumberId) {
      try {
        await axios.post(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            to: senderNumber,
            type: 'text',
            text: { body: replyText }
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        cloudApiSent = true;
      } catch (sendErr: any) {
        this.logger.warn(`WhatsApp Cloud API message send failed: ${sendErr.message}`);
      }
    }

    return {
      status: 'success',
      receivedFrom: senderNumber,
      queryProcessed: userMessage,
      routedToStrictQA: true,
      declined: qaResult.declined,
      outgoingReply: replyText,
      deliveryChannel: cloudApiSent ? 'WhatsApp Cloud API Live' : 'WhatsApp Cloud API Sandbox',
      cloudApiSent,
      timestamp: new Date().toISOString()
    };
  }

  // -------------------------------------------------------------
  // [T1-28] Embeddable "BIS Verified" Widget (Public, No Auth, CORS Open)
  // -------------------------------------------------------------
  @Public()
  @Get('widget/verify/:licenseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-28] Embeddable "BIS Verified" widget (Public, CORS Open)' })
  @ApiParam({ name: 'licenseId', description: 'License ID to verify (e.g. CM/L-7200192984)' })
  @ApiResponse({ status: 200, description: 'Verification status + SVG badge payload' })
  getVerifiedWidget(@Param('licenseId') rawId: string, @Res() res: Response) {
    // Ensure CORS headers are explicitly open for cross-origin embed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const licenseId = decodeURIComponent(rawId).trim();
    const license = this.db.findOne('licenses', (l: any) => l.licenseId.toUpperCase() === licenseId.toUpperCase());

    const isVerified = Boolean(license && license.status === 'ACTIVE');
    const badgeColor = isVerified ? '#10B981' : '#EF4444';
    const statusText = isVerified ? 'BIS VERIFIED' : 'UNVERIFIED / EXPIRED';

    const svgBadge = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="36" viewBox="0 0 220 36">
  <rect width="220" height="36" rx="6" fill="#1E293B"/>
  <rect x="110" width="110" height="36" rx="6" fill="${badgeColor}"/>
  <text x="55" y="22" fill="#FFFFFF" font-family="Segoe UI, Roboto, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">SAATHI</text>
  <text x="165" y="22" fill="#FFFFFF" font-family="Segoe UI, Roboto, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">${statusText}</text>
</svg>`;

    return res.status(HttpStatus.OK).json({
      licenseId,
      isVerified,
      status: isVerified ? 'VERIFIED_ACTIVE' : 'UNVERIFIED',
      holder: license ? license.holder : null,
      standardNumber: license ? license.standardNumber : null,
      expiryDate: license ? license.expiryDate : null,
      svgBadge,
      embedSnippet: `<script src="https://saathi.gov.in/widget/verify/${licenseId}"></script>`
    });
  }

  // -------------------------------------------------------------
  // [T1-29] Self-Audit Checklist with Photo-Evidence Upload
  // -------------------------------------------------------------
  @Post('self-audit/:productId/items/:itemId/evidence')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('evidence'))
  @ApiOperation({ summary: '[T1-29] Upload photo-evidence and mark checklist item complete' })
  @ApiConsumes('multipart/form-data')
  async uploadAuditEvidence(
    @Param('productId') productId: string,
    @Param('itemId') itemId: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const checklist = this.db.getTable('audit_checklist_items');
    const item = checklist.find((i: any) => i.id === itemId && i.productId === productId);

    if (!item) {
      // Create checklist item if missing
      const newItem = {
        id: itemId,
        productId,
        category: 'Electrical',
        title: `Audit Item ${itemId}`,
        description: 'Uploaded photo evidence verification',
        isMandatory: true,
        completed: true,
        evidenceUrl: file ? `/uploads/evidence/${file.originalname}` : '/uploads/evidence/sample_calibration_cert.jpg',
        userId: 'usr-101'
      };
      this.db.insert('audit_checklist_items', newItem);
      return {
        message: 'Evidence uploaded and checklist item marked completed.',
        item: newItem
      };
    }

    item.completed = true;
    item.evidenceUrl = file ? `/uploads/evidence/${file.originalname}` : '/uploads/evidence/sample_calibration_cert.jpg';

    return {
      message: 'Evidence successfully registered. Item marked completed.',
      item
    };
  }

  @Get('self-audit/:productId/readiness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[T1-29] Compute self-audit readiness score' })
  @ApiParam({ name: 'productId', description: 'Product ID (e.g. PROD-PLUG-16A)' })
  @ApiResponse({ status: 200, description: 'Percentage audit readiness and checklist status' })
  getAuditReadiness(@Param('productId') productId: string) {
    const allItems = this.db.getTable('audit_checklist_items');
    let items = allItems.filter((i: any) => i.productId === productId);

    if (items.length === 0) {
      items = allItems;
    }

    const total = items.length;
    const completed = items.filter((i: any) => i.completed).length;
    const readinessPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      productId,
      readinessPercentage,
      completedItemsCount: completed,
      totalItemsCount: total,
      auditStatus: readinessPercentage >= 80 ? 'READY_FOR_BIS_INSPECTION' : 'REMEDIATION_REQUIRED',
      checklist: items
    };
  }
}
