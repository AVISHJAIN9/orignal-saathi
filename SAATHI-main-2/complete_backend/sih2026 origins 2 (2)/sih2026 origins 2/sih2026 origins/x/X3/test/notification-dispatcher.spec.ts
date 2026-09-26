import { NotificationDispatcherService } from '../src/notification-dispatcher.service';

describe('X3: Notification Dispatcher Service', () => {
  let dispatcher: NotificationDispatcherService;

  beforeEach(() => {
    dispatcher = new NotificationDispatcherService();
  });

  it('should dispatch email and SMS notifications when contact details are supplied', async () => {
    const mockTicket: any = {
      ticketId: 'BIS-TKT-2026-001001',
      userEmail: 'msme@example.in',
      userPhone: '+919876543210',
      acknowledgementNotice: {
        english: 'Your ticket has been logged',
        hindi: 'आपका टिकट दर्ज किया गया है',
      },
    };

    const result = await dispatcher.dispatchTicketAcknowledgement(mockTicket);
    expect(result.emailDispatched).toBe(true);
    expect(result.smsDispatched).toBe(true);
  });

  it('should dispatch SLA breach alerts to departmental officers', async () => {
    const mockTicket: any = {
      ticketId: 'BIS-TKT-2026-001002',
      assignedDepartment: 'CAD',
      nodalContact: { nodalEmail: 'nodal@bis.gov.in' },
    };

    const result = await dispatcher.dispatchSlaBreachAlert(mockTicket);
    expect(result.officerNotified).toBe(true);
  });
});
