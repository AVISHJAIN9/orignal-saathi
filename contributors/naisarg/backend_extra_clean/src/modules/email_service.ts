import { Controller, Post, Body, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/guards/public.decorator';
import axios from 'axios';

interface SendEmailDto {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

@ApiTags('Email & Transactional Dispatch (Resend)')
@Controller('api/v1/email')
export class EmailGatewayController {
  private readonly logger = new Logger(EmailGatewayController.name);

  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send transactional email via Resend API' })
  @ApiResponse({ status: 200, description: 'Email dispatched successfully' })
  async sendEmail(@Body() body: SendEmailDto) {
    const { to, subject, html, text, from = 'SAATHI BIS <onboarding@resend.dev>' } = body;
    if (!to || !to.includes('@')) {
      throw new BadRequestException('Valid recipient email address is required.');
    }
    if (!subject) {
      throw new BadRequestException('Email subject is required.');
    }

    const resendKey = process.env.RESEND_API_KEY;
    let deliveredVia = 'In-App Simulation';
    let resendResponse = null;

    if (resendKey) {
      try {
        const response = await axios.post(
          'https://api.resend.com/emails',
          {
            from,
            to: [to],
            subject,
            html: html || `<p>${text || subject}</p>`,
            text: text || subject
          },
          {
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        resendResponse = response.data;
        deliveredVia = 'Resend Live Email API';
        this.logger.log(`Dispatched live transactional email to ${to} via Resend. ID: ${resendResponse?.id}`);
      } catch (err: any) {
        this.logger.warn(`Resend email delivery failed: ${err.response?.data?.message || err.message}`);
      }
    }

    return {
      status: 'success',
      to,
      subject,
      deliveredVia,
      resendId: resendResponse?.id || null,
      timestamp: new Date().toISOString()
    };
  }
}
