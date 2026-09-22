import { generateClauseAnchor, isValidAnchorSlug } from './clause-anchor.util';

export interface DeepLinkParams {
  documentId: string;
  chunkId?: string;
  sectionNumber?: string | null;
  sectionTitle?: string | null;
  baseUrl?: string;
}

export interface ResolvedDeepLink {
  isValid: boolean;
  documentId: string;
  chunkId?: string;
  anchorSlug?: string;
  targetType: 'CLAUSE' | 'TABLE' | 'ANNEX' | 'FIGURE' | 'SECTION' | 'MAIN';
  targetIdentifier?: string;
  error?: string;
}

/**
 * Builds a direct URL to standard document viewer with clause anchor and chunk highlighting
 */
export function buildDeepLink(params: DeepLinkParams): string {
  if (!params.documentId || typeof params.documentId !== 'string') {
    throw new Error('documentId is required to build a deep link');
  }

  const base = params.baseUrl || '/standards/view';
  const docPath = `${base}/${encodeURIComponent(params.documentId.trim())}`;

  const queryParams = new URLSearchParams();
  if (params.chunkId) {
    queryParams.append('chunkId', params.chunkId.trim());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const anchor = generateClauseAnchor(params.sectionNumber, params.sectionTitle);

  return `${docPath}${queryString}#${anchor}`;
}

/**
 * Parses deep link URL back into document ID, chunk ID, and anchor targets with full error handling
 */
export function parseDeepLinkUrl(deepLinkUrl: string): ResolvedDeepLink {
  if (!deepLinkUrl || typeof deepLinkUrl !== 'string' || deepLinkUrl.trim() === '') {
    return {
      isValid: false,
      documentId: '',
      targetType: 'MAIN',
      error: 'Empty or non-string URL provided',
    };
  }

  try {
    const cleanUrl = deepLinkUrl.trim();
    const [pathWithQuery, hash] = cleanUrl.split('#');
    const [path, query] = pathWithQuery.split('?');
    const pathParts = path.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      return {
        isValid: false,
        documentId: '',
        targetType: 'MAIN',
        error: 'URL path is missing document ID',
      };
    }

    const documentId = decodeURIComponent(pathParts[pathParts.length - 1]);
    if (!documentId) {
      return {
        isValid: false,
        documentId: '',
        targetType: 'MAIN',
        error: 'Unable to extract document ID from URL path',
      };
    }

    let chunkId: string | undefined = undefined;
    if (query) {
      const searchParams = new URLSearchParams(query);
      chunkId = searchParams.get('chunkId') || undefined;
    }

    const anchorSlug = hash || undefined;
    let targetType: ResolvedDeepLink['targetType'] = 'MAIN';
    let targetIdentifier: string | undefined = undefined;

    if (anchorSlug) {
      if (anchorSlug.startsWith('clause-')) {
        targetType = 'CLAUSE';
        targetIdentifier = anchorSlug.replace('clause-', '').replace(/-/g, '.');
      } else if (anchorSlug.startsWith('table-')) {
        targetType = 'TABLE';
        targetIdentifier = anchorSlug.replace('table-', '').toUpperCase();
      } else if (anchorSlug.startsWith('annex-')) {
        targetType = 'ANNEX';
        targetIdentifier = anchorSlug.replace('annex-', '').toUpperCase();
      } else if (anchorSlug.startsWith('figure-')) {
        targetType = 'FIGURE';
        targetIdentifier = anchorSlug.replace('figure-', '');
      } else if (anchorSlug.startsWith('section-')) {
        targetType = 'SECTION';
        targetIdentifier = anchorSlug.replace('section-', '');
      }
    }

    return {
      isValid: true,
      documentId,
      chunkId,
      anchorSlug,
      targetType,
      targetIdentifier,
    };
  } catch (err) {
    return {
      isValid: false,
      documentId: '',
      targetType: 'MAIN',
      error: `Malformed deep link URL: ${(err as Error).message}`,
    };
  }
}
