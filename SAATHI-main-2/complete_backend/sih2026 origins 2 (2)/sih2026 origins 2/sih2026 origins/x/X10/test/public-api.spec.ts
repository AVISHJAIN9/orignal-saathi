import { ApiKeyService } from '../src/api-key.service';
import { PublicApiController } from '../src/public-api.controller';
import { SlidingWindowRateLimiter } from '../src/rate-limiter.service';

describe('X10: Public REST API for Third-Party Portals & Developer SDK (Enhanced)', () => {
  let apiKeyService: ApiKeyService;
  let rateLimiter: SlidingWindowRateLimiter;
  let apiController: PublicApiController;

  beforeEach(() => {
    apiKeyService = new ApiKeyService();
    rateLimiter = new SlidingWindowRateLimiter();
    apiController = new PublicApiController(apiKeyService, rateLimiter);
  });

  describe('Tiered API Keys', () => {
    it('should assign appropriate rate limits based on tier', () => {
      const free = apiKeyService.generateApiKey({
        ownerName: 'Free User',
        organization: 'MSME Shop',
        email: 'free@msme.in',
        tier: 'FREE',
      });
      expect(free.keyRecord.rateLimitPerMinute).toBe(60);

      const startup = apiKeyService.generateApiKey({
        ownerName: 'Startup Dev',
        organization: 'FinTech App',
        email: 'dev@fintech.in',
        tier: 'STARTUP',
      });
      expect(startup.keyRecord.rateLimitPerMinute).toBe(300);

      const gov = apiKeyService.generateApiKey({
        ownerName: 'Udyam Admin',
        organization: 'Ministry of MSME',
        email: 'udyam@gov.in',
        tier: 'ENTERPRISE_GOV',
      });
      expect(gov.keyRecord.rateLimitPerMinute).toBe(1200);
    });
  });

  describe('Developer SDK Snippets & OpenAPI Specs', () => {
    it('should generate multi-language SDK code snippets', () => {
      const snippets = apiController.generateCodeSnippets('saathi_live_test_key_123', '/v1/chat/completions');
      expect(snippets.curl).toContain('curl -X POST');
      expect(snippets.python).toContain('import requests');
      expect(snippets.typescript).toContain('await fetch');
    });

    it('should provide OpenAPI 3.0 specification', () => {
      const spec = apiController.getOpenApiSpec();
      expect(spec.openapi).toBe('3.0.3');
      expect(spec.info.title).toContain('SAATHI');
    });
  });
});
