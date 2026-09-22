import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptNormalizer {
  private readonly devanagariDigits: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  };

  private readonly hindiNumberWords: Record<string, string> = {
    'ek': '1', 'do': '2', 'teen': '3', 'char': '4', 'chaar': '4',
    'panch': '5', 'paanch': '5', 'chhe': '6', 'chhah': '6', 'saat': '7',
    'aath': '8', 'nau': '9', 'das': '10', 'gyarah': '11', 'barah': '12',
    'pandrah': '15', 'bees': '20', 'pachees': '25', 'pachaas': '50',
    'sau': '100', 'hazar': '1000', 'hazaar': '1000',
  };

  private readonly phoneticStandardsMap: Array<{ pattern: RegExp; replacement: string }> = [
    { pattern: /(?:^|\s)(?:आईएस|आई\s*एस|आइ\s*एस)\s*([0-9]+)/gi, replacement: ' IS $1' },
    { pattern: /(?:^|\s)(?:क्लॉज़|खंड|धारा)\s*([0-9]+(?:\.[0-9]+)*)/gi, replacement: ' Clause $1' },
    { pattern: /\b(?:a+y+i+|a+y+e+e+|i+s+h+|i+e+s+)\s*(?:y+e+s+|e+s+|s+)\s*(\d+)/gi, replacement: 'IS $1' },
    { pattern: /\b(?:aaye|aayi|aye|i)\s*s\s*(\d+)/gi, replacement: 'IS $1' },
    { pattern: /\bis\s*(\d+)/gi, replacement: 'IS $1' },
    { pattern: /\b(?:standard|stndrd)\s*(\d+)/gi, replacement: 'IS $1' },
    { pattern: /\bclause\s*(\d+)\s*(?:point|dash|\.)\s*(\d+)/gi, replacement: 'Clause $1.$2' },
    { pattern: /\btable\s*(\d+)/gi, replacement: 'Table $1' },
  ];

  private readonly fillerWords = [
    'um', 'uh', 'hmm', 'ah', 'like', 'you know', 'matlab', 'woh', 'haan', 'arre', 'bhai'
  ];

  public convertDevanagariDigits(text: string): string {
    return text.replace(/[०-९]/g, (digit) => this.devanagariDigits[digit] || digit);
  }

  public normalize(rawTranscript: string): { normalized: string; phoneticMatches: string[] } {
    if (!rawTranscript || typeof rawTranscript !== 'string') {
      return { normalized: '', phoneticMatches: [] };
    }

    let text = this.convertDevanagariDigits(rawTranscript.trim());
    const phoneticMatches: string[] = [];

    // Remove fillers
    for (const filler of this.fillerWords) {
      const fillerRegex = new RegExp(`\\b${filler}\\b`, 'gi');
      text = text.replace(fillerRegex, ' ');
    }

    // Replace phonetic standard words
    for (const mapping of this.phoneticStandardsMap) {
      if (mapping.pattern.test(text)) {
        const match = text.match(mapping.pattern);
        if (match) {
          phoneticMatches.push(...match);
        }
        text = text.replace(mapping.pattern, mapping.replacement);
      }
    }

    const normalized = text.replace(/\s+/g, ' ').trim();

    return {
      normalized,
      phoneticMatches,
    };
  }

  public inferIntentAndStandard(query: string): { intent: any; standard?: string } {
    const q = query.toLowerCase();

    let standard: string | undefined = undefined;
    if (q.includes('10500') || q.includes('paani') || q.includes('water')) {
      standard = 'IS 10500';
    } else if (q.includes('456') || q.includes('concrete')) {
      standard = 'IS 456';
    } else if (q.includes('1293') || q.includes('plug') || q.includes('socket')) {
      standard = 'IS 1293';
    } else if (q.includes('9873') || q.includes('toy') || q.includes('khilona')) {
      standard = 'IS 9873';
    }

    if (q.includes('fee') || q.includes('kharcha') || q.includes('paisa') || q.includes('cost')) {
      return { intent: 'FEE_LAB_PROCEDURE', standard };
    }
    if (q.includes('limit') || q.includes('clause') || q.includes('tds') || q.includes('strength')) {
      return { intent: 'CLAUSE_REQUIREMENTS', standard };
    }
    if (q.includes('mandatory') || q.includes('zaruri') || q.includes('license') || q.includes('isi mark')) {
      return { intent: 'PRODUCT_COMPLIANCE', standard };
    }

    return { intent: 'STANDARD_LOOKUP', standard };
  }
}
