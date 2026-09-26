# Module X3: Human-in-the-Loop Escalation & BIS Helpdesk Routing Engine

## Overview
Module X3 auto-routes low-confidence, complex, or sensitive regulatory queries to BIS Regional Offices and Departmental Nodal Officers.

## Key Capabilities
- **Geographic Routing (All 36 States & UTs)**: Routes to Northern (Delhi NCR), Western (Mumbai), Southern (Chennai), Eastern (Kolkata), Central (Chandigarh), or HQ desks.
- **Bilingual Auto-Responder**: Emits English & Hindi acknowledgement notices.
- **SLA Breach Predictor**: Dynamically tracks resolution deadlines and sends breach warnings.
- **RBAC Authorization**: Restricts status updates and resolution notes to authorized BIS officers.
- **Multi-Channel Notification Dispatcher**: Outbound alerts via Email, SMS, and WhatsApp.

## Endpoints
- `POST /escalations/create`
- `GET /escalations/:id`
- `PATCH /escalations/:id/status`
- `POST /escalations/resolve`
- `GET /escalations/sla/scan-breaches`
- `GET /escalations`
