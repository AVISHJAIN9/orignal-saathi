import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { BadGatewayException, HttpException } from '@nestjs/common';
import { SearchService } from '../src/modules/search/search.service';
import { SearchQueryDto } from '../src/modules/search/dto/search-query.dto';
import {
  M3HybridSearchResponse,
  SearchApiResponse,
} from '../src/modules/search/interfaces/search.interface';

describe('SearchService', () => {
  let service: SearchService;
  let cacheManager: {
    get: jest.Mock;
    set: jest.Mock;
  };
  let httpService: {
    post: jest.Mock;
  };
  let configService: {
    get: jest.Mock;
  };

  const mockChunkResult = {
    id: 'chunk-123',
    document_id: 'doc-456',
    standard_number: 'IS 10500:2012',
    doc_type: 'standard',
    category: 'Food & Agriculture',
    section_title: 'Drinking Water Specification',
    section_number: 'Clause 4',
    content: 'Total dissolved solids shall not exceed 500 mg/l.',
    source_url: 'https://standardsbis.bsbedge.com',
    publication_date: '2012-05-01',
    metadata: {},
    rrf_score: 0.032,
    dense_rank: 1,
    sparse_rank: 2,
    cosine_similarity: 0.89,
    bm25_score: 12.4,
    is_exact_match: true,
  };

  const mockM3Response: M3HybridSearchResponse = {
    query: 'drinking water limits',
    detected_is_standards: ['IS 10500:2012'],
    total_results: 1,
    results: [mockChunkResult],
    execution_time_ms: 45.2,
  };

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn().mockResolvedValue(undefined),
    };

    httpService = {
      post: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        if (key === 'M3_RETRIEVAL_URL') return 'http://localhost:8003/api/v1/retrieval/hybrid';
        if (key === 'CACHE_TTL_SECONDS') return 3600;
        if (key === 'M3_TIMEOUT_MS') return 10000;
        return defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCacheKey', () => {
    it('should generate consistent deterministic cache keys for identical query criteria', () => {
      const dto1: SearchQueryDto = {
        query: 'drinking water',
        standardNumber: 'IS 10500',
        docType: 'standard',
        category: 'Food',
        page: 1,
        limit: 10,
        enableIsBoost: true,
      };

      const dto2: SearchQueryDto = {
        query: '  drinking water  ',
        standardNumber: 'is 10500',
        docType: 'STANDARD',
        category: 'FOOD',
        page: 1,
        limit: 10,
        enableIsBoost: true,
      };

      const key1 = service.generateCacheKey(dto1);
      const key2 = service.generateCacheKey(dto2);

      expect(key1).toEqual(key2);
      expect(key1).toContain('standards:search:drinking water:IS 10500:');
    });

    it('should generate distinct keys for different pages or limits', () => {
      const dto1: SearchQueryDto = { query: 'cement', page: 1, limit: 10 };
      const dto2: SearchQueryDto = { query: 'cement', page: 2, limit: 10 };

      expect(service.generateCacheKey(dto1)).not.toEqual(service.generateCacheKey(dto2));
    });
  });

  describe('searchStandards - Cache Hit', () => {
    it('should return cached response immediately without calling M3 HTTP endpoint', async () => {
      const cachedData: SearchApiResponse = {
        query: 'drinking water',
        detectedIsStandards: ['IS 10500'],
        page: 1,
        limit: 10,
        totalResults: 1,
        totalPages: 1,
        results: [mockChunkResult],
        fromCache: false,
        executionTimeMs: 20,
        timestamp: '2026-08-30T10:00:00.000Z',
      };

      cacheManager.get.mockResolvedValue(cachedData);

      const dto: SearchQueryDto = { query: 'drinking water', page: 1, limit: 10 };
      const result = await service.searchStandards(dto);

      expect(cacheManager.get).toHaveBeenCalledTimes(1);
      expect(httpService.post).not.toHaveBeenCalled();
      expect(result.fromCache).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].standard_number).toBe('IS 10500:2012');
    });
  });

  describe('searchStandards - Cache Miss', () => {
    it('should call M3 hybrid retrieval endpoint, cache result with TTL, and return formatted response', async () => {
      cacheManager.get.mockResolvedValue(null);
      httpService.post.mockReturnValue(of({ data: mockM3Response }));

      const dto: SearchQueryDto = {
        query: 'drinking water limits',
        page: 1,
        limit: 10,
        docType: 'standard',
        category: 'Food & Agriculture',
      };

      const result = await service.searchStandards(dto);

      expect(cacheManager.get).toHaveBeenCalledTimes(1);
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8003/api/v1/retrieval/hybrid',
        expect.objectContaining({
          query: 'drinking water limits',
          top_k: 10,
          filters: {
            doc_type: 'standard',
            category: 'Food & Agriculture',
          },
          enable_is_boost: true,
          include_metadata: true,
        }),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        }),
      );

      expect(cacheManager.set).toHaveBeenCalledTimes(1);
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          query: 'drinking water limits',
          totalResults: 1,
          results: [mockChunkResult],
          fromCache: false,
        }),
        3600000, // 3600s in ms
      );

      expect(result.fromCache).toBe(false);
      expect(result.totalResults).toBe(1);
      expect(result.results).toHaveLength(1);
      expect(result.detectedIsStandards).toContain('IS 10500:2012');
    });
  });

  describe('searchStandards - Empty Query', () => {
    it('should return empty result set if both query and standardNumber are empty', async () => {
      const dto: SearchQueryDto = { page: 1, limit: 10 };
      const result = await service.searchStandards(dto);

      expect(httpService.post).not.toHaveBeenCalled();
      expect(result.totalResults).toBe(0);
      expect(result.results).toEqual([]);
      expect(result.fromCache).toBe(false);
    });
  });

  describe('searchStandards - Upstream Error Handling', () => {
    it('should throw BadGatewayException when M3 connection is refused', async () => {
      cacheManager.get.mockResolvedValue(null);
      const networkError = new Error('Connection refused') as any;
      networkError.code = 'ECONNREFUSED';
      httpService.post.mockReturnValue(throwError(() => networkError));

      const dto: SearchQueryDto = { query: 'test standard', page: 1, limit: 10 };

      await expect(service.searchStandards(dto)).rejects.toThrow(BadGatewayException);
    });

    it('should propagate upstream M3 HTTP error with status code and message', async () => {
      cacheManager.get.mockResolvedValue(null);
      const httpErr = {
        message: 'Request failed with status code 500',
        response: {
          status: 500,
          data: { detail: 'Database query execution failed' },
        },
      };
      httpService.post.mockReturnValue(throwError(() => httpErr));

      const dto: SearchQueryDto = { query: 'test standard', page: 1, limit: 10 };

      await expect(service.searchStandards(dto)).rejects.toThrow(HttpException);
    });
  });
});
