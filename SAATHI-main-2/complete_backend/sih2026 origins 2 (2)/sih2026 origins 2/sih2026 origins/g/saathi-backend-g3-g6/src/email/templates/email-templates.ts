import {
  EmailTemplateName
} from '../email-log.entity';
import {
  EmailPayload
} from '../interfaces/email-job.interface';

export interface RenderedEmail {

  subject: string;
  html: string;
  text: string;

}

// Renders email subject and bodies based on template type
export function renderEmail(
  payloadData: EmailPayload
): RenderedEmail {

  if (
    payloadData.template === EmailTemplateName.PASSWORD_RESET
  ) {
    const {
      resetLink,
      expiresInMinutes
    } = payloadData.data;

    return {
      subject: 'Reset your SAATHI password',
      text: `We received a request to reset your SAATHI password. This link expires in ${expiresInMinutes} minutes:\n${resetLink}\n\nIf you didn't request this, you can ignore this email.`,
      html: `<p>We received a request to reset your SAATHI password.</p>
<p><a href="${resetLink}">Reset your password</a> (expires in ${expiresInMinutes} minutes)</p>
<p>If you didn't request this, you can ignore this email.</p>`
    };
  }

  if (
    payloadData.template === EmailTemplateName.ESCALATION_TICKET_CONFIRMATION
  ) {
    const {
      ticketId,
      summary
    } = payloadData.data;

    return {
      subject: `SAATHI escalation ticket ${ticketId} received`,
      text: `Your query was routed to the BIS helpdesk. Ticket: ${ticketId}\nSummary: ${summary}`,
      html: `<p>Your query was routed to the BIS helpdesk.</p><p><strong>Ticket:</strong> ${ticketId}</p><p><strong>Summary:</strong> ${summary}</p>`
    };
  }

  const {
    documentId,
    errorMessage
  } = payloadData.data;

  return {
    subject: `Ingestion failed for document ${documentId}`,
    text: `Document ${documentId} failed to ingest.\nError: ${errorMessage}`,
    html: `<p>Document <code>${documentId}</code> failed to ingest.</p><pre>${errorMessage}</pre>`
  };

}
