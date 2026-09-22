/**
 * Sanitizes and generates a URL anchor slug from section or clause identifiers
 */
export function generateClauseAnchor(
  sectionNumber?: string | null,
  sectionTitle?: string | null
): string {
  if (sectionNumber && typeof sectionNumber === 'string' && sectionNumber.trim() !== '') {
    const cleanNumber = sectionNumber
      .trim()
      .replace(/[^a-zA-Z0-9\.]/g, '')
      .replace(/\./g, '-');
    return `clause-${cleanNumber.toLowerCase()}`;
  }

  if (sectionTitle && typeof sectionTitle === 'string' && sectionTitle.trim() !== '') {
    const cleanTitle = sectionTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `section-${cleanTitle}`;
  }

  return 'section-main';
}

/**
 * Validates whether an anchor slug is properly formatted
 */
export function isValidAnchorSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  return /^(clause-[a-z0-9\-]+|table-[a-z0-9\-]+|annex-[a-z0-9\-]+|figure-[a-z0-9\-]+|section-[a-z0-9\-]+)$/.test(slug);
}
