import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { SearchQueryDto } from './dto/search-query.dto';
import {
  M3HybridSearchRequest,
  M3HybridSearchResponse,
  SearchApiResponse,
} from './interfaces/search.interface';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly m3RetrievalUrl: string;
  private readonly cacheTtlMs: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.m3RetrievalUrl = this.configService.get<string>(
      'M3_RETRIEVAL_URL',
      'http://localhost:8003/api/v1/retrieval/hybrid',
    );
    const ttlSeconds = this.configService.get<number>('CACHE_TTL_SECONDS', 3600);
    this.cacheTtlMs = ttlSeconds * 1000;
  }

  /**
   * Generates a deterministic cache key for a given search query DTO.
   */
  public generateCacheKey(dto: SearchQueryDto): string {
    const normalized = {
      q: (dto.query || '').trim().toLowerCase(),
      std: (dto.standardNumber || '').trim().toUpperCase(),
      dt: (dto.docType || '').trim().toLowerCase(),
      cat: (dto.category || '').trim().toLowerCase(),
      p: dto.page || 1,
      l: dto.limit || 10,
      boost: dto.enableIsBoost !== false,
    };

    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(normalized))
      .digest('hex')
      .substring(0, 16);

    return `standards:search:${normalized.q || 'all'}:${normalized.std || 'none'}:${hash}`;
  }

  /**
   * Searches BIS standards by querying Python m3 hybrid retrieval with Redis caching.
   */
  async searchStandards(dto: SearchQueryDto): Promise<SearchApiResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(dto);

    // 1. Check Redis Cache
    try {
      const cachedResult = await this.cacheManager.get<SearchApiResponse>(cacheKey);
      if (cachedResult) {
        this.logger.log(`[Cache HIT] key: ${cacheKey}`);
        return {
          ...cachedResult,
          fromCache: true,
          executionTimeMs: Date.now() - startTime,
        };
      }
    } catch (cacheErr) {
      this.logger.warn(`Redis cache get error: ${cacheErr.message}. Continuing without cache.`);
    }

    this.logger.log(`[Cache MISS] key: ${cacheKey} -> Proxying query to M3 service`);

    // 2. Build Python M3 Payload
    const queryText = (dto.query || dto.standardNumber || '').trim();
    if (!queryText) {
      return {
        query: '',
        detectedIsStandards: [],
        page: dto.page || 1,
        limit: dto.limit || 10,
        totalResults: 0,
        totalPages: 0,
        results: [],
        fromCache: false,
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const topK = Math.min(Math.max(page * limit, 10), 100);

    const m3Payload: M3HybridSearchRequest = {
      query: queryText,
      top_k: topK,
      filters: {
        ...(dto.docType ? { doc_type: dto.docType.trim() } : {}),
        ...(dto.category ? { category: dto.category.trim() } : {}),
        ...(dto.standardNumber ? { standard_number: dto.standardNumber.trim() } : {}),
      },
      enable_is_boost: dto.enableIsBoost !== false,
      include_metadata: true,
    };

    // 3. Execute HTTP request to M3
    let m3Response: M3HybridSearchResponse;
    try {
      const response$ = this.httpService.post<M3HybridSearchResponse>(
        this.m3RetrievalUrl,
        m3Payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'SAATHI-D2-Backend/1.0',
          },
          timeout: this.configService.get<number>('M3_TIMEOUT_MS', 10000),
        },
      );

      const response: any = await firstValueFrom(response$);
      m3Response = response.data;
    } catch (err: any) {
      this.logger.error(`Error querying M3 hybrid retrieval engine: ${err.message}`, err.stack);
      if (err.response) {
        throw new HttpException(
          {
            statusCode: err.response.status,
            message: `M3 Retrieval Engine Error: ${JSON.stringify(err.response.data?.detail || err.response.data)}`,
            error: 'Upstream Engine Error',
          },
          err.response.status || HttpStatus.BAD_GATEWAY,
        );
      } else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        throw new BadGatewayException(
          `Unable to connect to Python M3 Retrieval service at ${this.m3RetrievalUrl} (${err.code})`,
        );
      }
      throw new InternalServerErrorException(
        `Unexpected error during standards search: ${err.message}`,
      );
    }

    // 4. Format & Paginate Response
    const totalResults = m3Response.total_results || m3Response.results.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = m3Response.results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalResults / limit) || (totalResults > 0 ? 1 : 0);

    const apiResponse: SearchApiResponse = {
      query: m3Response.query,
      detectedIsStandards: m3Response.detected_is_standards || [],
      page,
      limit,
      totalResults,
      totalPages,
      results: paginatedResults,
      fromCache: false,
      executionTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };

    // 5. Save to Cache in Background
    try {
      await this.cacheManager.set(cacheKey, apiResponse, this.cacheTtlMs);
      this.logger.log(`[Cache SET] key: ${cacheKey} (TTL: ${this.cacheTtlMs / 1000}s)`);
    } catch (cacheSetErr) {
      this.logger.warn(`Failed to set Redis cache for ${cacheKey}: ${cacheSetErr.message}`);
    }

    return apiResponse;
  }
}
