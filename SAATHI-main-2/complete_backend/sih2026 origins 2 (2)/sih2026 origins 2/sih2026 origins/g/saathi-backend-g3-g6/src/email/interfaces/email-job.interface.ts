import {
  EmailTemplateName
} from '../email-log.entity';

export interface PasswordResetPayload {

  resetLink: string;
  expiresInMinutes: number;

}

export interface EscalationTicketConfirmationPayload {

  ticketId: string;
  summary: string;

}

export interface AdminIngestionFailurePayload {

  documentId: string;
  errorMessage: string;

}

export type EmailPayload =
  | {
      template: EmailTemplateName.PASSWORD_RESET;
      data: PasswordResetPayload;
    }
  | {
      template: EmailTemplateName.ESCALATION_TICKET_CONFIRMATION;
      data: EscalationTicketConfirmationPayload;
    }
  | {
      template: EmailTemplateName.ADMIN_INGESTION_FAILURE;
      data: AdminIngestionFailurePayload;
    };

export interface EmailJobData {

  to: string;
  logId: string;
  payload: EmailPayload;

}
