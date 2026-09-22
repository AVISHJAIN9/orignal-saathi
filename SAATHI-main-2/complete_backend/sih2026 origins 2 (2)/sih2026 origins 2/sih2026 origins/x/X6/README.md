# Module X6: WhatsApp Bot Channel & Webhook Handler

## Overview
Module X6 integrates the SAATHI BIS Assistant directly into WhatsApp using Meta Cloud API with session tracking, opt-out management, and interactive menus.

## Key Capabilities
- **Meta Cloud Webhook Verification & HMAC Security**: Validates inbound requests and signatures.
- **Outbound Graph API Dispatcher**: Dispatches interactive lists, buttons, and text messages with BIS citation chips.
- **STOP / START Consent Tracking**: Compliant with Meta Business Messaging opt-in/opt-out rules.
- **Audio Message Forwarding**: Hands off voice notes to Module X7 for speech recognition.

## Endpoints
- `GET /whatsapp/webhook`
- `POST /whatsapp/webhook`
