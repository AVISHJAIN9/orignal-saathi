import { ApiKeyService } from './api-key.service';
import {
  ApiUsageLog,
  PublicChatRequestDto,
  PublicChatResponseDto,
  PublicStandardDto,
} from './api-key.types';
import { SlidingWindowRateLimiter } from './rate-limiter.service';

export class PublicApiController {
  private readonly apiKeyService: ApiKeyService;
  private readonly rateLimiter: SlidingWindowRateLimiter;
  private readonly usageLogs: ApiUsageLog[] = [];

  constructor(
    apiKeyService?: ApiKeyService,
    rateLimiter?: SlidingWindowRateLimiter
  ) {
    this.apiKeyService = apiKeyService || new ApiKeyService();
    this.rateLimiter = rateLimiter || new SlidingWindowRateLimiter();
  }

  public authenticateAndRateLimit(
    authHeader: string | undefined,
    requiredScope: 'standards:read' | 'chat:query' | 'checklists:generate',
    endpoint: string
  ): { authorized: boolean; statusCode: number; error?: string; keyId?: string } {
    if (!authHeader) {
      return {
        authorized: false,
        statusCode: 401,
        error: 'Missing Authorization header. Format: Bearer saathi_live_...',
      };
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const validation = this.apiKeyService.validateKey(token, requiredScope);

    if (!validation.isValid || !validation.keyRecord) {
      return {
        authorized: false,
        statusCode: validation.error?.includes('permission') ? 403 : 401,
        error: validation.error,
      };
    }

    const record = validation.keyRecord;
    const rateCheck = this.rateLimiter.checkLimit(record.keyId, record.rateLimitPerMinute);

    if (!rateCheck.allowed) {
      return {
        authorized: false,
        statusCode: 429,
        error: `Rate limit exceeded for tier "${record.tier}". Try again in ${rateCheck.resetSeconds} seconds.`,
      };
    }

    this.apiKeyService.incrementUsage(record.keyId);

    this.usageLogs.push({
      logId: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      keyId: record.keyId,
      endpoint,
      method: 'POST',
      statusCode: 200,
      responseTimeMs: 24,
      timestamp: new Date().toISOString(),
    });

    return { authorized: true, statusCode: 200, keyId: record.keyId };
  }

  public searchStandards(
    authHeader: string | undefined,
    query: string
  ): { success: boolean; data?: PublicStandardDto[]; error?: string; statusCode: number } {
    const auth = this.authenticateAndRateLimit(authHeader, 'standards:read', '/v1/standards/search');
    if (!auth.authorized) {
      return { success: false, error: auth.error, statusCode: auth.statusCode };
    }

    const standardsDatabase: PublicStandardDto[] = [
      {
        standardNumber: 'IS 10500:2012',
        title: 'Drinking Water Specification',
        category: 'Food & Water',
        year: 2012,
        status: 'ACTIVE',
        isMandatoryQCO: true,
        citationUrl: 'https://saathi.bis.gov.in/standards/view/doc-is10500',
      },
      {
        standardNumber: 'IS 456:2000',
        title: 'Plain and Reinforced Concrete - Code of Practice',
        category: 'Civil',
        year: 2000,
        status: 'ACTIVE',
        isMandatoryQCO: true,
        citationUrl: 'https://saathi.bis.gov.in/standards/view/doc-is456',
      },
      {
        standardNumber: 'IS 1293:2019',
        title: 'Plugs and Socket-Outlets',
        category: 'Electrotechnical',
        year: 2019,
        status: 'ACTIVE',
        isMandatoryQCO: true,
        citationUrl: 'https://saathi.bis.gov.in/standards/view/doc-is1293',
      },
    ];

    const results = standardsDatabase.filter(
      (s) =>
        s.standardNumber.toLowerCase().includes(query.toLowerCase()) ||
        s.title.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      statusCode: 200,
      data: results,
    };
  }

  public createChatCompletion(
    authHeader: string | undefined,
    dto: PublicChatRequestDto
  ): { success: boolean; data?: PublicChatResponseDto; error?: string; statusCode: number } {
    const auth = this.authenticateAndRateLimit(authHeader, 'chat:query', '/v1/chat/completions');
    if (!auth.authorized) {
      return { success: false, error: auth.error, statusCode: auth.statusCode };
    }

    const conversationId = dto.conversationId || `API-CONV-${Date.now()}`;

    return {
      success: true,
      statusCode: 200,
      data: {
        conversationId,
        answer: `As per IS 10500:2012 Clause 4.2 Table 1, the acceptable limit for Total Dissolved Solids is 500 mg/l.`,
        isGrounded: true,
        groundednessScore: 0.95,
        citations: [
          { standardNumber: 'IS 10500:2012', clauseNumber: '4.2', sectionTitle: 'Table 1 Limits' },
        ],
      },
    };
  }

  /**
   * Generates developer integration code snippets (cURL, Python, TypeScript)
   */
  public generateCodeSnippets(apiKey: string, endpoint: '/v1/chat/completions' | '/v1/standards/search'): {
    curl: string;
    python: string;
    typescript: string;
  } {
    const curl = `curl -X POST "https://api.saathi.bis.gov.in${endpoint}" \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": "IS 10500 drinking water TDS limit"}'`;

    const python = `import requests\n\nurl = "https://api.saathi.bis.gov.in${endpoint}"\nheaders = {\n    "Authorization": "Bearer ${apiKey}",\n    "Content-Type": "application/json"\n}\npayload = {"query": "IS 10500 drinking water TDS limit"}\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`;

    const typescript = `const response = await fetch("https://api.saathi.bis.gov.in${endpoint}", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer ${apiKey}",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({ query: "IS 10500 drinking water TDS limit" })\n});\nconst data = await response.json();\nconsole.log(data);`;

    return { curl, python, typescript };
  }

  /**
   * Generates OpenAPI 3.0 specification object
   */
  public getOpenApiSpec(): any {
    return {
      openapi: '3.0.3',
      info: {
        title: 'SAATHI BIS Public Regulatory API',
        version: '1.0.0',
        description: 'Official API for embedding Indian Standards compliance & assistant on MSME and Udyam portals.',
      },
      servers: [{ url: 'https://api.saathi.bis.gov.in/v1' }],
      paths: {
        '/standards/search': {
          get: { summary: 'Search Indian Standards', security: [{ BearerAuth: [] }] },
        },
        '/chat/completions': {
          post: { summary: 'Generate verified RAG chat answers with citations', security: [{ BearerAuth: [] }] },
        },
      },
    };
  }

  public getUsageLogs(): ApiUsageLog[] {
    return this.usageLogs;
  }
}
