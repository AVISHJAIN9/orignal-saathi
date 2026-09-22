import {
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  ILike,
  Repository
} from 'typeorm';
import to from 'await-to-js';
import {
  DocumentChunk
} from './entities/chunk.entity';
import {
  ChunkDetailDto,
  ChunkSummaryDto,
  DeepLinkResolutionDto,
  DocumentSummaryDto,
  SectionOutlineDto,
  SurroundingContextDto
} from './dto/citation-response.dto';
import { OFFLINE_CITATION_FIXTURES } from './fixtures/offline-citations.fixture';

@Injectable(
)
export class CitationService {

  private readonly logger = new Logger(
    CitationService.name
  );

  constructor(
    @InjectRepository(
      DocumentChunk
    )
    private readonly chunkRepository: Repository<
      DocumentChunk
    >
  ) {

  }

  // Generates clean URL-safe clause anchor (e.g. clause-4-2 or section-scope)
  public generateClauseAnchor(
    sectionNumberString?: string | null,
    sectionTitleString?: string | null
  ): string {

    if (
      sectionNumberString && sectionNumberString.trim(
      ).length > 0
    ) {
      const sanitizedNumber = sectionNumberString.trim(
      ).toLowerCase(
      ).replace(
        /[^a-z0-9]+/g,
        '-'
      ).replace(
        /^-|-$/g,
        ''
      );
      return `clause-${sanitizedNumber}`;
    }

    if (
      sectionTitleString && sectionTitleString.trim(
      ).length > 0
    ) {
      const sanitizedTitle = sectionTitleString.trim(
      ).toLowerCase(
      ).replace(
        /[^a-z0-9]+/g,
        '-'
      ).replace(
        /^-|-$/g,
        ''
      );
      return `section-${sanitizedTitle}`;
    }

    return 'section-main';

  }

  // Constructs full deep-link URI for web frontend D1 / D3
  public buildDeepLinkUrl(
    documentIdentifier: string,
    chunkIdentifier: string,
    clauseAnchorString: string
  ): string {

    return `/standards/view/${documentIdentifier}?chunkId=${chunkIdentifier}#${clauseAnchorString}`;

  }

  // Helper to convert entity to summary DTO with snippet and anchor
  private toSummaryDto(
    chunkEntity: DocumentChunk
  ): ChunkSummaryDto {

    const snippetMaxLength = 200;
    let snippetContentString = '';

    if (
      chunkEntity.content.length > snippetMaxLength
    ) {
      snippetContentString = `${chunkEntity.content.substring(
        0,
        snippetMaxLength
      ).trim(
      )}...`;
    } else {
      snippetContentString = chunkEntity.content;
    }

    const calculatedClauseAnchor = this.generateClauseAnchor(
      chunkEntity.sectionNumber,
      chunkEntity.sectionTitle
    );
    const calculatedDeepLinkUrl = this.buildDeepLinkUrl(
      chunkEntity.documentId,
      chunkEntity.id,
      calculatedClauseAnchor
    );

    return {
      id: chunkEntity.id,
      documentId: chunkEntity.documentId,
      standardNumber: chunkEntity.standardNumber,
      docType: chunkEntity.docType,
      category: chunkEntity.category,
      sectionTitle: chunkEntity.sectionTitle,
      sectionNumber: chunkEntity.sectionNumber,
      clauseAnchor: calculatedClauseAnchor,
      deepLinkUrl: calculatedDeepLinkUrl,
      contentSnippet: snippetContentString,
      sourceUrl: chunkEntity.sourceUrl,
      publicationDate: chunkEntity.publicationDate
    };

  }

  // Helper to convert entity to full detail DTO with licensed fallback handling
  private toDetailDto(
    chunkEntity: DocumentChunk,
    surroundingContextDto?: SurroundingContextDto | null
  ): ChunkDetailDto {

    const calculatedClauseAnchor = this.generateClauseAnchor(
      chunkEntity.sectionNumber,
      chunkEntity.sectionTitle
    );
    const calculatedDeepLinkUrl = this.buildDeepLinkUrl(
      chunkEntity.documentId,
      chunkEntity.id,
      calculatedClauseAnchor
    );

    const chunkMetadataRecord = chunkEntity.metadata || {
    };
    const isUnlicensedContent = chunkMetadataRecord.isLicensed === false;

    let effectiveContentText = chunkEntity.content;
    let fallbackNoticeString: string | null = null;

    if (
      isUnlicensedContent
    ) {
      const scopeSummary = chunkMetadataRecord.scope || 'Standard specifications and requirements scope';
      const sectionHeading = chunkEntity.sectionTitle || 'General Requirements';
      const standardNum = chunkEntity.standardNumber || chunkEntity.documentId;

      effectiveContentText = `[Standard: ${standardNum}] [Section: ${sectionHeading}] Scope & Requirement Summary: ${scopeSummary}`;
      fallbackNoticeString = 'Full text is copyright-protected by Bureau of Indian Standards (BIS). Displaying verified standard metadata, title, and scope citation.';
    }

    return {
      id: chunkEntity.id,
      documentId: chunkEntity.documentId,
      standardNumber: chunkEntity.standardNumber,
      docType: chunkEntity.docType,
      category: chunkEntity.category,
      sectionTitle: chunkEntity.sectionTitle,
      sectionNumber: chunkEntity.sectionNumber,
      clauseAnchor: calculatedClauseAnchor,
      deepLinkUrl: calculatedDeepLinkUrl,
      content: effectiveContentText,
      sourceUrl: chunkEntity.sourceUrl,
      publicationDate: chunkEntity.publicationDate,
      isLicensedFallback: isUnlicensedContent,
      licensedFallbackNotice: fallbackNoticeString,
      metadata: chunkMetadataRecord,
      createdAt: chunkEntity.createdAt,
      updatedAt: chunkEntity.updatedAt,
      surroundingContext: surroundingContextDto ?? null
    };

  }

  // Fetches a single document chunk by UUID with surrounding context
  async getChunkById(
    chunkIdentifier: string,
    includeSurroundingFlag: boolean = true
  ): Promise<
    ChunkDetailDto
  > {

    this.logger.log(
      `Fetching chunk by ID: ${chunkIdentifier} (includeSurrounding=${includeSurroundingFlag})`
    );

    const [
      lookupError,
      foundChunkEntity
    ] = await to(
      this.chunkRepository.findOne(
        {
          where: {
            id: chunkIdentifier
          }
        }
      )
    );

    if (
      lookupError
    ) {
      throw lookupError;
    }

    if (!foundChunkEntity) {
      // Check offline demo fixture
      const fixture = OFFLINE_CITATION_FIXTURES[chunkIdentifier];
      if (fixture) {
        this.logger.log(`Serving chunk from offline fixture: ${chunkIdentifier}`);
        return {
          id: fixture.id,
          documentId: fixture.documentId,
          standardNumber: fixture.standardNumber,
          docType: fixture.docType,
          category: fixture.category,
          sectionTitle: fixture.sectionTitle,
          sectionNumber: fixture.sectionNumber,
          clauseAnchor: fixture.metadata?.clauseAnchor || 'clause-main',
          deepLinkUrl: `/standards/view/${fixture.documentId}?chunkId=${fixture.id}#${fixture.metadata?.clauseAnchor || 'clause-main'}`,
          content: fixture.content,
          sourceUrl: fixture.sourceUrl,
          publicationDate: fixture.publicationDate,
          isLicensedFallback: false,
          licensedFallbackNotice: null,
          metadata: fixture.metadata,
          createdAt: new Date(),
          updatedAt: new Date(),
          surroundingContext: null,
        };
      }

      this.logger.warn(`Chunk with ID '${chunkIdentifier}' not found`);
      throw new NotFoundException(`Document chunk with ID '${chunkIdentifier}' not found`);
    }

    if (
      !includeSurroundingFlag
    ) {
      return this.toDetailDto(
        foundChunkEntity,
        null
      );
    }

    const [
      listError,
      documentChunksList
    ] = await to(
      this.chunkRepository.find(
        {
          where: {
            documentId: foundChunkEntity.documentId
          },
          order: {
            createdAt: 'ASC'
          }
        }
      )
    );

    if (
      listError || !documentChunksList
    ) {
      throw listError;
    }

    const currentChunkIndex = documentChunksList.findIndex(
      (
        chunkItem
      ) => chunkItem.id === foundChunkEntity.id
    );

    let previousChunkEntity: DocumentChunk | null = null;
    if (
      currentChunkIndex > 0
    ) {
      previousChunkEntity = documentChunksList[
        currentChunkIndex - 1
      ];
    } else {
      previousChunkEntity = null;
    }

    let nextChunkEntity: DocumentChunk | null = null;
    if (
      currentChunkIndex >= 0 && currentChunkIndex < documentChunksList.length - 1
    ) {
      nextChunkEntity = documentChunksList[
        currentChunkIndex + 1
      ];
    } else {
      nextChunkEntity = null;
    }

    let previousChunkSummary: ChunkSummaryDto | null = null;
    if (
      previousChunkEntity
    ) {
      previousChunkSummary = this.toSummaryDto(
        previousChunkEntity
      );
    } else {
      previousChunkSummary = null;
    }

    let nextChunkSummary: ChunkSummaryDto | null = null;
    if (
      nextChunkEntity
    ) {
      nextChunkSummary = this.toSummaryDto(
        nextChunkEntity
      );
    } else {
      nextChunkSummary = null;
    }

    const surroundingContextRecord: SurroundingContextDto = {
      previousChunk: previousChunkSummary,
      nextChunk: nextChunkSummary,
      totalDocumentChunks: documentChunksList.length,
      currentChunkIndex: currentChunkIndex >= 0 ? currentChunkIndex + 1 : 1
    };

    return this.toDetailDto(
      foundChunkEntity,
      surroundingContextRecord
    );

  }

  // Fetches all chunks belonging to a document ID ordered by document sequence
  async getChunksByDocumentId(
    documentIdentifier: string
  ): Promise<
    DocumentSummaryDto
  > {

    this.logger.log(
      `Fetching all chunks for document ID: ${documentIdentifier}`
    );

    const [
      listError,
      chunksList
    ] = await to(
      this.chunkRepository.find(
        {
          where: {
            documentId: documentIdentifier
          },
          order: {
            createdAt: 'ASC'
          }
        }
      )
    );

    if (
      listError
    ) {
      throw listError;
    }

    if (
      !chunksList || chunksList.length === 0
    ) {
      this.logger.warn(
        `No chunks found for document ID '${documentIdentifier}'`
      );
      throw new NotFoundException(
        `No chunks found for document ID '${documentIdentifier}'`
      );
    }

    const firstChunkItem = chunksList[
      0
    ];
    const sectionsOutlineList: SectionOutlineDto[] = [
    ];
    const seenSectionKeysSet = new Set<
      string
    >(
    );

    for (
      const chunkItem of chunksList
    ) {
      const sectionUniqueKey = `${chunkItem.sectionNumber || ''}|${chunkItem.sectionTitle || ''}`;
      if (
        sectionUniqueKey !== '|' && !seenSectionKeysSet.has(
          sectionUniqueKey
        )
      ) {
        seenSectionKeysSet.add(
          sectionUniqueKey
        );
        const calculatedAnchor = this.generateClauseAnchor(
          chunkItem.sectionNumber,
          chunkItem.sectionTitle
        );
        const calculatedUrl = this.buildDeepLinkUrl(
          chunkItem.documentId,
          chunkItem.id,
          calculatedAnchor
        );

        sectionsOutlineList.push(
          {
            sectionNumber: chunkItem.sectionNumber,
            sectionTitle: chunkItem.sectionTitle,
            chunkId: chunkItem.id,
            clauseAnchor: calculatedAnchor,
            deepLinkUrl: calculatedUrl
          }
        );
      }
    }

    const detailChunksList = chunksList.map(
      (
        chunkRecord
      ) => this.toDetailDto(
        chunkRecord,
        null
      )
    );

    return {
      documentId: firstChunkItem.documentId,
      standardNumber: firstChunkItem.standardNumber,
      docType: firstChunkItem.docType,
      category: firstChunkItem.category,
      publicationDate: firstChunkItem.publicationDate,
      sourceUrl: firstChunkItem.sourceUrl,
      totalChunks: chunksList.length,
      sections: sectionsOutlineList,
      chunks: detailChunksList
    };

  }

  // X1: Resolves specific clause or section deep-link for a standard
  async resolveDeepLink(
    standardNumberQuery: string,
    clauseQueryString: string
  ): Promise<
    DeepLinkResolutionDto
  > {

    this.logger.log(
      `Resolving X1 deep-link for standard: ${standardNumberQuery}, clause: ${clauseQueryString}`
    );

    const cleanStandard = standardNumberQuery.trim(
    );
    const cleanClause = clauseQueryString.trim(
    );

    const [
      exactLookupError,
      exactMatchChunk
    ] = await to(
      this.chunkRepository.findOne(
        {
          where: [
            {
              standardNumber: ILike(
                `%${cleanStandard}%`
              ),
              sectionNumber: ILike(
                `%${cleanClause}%`
              )
            },
            {
              documentId: ILike(
                `%${cleanStandard}%`
              ),
              sectionNumber: ILike(
                `%${cleanClause}%`
              )
            },
            {
              standardNumber: ILike(
                `%${cleanStandard}%`
              ),
              sectionTitle: ILike(
                `%${cleanClause}%`
              )
            }
          ]
        }
      )
    );

    if (
      exactLookupError
    ) {
      throw exactLookupError;
    }

    let targetMatchingChunk: DocumentChunk | null = null;
    if (
      exactMatchChunk
    ) {
      targetMatchingChunk = exactMatchChunk;
    } else {
      const [
        fallbackError,
        firstDocumentChunk
      ] = await to(
        this.chunkRepository.findOne(
          {
            where: [
              {
                standardNumber: ILike(
                  `%${cleanStandard}%`
                )
              },
              {
                documentId: ILike(
                  `%${cleanStandard}%`
                )
              }
            ]
          }
        )
      );

      if (
        fallbackError
      ) {
        throw fallbackError;
      }

      targetMatchingChunk = firstDocumentChunk;
    }

    if (
      !targetMatchingChunk
    ) {
      throw new NotFoundException(
        `Clause '${cleanClause}' not found for standard '${cleanStandard}'`
      );
    }

    const calculatedClauseAnchor = this.generateClauseAnchor(
      cleanClause,
      targetMatchingChunk.sectionTitle
    );
    const calculatedDeepLinkUrl = this.buildDeepLinkUrl(
      targetMatchingChunk.documentId,
      targetMatchingChunk.id,
      calculatedClauseAnchor
    );

    const chunkDetailResult = this.toDetailDto(
      targetMatchingChunk,
      null
    );

    return {
      standardNumber: cleanStandard,
      requestedClause: cleanClause,
      clauseAnchor: `#${calculatedClauseAnchor}`,
      deepLinkUrl: calculatedDeepLinkUrl,
      chunk: chunkDetailResult
    };

  }

}
