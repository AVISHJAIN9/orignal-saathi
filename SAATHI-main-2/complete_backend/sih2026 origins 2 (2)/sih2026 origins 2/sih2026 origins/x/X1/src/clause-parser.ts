export interface ParsedClauseReference {
  standardNumber: string | null;
  clauseNumber: string | null;
  tableNumber: string | null;
  annexNumber: string | null;
  figureNumber: string | null;
  sectionTitle: string | null;
  rawReference: string;
  anchorSlug: string;
}

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

function normalizeDevanagari(text: string): string {
  return text.replace(/[०-९]/g, (d) => DEVANAGARI_DIGITS[d] || d);
}

// Regex patterns for global and compound citation extraction
const IS_STANDARD_REGEX = /\b(IS(?:\s*[\/\-]\s*(?:ISO|IEC))?\s+\d+(?:(?:\s*[\-\(]\s*Part\s*\d+[\-\)]?)|\s*:\s*\d{4})?)\b/gi;
const CLAUSE_REGEX = /\b(?:Clause|Section|Cl\.|Sec\.)\s*([0-9]+(?:\.[0-9]+)*)\b/i;
const TABLE_REGEX = /\b(?:Table|Tbl\.)\s*([0-9]+|[A-Z])(?:\s*(?:Item|Row)\s*([0-9]+))?\b/i;
const ANNEX_REGEX = /\b(?:Annexure|Annex|Ann\.)\s*([A-Z0-9]+)\b/i;
const FIGURE_REGEX = /\b(?:Figure|Fig\.)\s*([0-9]+(?:\.[0-9]+)*)\b/i;
const TITLE_REGEX = /\(([^)]+)\)$/;

/**
 * Parses a single reference string into a structured clause reference
 */
export function parseClauseReference(rawCitationString: string): ParsedClauseReference {
  if (!rawCitationString || typeof rawCitationString !== 'string') {
    return {
      standardNumber: null,
      clauseNumber: null,
      tableNumber: null,
      annexNumber: null,
      figureNumber: null,
      sectionTitle: null,
      rawReference: '',
      anchorSlug: 'section-main',
    };
  }

  const cleanText = normalizeDevanagari(rawCitationString.trim());

  // Match standard number
  const standardMatch = cleanText.match(IS_STANDARD_REGEX);
  let extractedStandardNumber: string | null = null;
  if (standardMatch && standardMatch[0]) {
    extractedStandardNumber = standardMatch[0].replace(/\s+/g, ' ').trim();
  }

  // Match clause
  const clauseMatch = cleanText.match(CLAUSE_REGEX);
  let extractedClauseNumber: string | null = null;
  if (clauseMatch && clauseMatch[1]) {
    extractedClauseNumber = clauseMatch[1].trim();
  }

  // Match table (supporting compound "Table 2 Item 4")
  const tableMatch = cleanText.match(TABLE_REGEX);
  let extractedTableNumber: string | null = null;
  if (tableMatch && tableMatch[1]) {
    extractedTableNumber = tableMatch[1].trim();
    if (tableMatch[2]) {
      extractedTableNumber += `-item-${tableMatch[2].trim()}`;
    }
  }

  // Match annexure
  const annexMatch = cleanText.match(ANNEX_REGEX);
  let extractedAnnexNumber: string | null = null;
  if (annexMatch && annexMatch[1]) {
    extractedAnnexNumber = annexMatch[1].trim();
  }

  // Match figure
  const figureMatch = cleanText.match(FIGURE_REGEX);
  let extractedFigureNumber: string | null = null;
  if (figureMatch && figureMatch[1]) {
    extractedFigureNumber = figureMatch[1].trim();
  }

  // Match title in parentheses
  const titleMatch = cleanText.match(TITLE_REGEX);
  let extractedSectionTitle: string | null = null;
  if (titleMatch && titleMatch[1]) {
    extractedSectionTitle = titleMatch[1].trim();
  }

  // Generate anchor slug (compound aware)
  let anchorSlug = 'section-main';
  const parts: string[] = [];

  if (extractedClauseNumber) {
    parts.push(`clause-${extractedClauseNumber.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
  }
  if (extractedTableNumber) {
    parts.push(`table-${extractedTableNumber.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
  }
  if (extractedAnnexNumber) {
    parts.push(`annex-${extractedAnnexNumber.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
  }
  if (extractedFigureNumber) {
    parts.push(`figure-${extractedFigureNumber.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
  }

  if (parts.length > 0) {
    anchorSlug = parts.join('-');
  } else if (extractedSectionTitle) {
    anchorSlug = `section-${extractedSectionTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  }

  return {
    standardNumber: extractedStandardNumber,
    clauseNumber: extractedClauseNumber,
    tableNumber: extractedTableNumber,
    annexNumber: extractedAnnexNumber,
    figureNumber: extractedFigureNumber,
    sectionTitle: extractedSectionTitle,
    rawReference: cleanText,
    anchorSlug,
  };
}

/**
 * Extracts ALL citation references from a multi-paragraph model response
 */
export function extractAllCitations(fullResponseText: string): ParsedClauseReference[] {
  if (!fullResponseText || typeof fullResponseText !== 'string') {
    return [];
  }

  // Find all standard mentions and clause patterns
  const citationPattern = /\b(?:IS\s*(?:\(Part\s*\d+[^\)]*\)|[0-9]+(?::\d{4})?)[^\n,;.]*)/gi;
  const matches = fullResponseText.match(citationPattern) || [];

  const results: ParsedClauseReference[] = [];
  const seenSlugs = new Set<string>();

  for (const match of matches) {
    const parsed = parseClauseReference(match);
    if (parsed.standardNumber && !seenSlugs.has(parsed.anchorSlug + parsed.standardNumber)) {
      seenSlugs.add(parsed.anchorSlug + parsed.standardNumber);
      results.push(parsed);
    }
  }

  return results;
}
