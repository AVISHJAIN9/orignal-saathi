import { WhatsAppSessionManager } from '../src/whatsapp-session.manager';

describe('X6: WhatsApp Session Manager', () => {
  let sessionManager: WhatsAppSessionManager;

  beforeEach(() => {
    sessionManager = new WhatsAppSessionManager();
  });

  it('should create and sanitize phone number sessions', () => {
    const session = sessionManager.getOrCreateSession('+91 98765 43210', 'Rahul Sharma');
    expect(session.phoneNumber).toBe('919876543210');
    expect(session.optInStatus).toBe(true);
  });

  it('should handle STOP and START opt-out keywords', () => {
    const phone = '919876543210';
    sessionManager.getOrCreateSession(phone);

    const stopResult = sessionManager.handleOptInOut(phone, 'STOP');
    expect(stopResult.statusChanged).toBe(true);
    expect(stopResult.newOptInStatus).toBe(false);

    const startResult = sessionManager.handleOptInOut(phone, 'START');
    expect(startResult.statusChanged).toBe(true);
    expect(startResult.newOptInStatus).toBe(true);
  });
});
