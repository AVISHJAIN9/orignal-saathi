import { EscalationService } from '../src/escalation.service';
import { NotificationDispatcherService } from '../src/notification-dispatcher.service';

describe('X3: Escalation Service (RBAC & SLA Lifecycle)', () => {
  let escalationService: EscalationService;
  let dispatcher: NotificationDispatcherService;

  beforeEach(() => {
    dispatcher = new NotificationDispatcherService();
    escalationService = new EscalationService(dispatcher);
  });

  it('should create an escalation ticket with full regional info and dispatch notices', async () => {
    const ticket = await escalationService.createTicket({
      userQuery: 'Clarification on IS 10500 Clause 4.2',
      userState: 'Assam',
      userEmail: 'assam.water@msme.in',
      userPhone: '+919988776655',
      confidenceScore: 0.15,
    });

    expect(ticket.ticketId).toMatch(/^BIS-TKT-\d{4}-\d{6}$/);
    expect(ticket.assignedRegion).toBe('EAST_REGIONAL_OFFICE_KOLKATA');
    expect(ticket.status).toBe('OPEN');
    expect(ticket.timelineEvents.length).toBe(2);
  });

  it('should enforce RBAC on status changes and resolution', async () => {
    const ticket = await escalationService.createTicket({
      userQuery: 'Test query',
    });

    // Unauthorized citizen attempt should fail
    expect(() => {
      escalationService.updateStatus(ticket.ticketId, 'IN_REVIEW', 'Citizen User', 'CITIZEN');
    }).toThrow();

    // Authorized officer update should succeed
    const updated = escalationService.updateStatus(ticket.ticketId, 'IN_REVIEW', 'Officer Sharma', 'BIS_OFFICER');
    expect(updated?.status).toBe('IN_REVIEW');

    // Authorized resolution
    const resolved = escalationService.resolveTicket({
      ticketId: ticket.ticketId,
      resolutionNotes: 'Clarified via Gazette Circular 2026/04',
      resolvedBy: 'Director - CAD',
      callerRole: 'ADMIN',
    });
    expect(resolved?.status).toBe('RESOLVED');
  });

  it('should scan and alert for SLA breaches', async () => {
    await escalationService.createTicket({
      userQuery: 'QCO breach test',
      category: 'QUALITY_CONTROL_ORDER_COMPLIANCE',
    });

    const breaches = await escalationService.scanAndAlertSlaBreaches();
    expect(Array.isArray(breaches)).toBe(true);
  });
});
