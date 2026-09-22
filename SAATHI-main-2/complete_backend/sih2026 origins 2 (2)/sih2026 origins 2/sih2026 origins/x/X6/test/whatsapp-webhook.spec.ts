import { WhatsAppFormatter } from '../src/whatsapp-formatter';
import { WhatsAppOutboundClient } from '../src/whatsapp-outbound.client';
import { WhatsAppSessionManager } from '../src/whatsapp-session.manager';
import { WhatsAppWebhookService } from '../src/whatsapp-webhook.service';

describe('X6: WhatsApp Webhook Service', () => {
  let webhookService: WhatsAppWebhookService;
  let sessionManager: WhatsAppSessionManager;
  let formatter: WhatsAppFormatter;
  let outboundClient: WhatsAppOutboundClient;

  beforeEach(() => {
    sessionManager = new WhatsAppSessionManager();
    formatter = new WhatsAppFormatter();
    outboundClient = new WhatsAppOutboundClient();
    webhookService = new WhatsAppWebhookService(
      sessionManager,
      formatter,
      outboundClient
    );
  });

  it('should verify webhook challenge with correct token', () => {
    const result = webhookService.verifyWebhook({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'saathi_bis_secure_wa_webhook_token_2026',
      'hub.challenge': '12345678',
    });
    expect(result.valid).toBe(true);
    expect(result.challenge).toBe('12345678');
  });

  it('should process inbound text message and send outbound response', async () => {
    const payload: any = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '123',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '123', phone_number_id: '456' },
                messages: [
                  {
                    from: '919876543210',
                    id: 'msg_001',
                    timestamp: '1600000000',
                    type: 'text',
                    text: { body: 'What are the requirements for IS 10500?' },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const res = await webhookService.processInboundWebhook(payload);
    expect(res.processed).toBe(1);
    expect(res.outboundSent).toBe(1);
  });

  it('should intercept audio messages and return voice acknowledgment', async () => {
    const payload: any = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '123',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '123', phone_number_id: '456' },
                messages: [
                  {
                    from: '919876543210',
                    id: 'msg_002',
                    timestamp: '1600000000',
                    type: 'audio',
                    audio: { id: 'aud_123', mime_type: 'audio/ogg' },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const res = await webhookService.processInboundWebhook(payload);
    expect(res.processed).toBe(1);
    expect(res.outboundSent).toBe(1);
  });
});
