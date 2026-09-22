import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SitemapService } from './sitemap.service';
import { STANDARDS_PORT } from '../common/ports/standards.port';

describe('SitemapService', () => {
  let service: SitemapService;
  const standardsPortMock = { listPublicSlugs: jest.fn() };
  const configMock = { get: jest.fn((_key: string, fallback?: unknown) => fallback) };

  beforeEach(async () => {
    jest.clearAllMocks();
    standardsPortMock.listPublicSlugs.mockResolvedValue([
      { slug: 'is-10500-drinking-water', updatedAt: new Date('2026-01-15') },
    ]);
    const moduleRef = await Test.createTestingModule({
      providers: [
        SitemapService,
        { provide: STANDARDS_PORT, useValue: standardsPortMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();
    service = moduleRef.get(SitemapService);
  });

  it('includes both static pages and dynamic standard slugs', async () => {
    const xml = await service.getSitemap();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('/chat</loc>');
    expect(xml).toContain('/standards/is-10500-drinking-water</loc>');
  });

  it('caches between calls — does not re-query the standards port', async () => {
    await service.getSitemap();
    await service.getSitemap();
    expect(standardsPortMock.listPublicSlugs).toHaveBeenCalledTimes(1);
  });

  it('invalidate() forces a rebuild on the next call', async () => {
    await service.getSitemap();
    service.invalidate();
    await service.getSitemap();
    expect(standardsPortMock.listPublicSlugs).toHaveBeenCalledTimes(2);
  });

  it('escapes XML-unsafe characters in generated URLs', async () => {
    standardsPortMock.listPublicSlugs.mockResolvedValue([
      { slug: 'a&b<test>', updatedAt: new Date('2026-01-01') },
    ]);
    service.invalidate();
    const xml = await service.getSitemap();
    expect(xml).toContain('a&amp;b&lt;test&gt;');
    expect(xml).not.toContain('a&b<test>');
  });
});
