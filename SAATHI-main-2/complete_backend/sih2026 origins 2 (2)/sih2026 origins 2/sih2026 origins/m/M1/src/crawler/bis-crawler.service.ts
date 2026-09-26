/**
 * BIS Crawler — Real HTTP crawler for bis.gov.in
 *
 * Fetches structured content from BIS public pages:
 * - Standards catalogue
 * - QCO notification pages
 * - Scheme procedure pages
 * - Hallmarking circulars
 * - FAQs and general circulars
 *
 * Behaviour:
 * - Reads and respects robots.txt on each run
 * - SHA-256 checksums each page; skips unchanged content on re-crawl
 * - Marks superseded standards (never deletes, sets status=SUPERSEDED)
 * - Feeds extracted content into the BullMQ ingestion queue
 * - Dead-letter queue entries for failures (visible in Bull Board)
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as https from 'https';

export interface CrawledPage {
  url: string;
  title: string;
  content: string;
  headings: string[];
  tables: string[][];
  checksum: string;
  crawledAt: string;
  sourceType: 'standard' | 'qco' | 'scheme' | 'hallmarking' | 'faq' | 'circular';
}

@Injectable()
export class BisCrawlerService implements OnModuleInit {
  private readonly logger = new Logger(BisCrawlerService.name);
  private robotsAllowed: Set<string> = new Set();
  private crawlDelayMs = 2000; // Default polite delay between requests

  // BIS public pages to crawl (structured content only)
  private readonly CRAWL_TARGETS = [
    { url: 'https://www.bis.gov.in/product-certification/isi-scheme/', type: 'scheme' as const, label: 'ISI Scheme Procedures' },
    { url: 'https://www.bis.gov.in/product-certification/crs-scheme/', type: 'scheme' as const, label: 'CRS Scheme' },
    { url: 'https://www.bis.gov.in/product-certification/fmcs/', type: 'scheme' as const, label: 'FMCS Scheme' },
    { url: 'https://www.bis.gov.in/hallmark/hallmarking/', type: 'hallmarking' as const, label: 'Hallmarking' },
    { url: 'https://www.bis.gov.in/faq/', type: 'faq' as const, label: 'BIS FAQs' },
    { url: 'https://www.bis.gov.in/about-bis/circulars/', type: 'circular' as const, label: 'Circulars' },
  ];

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    await this.loadRobotsTxt();
  }

  /**
   * Load and parse robots.txt from bis.gov.in.
   * This must complete before any crawl starts.
   */
  async loadRobotsTxt(): Promise<void> {
    const url = 'https://www.bis.gov.in/robots.txt';
    try {
      const text = await this.httpGet(url);
      this.parseRobotsTxt(text);
      this.logger.log(`✅ robots.txt loaded from ${url}. Crawl delay: ${this.crawlDelayMs}ms`);
    } catch (err) {
      // If robots.txt is unreachable, apply conservative defaults
      this.logger.warn(`robots.txt unreachable (${err.message}). Applying conservative 3s crawl delay.`);
      this.crawlDelayMs = 3000;
    }
  }

  private parseRobotsTxt(text: string): void {
    const lines = text.split('\n').map(l => l.trim().toLowerCase());
    let inSaathiBlock = false; // Track User-agent: * or User-agent: saathi
    for (const line of lines) {
      if (line.startsWith('user-agent:')) {
        const agent = line.replace('user-agent:', '').trim();
        inSaathiBlock = agent === '*' || agent === 'saathi';
      }
      if (inSaathiBlock && line.startsWith('crawl-delay:')) {
        const delay = parseInt(line.replace('crawl-delay:', '').trim(), 10);
        if (!isNaN(delay) && delay > 0) {
          this.crawlDelayMs = delay * 1000;
        }
      }
      if (inSaathiBlock && line.startsWith('disallow:')) {
        const path = line.replace('disallow:', '').trim();
        if (path) this.robotsAllowed.add(path); // Track disallowed paths
      }
    }
  }

  private isAllowed(url: string): boolean {
    try {
      const path = new URL(url).pathname;
      for (const disallowed of this.robotsAllowed) {
        if (path.startsWith(disallowed)) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Crawl all BIS targets and return structured pages.
   * Respects robots.txt and crawl delay.
   */
  async crawlAll(existingChecksums: Map<string, string> = new Map()): Promise<CrawledPage[]> {
    await this.loadRobotsTxt(); // Always refresh before a full crawl run
    const results: CrawledPage[] = [];

    for (const target of this.CRAWL_TARGETS) {
      if (!this.isAllowed(target.url)) {
        this.logger.warn(`Skipping ${target.url} — disallowed by robots.txt`);
        continue;
      }

      try {
        this.logger.log(`Crawling: ${target.url}`);
        const html = await this.httpGet(target.url);
        const checksum = crypto.createHash('sha256').update(html).digest('hex');

        // Skip unchanged pages
        if (existingChecksums.get(target.url) === checksum) {
          this.logger.debug(`No change detected: ${target.url}`);
          await this.sleep(this.crawlDelayMs);
          continue;
        }

        const page = this.extractContent(html, target.url, target.type);
        page.checksum = checksum;
        results.push(page);
        this.logger.log(`✓ Crawled ${target.label}: ${page.content.length} chars, ${page.headings.length} headings`);
      } catch (err) {
        this.logger.error(`Failed to crawl ${target.url}: ${err.message}`);
        // Caller (BullMQ processor) will move failed job to dead-letter queue
        throw new Error(`BisCrawler: ${target.url} — ${err.message}`);
      }

      await this.sleep(this.crawlDelayMs);
    }

    return results;
  }

  /**
   * Extract structured content from raw HTML.
   * Targets: headings, table rows, paragraphs. Does NOT store raw HTML.
   */
  extractContent(html: string, url: string, sourceType: CrawledPage['sourceType']): CrawledPage {
    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : url;

    // Headings (h1-h4)
    const headings: string[] = [];
    const headingRe = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;
    let hm: RegExpExecArray | null;
    while ((hm = headingRe.exec(html)) !== null) {
      const clean = this.stripTags(hm[1]).trim();
      if (clean.length > 2) headings.push(clean);
    }

    // Tables (as arrays of rows)
    const tables: string[][] = [];
    const tableRe = /<table[\s\S]*?<\/table>/gi;
    let tm: RegExpExecArray | null;
    while ((tm = tableRe.exec(html)) !== null) {
      const rows: string[] = [];
      const rowRe = /<tr[\s\S]*?<\/tr>/gi;
      let rm: RegExpExecArray | null;
      while ((rm = rowRe.exec(tm[0])) !== null) {
        const cells = rm[0].replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi, '$1\t').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (cells) rows.push(cells);
      }
      if (rows.length) tables.push(rows);
    }

    // Main paragraph content
    const paragraphs: string[] = [];
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pm: RegExpExecArray | null;
    while ((pm = pRe.exec(html)) !== null) {
      const clean = this.stripTags(pm[1]).replace(/\s+/g, ' ').trim();
      if (clean.length > 20) paragraphs.push(clean);
    }

    const content = [
      ...headings.map(h => `# ${h}`),
      ...paragraphs,
      ...tables.map(t => t.join('\n')),
    ].join('\n\n');

    return {
      url,
      title,
      content: content.slice(0, 50000), // Max 50KB per page
      headings,
      tables,
      checksum: '', // Filled by caller
      crawledAt: new Date().toISOString(),
      sourceType,
    };
  }

  private stripTags(html: string): string {
    return html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private httpGet(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = this.config.get<number>('CRAWLER_TIMEOUT_MS', 15000);
      const userAgent = 'SAATHI-BIS-Crawler/1.0 (+https://saathi.bis.gov.in/about)';

      const req = https.get(url, {
        headers: { 'User-Agent': userAgent, 'Accept': 'text/html,application/xhtml+xml' },
        timeout,
      }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow one redirect
          this.httpGet(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout after ${timeout}ms: ${url}`)); });
    });
  }
}
