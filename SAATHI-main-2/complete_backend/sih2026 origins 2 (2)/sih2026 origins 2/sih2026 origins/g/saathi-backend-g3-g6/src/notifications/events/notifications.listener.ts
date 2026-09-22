import {
  Injectable,
  Logger
} from '@nestjs/common';
import {
  OnEvent
} from '@nestjs/event-emitter';
import to from 'await-to-js';
import {
  NotificationsService
} from '../notifications.service';
import {
  NotificationType
} from '../notification.entity';

export interface EscalationTicketUpdatedEvent {

  userId: string;
  ticketId: string;
  status: string;

}

export interface SessionActivityEvent {

  userId: string;
  conversationId: string;
  summary: string;

}

@Injectable(
)
export class NotificationsListener {

  private readonly logger = new Logger(
    NotificationsListener.name
  );

  constructor(
    private readonly notificationsService: NotificationsService
  ) {

  }

  @OnEvent(
    'escalation.ticket.updated'
  )
  async onEscalationTicketUpdated(
    eventData: EscalationTicketUpdatedEvent
  ): Promise<
    void
  > {

    const [
      createError
    ] = await to(
      this.notificationsService.create(
        {
          userId: eventData.userId,
          type: NotificationType.ESCALATION_TICKET_UPDATE,
          message: `Your escalation ticket ${eventData.ticketId} is now ${eventData.status}.`,
          metadata: {
            ticketId: eventData.ticketId,
            status: eventData.status
          }
        }
      )
    );

    if (
      createError
    ) {
      this.logger.error(
        `Failed to create escalation notification for user ${eventData.userId}`
      );
    }

  }

  @OnEvent(
    'session.activity'
  )
  async onSessionActivity(
    eventData: SessionActivityEvent
  ): Promise<
    void
  > {

    const [
      createError
    ] = await to(
      this.notificationsService.create(
        {
          userId: eventData.userId,
          type: NotificationType.SESSION_ACTIVITY,
          message: eventData.summary,
          metadata: {
            conversationId: eventData.conversationId
          }
        }
      )
    );

    if (
      createError
    ) {
      this.logger.error(
        `Failed to create session activity notification for user ${eventData.userId}`
      );
    }

  }

  @OnEvent(
    'ingestion.failed'
  )
  async onIngestionFailed(
    eventData: {
      adminUserId: string;
      documentId: string;
      error: string;
    }
  ): Promise<
    void
  > {

    this.logger.warn(
      `Ingestion failure notification for doc ${eventData.documentId}`
    );

    const [
      createError
    ] = await to(
      this.notificationsService.create(
        {
          userId: eventData.adminUserId,
          type: NotificationType.SYSTEM,
          message: `Ingestion failed for document ${eventData.documentId}.`,
          metadata: {
            documentId: eventData.documentId,
            error: eventData.error
          }
        }
      )
    );

    if (
      createError
    ) {
      this.logger.error(
        `Failed to create ingestion failure notification for admin ${eventData.adminUserId}`
      );
    }

  }

}
