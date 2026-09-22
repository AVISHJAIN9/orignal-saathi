import { Injectable } from '@nestjs/common';
import { PublicStandardEntry, StandardsPort } from '../common/ports/standards.port';

/**
 * Placeholder only — returns an empty list, so the sitemap still renders
 * (with just the static pages) before D2's real adapter is wired in.
 * Delete once D2's owner provides the real implementation.
 */
@Injectable()
export class InMemoryStandardsPort implements StandardsPort {
  async listPublicSlugs(): Promise<PublicStandardEntry[]> {
    return [];
  }
}
