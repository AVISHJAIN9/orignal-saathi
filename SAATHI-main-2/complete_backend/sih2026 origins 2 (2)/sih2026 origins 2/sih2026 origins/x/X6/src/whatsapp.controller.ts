import { Body, Controller, Get, Headers, HttpCode, Post, Query, Res } from '@nestjs/common';
import { WhatsAppWebhookService } from './whatsapp-webhook.service';
import { WhatsAppWebhookPayload, WhatsAppWebhookQuery } from './whatsapp.types';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly webhookService: WhatsAppWebhookService) {}

  @Get('webhook')
  public verifyWebhook(@Query() query: WhatsAppWebhookQuery, @Res() res: any) {
    const result = this.webhookService.verifyWebhook(query);
    if (result.valid) {
      return res.status(200).send(result.challenge);
    }
    return res.status(403).send('Forbidden');
  }

  @Post('webhook')
  @HttpCode(200)
  public async handleWebhook(
    @Body() payload: WhatsAppWebhookPayload,
    @Headers('x-hub-signature-256') signature?: string
  ) {
    return this.webhookService.processInboundWebhook(payload);
  }
}
