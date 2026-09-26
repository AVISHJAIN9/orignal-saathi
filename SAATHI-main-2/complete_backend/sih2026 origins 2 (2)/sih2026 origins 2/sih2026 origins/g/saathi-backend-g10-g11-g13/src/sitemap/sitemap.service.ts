import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { STANDARDS_PORT, StandardsPort } from '../common/ports/standards.port';

interface StaticPage {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

// Adjust to match the real public route list once D1/D2/G3 land their
// frontend routes — this is a reasonable starting set from the spec.
const STATIC_PAGES: StaticPage[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/chat', changefreq: 'weekly', priority: 0.9 },
  { path: '/standards', changefreq: 'daily', priority: 0.9 },
  { path: '/testimonials', changefreq: 'monthly', priority: 0.5 },
  { path: '/faq', changefreq: 'monthly', priority: 0.5 },
];

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour fallback if no invalidation event ever fires

@Injectable()
export class SitemapService {
  private readonly logger = new Logger(SitemapService.name);
  private cachedXml: string | null = null;
  private cachedAt = 0;

  constructor(
    @Inject(STANDARDS_PORT) private readonly standardsPort: StandardsPort,
    private readonly config: ConfigService,
  ) {}

  async getSitemap(): Promise<string> {
    const isStale = !this.cachedXml || Date.now() - this.cachedAt > CACHE_TTL_MS;
    if (isStale) {
      this.cachedXml = await this.build();
      this.cachedAt = Date.now();
    }
    return this.cachedXml;
  }

  /**
   * Fired on any content change that should show up in the sitemap —
   * standards added/updated/removed (D2/M1) or new public pages shipping.
   * Whoever owns those flows should emit these; until they do, the sitemap
   * just falls back to the TTL above.
   */
  @OnEvent('standards.created')
  @OnEvent('standards.updated')
  @OnEvent('standards.removed')
  invalidate(): void {
    this.logger.log('Sitemap cache invalidated due to content change.');
    this.cachedXml = null;
  }

  private async build(): Promise<string> {
    const baseUrl = this.config.get<string>('APP_BASE_URL', 'https://saathi.example.gov.in');
    const standards = await this.standardsPort.listPublicSlugs();

    const staticUrls = STATIC_PAGES.map(
      (page) =>
        `  <url>\n` +
        `    <loc>${this.escapeXml(baseUrl + page.path)}</loc>\n` +
        `    <changefreq>${page.changefreq}</changefreq>\n` +
        `    <priority>${page.priority.toFixed(1)}</priority>\n` +
        `  </url>`,
    );

    const standardUrls = standards.map(
      (s) =>
        `  <url>\n` +
        `    <loc>${this.escapeXml(`${baseUrl}/standards/${s.slug}`)}</loc>\n` +
        `    <lastmod>${s.updatedAt.toISOString().slice(0, 10)}</lastmod>\n` +
        `    <changefreq>monthly</changefreq>\n` +
        `    <priority>0.7</priority>\n` +
        `  </url>`,
    );

    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      [...staticUrls, ...standardUrls].join('\n') +
      '\n</urlset>'
    );
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
