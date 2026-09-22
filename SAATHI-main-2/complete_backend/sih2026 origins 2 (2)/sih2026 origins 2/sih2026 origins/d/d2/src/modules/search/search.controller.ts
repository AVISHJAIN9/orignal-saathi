import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchApiResponse } from './interfaces/search.interface';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * GET /api/v1/search
   * Unified standards browser and hybrid search API with Redis caching.
   *
   * Query Parameters:
   * - query: Text query for hybrid dense/sparse search
   * - standardNumber: Exact IS standard lookup (e.g. 'IS 10500:2012')
   * - docType: Document type filter ('standard', 'amendment', 'manual')
   * - category: BIS category / division filter ('Food & Agriculture', 'Civil Engineering')
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - enableIsBoost: Boost exact IS standard matches (default: true)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  )
  async searchStandards(@Query() queryDto: SearchQueryDto): Promise<SearchApiResponse> {
    return this.searchService.searchStandards(queryDto);
  }

  /**
   * GET /api/v1/search/ping
   * Health check for search module.
   */
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return {
      status: 'ok',
      module: 'd2-search-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
