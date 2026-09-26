import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppOutboundMessage } from './whatsapp.types';

@Injectable()
export class WhatsAppOutboundClient {
  private readonly logger = new Logger(WhatsAppOutboundClient.name);
  private readonly apiToken: string;
  private readonly phoneNumberId: string;

  constructor() {
    this.apiToken = process.env.WHATSAPP_API_TOKEN || 'mock_whatsapp_cloud_token';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || 'mock_phone_number_id';
  }

  /**
   * Dispatches outbound message payload to Meta Graph API
   */
  public async sendMessage(message: WhatsAppOutboundMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const url = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;

    try {
      this.logger.log(`Dispatching WhatsApp message to ${message.to}`);

      // In production environment with live API token:
      if (this.apiToken !== 'mock_whatsapp_cloud_token') {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Meta API error (${response.status}): ${errBody}`);
        }

        const data: any = await response.json();
        return { success: true, messageId: data.messages?.[0]?.id };
      }

      // Simulated success in test/dev
      return { success: true, messageId: `wamid.HBgL${Date.now()}` };
    } catch (err) {
      this.logger.error(`Failed to send WhatsApp message: ${(err as Error).message}`);
      return { success: false, error: (err as Error).message };
    }
  }
}
