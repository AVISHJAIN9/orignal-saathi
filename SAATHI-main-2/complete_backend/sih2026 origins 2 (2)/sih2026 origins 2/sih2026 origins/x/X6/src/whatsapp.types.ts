export interface WhatsAppWebhookQuery {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}

export interface WhatsAppInboundMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'interactive' | 'button' | 'audio';
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  audio?: {
    id: string;
    mime_type: string;
  };
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: 'whatsapp';
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: WhatsAppInboundMessage[];
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppSessionState {
  phoneNumber: string;
  conversationId: string;
  userName?: string;
  language: 'en' | 'hi';
  optInStatus: boolean;
  optInDate: string;
  lastMessageTimestamp: number;
  activeIntent?: 'LOOKUP' | 'CERTIFICATION_STEPS' | 'CHECKLIST_DELIVERY' | 'HELPDESK_HANDOFF';
  currentStandard?: string;
}

export interface WhatsAppOutboundMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'interactive';
  text?: {
    body: string;
    preview_url?: boolean;
  };
  interactive?: any;
}
