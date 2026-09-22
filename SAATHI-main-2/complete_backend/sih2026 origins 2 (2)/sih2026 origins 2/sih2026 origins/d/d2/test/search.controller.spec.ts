import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../src/modules/search/search.controller';
import { SearchService } from '../src/modules/search/search.service';
import { SearchQueryDto } from '../src/modules/search/dto/search-query.dto';
import { SearchApiResponse } from '../src/modules/search/interfaces/search.interface';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: {
    searchStandards: jest.Mock;
  };

  const mockApiResponse: SearchApiResponse = {
    query: 'drinking water',
    detectedIsStandards: ['IS 10500:2012'],
    page: 1,
    limit: 10,
    totalResults: 1,
    totalPages: 1,
    results: [
      {
        id: 'chunk-1',
        document_id: 'doc-1',
        standard_number: 'IS 10500:2012',
        content: 'Potable water test parameters',
        rrf_score: 0.05,
        is_exact_match: true,
      },
    ],
    fromCache: false,
    executionTimeMs: 35,
    timestamp: '2026-08-30T12:00:00.000Z',
  };

  beforeEach(async () => {
    searchService = {
      searchStandards: jest.fn().mockResolvedValue(mockApiResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [{ provide: SearchService, useValue: searchService }],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /api/v1/search', () => {
    it('should delegate search query parameters to SearchService.searchStandards', async () => {
      const dto: SearchQueryDto = {
        query: 'drinking water',
        standardNumber: 'IS 10500',
        docType: 'standard',
        category: 'Food & Agriculture',
        page: 1,
        limit: 10,
        enableIsBoost: true,
      };

      const result = await controller.searchStandards(dto);

      expect(searchService.searchStandards).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockApiResponse);
    });
  });

  describe('GET /api/v1/search/ping', () => {
    it('should return health status payload', () => {
      const pingRes = controller.ping();
      expect(pingRes.status).toBe('ok');
      expect(pingRes.module).toBe('d2-search-backend');
    });
  });
});
