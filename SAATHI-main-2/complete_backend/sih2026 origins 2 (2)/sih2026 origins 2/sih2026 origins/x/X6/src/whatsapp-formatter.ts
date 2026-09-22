export class WhatsAppFormatter {
  public formatForWhatsApp(
    markdownText: string,
    citations?: Array<{ standardNumber: string; clauseNumber?: string; sectionTitle?: string }>,
    lang: 'en' | 'hi' = 'en'
  ): string {
    if (!markdownText) return '';

    let formatted = markdownText
      .replace(/\*\*(.*?)\*\*/g, '*$1*')
      .replace(/^###?\s+(.*?)$/gm, '*$1*')
      .replace(/^\s*-\s+/gm, '• ');

    if (citations && citations.length > 0) {
      const header = lang === 'hi' ? '\n\n*सत्यापित संदर्भ (BIS):*' : '\n\n*Verified References (BIS):*';
      formatted += header;
      const uniqueCitations = new Set<string>();

      for (const cit of citations) {
        let chip = `📌 [${cit.standardNumber}`;
        if (cit.clauseNumber) {
          chip += ` Cl. ${cit.clauseNumber}`;
        }
        if (cit.sectionTitle) {
          chip += ` - ${cit.sectionTitle}`;
        }
        chip += `]`;
        uniqueCitations.add(chip);
      }

      for (const chip of uniqueCitations) {
        formatted += `\n${chip}`;
      }
    }

    const footer = lang === 'hi'
      ? '\n\n_साथी (SAATHI) BIS डिजिटल सहायक | भारत सरकार_'
      : '\n\n_SAATHI BIS Digital Assistant | Govt of India_';

    formatted += footer;
    return formatted;
  }

  /**
   * Generates interactive WhatsApp List Dropdown for top standards
   */
  public getTopStandardsListMessage(toPhone: string): any {
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toPhone,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: 'BIS Indian Standards Directory' },
        body: { text: 'Select a standard below to view mandatory testing, scope, and certification fees:' },
        footer: { text: 'SAATHI BIS Assistant' },
        action: {
          button: 'Select Standard',
          sections: [
            {
              title: 'Popular MSME Standards',
              rows: [
                { id: 'LST_IS10500', title: 'IS 10500:2012', description: 'Drinking Water Specification' },
                { id: 'LST_IS456', title: 'IS 456:2000', description: 'Plain & Reinforced Concrete' },
                { id: 'LST_IS1293', title: 'IS 1293:2019', description: 'Plugs & Socket Outlets' },
                { id: 'LST_IS9873', title: 'IS 9873:2019', description: 'Safety of Toys' },
              ],
            },
          ],
        },
      },
    };
  }
}
