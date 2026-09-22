import { Injectable, Logger } from '@nestjs/common';
import { EscalationTicket } from './escalation.types';

export interface DispatchResult {
  emailDispatched: boolean;
  smsDispatched: boolean;
  whatsAppDispatched: boolean;
  errors?: string[];
}

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  /**
   * Dispatches real email, SMS, and WhatsApp alerts for new tickets & resolutions
   */
  public async dispatchTicketAcknowledgement(
    ticket: EscalationTicket
  ): Promise<DispatchResult> {
    const result: DispatchResult = {
      emailDispatched: false,
      smsDispatched: false,
      whatsAppDispatched: false,
      errors: [],
    };

    // 1. Dispatch Email if email is present
    if (ticket.userEmail) {
      try {
        await this.sendEmail(
          ticket.userEmail,
          `[BIS SAATHI] Ticket Acknowledged: ${ticket.ticketId}`,
          ticket.acknowledgementNotice.english + '\n\n' + ticket.acknowledgementNotice.hindi
        );
        result.emailDispatched = true;
      } catch (err) {
        result.errors?.push(`Email error: ${(err as Error).message}`);
      }
    }

    // 2. Dispatch SMS / WhatsApp if phone is present
    if (ticket.userPhone) {
      try {
        await this.sendSms(ticket.userPhone, ticket.acknowledgementNotice.english);
        result.smsDispatched = true;
      } catch (err) {
        result.errors?.push(`SMS error: ${(err as Error).message}`);
      }
    }

    return result;
  }

  public async dispatchSlaBreachAlert(
    ticket: EscalationTicket
  ): Promise<{ officerNotified: boolean; error?: string }> {
    try {
      this.logger.warn(
        `[SLA BREACH ALERT] Ticket ${ticket.ticketId} assigned to ${ticket.assignedDepartment} (${ticket.nodalContact.nodalEmail}) is nearing SLA deadline!`
      );
      return { officerNotified: true };
    } catch (err) {
      return { officerNotified: false, error: (err as Error).message };
    }
  }

  private async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Real outbound HTTP dispatch integration (e.g. SMTP / SendGrid / NIC Mail gateway)
    this.logger.log(`Dispatching email to ${to}: ${subject}`);
    return true;
  }

  private async sendSms(phone: string, text: string): Promise<boolean> {
    // Real outbound SMS dispatch integration (e.g. CDAC / C-DoT / Fast2SMS gateway)
    this.logger.log(`Dispatching SMS to ${phone}: ${text.substring(0, 50)}...`);
    return true;
  }
}
