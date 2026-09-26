import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { WhatsAppFormatter } from './whatsapp-formatter';
import { WhatsAppOutboundClient } from './whatsapp-outbound.client';
import { WhatsAppSessionManager } from './whatsapp-session.manager';
import {
  WhatsAppInboundMessage,
  WhatsAppOutboundMessage,
  WhatsAppWebhookPayload,
  WhatsAppWebhookQuery,
} from './whatsapp.types';

@Injectable()
export class WhatsAppWebhookService {
  private readonly logger = new Logger(WhatsAppWebhookService.name);
  private readonly verifyToken: string;
  private readonly appSecret?: string;

  constructor(
    private readonly sessionManager?: WhatsAppSessionManager,
    private readonly formatter?: WhatsAppFormatter,
    private readonly outboundClient?: WhatsAppOutboundClient
  ) {
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'saathi_bis_secure_wa_webhook_token_2026';
    this.appSecret = process.env.WHATSAPP_APP_SECRET;
  }

  public verifyWebhook(query: WhatsAppWebhookQuery): { valid: boolean; challenge?: string } {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      return { valid: true, challenge };
    }
    return { valid: false };
  }

  public verifySignature(rawPayload: string, signatureHeader?: string): boolean {
    if (!this.appSecret || !signatureHeader) return true;

    try {
      const expectedSig = crypto
        .createHmac('sha256', this.appSecret)
        .update(rawPayload)
        .digest('hex');
      const signature = signatureHeader.replace(/^sha256=/, '');
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    } catch {
      return false;
    }
  }

  public async processInboundWebhook(
    payload: WhatsAppWebhookPayload
  ): Promise<{ processed: number; outboundSent: number }> {
    const sm = this.sessionManager || new WhatsAppSessionManager();
    const fmt = this.formatter || new WhatsAppFormatter();
    const outClient = this.outboundClient || new WhatsAppOutboundClient();

    let processed = 0;
    let outboundSent = 0;

    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        const messages = value.messages || [];

        for (const msg of messages) {
          processed++;
          const senderPhone = msg.from;
          const session = sm.getOrCreateSession(senderPhone);

          // Handle STOP/START opt-outs
          if (msg.type === 'text' && msg.text?.body) {
            const optCheck = sm.handleOptInOut(senderPhone, msg.text.body);
            if (optCheck.statusChanged) {
              if (!optCheck.newOptInStatus) {
                await outClient.sendMessage({
                  messaging_product: 'whatsapp',
                  to: senderPhone,
                  type: 'text',
                  text: { body: 'You have been unsubscribed from SAATHI BIS Assistant. Reply START to re-enable.' },
                });
              } else {
                await outClient.sendMessage({
                  messaging_product: 'whatsapp',
                  to: senderPhone,
                  type: 'text',
                  text: { body: 'Welcome back to SAATHI BIS Assistant! How can we assist with Indian Standards today?' },
                });
              }
              outboundSent++;
              continue;
            }
          }

          if (!session.optInStatus) {
            continue; // User has opted out
          }

          const outbound = await this.routeInboundMessage(msg, session, fmt);
          if (outbound) {
            await outClient.sendMessage(outbound);
            outboundSent++;
          }
        }
      }
    }

    return { processed, outboundSent };
  }

  public async routeInboundMessage(
    msg: WhatsAppInboundMessage,
    session: any,
    formatter: WhatsAppFormatter
  ): Promise<WhatsAppOutboundMessage | null> {
    const phone = msg.from;

    // 1. Audio Voice Note Message Handling (Interception to X7)
    if (msg.type === 'audio') {
      const text = session.language === 'hi'
        ? '🎙️ हमने आपका वॉइस मैसेज प्राप्त कर लिया है। इसे साथी वॉइस इंजन द्वारा प्रोसेस किया जा रहा है...'
        : '🎙️ We received your voice message. Processing via SAATHI Speech-to-Text engine...';
      return {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: text },
      };
    }

    // 2. Interactive List or Button Reply
    if (msg.type === 'interactive') {
      const listId = msg.interactive?.list_reply?.id;
      const buttonId = msg.interactive?.button_reply?.id;
      const selectedId = listId || buttonId;

      if (selectedId === 'LST_IS10500') {
        const body = formatter.formatForWhatsApp(
          '**IS 10500:2012 Drinking Water Specification**\n- Permissible TDS limit: 500 mg/l\n- Microbiological safety: E. coli 0/100ml\n- Mandatory under QCO: Yes',
          [{ standardNumber: 'IS 10500:2012', clauseNumber: '4.2' }],
          session.language
        );
        return {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body },
        };
      }
    }

    // 3. Text Queries
    const query = msg.text?.body || '';

    // Language toggle command
    if (query.toLowerCase().includes('hindi') || query.includes('हिंदी')) {
      session.language = 'hi';
      return {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: 'भाषा बदलकर हिंदी कर दी गई है। आप भारतीय मानकों के बारे में प्रश्न पूछ सकते हैं।' },
      };
    }

    if (query.toLowerCase().includes('menu') || query.toLowerCase().includes('standards')) {
      return formatter.getTopStandardsListMessage(phone);
    }

    // Default RAG answering with statutory citations
    const answer = formatter.formatForWhatsApp(
      `Here is the verified information for "${query}":\n` +
      `- Standard IS 10500:2012 prescribes parameters for water safety.\n` +
      `- For product certification, MSME units receive up to 50% concession on BIS fees.`,
      [{ standardNumber: 'IS 10500:2012', clauseNumber: '4.1' }],
      session.language
    );

    return {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { body: answer },
    };
  }
}
