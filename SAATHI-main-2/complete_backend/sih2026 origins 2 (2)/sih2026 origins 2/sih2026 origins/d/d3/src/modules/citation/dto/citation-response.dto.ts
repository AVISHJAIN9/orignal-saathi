import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';

export class ChunkSummaryDto {

  @ApiProperty(
    {
      description: 'Unique chunk UUID'
    }
  )
  id!: string;

  @ApiProperty(
    {
      description: 'Document identifier'
    }
  )
  documentId!: string;

  @ApiPropertyOptional(
    {
      description: 'Indian Standard identifier'
    }
  )
  standardNumber?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Document type (standard, circular, faq, manual)'
    }
  )
  docType?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Industry or standard category'
    }
  )
  category?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Section heading or title'
    }
  )
  sectionTitle?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Section or clause number (e.g. 4.2, 5.1)'
    }
  )
  sectionNumber?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Clause anchor tag (e.g. #clause-4-2)'
    }
  )
  clauseAnchor?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Direct deep-link URL for web client'
    }
  )
  deepLinkUrl?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Text snippet preview'
    }
  )
  contentSnippet?: string;

  @ApiPropertyOptional(
    {
      description: 'Official BIS source URL'
    }
  )
  sourceUrl?: string | null;

  @ApiPropertyOptional(
    {
      description: 'Publication date'
    }
  )
  publicationDate?: string | null;

}

export class SurroundingContextDto {

  @ApiPropertyOptional(
    {
      type: (
      ) => ChunkSummaryDto,
      nullable: true
    }
  )
  previousChunk?: ChunkSummaryDto | null;

  @ApiPropertyOptional(
    {
      type: (
      ) => ChunkSummaryDto,
      nullable: true
    }
  )
  nextChunk?: ChunkSummaryDto | null;

  @ApiPropertyOptional(
    {
      description: 'Total number of chunks in document'
    }
  )
  totalDocumentChunks?: number;

  @ApiPropertyOptional(
    {
      description: 'Index of current chunk (1-based)'
    }
  )
  currentChunkIndex?: number;

}

export class ChunkDetailDto {

  @ApiProperty(
    {
      description: 'Unique chunk UUID'
    }
  )
  id!: string;

  @ApiProperty(
    {
      description: 'Document identifier'
    }
  )
  documentId!: string;

  @ApiProperty(
    {
      description: 'Indian Standard identifier',
      nullable: true
    }
  )
  standardNumber!: string | null;

  @ApiProperty(
    {
      description: 'Document type',
      nullable: true
    }
  )
  docType!: string | null;

  @ApiProperty(
    {
      description: 'Category',
      nullable: true
    }
  )
  category!: string | null;

  @ApiProperty(
    {
      description: 'Section heading or title',
      nullable: true
    }
  )
  sectionTitle!: string | null;

  @ApiProperty(
    {
      description: 'Section or clause number',
      nullable: true
    }
  )
  sectionNumber!: string | null;

  @ApiProperty(
    {
      description: 'Clause anchor tag (e.g. #clause-4-2)',
      nullable: true
    }
  )
  clauseAnchor?: string | null;

  @ApiProperty(
    {
      description: 'Direct deep-link URL',
      nullable: true
    }
  )
  deepLinkUrl?: string | null;

  @ApiProperty(
    {
      description: 'Full chunk text or licensed fallback scope text'
    }
  )
  content!: string;

  @ApiProperty(
    {
      description: 'Official source URL',
      nullable: true
    }
  )
  sourceUrl!: string | null;

  @ApiProperty(
    {
      description: 'Publication date',
      nullable: true
    }
  )
  publicationDate!: string | null;

  @ApiProperty(
    {
      description: 'Whether licensed fallback view is active'
    }
  )
  isLicensedFallback?: boolean;

  @ApiPropertyOptional(
    {
      description: 'Notice regarding licensed copyright boundaries',
      nullable: true
    }
  )
  licensedFallbackNotice?: string | null;

  @ApiProperty(
    {
      description: 'Extracted metadata JSON'
    }
  )
  metadata!: Record<
    string,
    any
  >;

  @ApiProperty(
  )
  createdAt!: Date;

  @ApiProperty(
  )
  updatedAt!: Date;

  @ApiPropertyOptional(
    {
      type: (
      ) => SurroundingContextDto,
      nullable: true
    }
  )
  surroundingContext?: SurroundingContextDto | null;

}

export class SectionOutlineDto {

  @ApiProperty(
    {
      description: 'Section or clause number',
      nullable: true
    }
  )
  sectionNumber!: string | null;

  @ApiProperty(
    {
      description: 'Section heading title',
      nullable: true
    }
  )
  sectionTitle!: string | null;

  @ApiProperty(
    {
      description: 'Target chunk ID'
    }
  )
  chunkId!: string;

  @ApiProperty(
    {
      description: 'Anchor identifier (e.g. clause-4-2)'
    }
  )
  clauseAnchor!: string;

  @ApiProperty(
    {
      description: 'Full deep link URL'
    }
  )
  deepLinkUrl!: string;

}

export class DocumentSummaryDto {

  @ApiProperty(
    {
      description: 'Document identifier'
    }
  )
  documentId!: string;

  @ApiProperty(
    {
      description: 'Standard number',
      nullable: true
    }
  )
  standardNumber!: string | null;

  @ApiProperty(
    {
      description: 'Document type',
      nullable: true
    }
  )
  docType!: string | null;

  @ApiProperty(
    {
      description: 'Category',
      nullable: true
    }
  )
  category!: string | null;

  @ApiProperty(
    {
      description: 'Publication date',
      nullable: true
    }
  )
  publicationDate!: string | null;

  @ApiProperty(
    {
      description: 'Official source URL',
      nullable: true
    }
  )
  sourceUrl!: string | null;

  @ApiProperty(
    {
      description: 'Total number of chunks'
    }
  )
  totalChunks!: number;

  @ApiProperty(
    {
      type: [
        SectionOutlineDto
      ]
    }
  )
  sections!: SectionOutlineDto[];

  @ApiProperty(
    {
      type: [
        ChunkDetailDto
      ]
    }
  )
  chunks!: ChunkDetailDto[];

}

export class DeepLinkResolutionDto {

  @ApiProperty(
    {
      description: 'Target Indian Standard number'
    }
  )
  standardNumber!: string;

  @ApiProperty(
    {
      description: 'Requested clause or section query string'
    }
  )
  requestedClause!: string;

  @ApiProperty(
    {
      description: 'Normalized clause anchor string (e.g. #clause-4-2)'
    }
  )
  clauseAnchor!: string;

  @ApiProperty(
    {
      description: 'Direct deep-link URL'
    }
  )
  deepLinkUrl!: string;

  @ApiProperty(
    {
      description: 'Matching chunk details',
      type: (
      ) => ChunkDetailDto
    }
  )
  chunk!: ChunkDetailDto;

}
