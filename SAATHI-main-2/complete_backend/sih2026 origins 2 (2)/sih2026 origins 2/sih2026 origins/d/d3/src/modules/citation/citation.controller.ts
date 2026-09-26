import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  CitationService
} from './citation.service';
import {
  ChunkDetailDto,
  DeepLinkResolutionDto,
  DocumentSummaryDto
} from './dto/citation-response.dto';

@ApiTags(
  'citations'
)
@Controller(
  'citations'
)
export class CitationController {

  constructor(
    private readonly citationService: CitationService
  ) {

  }

  // Fetches full chunk detail and surrounding context chunks
  @Get(
    'chunk/:chunkId'
  )
  @HttpCode(
    HttpStatus.OK
  )
  @ApiOperation(
    {
      summary: 'Get full chunk details and surrounding context by chunk UUID'
    }
  )
  @ApiQuery(
    {
      name: 'includeSurrounding',
      required: false,
      type: Boolean,
      description: 'Include adjacent previous and next chunk sequence preview'
    }
  )
  @ApiResponse(
    {
      status: 200,
      type: ChunkDetailDto,
      description: 'Chunk detail retrieved successfully'
    }
  )
  async getChunkById(
    @Param(
      'chunkId',
      new ParseUUIDPipe(
        {
          version: '4',
          errorHttpStatusCode: HttpStatus.BAD_REQUEST
        }
      )
    )
    chunkIdentifier: string,
    @Query(
      'includeSurrounding',
      new DefaultValuePipe(
        true
      ),
      ParseBoolPipe
    )
    includeSurroundingFlag: boolean
  ): Promise<
    ChunkDetailDto
  > {

    return this.citationService.getChunkById(
      chunkIdentifier,
      includeSurroundingFlag
    );

  }

  // Fetches all chunks and section outline for a document ID
  @Get(
    'document/:documentId'
  )
  @HttpCode(
    HttpStatus.OK
  )
  @ApiOperation(
    {
      summary: 'Get all chunks and section hierarchy outline for a document'
    }
  )
  @ApiResponse(
    {
      status: 200,
      type: DocumentSummaryDto,
      description: 'Document chunks outline retrieved successfully'
    }
  )
  async getChunksByDocumentId(
    @Param(
      'documentId'
    )
    documentIdentifier: string
  ): Promise<
    DocumentSummaryDto
  > {

    return this.citationService.getChunksByDocumentId(
      documentIdentifier
    );

  }

  // X1: Resolves clause-level deep link URL and target chunk
  @Get(
    'deep-link'
  )
  @HttpCode(
    HttpStatus.OK
  )
  @ApiOperation(
    {
      summary: 'X1: Resolve clause or section level deep link with anchor URL'
    }
  )
  @ApiQuery(
    {
      name: 'standardNumber',
      required: true,
      description: 'Indian Standard number (e.g. IS 10500, IS 456)'
    }
  )
  @ApiQuery(
    {
      name: 'clause',
      required: true,
      description: 'Clause or section identifier (e.g. 4.2, Table 1, Scope)'
    }
  )
  @ApiResponse(
    {
      status: 200,
      type: DeepLinkResolutionDto,
      description: 'Deep link resolved with anchor URL'
    }
  )
  async resolveDeepLink(
    @Query(
      'standardNumber'
    )
    standardNumberQuery: string,
    @Query(
      'clause'
    )
    clauseQuery: string
  ): Promise<
    DeepLinkResolutionDto
  > {

    return this.citationService.resolveDeepLink(
      standardNumberQuery,
      clauseQuery
    );

  }

  // X1: Parameterized clause deep link resolver
  @Get(
    'clause/:standardNumber/:clauseNumber'
  )
  @HttpCode(
    HttpStatus.OK
  )
  @ApiOperation(
    {
      summary: 'X1: Direct parameterized clause deep link resolution'
    }
  )
  async getClauseByParams(
    @Param(
      'standardNumber'
    )
    standardNumberParam: string,
    @Param(
      'clauseNumber'
    )
    clauseNumberParam: string
  ): Promise<
    DeepLinkResolutionDto
  > {

    return this.citationService.resolveDeepLink(
      standardNumberParam,
      clauseNumberParam
    );

  }

  // Service health check endpoint
  @Get(
    'health'
  )
  @HttpCode(
    HttpStatus.OK
  )
  @ApiOperation(
    {
      summary: 'Citation service health check'
    }
  )
  health(
  ): {
    status: string;
    module: string;
    timestamp: string;
  } {

    return {
      status: 'healthy',
      module: 'd3-citation-backend',
      timestamp: new Date(
      ).toISOString(
      )
    };

  }

}
