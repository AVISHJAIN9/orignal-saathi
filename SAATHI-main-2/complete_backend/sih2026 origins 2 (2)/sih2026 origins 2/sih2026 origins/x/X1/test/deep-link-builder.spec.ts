import { buildDeepLink, parseDeepLinkUrl } from '../src/deep-link.builder';

describe('X1: Deep Link Builder & URL Resolver', () => {
  it('should construct valid deep link URLs', () => {
    const url = buildDeepLink({
      documentId: 'doc-is10500',
      chunkId: 'chunk-123',
      sectionNumber: '4.2',
    });

    expect(url).toBe('/standards/view/doc-is10500?chunkId=chunk-123#clause-4-2');
  });

  it('should parse deep link URLs accurately', () => {
    const resolved = parseDeepLinkUrl('/standards/view/doc-is456?chunkId=chunk-999#table-2');
    expect(resolved.isValid).toBe(true);
    expect(resolved.documentId).toBe('doc-is456');
    expect(resolved.chunkId).toBe('chunk-999');
    expect(resolved.targetType).toBe('TABLE');
    expect(resolved.targetIdentifier).toBe('2');
  });

  it('should handle malformed URLs gracefully without throwing exceptions', () => {
    const resolved = parseDeepLinkUrl('');
    expect(resolved.isValid).toBe(false);
    expect(resolved.error).toBeDefined();

    const resolvedNull = parseDeepLinkUrl(null as any);
    expect(resolvedNull.isValid).toBe(false);
  });
});
