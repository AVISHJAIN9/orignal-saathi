import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BIS_REGIONAL_OFFICES, HelpdeskRouter } from './helpdesk-router';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import {
  CreateTicketDto,
  EscalationTicket,
  ResolveTicketDto,
  TicketStatus,
  TicketTimelineEvent,
  UserRole,
} from './escalation.types';

@Injectable()
export class EscalationService {
  private readonly router: HelpdeskRouter;
  private readonly ticketStore: Map<string, EscalationTicket> = new Map();
  private ticketSequence: number = 1000;

  constructor(private readonly dispatcher?: NotificationDispatcherService) {
    this.router = new HelpdeskRouter();
  }

  private generateTicketId(): string {
    this.ticketSequence++;
    const year = new Date().getFullYear();
    return `BIS-TKT-${year}-${this.ticketSequence.toString().padStart(6, '0')}`;
  }

  private generateBilingualNotice(
    ticketId: string,
    slaTargetHours: number,
    department: string
  ): { english: string; hindi: string } {
    return {
      english: `Your query has been escalated to ${department} under Ticket ID: ${ticketId}. Our technical officers will review and provide statutory clarification within ${slaTargetHours} hours.`,
      hindi: `आपका प्रश्न टिकट आईडी ${ticketId} के तहत ${department} को भेजा गया है। हमारे तकनीकी अधिकारी ${slaTargetHours} घंटों के भीतर आधिकारिक स्पष्टीकरण प्रदान करेंगे।`,
    };
  }

  public calculateSlaStatus(
    createdAtIso: string,
    slaTargetHours: number,
    status: TicketStatus
  ): { hoursRemaining: number; isBreached: boolean; breachWarning: boolean } {
    if (status === 'RESOLVED' || status === 'CLOSED') {
      return { hoursRemaining: 0, isBreached: false, breachWarning: false };
    }

    const elapsedMs = Date.now() - new Date(createdAtIso).getTime();
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, Number((slaTargetHours - elapsedHours).toFixed(1)));
    const isBreached = elapsedHours > slaTargetHours;
    const breachWarning = hoursRemaining < 6 && !isBreached;

    return { hoursRemaining, isBreached, breachWarning };
  }

  public async createTicket(dto: CreateTicketDto): Promise<EscalationTicket> {
    const category = dto.category || this.router.classifyCategory(dto.userQuery);
    const region = this.router.resolveRegion(dto.userState);
    const department = this.router.resolveDepartment(category);
    const nodalContact = BIS_REGIONAL_OFFICES[region];
    const confidenceScore = dto.confidenceScore ?? 0.0;

    const { priority, slaTargetHours } = this.router.calculatePriorityAndSLA(
      confidenceScore,
      category
    );

    const ticketId = this.generateTicketId();
    const now = new Date().toISOString();

    const acknowledgementNotice = this.generateBilingualNotice(
      ticketId,
      slaTargetHours,
      department
    );

    const initialEvents: TicketTimelineEvent[] = [
      {
        eventId: `EVT-${Date.now()}-1`,
        eventType: 'TICKET_CREATED',
        description: 'Escalation ticket initiated automatically from chat pipeline',
        actor: 'SAATHI Automation Engine',
        timestamp: now,
      },
      {
        eventId: `EVT-${Date.now()}-2`,
        eventType: 'ROUTED_TO_OFFICE',
        description: `Routed to ${nodalContact.officeName} (${department})`,
        actor: 'Helpdesk Routing Engine',
        timestamp: now,
      },
    ];

    const ticket: EscalationTicket = {
      ticketId,
      messageId: dto.messageId,
      conversationId: dto.conversationId,
      userQuery: dto.userQuery,
      userEmail: dto.userEmail,
      userPhone: dto.userPhone,
      userState: dto.userState,
      reason: dto.reason || 'Query escalated due to low confidence in standard documentation.',
      confidenceScore,
      priority: dto.priority || priority,
      category,
      assignedRegion: region,
      assignedDepartment: department,
      nodalContact,
      status: 'OPEN',
      slaTargetHours,
      slaBreachWarning: false,
      isBreached: false,
      hoursRemainingBeforeBreach: slaTargetHours,
      acknowledgementNotice,
      timelineEvents: initialEvents,
      createdAt: now,
      updatedAt: now,
    };

    this.ticketStore.set(ticketId, ticket);

    // Dispatch real email/SMS notifications
    if (this.dispatcher) {
      await this.dispatcher.dispatchTicketAcknowledgement(ticket);
    }

    return ticket;
  }

  public getTicketById(ticketId: string): EscalationTicket | null {
    const ticket = this.ticketStore.get(ticketId);
    if (!ticket) return null;

    const sla = this.calculateSlaStatus(
      ticket.createdAt,
      ticket.slaTargetHours,
      ticket.status
    );
    ticket.hoursRemainingBeforeBreach = sla.hoursRemaining;
    ticket.slaBreachWarning = sla.breachWarning;
    ticket.isBreached = sla.isBreached;

    return ticket;
  }

  public updateStatus(
    ticketId: string,
    status: TicketStatus,
    actor: string = 'BIS Nodal Officer',
    callerRole: UserRole = 'BIS_OFFICER'
  ): EscalationTicket | null {
    if (callerRole !== 'BIS_OFFICER' && callerRole !== 'ADMIN') {
      throw new UnauthorizedException('Only authorized BIS officers or administrators can update ticket status.');
    }

    const ticket = this.ticketStore.get(ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    ticket.status = status;
    ticket.updatedAt = now;

    ticket.timelineEvents.push({
      eventId: `EVT-${Date.now()}`,
      eventType: 'STATUS_CHANGED',
      description: `Status updated to ${status} by ${actor}`,
      actor,
      timestamp: now,
    });

    this.ticketStore.set(ticketId, ticket);
    return ticket;
  }

  public resolveTicket(dto: ResolveTicketDto): EscalationTicket | null {
    const role = dto.callerRole || 'BIS_OFFICER';
    if (role !== 'BIS_OFFICER' && role !== 'ADMIN') {
      throw new UnauthorizedException('Only authorized BIS officers can provide official ticket resolutions.');
    }

    const ticket = this.ticketStore.get(dto.ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    ticket.status = 'RESOLVED';
    ticket.resolutionNotes = dto.resolutionNotes;
    ticket.resolvedAt = now;
    ticket.updatedAt = now;
    ticket.hoursRemainingBeforeBreach = 0;
    ticket.slaBreachWarning = false;
    ticket.isBreached = false;

    ticket.timelineEvents.push({
      eventId: `EVT-${Date.now()}`,
      eventType: 'RESOLUTION_ADDED',
      description: `Official resolution provided by ${dto.resolvedBy}`,
      actor: dto.resolvedBy,
      timestamp: now,
    });

    this.ticketStore.set(dto.ticketId, ticket);
    return ticket;
  }

  /**
   * Automated cron scanner checking all active tickets for SLA breach warnings
   */
  public async scanAndAlertSlaBreaches(): Promise<EscalationTicket[]> {
    const breachingTickets: EscalationTicket[] = [];

    for (const ticket of this.ticketStore.values()) {
      if (ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED') {
        const sla = this.calculateSlaStatus(ticket.createdAt, ticket.slaTargetHours, ticket.status);
        ticket.hoursRemainingBeforeBreach = sla.hoursRemaining;
        ticket.slaBreachWarning = sla.breachWarning;
        ticket.isBreached = sla.isBreached;

        if (sla.breachWarning || sla.isBreached) {
          breachingTickets.push(ticket);
          if (this.dispatcher) {
            await this.dispatcher.dispatchSlaBreachAlert(ticket);
          }
        }
      }
    }

    return breachingTickets;
  }

  public listTickets(filters?: {
    status?: TicketStatus;
    category?: string;
    conversationId?: string;
  }): EscalationTicket[] {
    let tickets = Array.from(this.ticketStore.values());

    if (filters?.status) {
      tickets = tickets.filter((t) => t.status === filters.status);
    }
    if (filters?.category) {
      tickets = tickets.filter((t) => t.category === filters.category);
    }
    if (filters?.conversationId) {
      tickets = tickets.filter((t) => t.conversationId === filters.conversationId);
    }

    return tickets.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
