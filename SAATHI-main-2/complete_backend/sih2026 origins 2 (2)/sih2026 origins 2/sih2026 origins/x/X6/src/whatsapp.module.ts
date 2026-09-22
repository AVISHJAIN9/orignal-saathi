import { Module } from '@nestjs/common';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppFormatter } from './whatsapp-formatter';
import { WhatsAppOutboundClient } from './whatsapp-outbound.client';
import { WhatsAppSessionManager } from './whatsapp-session.manager';
import { WhatsAppWebhookService } from './whatsapp-webhook.service';

@Module({
  controllers: [WhatsAppController],
  providers: [
    WhatsAppWebhookService,
    WhatsAppSessionManager,
    WhatsAppFormatter,
    WhatsAppOutboundClient,
  ],
  exports: [
    WhatsAppWebhookService,
    WhatsAppSessionManager,
    WhatsAppFormatter,
    WhatsAppOutboundClient,
  ],
})
export class WhatsAppModule {}
