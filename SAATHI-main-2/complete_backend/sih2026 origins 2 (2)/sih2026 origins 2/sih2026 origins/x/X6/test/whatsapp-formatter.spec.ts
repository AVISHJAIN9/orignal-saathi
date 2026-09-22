import { WhatsAppFormatter } from '../src/whatsapp-formatter';

describe('X6: WhatsApp Formatter', () => {
  let formatter: WhatsAppFormatter;

  beforeEach(() => {
    formatter = new WhatsAppFormatter();
  });

  it('should format markdown into WhatsApp bold and bullet formatting', () => {
    const md = `**Important Notice:**\n- IS 10500 specifies water requirements.\n- IS 456 specifies concrete.`;
    const formatted = formatter.formatForWhatsApp(md);
    expect(formatted).toContain('*Important Notice:*');
    expect(formatted).toContain('• IS 10500');
  });

  it('should generate interactive List dropdown messages', () => {
    const listMsg = formatter.getTopStandardsListMessage('919876543210');
    expect(listMsg.type).toBe('interactive');
    expect(listMsg.interactive.type).toBe('list');
    expect(listMsg.interactive.action.sections[0].rows.length).toBeGreaterThanOrEqual(4);
  });
});
